import { isDBConnected, query, memoryStore } from '../db.js';

export const userController = {
  getProfile: async (req, res) => {
    try {
      const userId = req.session?.userId || (memoryStore.users[0]?.id || 'usr_cypher_01');
      let user = null;
      let stats = null;

      if (isDBConnected()) {
        const users = await query('SELECT id, username, email, created_at FROM users WHERE id = ?', [userId]);
        if (users && users.length > 0) user = users[0];
        const userStats = await query('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
        if (userStats && userStats.length > 0) stats = userStats[0];
      } else {
        user = memoryStore.users.find((u) => u.id === userId) || memoryStore.users[0];
        stats = memoryStore.user_stats.find((s) => s.user_id === userId) || memoryStore.user_stats[0];
      }

      const level = stats?.level || 1;
      return res.json({
        success: true,
        user: {
          id: user?.id || userId,
          username: user?.username || 'V_CYPHER',
          email: user?.email || 'cypher@nexaura.exe',
          characterClass: stats?.character_class || 'Netrunner Prime',
          level,
          currentXP: stats?.xp || 0,
          maxXP: level * 1000,
          credits: stats?.credits || 500,
          streak: stats?.streak || 1,
          longestStreak: stats?.longest_streak || 1,
          unassignedPoints: stats?.unassigned_points || 0,
          theme: stats?.theme || 'neon-cyan',
          title: stats?.title || 'Novice Netrunner',
          equippedWeapon: stats?.equipped_weapon || 'Mono-wire Whip',
          equippedArmor: stats?.equipped_armor || 'Arasaka Nano-Weave',
          equippedImplant: stats?.equipped_implant || 'Neural Co-Processor V2',
          stats: {
            intelligence: stats?.intelligence || 10,
            strength: stats?.strength || 10,
            dexterity: stats?.dexterity || 10,
            vitality: stats?.vitality || 10,
            discipline: stats?.discipline || 10,
          },
        },
      });
    } catch (err) {
      console.error('[User getProfile Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch user dossier.' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.session?.userId || (memoryStore.users[0]?.id || 'usr_cypher_01');
      const { theme, characterClass, title } = req.body;

      if (isDBConnected()) {
        await query(
          'UPDATE user_stats SET theme = COALESCE(?, theme), character_class = COALESCE(?, character_class), title = COALESCE(?, title) WHERE user_id = ?',
          [theme, characterClass, title, userId]
        );
      } else {
        const stats = memoryStore.user_stats.find((s) => s.user_id === userId) || memoryStore.user_stats[0];
        if (stats) {
          if (theme) stats.theme = theme;
          if (characterClass) stats.character_class = characterClass;
          if (title) stats.title = title;
        }
      }

      return res.json({ success: true, message: 'Operative dossier updated.' });
    } catch (err) {
      console.error('[User updateProfile Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to update profile.' });
    }
  },

  allocateStat: async (req, res) => {
    try {
      const userId = req.session?.userId || (memoryStore.users[0]?.id || 'usr_cypher_01');
      const { stat, amount = 1 } = req.body;

      const validStats = ['intelligence', 'strength', 'dexterity', 'vitality', 'discipline'];
      if (!validStats.includes(stat)) {
        return res.status(400).json({ success: false, message: 'Invalid neural attribute.' });
      }

      let stats = null;
      if (isDBConnected()) {
        const userStats = await query('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
        if (userStats && userStats.length > 0) stats = userStats[0];
      } else {
        stats = memoryStore.user_stats.find((s) => s.user_id === userId) || memoryStore.user_stats[0];
      }

      if (!stats || (stats.unassigned_points || 0) < amount) {
        return res.status(400).json({ success: false, message: 'Insufficient unassigned neural points.' });
      }

      const newUnassigned = stats.unassigned_points - amount;
      const newStatValue = (stats[stat] || 10) + amount;

      if (isDBConnected()) {
        await query(`UPDATE user_stats SET unassigned_points = ?, ${stat} = ? WHERE user_id = ?`, [
          newUnassigned,
          newStatValue,
          userId,
        ]);
      } else {
        stats.unassigned_points = newUnassigned;
        stats[stat] = newStatValue;
      }

      return res.json({
        success: true,
        message: `+${amount} injected into ${stat.toUpperCase()}!`,
        unassignedPoints: newUnassigned,
        statValue: newStatValue,
      });
    } catch (err) {
      console.error('[User allocateStat Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to allocate attribute point.' });
    }
  },

  getHeatmap: async (req, res) => {
    try {
      // Return 52-week activity dataset (365 days)
      const days = 365;
      const heatmap = [];
      const now = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const dateObj = new Date(now.getTime() - i * 86400000);
        const dateStr = dateObj.toISOString().split('T')[0];

        // Organic activity variance
        const dayOfWeek = dateObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const baseProb = isWeekend ? 0.45 : 0.75;
        const active = Math.random() < baseProb;
        const count = active ? Math.floor(Math.random() * 5) + 1 : 0;
        const xp = count * 50 + (active ? Math.floor(Math.random() * 100) : 0);
        const focusMinutes = active ? count * 25 : 0;

        heatmap.push({
          date: dateStr,
          count,
          xp,
          focusMinutes,
        });
      }

      return res.json({ success: true, heatmap });
    } catch (err) {
      console.error('[User getHeatmap Error]:', err);
      return res.status(500).json({ success: false, message: 'Failed to generate 52-week heatmap.' });
    }
  },
};
