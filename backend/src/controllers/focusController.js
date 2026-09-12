import { getDB, fallbackStore } from '../config/db.js'

export async function startFocusSession(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { taskId = null, durationMinutes = 25, sessionType = 'pomodoro' } = req.body

    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const session = {
        id: fallbackStore.focus_sessions.length + 1,
        user_id: userId,
        task_id: taskId,
        duration_minutes: durationMinutes,
        session_type: sessionType,
        xp_earned: durationMinutes * 6,
        completed: 0,
        created_at: new Date().toISOString(),
      }
      fallbackStore.focus_sessions.unshift(session)
      return res.json({ success: true, session })
    }

    const [result] = await pool.query(
      `INSERT INTO focus_sessions (user_id, task_id, duration_minutes, session_type, xp_earned, completed)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [userId, taskId, durationMinutes, sessionType, durationMinutes * 6]
    )

    const [rows] = await pool.query('SELECT * FROM focus_sessions WHERE id = ?', [result.insertId])
    res.json({ success: true, session: rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function completeFocusSession(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { sessionId, durationMinutes = 25, taskId, notes } = req.body
    const xpReward = Math.round(durationMinutes * 6)
    const creditReward = Math.round(durationMinutes * 3)

    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const session = fallbackStore.focus_sessions.find((s) => s.id === Number(sessionId)) || {
        id: fallbackStore.focus_sessions.length + 1,
        user_id: userId,
        task_id: taskId || null,
        duration_minutes: durationMinutes,
        session_type: 'deep_work',
        xp_earned: xpReward,
        completed: 1,
        created_at: new Date().toISOString(),
      }
      session.completed = 1

      const user = fallbackStore.users.find((u) => u.id === userId) || fallbackStore.users[0]
      user.current_xp += xpReward
      user.credits += creditReward

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
        title: 'Deep Work Focus Complete',
        details: `${durationMinutes}m deep focus reactor cycle completed. ${notes || ''}`,
        xp_gained: xpReward,
        credits_gained: creditReward,
        created_at: new Date().toISOString(),
      })

      return res.json({ success: true, session, user, xpGained: xpReward, creditsGained: creditReward, didLevelUp })
    }

    if (sessionId) {
      await pool.query('UPDATE focus_sessions SET completed = 1 WHERE id = ?', [sessionId])
    } else {
      await pool.query(
        'INSERT INTO focus_sessions (user_id, task_id, duration_minutes, session_type, xp_earned, completed) VALUES (?, ?, "deep_work", ?, 1)',
        [userId, taskId || null, durationMinutes, xpReward]
      )
    }

    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    const user = userRows[0]

    let nextXP = user.current_xp + xpReward
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

    await pool.query(
      `UPDATE users SET
        current_xp = ?,
        level = ?,
        max_xp = ?,
        credits = credits + ?,
        unassigned_points = ?
       WHERE id = ?`,
      [nextXP, nextLevel, nextMaxXP, creditReward, nextUnassigned, userId]
    )

    await pool.query(
      `INSERT INTO activity_logs (user_id, type, title, details, xp_gained, credits_gained)
       VALUES (?, 'mission', 'Focus Session Complete', ?, ?, ?)`,
      [userId, `Completed ${durationMinutes}m deep focus sprint.`, xpReward, creditReward]
    )

    const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    res.json({ success: true, user: updatedUser[0], xpGained: xpReward, creditsGained: creditReward, didLevelUp })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getFocusHistory(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      return res.json({
        success: true,
        history: fallbackStore.focus_sessions,
        sessions: fallbackStore.focus_sessions,
      })
    }

    const [rows] = await pool.query('SELECT * FROM focus_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 30', [userId])
    res.json({ success: true, history: rows, sessions: rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
