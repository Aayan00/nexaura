import { getDB, fallbackStore } from '../config/db.js'

export async function getUserProfile(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const user = fallbackStore.users.find((u) => u.id === userId) || fallbackStore.users[0]
      return res.json({ success: true, user })
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    res.json({ success: true, user: rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getUserStats(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const user = fallbackStore.users.find((u) => u.id === userId) || fallbackStore.users[0]
      const attributes = [
        { code: 'INT', name: 'Intellect', fullName: 'Intellect & Neural Processing', value: user.stat_int, level: Math.floor(user.stat_int / 10) + 1 },
        { code: 'STR', name: 'Strength', fullName: 'Strength & Physical Power', value: user.stat_str, level: Math.floor(user.stat_str / 10) + 1 },
        { code: 'DEX', name: 'Dexterity', fullName: 'Dexterity & Motor Agility', value: user.stat_dex, level: Math.floor(user.stat_dex / 10) + 1 },
        { code: 'VIT', name: 'Vitality', fullName: 'Vitality & Bio-Resilience', value: user.stat_vit, level: Math.floor(user.stat_vit / 10) + 1 },
        { code: 'DIS', name: 'Discipline', fullName: 'Discipline & Willpower Core', value: user.stat_dis, level: Math.floor(user.stat_dis / 10) + 1 },
      ]
      return res.json({ success: true, attributes, unassignedPoints: user.unassigned_points })
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    const user = rows[0]

    const attributes = [
      { code: 'INT', name: 'Intellect', fullName: 'Intellect & Neural Processing', value: user.stat_int, level: Math.floor(user.stat_int / 10) + 1 },
      { code: 'STR', name: 'Strength', fullName: 'Strength & Physical Power', value: user.stat_str, level: Math.floor(user.stat_str / 10) + 1 },
      { code: 'DEX', name: 'Dexterity', fullName: 'Dexterity & Motor Agility', value: user.stat_dex, level: Math.floor(user.stat_dex / 10) + 1 },
      { code: 'VIT', name: 'Vitality', fullName: 'Vitality & Bio-Resilience', value: user.stat_vit, level: Math.floor(user.stat_vit / 10) + 1 },
      { code: 'DIS', name: 'Discipline', fullName: 'Discipline & Willpower Core', value: user.stat_dis, level: Math.floor(user.stat_dis / 10) + 1 },
    ]

    res.json({ success: true, attributes, unassignedPoints: user.unassigned_points })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function allocateStat(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { attribute } = req.body // 'INT', 'STR', 'DEX', 'VIT', 'DIS' or 'intelligence' etc.
    if (!attribute) return res.status(400).json({ error: 'Attribute code required' })

    const code = attribute.toUpperCase().slice(0, 3) // INT, STR, DEX, VIT, DIS
    const { pool, isUsingFallbackStore } = getDB()
    const attrCol = `stat_${code.toLowerCase()}`

    if (isUsingFallbackStore || !pool) {
      const user = fallbackStore.users.find((u) => u.id === userId) || fallbackStore.users[0]
      if (user.unassigned_points <= 0) {
        return res.status(400).json({ error: 'No unassigned stat points available' })
      }

      user.unassigned_points -= 1
      user[attrCol] = (user[attrCol] || 10) + 2

      fallbackStore.activity_logs.unshift({
        id: fallbackStore.activity_logs.length + 1,
        user_id: user.id,
        type: 'stat',
        title: `${code} Attribute Surge`,
        details: `Allocated points to ${code}. New rating: ${user[attrCol]}.`,
        xp_gained: 0,
        credits_gained: 0,
        created_at: new Date().toISOString(),
      })

      return res.json({ success: true, user })
    }

    const [userRows] = await pool.query('SELECT unassigned_points FROM users WHERE id = ?', [userId])
    if (userRows[0].unassigned_points <= 0) {
      return res.status(400).json({ error: 'No unassigned stat points available' })
    }

    await pool.query(
      `UPDATE users SET
        unassigned_points = unassigned_points - 1,
        ${attrCol} = ${attrCol} + 2
       WHERE id = ?`,
      [userId]
    )

    await pool.query(
      `INSERT INTO activity_logs (user_id, type, title, details)
       VALUES (?, 'stat', ?, ?)`,
      [userId, `${code} Attribute Surge`, `Allocated points to ${code}.`]
    )

    const [updated] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    res.json({ success: true, user: updated[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getUserAnalytics(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { pool, isUsingFallbackStore } = getDB()

    const sampleHeatmap = Array.from({ length: 52 * 7 }, (_, i) => ({
      date: new Date(Date.now() - (52 * 7 - i) * 86400000).toISOString().split('T')[0],
      count: (i * 7) % 5,
      xp: ((i * 7) % 5) * 120,
    }))

    if (isUsingFallbackStore || !pool) {
      const completedTasks = fallbackStore.tasks.filter((t) => t.status === 'completed').length
      const totalTasks = fallbackStore.tasks.length

      const analytics = {
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100,
        totalCompleted: completedTasks,
        totalActive: totalTasks - completedTasks,
        currentStreak: 7,
        longestStreak: 14,
        totalFocusMinutes: 175,
        categoryDistribution: {
          Coding: 45,
          Fitness: 25,
          Health: 15,
          Project: 15,
        },
        weeklyActivity: [
          { day: 'Mon', completed: 4, xp: 850 },
          { day: 'Tue', completed: 5, xp: 1100 },
          { day: 'Wed', completed: 3, xp: 620 },
          { day: 'Thu', completed: 6, xp: 1400 },
          { day: 'Fri', completed: 4, xp: 900 },
          { day: 'Sat', completed: 7, xp: 1850 },
          { day: 'Sun', completed: 5, xp: 1200 },
        ],
      }

      return res.json({
        success: true,
        analytics,
        heatmap: sampleHeatmap,
      })
    }

    const [taskStats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM tasks WHERE user_id = ?
    `, [userId])

    const [userRow] = await pool.query('SELECT streak_days, longest_streak FROM users WHERE id = ?', [userId])

    const total = taskStats[0]?.total || 0
    const completed = taskStats[0]?.completed || 0

    const analytics = {
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 100,
      totalCompleted: completed,
      totalActive: total - completed,
      currentStreak: userRow[0]?.streak_days || 1,
      longestStreak: userRow[0]?.longest_streak || 1,
      totalFocusMinutes: 175,
      categoryDistribution: {
        Coding: 45,
        Fitness: 25,
        Health: 15,
        Project: 15,
      },
      weeklyActivity: [
        { day: 'Mon', completed: 4, xp: 850 },
        { day: 'Tue', completed: 5, xp: 1100 },
        { day: 'Wed', completed: 3, xp: 620 },
        { day: 'Thu', completed: 6, xp: 1400 },
        { day: 'Fri', completed: 4, xp: 900 },
        { day: 'Sat', completed: 7, xp: 1850 },
        { day: 'Sun', completed: 5, xp: 1200 },
      ],
    }

    res.json({
      success: true,
      analytics,
      heatmap: sampleHeatmap,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getUserActivity(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      return res.json({ success: true, activity: fallbackStore.activity_logs })
    }

    const [rows] = await pool.query('SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 25', [userId])
    res.json({ success: true, activity: rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
