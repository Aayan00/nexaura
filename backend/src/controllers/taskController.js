import { getDB, fallbackStore } from '../config/db.js'

export async function getTasks(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const userTasks = fallbackStore.tasks.filter((t) => t.user_id === userId || t.user_id === 1)
      const tasksWithSubtasks = userTasks.map((t) => {
        const subtasks = fallbackStore.subtasks.filter((s) => s.task_id === t.id)
        return { ...t, subtasks }
      })
      return res.json({ success: true, tasks: tasksWithSubtasks })
    }

    const [tasks] = await pool.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId])
    const [subtasks] = await pool.query(
      'SELECT * FROM subtasks WHERE task_id IN (SELECT id FROM tasks WHERE user_id = ?)',
      [userId]
    )

    const tasksWithSubtasks = tasks.map((t) => {
      return {
        ...t,
        subtasks: subtasks.filter((s) => s.task_id === t.id),
      }
    })

    res.json({ success: true, tasks: tasksWithSubtasks })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createTask(req, res) {
  try {
    const userId = req.session?.userId || 1
    const {
      title,
      description = '',
      category = 'Coding',
      difficulty = 'Medium',
      priority = 'Medium',
      dueDate = '23:59 TODAY',
      estimatedDuration = 30,
      xpReward = 200,
      creditReward = 100,
      statPoints = 2,
      attribute = 'INT',
      isBoss = 0,
      recurrence = 'none',
      subtasks = [],
    } = req.body

    if (!title) return res.status(400).json({ error: 'Directive title required' })

    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const newTask = {
        id: fallbackStore.tasks.length + 1,
        user_id: userId,
        title,
        description,
        category,
        difficulty,
        priority,
        status: 'pending',
        due_date: dueDate,
        estimated_duration: estimatedDuration,
        xp_reward: xpReward,
        credit_reward: creditReward,
        stat_points: statPoints,
        attribute,
        is_boss: isBoss ? 1 : 0,
        recurrence,
        completed_at: null,
        created_at: new Date().toISOString(),
        subtasks: [],
      }

      fallbackStore.tasks.unshift(newTask)

      if (Array.isArray(subtasks) && subtasks.length > 0) {
        subtasks.forEach((stTitle) => {
          const newSub = {
            id: fallbackStore.subtasks.length + 1,
            task_id: newTask.id,
            title: typeof stTitle === 'string' ? stTitle : stTitle.title,
            completed: 0,
          }
          fallbackStore.subtasks.push(newSub)
          newTask.subtasks.push(newSub)
        })
      }

      return res.json({ success: true, task: newTask })
    }

    const [insertResult] = await pool.query(
      `INSERT INTO tasks (
        user_id, title, description, category, difficulty, priority, status,
        due_date, estimated_duration, xp_reward, credit_reward, stat_points, attribute, is_boss, recurrence
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        description,
        category,
        difficulty,
        priority,
        dueDate,
        estimatedDuration,
        xpReward,
        creditReward,
        statPoints,
        attribute,
        isBoss ? 1 : 0,
        recurrence,
      ]
    )

    const taskId = insertResult.insertId

    if (Array.isArray(subtasks) && subtasks.length > 0) {
      for (const st of subtasks) {
        const subTitle = typeof st === 'string' ? st : st.title
        if (subTitle && subTitle.trim()) {
          await pool.query('INSERT INTO subtasks (task_id, title, completed) VALUES (?, ?, 0)', [taskId, subTitle])
        }
      }
    }

    const [taskRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId])
    const [subRows] = await pool.query('SELECT * FROM subtasks WHERE task_id = ?', [taskId])

    res.json({ success: true, task: { ...taskRows[0], subtasks: subRows } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateTask(req, res) {
  try {
    const taskId = Number(req.params.id)
    const { title, description, category, difficulty, priority, status, dueDate, estimatedDuration } = req.body
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const task = fallbackStore.tasks.find((t) => t.id === taskId)
      if (!task) return res.status(404).json({ error: 'Task not found' })

      if (title !== undefined) task.title = title
      if (description !== undefined) task.description = description
      if (category !== undefined) task.category = category
      if (difficulty !== undefined) task.difficulty = difficulty
      if (priority !== undefined) task.priority = priority
      if (status !== undefined) task.status = status
      if (dueDate !== undefined) task.due_date = dueDate
      if (estimatedDuration !== undefined) task.estimated_duration = estimatedDuration

      return res.json({ success: true, task })
    }

    await pool.query(
      `UPDATE tasks SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        difficulty = COALESCE(?, difficulty),
        priority = COALESCE(?, priority),
        status = COALESCE(?, status),
        due_date = COALESCE(?, due_date),
        estimated_duration = COALESCE(?, estimated_duration)
       WHERE id = ?`,
      [title, description, category, difficulty, priority, status, dueDate, estimatedDuration, taskId]
    )

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId])
    res.json({ success: true, task: rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function deleteTask(req, res) {
  try {
    const taskId = Number(req.params.id)
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      fallbackStore.tasks = fallbackStore.tasks.filter((t) => t.id !== taskId)
      fallbackStore.subtasks = fallbackStore.subtasks.filter((s) => s.task_id !== taskId)
      return res.json({ success: true, message: 'Directive purged' })
    }

    await pool.query('DELETE FROM tasks WHERE id = ?', [taskId])
    res.json({ success: true, message: 'Directive purged' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function completeTask(req, res) {
  try {
    const taskId = Number(req.params.id)
    const userId = req.session?.userId || 1
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const task = fallbackStore.tasks.find((t) => t.id === taskId)
      if (!task) return res.status(404).json({ error: 'Task not found' })

      task.status = 'completed'
      task.completed_at = new Date().toISOString()

      // Upgrade user
      const user = fallbackStore.users.find((u) => u.id === userId) || fallbackStore.users[0]
      const xpGained = task.xp_reward
      const creditsGained = task.credit_reward
      const statGained = task.stat_points

      user.current_xp += xpGained
      user.credits += creditsGained

      // Attribute increment
      const attrKey = `stat_${task.attribute.toLowerCase()}`
      if (user[attrKey] !== undefined) {
        user[attrKey] += statGained
      }

      // Check level up
      let didLevelUp = false
      if (user.current_xp >= user.max_xp) {
        user.current_xp -= user.max_xp
        user.level += 1
        user.max_xp = Math.floor(user.max_xp * 1.25)
        user.unassigned_points += 3
        didLevelUp = true
      }

      fallbackStore.activity_logs.unshift({
        id: fallbackStore.activity_logs.length + 1,
        user_id: user.id,
        type: 'mission',
        title: 'Mission Complete',
        details: `${task.title} completed. +${statGained} ${task.attribute} awarded.`,
        xp_gained: xpGained,
        credits_gained: creditsGained,
        created_at: new Date().toISOString(),
      })

      return res.json({ success: true, task, user, didLevelUp })
    }

    const [taskRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId])
    if (taskRows.length === 0) return res.status(404).json({ error: 'Task not found' })
    const task = taskRows[0]

    await pool.query('UPDATE tasks SET status = "completed", completed_at = NOW() WHERE id = ?', [taskId])

    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    const user = userRows[0]

    const xpGained = task.xp_reward
    const creditsGained = task.credit_reward
    const statGained = task.stat_points

    let nextXP = user.current_xp + xpGained
    let nextLevel = user.level
    let nextMaxXP = user.max_xp
    let nextUnassigned = user.unassigned_points
    let didLevelUp = false

    if (nextXP >= nextMaxXP) {
      nextXP -= nextMaxXP
      nextLevel += 1
      nextMaxXP = Math.floor(nextMaxXP * 1.25)
      nextUnassigned += 3
      didLevelUp = true
    }

    const attrCol = `stat_${task.attribute.toLowerCase()}`

    await pool.query(
      `UPDATE users SET
        current_xp = ?,
        level = ?,
        max_xp = ?,
        credits = credits + ?,
        unassigned_points = ?,
        ${attrCol} = ${attrCol} + ?
       WHERE id = ?`,
      [nextXP, nextLevel, nextMaxXP, creditsGained, nextUnassigned, statGained, userId]
    )

    await pool.query(
      `INSERT INTO activity_logs (user_id, type, title, details, xp_gained, credits_gained)
       VALUES (?, 'mission', 'Mission Complete', ?, ?, ?)`,
      [userId, `${task.title} completed. +${statGained} ${task.attribute} points awarded.`, xpGained, creditsGained]
    )

    const [updatedUserRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])

    res.json({
      success: true,
      task: { ...task, status: 'completed' },
      user: updatedUserRows[0],
      didLevelUp,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function setTaskStatus(req, res) {
  try {
    const taskId = Number(req.params.id)
    const { status } = req.body
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const task = fallbackStore.tasks.find((t) => t.id === taskId)
      if (!task) return res.status(404).json({ error: 'Task not found' })
      task.status = status
      return res.json({ success: true, task })
    }

    await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, taskId])
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId])
    res.json({ success: true, task: rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Subtask handlers
export async function addSubtask(req, res) {
  try {
    const taskId = Number(req.params.id)
    const { title } = req.body
    if (!title) return res.status(400).json({ error: 'Subtask title required' })

    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const newSub = {
        id: fallbackStore.subtasks.length + 1,
        task_id: taskId,
        title,
        completed: 0,
      }
      fallbackStore.subtasks.push(newSub)
      return res.json({ success: true, subtask: newSub })
    }

    const [result] = await pool.query('INSERT INTO subtasks (task_id, title, completed) VALUES (?, ?, 0)', [
      taskId,
      title,
    ])
    const [rows] = await pool.query('SELECT * FROM subtasks WHERE id = ?', [result.insertId])
    res.json({ success: true, subtask: rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function toggleSubtask(req, res) {
  try {
    const subtaskId = Number(req.params.id)
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const sub = fallbackStore.subtasks.find((s) => s.id === subtaskId)
      if (!sub) return res.status(404).json({ error: 'Subtask not found' })
      sub.completed = sub.completed ? 0 : 1
      return res.json({ success: true, subtask: sub })
    }

    await pool.query('UPDATE subtasks SET completed = NOT completed WHERE id = ?', [subtaskId])
    const [rows] = await pool.query('SELECT * FROM subtasks WHERE id = ?', [subtaskId])
    res.json({ success: true, subtask: rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function deleteSubtask(req, res) {
  try {
    const subtaskId = Number(req.params.id)
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      fallbackStore.subtasks = fallbackStore.subtasks.filter((s) => s.id !== subtaskId)
      return res.json({ success: true, message: 'Subtask removed' })
    }

    await pool.query('DELETE FROM subtasks WHERE id = ?', [subtaskId])
    res.json({ success: true, message: 'Subtask removed' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
