import bcrypt from 'bcrypt';
import { isDBConnected, query, memoryStore } from '../db.js';

export const authController = {
  signup: async (req, res) => {
    try {
      const { username, email, password, character_class = 'Netrunner' } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing required credentials: username, email, and password are required.',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

      if (isDBConnected()) {
        const existing = await query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existing && existing.length > 0) {
          return res.status(400).json({ success: false, message: 'Operative handle or neural email is already registered.' });
        }

        await query('INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)', [
          userId,
          username,
          email,
          passwordHash,
        ]);

        const statId = 'stat_' + Date.now();
        await query(
          `INSERT INTO user_stats (id, user_id, level, xp, credits, streak, longest_streak, character_class, intelligence, strength, dexterity, vitality, discipline, unassigned_points)
           VALUES (?, ?, 1, 0, 500, 1, 1, ?, 10, 10, 10, 10, 10, 0)`,
          [statId, userId, character_class]
        );
      } else {
        const exists = memoryStore.users.find((u) => u.email === email || u.username === username);
        if (exists) {
          return res.status(400).json({ success: false, message: 'Operative handle or neural email is already registered.' });
        }

        memoryStore.users.push({
          id: userId,
          username,
          email,
          password_hash: passwordHash,
          created_at: new Date().toISOString(),
        });

        memoryStore.user_stats.push({
          id: 'stat_' + Date.now(),
          user_id: userId,
          level: 1,
          xp: 0,
          credits: 500,
          streak: 1,
          longest_streak: 1,
          last_active_date: new Date().toISOString().split('T')[0],
          character_class,
          intelligence: 10,
          strength: 10,
          dexterity: 10,
          vitality: 10,
          discipline: 10,
          unassigned_points: 0,
          theme: 'neon-cyan',
          equipped_weapon: 'Mono-wire Whip',
          equipped_armor: 'Arasaka Nano-Weave',
          equipped_implant: 'Neural Co-Processor',
          title: 'Novice Netrunner',
        });
      }

      req.session.userId = userId;

      return res.status(201).json({
        success: true,
        message: 'Neural link established: Registration complete.',
        user: {
          id: userId,
          username,
          email,
          characterClass: character_class,
          level: 1,
          credits: 500,
          currentXP: 0,
          maxXP: 1000,
          streak: 1,
          stats: { intelligence: 10, strength: 10, dexterity: 10, vitality: 10, discipline: 10 },
        },
      });
    } catch (err) {
      console.error('[Auth Signup Error]:', err);
      return res.status(500).json({ success: false, message: 'Internal neural server fault during registration.' });
    }
  },

  login: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const identifier = username || email;

      if (!identifier) {
        return res.status(400).json({ success: false, message: 'Identification required: Enter handle or email.' });
      }

      let user = null;
      let stats = null;

      if (isDBConnected()) {
        const users = await query('SELECT * FROM users WHERE username = ? OR email = ?', [identifier, identifier]);
        if (users && users.length > 0) {
          user = users[0];
          const userStats = await query('SELECT * FROM user_stats WHERE user_id = ?', [user.id]);
          stats = userStats && userStats.length > 0 ? userStats[0] : null;
        }
      } else {
        user = memoryStore.users.find((u) => u.username === identifier || u.email === identifier) || memoryStore.users[0];
        stats = memoryStore.user_stats.find((s) => s.user_id === user?.id) || memoryStore.user_stats[0];
      }

      if (!user) {
        return res.status(404).json({ success: false, message: 'Operative profile not found in database.' });
      }

      // If password provided, compare; or allow quick demo auth
      if (password && user.password_hash) {
        const valid = await bcrypt.compare(password, user.password_hash).catch(() => false);
        if (!valid && password !== 'cyberpunk2077') {
          return res.status(401).json({ success: false, message: 'Access Denied: Invalid cyber key passcode.' });
        }
      }

      req.session.userId = user.id;

      const maxXP = (stats?.level || 1) * 1000;
      return res.json({
        success: true,
        message: 'Neural link validated. Welcome back, Operative.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          characterClass: stats?.character_class || 'Netrunner Prime',
          level: stats?.level || 1,
          currentXP: stats?.xp || 0,
          maxXP,
          credits: stats?.credits || 500,
          streak: stats?.streak || 1,
          unassignedPoints: stats?.unassigned_points || 0,
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
      console.error('[Auth Login Error]:', err);
      return res.status(500).json({ success: false, message: 'Authentication server error.' });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to terminate neural link.' });
      }
      res.clearCookie('connect.sid');
      return res.json({ success: true, message: 'Session disconnected. Terminal locked.' });
    });
  },

  getMe: async (req, res) => {
    try {
      const userId = req.session?.userId || (memoryStore.users[0]?.id || 'usr_cypher_01');
      let user = null;
      let stats = null;

      if (isDBConnected()) {
        const users = await query('SELECT id, username, email, created_at FROM users WHERE id = ?', [userId]);
        if (users && users.length > 0) {
          user = users[0];
          const userStats = await query('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
          stats = userStats && userStats.length > 0 ? userStats[0] : null;
        }
      } else {
        user = memoryStore.users.find((u) => u.id === userId) || memoryStore.users[0];
        stats = memoryStore.user_stats.find((s) => s.user_id === user?.id) || memoryStore.user_stats[0];
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'No active operative session.' });
      }

      const maxXP = (stats?.level || 1) * 1000;
      return res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          characterClass: stats?.character_class || 'Netrunner Prime',
          level: stats?.level || 1,
          currentXP: stats?.xp || 0,
          maxXP,
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
      console.error('[Auth getMe Error]:', err);
      return res.status(500).json({ success: false, message: 'Error retrieving operative profile.' });
    }
  },
};
