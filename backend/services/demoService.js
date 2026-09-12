import bcrypt from 'bcrypt';
import { isDBConnected, query, memoryStore } from '../db.js';

const DEMO_CATALOG_ITEMS = [
  { id: 'cw_01', equipped: true },
  { id: 'cw_02', equipped: true },
  { id: 'cw_03', equipped: true },
  { id: 'th_01', equipped: true },
  { id: 'th_02', equipped: false },
  { id: 'th_03', equipped: false },
  { id: 'tit_01', equipped: false },
  { id: 'tit_02', equipped: true },
];

const DEMO_ACHIEVEMENTS = [
  {
    code: 'first_blood',
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
    code: 'cyber_samurai',
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
    code: 'boss_vanquisher',
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
    code: 'deep_work_master',
    title: 'Deep Work Master',
    description: 'Log over 300 cumulative minutes in the 3D Focus Chamber.',
    icon: 'Clock',
    category: 'Focus',
    requirement_type: 'focus_minutes',
    requirement_value: 300,
    xp_reward: 400,
    credit_reward: 200,
  },
  {
    code: 'market_baron',
    title: 'Black Market Baron',
    description: 'Collect all high-tier cyberware augments and neon holographic themes.',
    icon: 'ShoppingBag',
    category: 'Market',
    requirement_type: 'items_owned',
    requirement_value: 5,
    xp_reward: 600,
    credit_reward: 300,
  },
  {
    code: 'legendary_netrunner',
    title: 'Reality Architect Ascendant',
    description: 'Reach maximum operative level with fully optimized neural attributes.',
    icon: 'Trophy',
    category: 'Accolade',
    requirement_type: 'level_reached',
    requirement_value: 50,
    xp_reward: 1000,
    credit_reward: 1000,
  },
];

