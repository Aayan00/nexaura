import { isDBConnected, query, memoryStore } from '../db.js';

export const achievementController = {
  getAchievements: async (req, res) => {
    try {
      const userId = req.session?.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      if (isDBConnected()) {
        const achievements = await query('SELECT * FROM achievements WHERE user_id = ? OR user_id IS NULL', [userId]);
        return res.json({
          success: true,
          achievements: (achievements || []).map((a) => ({
            id: a.id,
            title: a.title,
            description: a.description,
            icon: a.icon,
            category: a.category,
            xpReward: a.xp_reward,
            creditReward: a.credit_reward,
            unlocked: Boolean(a.unlocked),
            claimed: Boolean(a.claimed),
          })),
        });
      } else {
        return res.json({
          success: true,
          achievements: memoryStore.achievements.map((a) => ({
            id: a.id,
            title: a.title,
            description: a.description,
            icon: a.icon,
            category: a.category,
            xpReward: a.xp_reward,
            creditReward: a.credit_reward,
            unlocked: Boolean(a.unlocked),
            claimed: Boolean(a.claimed),
          })),
        });
      }
    } catch (err) {
      console.error('[Achievement getAchievements Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to access accolades matrix.' });
    }
  },

  claimAchievement: async (req, res) => {
    try {
      const userId = req.session?.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }
      const { id } = req.params;

      let ach = null;
      let stats = null;

      if (isDBConnected()) {
        const achs = await query('SELECT * FROM achievements WHERE id = ? AND (user_id = ? OR user_id IS NULL)', [id, userId]);
        if (!achs || achs.length === 0) {
          return res.status(404).json({ success: false, message: 'Achievement accolade not found.' });
        }
        ach = achs[0];
        if (ach.claimed) {
          return res.status(400).json({ success: false, message: 'Reward already claimed.' });
        }
        const userStats = await query('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
        if (userStats && userStats.length > 0) stats = userStats[0];
      } else {
        ach = memoryStore.achievements.find((a) => a.id === id);
        if (!ach) return res.status(404).json({ success: false, message: 'Achievement accolade not found.' });
        if (ach.claimed) return res.status(400).json({ success: false, message: 'Reward already claimed.' });
        stats = memoryStore.user_stats.find((s) => s.user_id === userId) || memoryStore.user_stats[0];
      }

      const xpReward = ach.xp_reward || 100;
      const creditReward = ach.credit_reward || 50;

      let newXP = (stats?.xp || 0) + xpReward;
      let newLevel = stats?.level || 1;
      let newCredits = (stats?.credits || 500) + creditReward;
      let unassignedPoints = stats?.unassigned_points || 0;

      const nextLevelThreshold = newLevel * 1000;
      if (newXP >= nextLevelThreshold) {
        newLevel += 1;
        newXP -= nextLevelThreshold;
        unassignedPoints += 3;
      }

      if (isDBConnected()) {
        await query('UPDATE achievements SET claimed = true, unlocked = true WHERE id = ?', [id]);
        await query('UPDATE user_stats SET xp = ?, level = ?, credits = ?, unassigned_points = ? WHERE user_id = ?', [
          newXP,
          newLevel,
          newCredits,
          unassignedPoints,
          userId,
        ]);
        await query('INSERT INTO activity_logs (id, user_id, type, description, xp_delta, credits_delta) VALUES (?, ?, ?, ?, ?, ?)', [
          'act_' + Date.now(),
          userId,
          'ACHIEVEMENT_CLAIM',
          `Claimed Accolade Bounty: "${ach.title}"`,
          xpReward,
          creditReward,
        ]);
      } else {
        ach.claimed = true;
        ach.unlocked = true;
        if (stats) {
          stats.xp = newXP;
          stats.level = newLevel;
          stats.credits = newCredits;
          stats.unassigned_points = unassignedPoints;
        }
        memoryStore.activity_logs.unshift({
          id: 'act_' + Date.now(),
          user_id: userId,
          type: 'ACHIEVEMENT_CLAIM',
          description: `Claimed Accolade Bounty: "${ach.title}"`,
          xp_delta: xpReward,
          credits_delta: creditReward,
          created_at: new Date().toISOString(),
        });
      }

      return res.json({
        success: true,
        message: `Accolade Claimed! +${xpReward} XP, +${creditReward} Credits!`,
        achievement: { ...ach, claimed: true, unlocked: true },
        user: {
          level: newLevel,
          currentXP: newXP,
          maxXP: newLevel * 1000,
          credits: newCredits,
          unassignedPoints,
        },
      });
    } catch (err) {
      console.error('[Achievement claimAchievement Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to claim accolade reward.' });
    }
  },
};
