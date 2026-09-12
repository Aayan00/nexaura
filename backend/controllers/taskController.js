import { isDBConnected, query, memoryStore } from '../db.js';

const DIFFICULTY_REWARDS = {
  Easy: { xp: 20, credits: 5 },
  Medium: { xp: 50, credits: 15 },
  Hard: { xp: 100, credits: 30 },
  Epic: { xp: 250, credits: 75 },
};

function getCategoryAttribute(category) {
  switch ((category || '').toLowerCase()) {
    case 'study':
      return 'intelligence';
    case 'coding':
      return 'intelligence';
    case 'fitness':
      return 'strength';
    case 'health':
      return 'vitality';
    case 'creative':
      return 'dexterity';
    case 'habits':
      return 'discipline';
    default:
      return 'discipline';
  }
}

export const taskController = {
  getTasks: async (req, res) => {
    try {
      const userId = req.session?.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Session required.' });
      }

      if (isDBConnected()) {
        const tasks = await query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        const taskIds = tasks.map((t) => t.id);
        const subtasks = taskIds.length > 0
          ? await query(`SELECT * FROM subtasks WHERE task_id IN (${taskIds.map(() => '?').join(',')})`, taskIds)
          : [];

        const tasksWithSubtasks = tasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          category: t.category,
          difficulty: t.difficulty,
          priority: t.priority,
          status: t.status,
          dueDate: t.due_date,
          estimatedDuration: t.estimated_duration,
          xpReward: t.xp_reward,
          creditReward: t.credit_reward,
          attributeReward: t.attribute_reward,
          recurrence: t.recurrence,
          isBoss: Boolean(t.is_boss),
          bossName: t.boss_name,
          bossMaxHp: t.boss_max_hp,
          bossCurrentHp: t.boss_current_hp,
          completed: t.status === 'completed',
          completedAt: t.completed_at,
          createdAt: t.created_at,
          subtasks: (subtasks || [])
            .filter((s) => s.task_id === t.id)
            .map((s) => ({
              id: s.id,
              title: s.title,
              completed: Boolean(s.completed),
            })),
        }));

        return res.json({ success: true, tasks: tasksWithSubtasks });
      } else {
        const userTasks = memoryStore.tasks.filter((t) => t.user_id === userId);
        const tasksWithSubtasks = userTasks.map((t) => ({
          ...t,
          dueDate: t.due_date,
          estimatedDuration: t.estimated_duration,
          xpReward: t.xp_reward,
          creditReward: t.credit_reward,
          attributeReward: t.attribute_reward,
          isBoss: Boolean(t.is_boss),
          bossName: t.boss_name,
          bossMaxHp: t.boss_max_hp,
          bossCurrentHp: t.boss_current_hp,
          completed: t.status === 'completed',
          completedAt: t.completed_at,
          createdAt: t.created_at,
          subtasks: memoryStore.subtasks
            .filter((s) => s.task_id === t.id)
            .map((s) => ({
              id: s.id,
              title: s.title,
              completed: Boolean(s.completed),
            })),
        }));

        return res.json({ success: true, tasks: tasksWithSubtasks });
      }
    } catch (err) {
      console.error('[Task getTasks Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve mission directives.' });
    }
  },

  createTask: async (req, res) => {
    try {
      const userId = req.session?.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Session required.' });
      }
      const {
        title,
        description = '',
        category = 'Coding',
        difficulty = 'Medium',
        priority = 'B',
        dueDate = null,
        estimatedDuration = 30,
        recurrence = 'none',
        isBoss = false,
        bossName = null,
        bossMaxHp = 100,
        subtasks = [],
      } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, message: 'Mission directive title is required.' });
      }

      const rewardConfig = DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.Medium;
      const xpMultiplier = isBoss ? 2 : 1;
      const xpReward = rewardConfig.xp * xpMultiplier;
      const creditReward = rewardConfig.credits * xpMultiplier;
      const attributeReward = getCategoryAttribute(category);
      const taskId = 'task_' + Date.now();

      if (isDBConnected()) {
        await query(
          `INSERT INTO tasks (id, user_id, title, description, category, difficulty, priority, status, due_date, estimated_duration, xp_reward, credit_reward, attribute_reward, recurrence, is_boss, boss_name, boss_max_hp, boss_current_hp)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            taskId,
            userId,
            title,
            description,
            category,
            difficulty,
            priority,
            dueDate ? new Date(dueDate) : null,
            estimatedDuration,
            xpReward,
            creditReward,
            attributeReward,
            recurrence,
            isBoss,
            bossName || (isBoss ? `${title} Cyber-Daemon` : null),
            bossMaxHp,
            bossMaxHp,
          ]
        );

        if (Array.isArray(subtasks) && subtasks.length > 0) {
          for (let i = 0; i < subtasks.length; i++) {
            const sub = subtasks[i];
            const subTitle = typeof sub === 'string' ? sub : sub.title;
            if (subTitle) {
              await query('INSERT INTO subtasks (id, task_id, title, completed) VALUES (?, ?, ?, false)', [
                `sub_${Date.now()}_${i}`,
                taskId,
                subTitle,
              ]);
            }
          }
        }
      } else {
        const newTask = {
          id: taskId,
          user_id: userId,
          title,
          description,
          category,
          difficulty,
          priority,
          status: 'pending',
          due_date: dueDate || new Date(Date.now() + 86400000).toISOString(),
          estimated_duration: estimatedDuration,
          xp_reward: xpReward,
          credit_reward: creditReward,
          attribute_reward: attributeReward,
          recurrence,
          is_boss: isBoss,
          boss_name: bossName || (isBoss ? `${title} Cyber-Daemon` : null),
          boss_max_hp: bossMaxHp,
          boss_current_hp: bossMaxHp,
          completed_at: null,
          created_at: new Date().toISOString(),
        };
        memoryStore.tasks.unshift(newTask);

        if (Array.isArray(subtasks)) {
          subtasks.forEach((sub, i) => {
            const subTitle = typeof sub === 'string' ? sub : sub.title;
            if (subTitle) {
              memoryStore.subtasks.push({
                id: `sub_${Date.now()}_${i}`,
                task_id: taskId,
                title: subTitle,
                completed: false,
              });
            }
          });
        }
      }

      return res.status(201).json({
        success: true,
        message: 'New mission directive registered into neural matrix.',
        task: {
          id: taskId,
          title,
          description,
          category,
          difficulty,
          priority,
          status: 'pending',
          dueDate,
          estimatedDuration,
          xpReward,
          creditReward,
          attributeReward,
          isBoss,
          bossName,
          bossMaxHp,
          bossCurrentHp: bossMaxHp,
          completed: false,
          subtasks: Array.isArray(subtasks)
            ? subtasks.map((s, idx) => ({ id: `sub_${Date.now()}_${idx}`, title: typeof s === 'string' ? s : s.title, completed: false }))
            : [],
        },
      });
    } catch (err) {
      console.error('[Task createTask Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to create mission directive.' });
    }
  },

  updateTask: async (req, res) => {
    try {
      const userId = req.session?.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Session required.' });
      }
      const { id } = req.params;
      const { title, description, category, difficulty, priority, status } = req.body;

      if (isDBConnected()) {
        await query(
          `UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description),
           category = COALESCE(?, category), difficulty = COALESCE(?, difficulty),
           priority = COALESCE(?, priority), status = COALESCE(?, status) WHERE id = ? AND user_id = ?`,
          [title, description, category, difficulty, priority, status, id, userId]
        );
      } else {
        const task = memoryStore.tasks.find((t) => t.id === id && t.user_id === userId);
        if (task) {
          if (title) task.title = title;
          if (description !== undefined) task.description = description;
          if (category) task.category = category;
          if (difficulty) task.difficulty = difficulty;
          if (priority) task.priority = priority;
          if (status) task.status = status;
        }
      }

      return res.json({ success: true, message: 'Mission directive updated.' });
    } catch (err) {
      console.error('[Task updateTask Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to update mission directive.' });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const userId = req.session?.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Session required.' });
      }
      const { id } = req.params;

      if (isDBConnected()) {
        await query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
      } else {
        memoryStore.tasks = memoryStore.tasks.filter((t) => !(t.id === id && t.user_id === userId));
        memoryStore.subtasks = memoryStore.subtasks.filter((s) => s.task_id !== id);
      }

      return res.json({ success: true, message: 'Mission directive terminated.' });
    } catch (err) {
      console.error('[Task deleteTask Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete task.' });
    }
  },

  startTask: async (req, res) => {
    try {
      const userId = req.session?.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Session required.' });
      }
      const { id } = req.params;
      if (isDBConnected()) {
        await query("UPDATE tasks SET status = 'in_progress' WHERE id = ? AND user_id = ?", [id, userId]);
      } else {
        const task = memoryStore.tasks.find((t) => t.id === id && t.user_id === userId);
        if (task) task.status = 'in_progress';
      }
      return res.json({ success: true, message: 'Mission directive engaged: IN PROGRESS' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to engage mission.' });
    }
  },

  pauseTask: async (req, res) => {
    try {
      const userId = req.session?.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Session required.' });
      }
      const { id } = req.params;
      if (isDBConnected()) {
        await query("UPDATE tasks SET status = 'paused' WHERE id = ? AND user_id = ?", [id, userId]);
      } else {
        const task = memoryStore.tasks.find((t) => t.id === id && t.user_id === userId);
        if (task) task.status = 'paused';
      }
      return res.json({ success: true, message: 'Mission directive suspended: PAUSED' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to pause mission.' });
    }
  },

  failTask: async (req, res) => {
    try {
      const userId = req.session?.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Session required.' });
      }
      const { id } = req.params;
      if (isDBConnected()) {
        await query("UPDATE tasks SET status = 'failed' WHERE id = ? AND user_id = ?", [id, userId]);
      } else {
        const task = memoryStore.tasks.find((t) => t.id === id && t.user_id === userId);
        if (task) task.status = 'failed';
      }
      return res.json({ success: true, message: 'Mission directive marked: FAILED' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to update mission status.' });
    }
  },

  completeTask: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session?.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Session required.' });
      }

      let task = null;
      let stats = null;

      if (isDBConnected()) {
        const tasks = await query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
        if (!tasks || tasks.length === 0) {
          return res.status(404).json({ success: false, message: 'Mission directive not found.' });
        }
        task = tasks[0];

        if (task.status === 'completed') {
          return res.status(400).json({ success: false, message: 'Directive already fulfilled. Double rewards prevented.' });
        }

        const userStats = await query('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
        stats = userStats && userStats.length > 0 ? userStats[0] : null;
      } else {
        task = memoryStore.tasks.find((t) => t.id === id && t.user_id === userId);
        if (!task) return res.status(404).json({ success: false, message: 'Mission directive not found.' });
        if (task.status === 'completed') {
          return res.status(400).json({ success: false, message: 'Directive already fulfilled. Double rewards prevented.' });
        }
        stats = memoryStore.user_stats.find((s) => s.user_id === userId) || memoryStore.user_stats[0];
      }

      // Safe Server-Side Reward Calculations
      const xpReward = task.xp_reward || (task.is_boss ? 250 : 50);
      const creditReward = task.credit_reward || (task.is_boss ? 75 : 15);
      const attrKey = getCategoryAttribute(task.category);

      let newXP = (stats?.xp || 0) + xpReward;
      let newLevel = stats?.level || 1;
      let newCredits = (stats?.credits || 500) + creditReward;
      let unassignedPoints = stats?.unassigned_points || 0;
      let leveledUp = false;

      // Level-up calculation (Level * 1000 threshold)
      const nextLevelThreshold = newLevel * 1000;
      if (newXP >= nextLevelThreshold) {
        newLevel += 1;
        newXP -= nextLevelThreshold;
        unassignedPoints += 3;
        leveledUp = true;
      }

      const attrVal = (stats?.[attrKey] || 10) + 1;
      const completedAt = new Date().toISOString();

      if (isDBConnected()) {
        await query("UPDATE tasks SET status = 'completed', completed_at = ? WHERE id = ?", [completedAt, id]);
        await query(
          `UPDATE user_stats SET xp = ?, level = ?, credits = ?, unassigned_points = ?, ${attrKey} = ? WHERE user_id = ?`,
          [newXP, newLevel, newCredits, unassignedPoints, attrVal, userId]
        );
        await query('INSERT INTO activity_logs (id, user_id, type, description, xp_delta, credits_delta) VALUES (?, ?, ?, ?, ?, ?)', [
          'act_' + Date.now(),
          userId,
          'MISSION_COMPLETE',
          `Fulfilled directive: "${task.title}"`,
          xpReward,
          creditReward,
        ]);
      } else {
        task.status = 'completed';
        task.completed_at = completedAt;
        if (stats) {
          stats.xp = newXP;
          stats.level = newLevel;
          stats.credits = newCredits;
          stats.unassigned_points = unassignedPoints;
          stats[attrKey] = attrVal;
        }
        memoryStore.activity_logs.unshift({
          id: 'act_' + Date.now(),
          user_id: userId,
          type: 'MISSION_COMPLETE',
          description: `Fulfilled directive: "${task.title}"`,
          xp_delta: xpReward,
          credits_delta: creditReward,
          created_at: completedAt,
        });
      }

      return res.json({
        success: true,
        message: `Directive Completed! +${xpReward} XP, +${creditReward} Credits awarded.`,
        xpGained: xpReward,
        creditsGained: creditReward,
        leveledUp,
        user: {
          level: newLevel,
          currentXP: newXP,
          maxXP: newLevel * 1000,
          credits: newCredits,
          unassignedPoints,
        },
      });
    } catch (err) {
      console.error('[Task completeTask Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to complete mission directive.' });
    }
  },

  toggleSubtask: async (req, res) => {
    try {
      const userId = req.session?.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Session required.' });
      }
      const { id, subtaskId } = req.params;
      let subCompleted = false;

      if (isDBConnected()) {
        const tasks = await query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
        if (!tasks || tasks.length === 0) {
          return res.status(404).json({ success: false, message: 'Mission directive not found.' });
        }

        const sub = await query('SELECT * FROM subtasks WHERE id = ? AND task_id = ?', [subtaskId, id]);
        if (sub && sub.length > 0) {
          subCompleted = !sub[0].completed;
          await query('UPDATE subtasks SET completed = ? WHERE id = ?', [subCompleted, subtaskId]);
        }
        // If boss mission, damage boss HP
        if (tasks[0].is_boss) {
          const dmg = subCompleted ? 50 : -50;
          const newHp = Math.max(0, tasks[0].boss_current_hp - dmg);
          await query('UPDATE tasks SET boss_current_hp = ? WHERE id = ?', [newHp, id]);
        }
      } else {
        const task = memoryStore.tasks.find((t) => t.id === id && t.user_id === userId);
        if (!task) return res.status(404).json({ success: false, message: 'Mission directive not found.' });
        const sub = memoryStore.subtasks.find((s) => s.id === subtaskId && s.task_id === id);
        if (sub) {
          sub.completed = !sub.completed;
          subCompleted = sub.completed;
        }
        if (task && task.is_boss) {
          const dmg = subCompleted ? 50 : -50;
          task.boss_current_hp = Math.max(0, (task.boss_current_hp || 100) - dmg);
        }
      }

      return res.json({
        success: true,
        subtaskCompleted: subCompleted,
        message: subCompleted ? 'Sub-objective executed.' : 'Sub-objective reverted.',
      });
    } catch (err) {
      console.error('[Task toggleSubtask Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to toggle subtask.' });
    }
  },
};
