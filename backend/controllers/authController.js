import bcrypt from 'bcrypt';
import { isDBConnected, query, memoryStore } from '../db.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password, character_class = 'Neural Operative' } = req.body;

      // 1. Input Validation
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required: username, email, and password.',
        });
      }

      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim().toLowerCase();

      if (trimmedUsername.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Username must be at least 3 characters long.',
        });
      }

      if (!EMAIL_REGEX.test(trimmedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.',
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long.',
        });
      }

      // 2. Uniqueness Check in MySQL
      const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      const passwordHash = await bcrypt.hash(password, 10);

      if (isDBConnected()) {
        const existingUsers = await query(
          'SELECT id, username, email FROM users WHERE username = ? OR email = ?',
          [trimmedUsername, trimmedEmail]
        );

        if (existingUsers && existingUsers.length > 0) {
          const match = existingUsers[0];
          if (match.email.toLowerCase() === trimmedEmail) {
            return res.status(409).json({
              success: false,
              message: 'Email address is already registered. Please log in or use another email.',
            });
          }
          return res.status(409).json({
            success: false,
            message: 'Username is already taken. Please select another callsign.',
          });
        }

        // 3. Insert new User into `users` table
        try {
          await query(
            'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)',
            [userId, trimmedUsername, trimmedEmail, passwordHash]
          );
        } catch (dbErr) {
          if (dbErr.code === 'ER_DUP_ENTRY' || dbErr.errno === 1062) {
            return res.status(409).json({
              success: false,
              message: 'Username or email already exists in the neural database.',
            });
          }
          throw dbErr;
        }

        // 4. Create related row in `user_stats` table
        const statId = 'stat_' + Date.now();
        await query(
          `INSERT INTO user_stats (
            id, user_id, level, xp, credits, streak, longest_streak,
            character_class, intelligence, strength, dexterity, vitality, discipline, unassigned_points,
            theme, title
          ) VALUES (?, ?, 1, 0, 500, 1, 1, ?, 10, 10, 10, 10, 10, 0, 'neon-cyan', 'Novice Netrunner')`,
          [statId, userId, character_class]
        );

        // 5. Initialize starter achievements for the user
        const starterAchievements = [
          {
            id: `ach_01_${userId}`,
            title: 'First Neural Synapse',
            description: 'Complete your initial RPG mission directive in Nexaura.',
            icon: 'Zap',
            category: 'Missions',
            requirement_type: 'missions_completed',
            requirement_value: 1,
            xp_reward: 100,
            credit_reward: 50,
          },
          {
            id: `ach_02_${userId}`,
            title: 'Cyber Samurai',
            description: 'Achieve a continuous 7-day productivity streak.',
            icon: 'Flame',
            category: 'Streak',
            requirement_type: 'streak_days',
            requirement_value: 7,
            xp_reward: 300,
            credit_reward: 150,
          },
          {
            id: `ach_03_${userId}`,
            title: 'Boss Vanquisher',
            description: 'Defeat an S-Tier Boss Quest and claim double bounties.',
            icon: 'ShieldAlert',
            category: 'Boss',
            requirement_type: 'bosses_defeated',
            requirement_value: 1,
            xp_reward: 500,
            credit_reward: 250,
          },
          {
            id: `ach_04_${userId}`,
            title: 'Deep Work Master',
            description: 'Log over 300 cumulative minutes in the 3D Focus Chamber.',
            icon: 'Clock',
            category: 'Focus',
            requirement_type: 'focus_minutes',
            requirement_value: 300,
            xp_reward: 400,
            credit_reward: 200,
          },
        ];

        for (const ach of starterAchievements) {
          await query(
            `INSERT INTO achievements (
              id, user_id, title, description, icon, category,
              requirement_type, requirement_value, xp_reward, credit_reward, unlocked, claimed
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE, FALSE)`,
            [
              ach.id,
              userId,
              ach.title,
              ach.description,
              ach.icon,
              ach.category,
              ach.requirement_type,
              ach.requirement_value,
              ach.xp_reward,
              ach.credit_reward,
            ]
          );
        }
      } else {
        // In-Memory store fallback if DB is not active
        const exists = memoryStore.users.find(
          (u) => u.email.toLowerCase() === trimmedEmail || u.username.toLowerCase() === trimmedUsername.toLowerCase()
        );
        if (exists) {
          return res.status(409).json({
            success: false,
            message: 'Username or email is already registered.',
          });
        }

        memoryStore.users.push({
          id: userId,
          username: trimmedUsername,
          email: trimmedEmail,
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
          character_class,
          intelligence: 10,
          strength: 10,
          dexterity: 10,
          vitality: 10,
          discipline: 10,
          unassigned_points: 0,
          theme: 'neon-cyan',
          title: 'Novice Netrunner',
        });
      }

      // Never return password or password_hash
      return res.status(201).json({
        success: true,
        message: 'Account created successfully. Please log in.',
        user: {
          id: userId,
          username: trimmedUsername,
          email: trimmedEmail,
        },
      });
    } catch (err) {
      console.error('[Auth Register Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal neural server fault during registration.',
      });
    }
  },

  login: async (req, res) => {
    try {
      const { username, email, identifier, password } = req.body;
      const loginIdentifier = (identifier || username || email || '').trim();

      if (!loginIdentifier || !password) {
        return res.status(400).json({
          success: false,
          message: 'Both callsign/email and password are required.',
        });
      }

      let user = null;
      let stats = null;

      if (isDBConnected()) {
        const users = await query(
          'SELECT id, username, email, password_hash, is_demo, created_at FROM users WHERE username = ? OR email = ?',
          [loginIdentifier, loginIdentifier.toLowerCase()]
        );
        if (users && users.length > 0) {
          user = users[0];
          const userStats = await query('SELECT * FROM user_stats WHERE user_id = ?', [user.id]);
          stats = userStats && userStats.length > 0 ? userStats[0] : null;
        }
      } else {
        user = memoryStore.users.find(
          (u) =>
            u.username.toLowerCase() === loginIdentifier.toLowerCase() ||
            u.email.toLowerCase() === loginIdentifier.toLowerCase()
        );
        if (user) {
          stats = memoryStore.user_stats.find((s) => s.user_id === user.id);
        }
      }

      // Reject if user not found
      if (!user || !user.password_hash) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials: User not found or passcode incorrect.',
        });
      }

      // Verify bcrypt password comparison (Strict: NO hardcoded bypasses)
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials: User not found or passcode incorrect.',
        });
      }

      // Establish session with ONLY safe user information
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        is_demo: Boolean(user.is_demo),
      };
      req.session.userId = user.id;

      const level = stats?.level || 1;
      const maxXP = level * 1000;

      return res.json({
        success: true,
        message: 'Neural link established. Welcome back, Operative.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          is_demo: Boolean(user.is_demo),
          characterClass: stats?.character_class || 'Neural Operative',
          level,
          currentXP: stats?.xp || 0,
          maxXP,
          credits: stats?.credits || 500,
          streak: stats?.streak || 1,
          longestStreak: stats?.longest_streak || 1,
          unassignedPoints: stats?.unassigned_points || 0,
          theme: stats?.theme || 'neon-cyan',
          title: stats?.title || 'Novice Netrunner',
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
      return res.status(500).json({
        success: false,
        message: 'Authentication server error.',
      });
    }
  },

  getMe: async (req, res) => {
    try {
      const sessionUser = req.session?.user;
      const userId = sessionUser?.id || req.session?.userId;

      // Strict session enforcement - NO fallback to demo users!
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: No active operative session.',
        });
      }

      let user = null;
      let stats = null;

      if (isDBConnected()) {
        const users = await query(
          'SELECT id, username, email, is_demo, created_at FROM users WHERE id = ?',
          [userId]
        );
        if (users && users.length > 0) {
          user = users[0];
          const userStats = await query('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
          stats = userStats && userStats.length > 0 ? userStats[0] : null;
        }
      } else {
        user = memoryStore.users.find((u) => u.id === userId);
        if (user) {
          stats = memoryStore.user_stats.find((s) => s.user_id === user.id);
        }
      }

      if (!user) {
        // Session points to non-existent user: destroy session
        req.session.destroy(() => {});
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Operative profile not found.',
        });
      }

      const level = stats?.level || 1;
      const maxXP = level * 1000;

      return res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          is_demo: Boolean(user.is_demo),
          characterClass: stats?.character_class || 'Neural Operative',
          level,
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
      return res.status(500).json({
        success: false,
        message: 'Error retrieving operative profile.',
      });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('[Auth Logout Error]:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to terminate neural link.',
        });
      }
      res.clearCookie('connect.sid');
      return res.json({
        success: true,
        message: 'Session disconnected. Terminal locked.',
      });
    });
  },
};