export async function initializeDemoAccount() {
  const username = process.env.DEMO_USERNAME || 'demo_netrunner';
  const email = (process.env.DEMO_EMAIL || 'demo@nexaura.exe').toLowerCase().trim();
  const password = process.env.DEMO_PASSWORD || 'SetYourDemoPasswordHere';

  try {
    if (isDBConnected()) {
      // 1. Check if demo user already exists
      const existingUsers = await query(
        'SELECT id, username, email, is_demo FROM users WHERE email = ? OR username = ?',
        [email, username]
      );

      let demoUserId = null;

      if (existingUsers && existingUsers.length > 0) {
        demoUserId = existingUsers[0].id;
        // Ensure is_demo flag is set to true
        if (!existingUsers[0].is_demo) {
          await query('UPDATE users SET is_demo = TRUE WHERE id = ?', [demoUserId]);
        }
        console.log(`ℹ️ [Nexaura Demo] Demo account exists (${email}). Verifying demo telemetry...`);
      } else {
        // 2. Create the demo user
        demoUserId = 'usr_demo_' + Date.now();
        const passwordHash = await bcrypt.hash(password, 10);

        await query(
          'INSERT INTO users (id, username, email, password_hash, is_demo) VALUES (?, ?, ?, ?, TRUE)',
          [demoUserId, username, email, passwordHash]
        );
        console.log(`✨ [Nexaura Demo] Created demo user "${username}" (${email})`);
      }

      // 3. Ensure Max-Level user_stats exists for demo user
      const existingStats = await query('SELECT id FROM user_stats WHERE user_id = ?', [demoUserId]);
      if (!existingStats || existingStats.length === 0) {
        const statId = ('sd_' + demoUserId).slice(0, 36);
        await query(
          `INSERT INTO user_stats (
            id, user_id, level, xp, credits, streak, longest_streak,
            character_class, intelligence, strength, dexterity, vitality, discipline, unassigned_points,
            theme, equipped_weapon, equipped_armor, equipped_implant, title
          ) VALUES (?, ?, 50, 50000, 99999, 45, 60, ?, 99, 99, 99, 99, 99, 25, 'neon-cyan', ?, ?, ?, ?)`,
          [
            statId,
            demoUserId,
            'Prime Cyber Netrunner',
            'High-Frequency Muramasa Katana',
            'Titanium Exosuit Bracing',
            'Neural Co-Processor V2',
            'Callsign: Cyber SamurAI',
          ]
        );
      }

      // 4. Ensure All Achievements are Unlocked and Claimed
      for (const ach of DEMO_ACHIEVEMENTS) {
        const achId = ('ad_' + ach.code + '_' + demoUserId).slice(0, 48);
        const existingAch = await query('SELECT id FROM achievements WHERE id = ?', [achId]);
        if (!existingAch || existingAch.length === 0) {
          await query(
            `INSERT INTO achievements (
              id, user_id, title, description, icon, category,
              requirement_type, requirement_value, xp_reward, credit_reward, unlocked, claimed
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, TRUE)`,
            [
              achId,
              demoUserId,
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
      }

      // 5. Ensure All Catalog Items are in Demo Inventory and Equipped
      for (const item of DEMO_CATALOG_ITEMS) {
        const existingInv = await query(
          'SELECT id FROM inventory WHERE user_id = ? AND item_id = ?',
          [demoUserId, item.id]
        );
        if (!existingInv || existingInv.length === 0) {
          const invId = ('id_' + item.id + '_' + demoUserId).slice(0, 36);
          await query(
            'INSERT INTO inventory (id, user_id, item_id, equipped) VALUES (?, ?, ?, ?)',
            [invId, demoUserId, item.id, item.equipped]
          );
        }
      }

      // 6. Ensure Showcase Completed Missions & Vanquished Boss Task
      const existingTasks = await query('SELECT id FROM tasks WHERE user_id = ?', [demoUserId]);
      if (!existingTasks || existingTasks.length === 0) {
        const now = new Date();
        const past = new Date(Date.now() - 3600000 * 4);

        // Completed Regular Mission
        const task1Id = 'task_demo_01';
        await query(
          `INSERT INTO tasks (
            id, user_id, title, description, category, difficulty, priority, status,
            estimated_duration, xp_reward, credit_reward, attribute_reward, recurrence,
            is_boss, completed_at, created_at
          ) VALUES (?, ?, ?, ?, 'Coding', 'Hard', 'A', 'completed', 45, 200, 75, 'INT', 'none', FALSE, ?, ?)`,
          [
            task1Id,
            demoUserId,
            'Neural Core Architecture Refactoring',
            'Successfully refactored mission queue pipelines and neural state decoders.',
            now,
            past,
          ]
        );

        // Defeated S-Tier Boss Mission
        const bossTaskId = 'task_demo_boss_01';
        await query(
          `INSERT INTO tasks (
            id, user_id, title, description, category, difficulty, priority, status,
            estimated_duration, xp_reward, credit_reward, attribute_reward, recurrence,
            is_boss, boss_name, boss_max_hp, boss_current_hp, completed_at, created_at
          ) VALUES (?, ?, ?, ?, 'Coding', 'Epic', 'S', 'completed', 90, 500, 250, 'DIS', 'none', TRUE, ?, 500, 0, ?, ?)`,
          [
            bossTaskId,
            demoUserId,
            'Vanquish Corrupted NetDaemon AI (Arasaka Root)',
            'Overclocked neural mainframe infiltration. Boss core successfully neutralized.',
            'Arasaka Corrupted Daemon Alpha',
            now,
            past,
          ]
        );

        // Subtasks for Boss Task
        await query(
          'INSERT INTO subtasks (id, task_id, title, completed) VALUES (?, ?, ?, TRUE)',
          ['sub_demo_01', bossTaskId, 'Breach Outer ICE Firewall']
        );
        await query(
          'INSERT INTO subtasks (id, task_id, title, completed) VALUES (?, ?, ?, TRUE)',
          ['sub_demo_02', bossTaskId, 'Inject Neural Worm Payload']
        );
        await query(
          'INSERT INTO subtasks (id, task_id, title, completed) VALUES (?, ?, ?, TRUE)',
          ['sub_demo_03', bossTaskId, 'Sever Daemon Feedback Loop']
        );
      }

      // 7. Ensure Completed Focus Sessions
      const existingFocus = await query('SELECT id FROM focus_sessions WHERE user_id = ?', [demoUserId]);
      if (!existingFocus || existingFocus.length === 0) {
        await query(
          'INSERT INTO focus_sessions (id, user_id, duration_minutes, notes, xp_gained, credits_gained, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          ['foc_demo_01', demoUserId, 50, 'Overclocked coding sprint on 3D character engine.', 100, 40, new Date()]
        );
        await query(
          'INSERT INTO focus_sessions (id, user_id, duration_minutes, notes, xp_gained, credits_gained, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          ['foc_demo_02', demoUserId, 25, 'Neural sync and code review session.', 50, 20, new Date(Date.now() - 86400000)]
        );
      }

      // 8. Ensure Activity Logs
      const existingLogs = await query('SELECT id FROM activity_logs WHERE user_id = ?', [demoUserId]);
      if (!existingLogs || existingLogs.length === 0) {
        await query(
          'INSERT INTO activity_logs (id, user_id, type, description, xp_delta, credits_delta) VALUES (?, ?, ?, ?, ?, ?)',
          ['act_demo_01', demoUserId, 'ACHIEVEMENT_CLAIM', 'Claimed Accolade: Reality Architect Ascendant', 1000, 1000]
        );
        await query(
          'INSERT INTO activity_logs (id, user_id, type, description, xp_delta, credits_delta) VALUES (?, ?, ?, ?, ?, ?)',
          ['act_demo_02', demoUserId, 'PURCHASE', 'Acquired Black Market item: Titanium Exosuit Bracing', 0, -600]
        );
        await query(
          'INSERT INTO activity_logs (id, user_id, type, description, xp_delta, credits_delta) VALUES (?, ?, ?, ?, ?, ?)',
          ['act_demo_03', demoUserId, 'MISSION_COMPLETE', 'Defeated S-Tier Boss: Arasaka Corrupted Daemon Alpha', 500, 250]
        );
      }

      console.log(`✅ [Nexaura Demo] Demo account ready: ${username} (${email}) [MAX LEVEL 50, IS_DEMO: TRUE]`);
    } else {
      // Memory Store Fallback
      let user = memoryStore.users.find((u) => u.email === email || u.username === username);
      if (!user) {
        const passwordHash = await bcrypt.hash(password, 10);
        user = {
          id: 'usr_demo_netrunner',
          username,
          email,
          password_hash: passwordHash,
          is_demo: true,
          created_at: new Date().toISOString(),
        };
        memoryStore.users.push(user);
        memoryStore.user_stats.push({
          id: 'stat_demo_01',
          user_id: user.id,
          level: 50,
          xp: 50000,
          credits: 99999,
          streak: 45,
          longest_streak: 60,
          character_class: 'Prime Cyber Netrunner',
          intelligence: 99,
          strength: 99,
          dexterity: 99,
          vitality: 99,
          discipline: 99,
          unassigned_points: 25,
          theme: 'neon-cyan',
          equipped_weapon: 'High-Frequency Muramasa Katana',
          equipped_armor: 'Titanium Exosuit Bracing',
          equipped_implant: 'Neural Co-Processor V2',
          title: 'Callsign: Cyber SamurAI',
        });
      }
    }
  } catch (err) {
    console.error('❌ [Nexaura Demo] Failed to initialize demo account:', err);
  }
}
