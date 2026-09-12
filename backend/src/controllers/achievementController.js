import { getDB, fallbackStore } from '../config/db.js'

const ACHIEVEMENTS_DEF = [
  {
    id: 'ach-1',
    title: 'First Neural Sync',
    category: 'protocol',
    description: 'Complete your initial mission on Nexaura.exe OS.',
    max: 1,
    xpReward: 200,
    creditReward: 100,
    icon: 'CheckCircle2',
  },
  {
    id: 'ach-2',
    title: '7-Day Neural Overclock',
    category: 'protocol',
    description: 'Maintain an unbroken 7-day daily mission streak.',
    max: 7,
    xpReward: 1000,
    creditReward: 500,
    icon: 'Flame',
  },
  {
    id: 'ach-3',
    title: 'Neural Singularity',
    category: 'neural',
    description: 'Complete 25 high-intensity Intellect (INT) missions.',
    max: 25,
    xpReward: 1500,
    creditReward: 800,
    icon: 'Brain',
  },
  {
    id: 'ach-4',
    title: 'Subdermal Titan',
    category: 'combat',
    description: 'Reach Level 5 in Strength (STR) attribute.',
    max: 5,
    xpReward: 1200,
    creditReward: 600,
    icon: 'Dumbbell',
  },
  {
    id: 'ach-5',
    title: 'Iron Will Protocol',
    category: 'protocol',
    description: 'Attain Level 5 in Discipline (DIS) attribute.',
    max: 5,
    xpReward: 1200,
    creditReward: 600,
    icon: 'ShieldCheck',
  },
  {
    id: 'ach-6',
    title: 'Black Market Tycoon',
    category: 'market',
    description: 'Accumulate a cumulative total of 5,000 Credits.',
    max: 5000,
    xpReward: 2000,
    creditReward: 1000,
    icon: 'Coins',
  },
]

export async function getAchievements(req, res) {
  try {
    const userId = req.session?.userId || 1
    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      const userAchs = fallbackStore.achievements.filter((a) => a.user_id === userId || a.user_id === 1)
      const achievements = ACHIEVEMENTS_DEF.map((def) => {
        const record = userAchs.find((a) => a.achievement_key === def.id)
        return {
          ...def,
          current: record?.progress || (def.id === 'ach-2' ? 7 : def.id === 'ach-5' ? 5 : 0),
          unlocked: Boolean(record?.unlocked) || (def.id === 'ach-1' || def.id === 'ach-2' || def.id === 'ach-5'),
          claimed: Boolean(record?.claimed) || (def.id === 'ach-1'),
        }
      })
      return res.json({ success: true, achievements })
    }

    const [rows] = await pool.query('SELECT * FROM achievements WHERE user_id = ?', [userId])
    const achievements = ACHIEVEMENTS_DEF.map((def) => {
      const record = rows.find((a) => a.achievement_key === def.id)
      return {
        ...def,
        current: record?.progress || 0,
        unlocked: Boolean(record?.unlocked),
        claimed: Boolean(record?.claimed),
      }
    })

    res.json({ success: true, achievements })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function claimAchievement(req, res) {
  try {
    const userId = req.session?.userId || 1
    const achId = req.params.id
    const def = ACHIEVEMENTS_DEF.find((a) => a.id === achId)
    if (!def) return res.status(404).json({ error: 'Achievement not found' })

    const { pool, isUsingFallbackStore } = getDB()

    if (isUsingFallbackStore || !pool) {
      let record = fallbackStore.achievements.find((a) => a.user_id === userId && a.achievement_key === achId)
      if (!record) {
        record = { id: fallbackStore.achievements.length + 1, user_id: userId, achievement_key: achId, progress: def.max, unlocked: 1, claimed: 1 }
        fallbackStore.achievements.push(record)
      } else {
        record.claimed = 1
      }

      const user = fallbackStore.users.find((u) => u.id === userId) || fallbackStore.users[0]
      user.current_xp += def.xpReward
      user.credits += def.creditReward

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
        type: 'achievement',
        title: 'Achievement Claimed',
        details: `Milestone [${def.title}] claimed. +${def.xpReward} XP & +${def.creditReward} ₢.`,
        xp_gained: def.xpReward,
        credits_gained: def.creditReward,
        created_at: new Date().toISOString(),
      })

      return res.json({ success: true, user, achievement: def, didLevelUp })
    }

    await pool.query(
      `INSERT INTO achievements (user_id, achievement_key, progress, max_progress, unlocked, claimed, claimed_at)
       VALUES (?, ?, ?, ?, 1, 1, NOW())
       ON DUPLICATE KEY UPDATE claimed = 1, claimed_at = NOW()`,
      [userId, achId, def.max, def.max]
    )

    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    const user = userRows[0]

    let nextXP = user.current_xp + def.xpReward
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
      [nextXP, nextLevel, nextMaxXP, def.creditReward, nextUnassigned, userId]
    )

    await pool.query(
      `INSERT INTO activity_logs (user_id, type, title, details, xp_gained, credits_gained)
       VALUES (?, 'achievement', 'Achievement Claimed', ?, ?, ?)`,
      [userId, `Milestone [${def.title}] claimed.`, def.xpReward, def.creditReward]
    )

    const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    res.json({ success: true, user: updatedUser[0], achievement: def, didLevelUp })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
