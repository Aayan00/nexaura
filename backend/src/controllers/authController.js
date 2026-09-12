import bcrypt from 'bcrypt'
import { getDB, fallbackStore } from '../config/db.js'

export async function signup(req, res) {
  try {
    const { username, password, operativeClass = 'Neural Operative', favoredStat = 'INT' } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    const { pool, isUsingFallbackStore } = getDB()
    const passwordHash = await bcrypt.hash(password, 10)

    if (isUsingFallbackStore || !pool) {
      const existing = fallbackStore.users.find((u) => u.username.toLowerCase() === username.toLowerCase())
      if (existing) {
        return res.status(409).json({ error: 'Operative callsign already registered' })
      }

      const newUser = {
        id: fallbackStore.users.length + 1,
        username: username.toUpperCase(),
        password_hash: passwordHash,
        title: 'Novice Netrunner',
        operative_class: operativeClass,
        level: 1,
        current_xp: 0,
        max_xp: 1000,
        credits: 500,
        streak_days: 1,
        longest_streak: 1,
        unassigned_points: 5,
        avatar_id: 'default_netrunner',
        theme: 'neon-cyan',
        performance_mode: 'ultra',
        sound_enabled: 1,
        stat_int: favoredStat === 'INT' ? 30 : 20,
        stat_str: favoredStat === 'STR' ? 30 : 20,
        stat_dex: favoredStat === 'DEX' ? 30 : 20,
        stat_vit: favoredStat === 'VIT' ? 30 : 20,
        stat_dis: favoredStat === 'DIS' ? 30 : 20,
        created_at: new Date().toISOString(),
      }

      fallbackStore.users.push(newUser)
      req.session.userId = newUser.id
      return res.json({ success: true, user: newUser })
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username.toUpperCase()])
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Operative callsign already registered' })
    }

    const [result] = await pool.query(
      `INSERT INTO users (username, password_hash, operative_class, unassigned_points, stat_int, stat_str, stat_dex, stat_vit, stat_dis)
       VALUES (?, ?, ?, 5, ?, ?, ?, ?, ?)`,
      [
        username.toUpperCase(),
        passwordHash,
        operativeClass,
        favoredStat === 'INT' ? 30 : 20,
        favoredStat === 'STR' ? 30 : 20,
        favoredStat === 'DEX' ? 30 : 20,
        favoredStat === 'VIT' ? 30 : 20,
        favoredStat === 'DIS' ? 30 : 20,
      ]
    )

    req.session.userId = result.insertId
    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId])
    res.json({ success: true, user: userRows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const user = fallbackStore.users.find((u) => u.username.toLowerCase() === (username || '').toLowerCase())
      if (!user) {
        // Auto-create for demo ease
        const demoUser = fallbackStore.users[0]
        req.session.userId = demoUser.id
        return res.json({ success: true, user: demoUser })
      }

      req.session.userId = user.id
      return res.json({ success: true, user })
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [(username || '').toUpperCase()])
    if (rows.length === 0) {
      // Return default operative for quick demo
      const [allUsers] = await pool.query('SELECT * FROM users LIMIT 1')
      if (allUsers.length > 0) {
        req.session.userId = allUsers[0].id
        return res.json({ success: true, user: allUsers[0] })
      }
      return res.status(401).json({ error: 'Operative not found in registry' })
    }

    const user = rows[0]
    req.session.userId = user.id
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function logout(req, res) {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Neural link severed.' })
  })
}

export async function getMe(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const user = fallbackStore.users.find((u) => u.id === userId) || fallbackStore.users[0]
      return res.json({ success: true, user })
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    if (rows.length === 0) {
      const [first] = await pool.query('SELECT * FROM users LIMIT 1')
      return res.json({ success: true, user: first[0] || null })
    }

    res.json({ success: true, user: rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
