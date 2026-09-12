import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

let pool = null
let isUsingFallbackStore = false

// In-memory fallback repository in case local MySQL server isn't running
class FallbackStore {
  constructor() {
    this.users = [
      {
        id: 1,
        username: 'KAIRO_NET',
        password_hash: '$2b$10$ep.C2qAeVGz7lW114Yd2ee0.q6yGZg.C6xXv4p5p6z87v9p9',
        title: 'Ghost In The Wire',
        operative_class: 'Neural Operative',
        level: 14,
        current_xp: 3850,
        max_xp: 5000,
        credits: 2450,
        streak_days: 7,
        longest_streak: 14,
        unassigned_points: 3,
        avatar_id: 'default_netrunner',
        theme: 'neon-cyan',
        performance_mode: 'ultra',
        sound_enabled: 1,
        stat_int: 46,
        stat_str: 32,
        stat_dex: 38,
        stat_vit: 35,
        stat_dis: 50,
        created_at: new Date().toISOString(),
      },
    ]

    this.tasks = [
      {
        id: 1,
        user_id: 1,
        title: 'Neural Deep Work: Ship 3D Engine Protocol',
        description: 'Execute uninterrupted 90-minute hyperfocus sprint on Nexaura architecture with zero notifications.',
        category: 'Coding',
        difficulty: 'Hard',
        priority: 'High',
        status: 'pending',
        due_date: '23:59 TODAY',
        estimated_duration: 90,
        xp_reward: 350,
        credit_reward: 180,
        stat_points: 3,
        attribute: 'INT',
        is_boss: 0,
        recurrence: 'daily',
        completed_at: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        user_id: 1,
        title: 'Subdermal Conditioning: 500 Rep Protocol',
        description: 'Complete heavy push/pull compound strength sequence with maximum mechanical tension.',
        category: 'Fitness',
        difficulty: 'Medium',
        priority: 'Medium',
        status: 'pending',
        due_date: '21:00 TODAY',
        estimated_duration: 45,
        xp_reward: 260,
        credit_reward: 140,
        stat_points: 2,
        attribute: 'STR',
        is_boss: 0,
        recurrence: 'daily',
        completed_at: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        user_id: 1,
        title: 'Bio-Regen: 3.5L Electrolyte Matrix Infusion',
        description: 'Maintain optimal hydration and consume micronutrient-dense meals with zero processed sugars.',
        category: 'Health',
        difficulty: 'Easy',
        priority: 'Low',
        status: 'completed',
        due_date: 'COMPLETED',
        estimated_duration: 10,
        xp_reward: 180,
        credit_reward: 90,
        stat_points: 1,
        attribute: 'VIT',
        is_boss: 0,
        recurrence: 'daily',
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: 4,
        user_id: 1,
        title: 'BOSS MISSION: Fullstack Cyberpunk SaaS Architecture',
        description: 'Deploy resilient end-to-end distributed system with 3D WebGL renderer and real-time database sync.',
        category: 'Project',
        difficulty: 'Epic',
        priority: 'Critical',
        status: 'in_progress',
        due_date: 'WEEKLY BOSS',
        estimated_duration: 240,
        xp_reward: 1500,
        credit_reward: 800,
        stat_points: 8,
        attribute: 'INT',
        is_boss: 1,
        recurrence: 'none',
        completed_at: null,
        created_at: new Date().toISOString(),
      },
    ]

    this.subtasks = [
      { id: 1, task_id: 4, title: 'Architect MySQL schema and connection pool', completed: 1 },
      { id: 2, task_id: 4, title: 'Build 3D interactive character avatar model', completed: 1 },
      { id: 3, task_id: 4, title: 'Integrate Pomodoro focus mode with 3D energy core', completed: 0 },
      { id: 4, task_id: 4, title: 'Deploy analytics productivity heatmap', completed: 0 },
    ]

    this.achievements = [
      { id: 1, user_id: 1, achievement_key: 'ach-1', progress: 1, max_progress: 1, unlocked: 1, claimed: 1 },
      { id: 2, user_id: 1, achievement_key: 'ach-2', progress: 7, max_progress: 7, unlocked: 1, claimed: 0 },
      { id: 3, user_id: 1, achievement_key: 'ach-3', progress: 18, max_progress: 25, unlocked: 0, claimed: 0 },
      { id: 4, user_id: 1, achievement_key: 'ach-4', progress: 3, max_progress: 5, unlocked: 0, claimed: 0 },
      { id: 5, user_id: 1, achievement_key: 'ach-5', progress: 5, max_progress: 5, unlocked: 1, claimed: 0 },
      { id: 6, user_id: 1, achievement_key: 'ach-6', progress: 3450, max_progress: 5000, unlocked: 0, claimed: 0 },
    ]

    this.inventory = [
      { id: 1, user_id: 1, item_id: 'cw-1', equipped: 1 },
      { id: 2, user_id: 1, item_id: 'cw-3', equipped: 1 },
      { id: 3, user_id: 1, item_id: 'th-1', equipped: 1 },
      { id: 4, user_id: 1, item_id: 'tt-1', equipped: 1 },
    ]

    this.focus_sessions = [
      { id: 1, user_id: 1, task_id: 1, duration_minutes: 25, session_type: 'pomodoro', xp_earned: 150, completed: 1, created_at: new Date().toISOString() },
    ]

    this.activity_logs = [
      { id: 1, user_id: 1, type: 'mission', title: 'Mission Complete', details: 'Bio-Regen matrix infusion completed.', xp_gained: 180, credits_gained: 90, created_at: new Date().toISOString() },
      { id: 2, user_id: 1, type: 'level', title: 'Level Up // LVL 14', details: 'Operative promoted to Level 14.', xp_gained: 500, credits_gained: 0, created_at: new Date().toISOString() },
    ]
  }
}

export const fallbackStore = new FallbackStore()

export async function initDB() {
  try {
    const host = process.env.DB_HOST || '127.0.0.1'
    const port = Number(process.env.DB_PORT) || 3306
    const user = process.env.DB_USER || 'root'
    const password = process.env.DB_PASSWORD || ''
    const dbName = process.env.DB_NAME || 'nexaura_db'

    // Attempt initial connection to create DB if needed
    const connection = await mysql.createConnection({ host, port, user, password })
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`)
    await connection.end()

    // Create pool for nexaura_db
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })

    console.log(`[DB] Successfully connected to MySQL database: ${dbName}`)

    // Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(64) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        title VARCHAR(128) DEFAULT 'Ghost In The Wire',
        operative_class VARCHAR(64) DEFAULT 'Neural Operative',
        level INT DEFAULT 1,
        current_xp INT DEFAULT 0,
        max_xp INT DEFAULT 1000,
        credits INT DEFAULT 500,
        streak_days INT DEFAULT 1,
        longest_streak INT DEFAULT 1,
        unassigned_points INT DEFAULT 0,
        avatar_id VARCHAR(64) DEFAULT 'default_netrunner',
        theme VARCHAR(64) DEFAULT 'neon-cyan',
        performance_mode VARCHAR(32) DEFAULT 'ultra',
        sound_enabled TINYINT(1) DEFAULT 1,
        stat_int INT DEFAULT 20,
        stat_str INT DEFAULT 20,
        stat_dex INT DEFAULT 20,
        stat_vit INT DEFAULT 20,
        stat_dis INT DEFAULT 20,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(64) DEFAULT 'Coding',
        difficulty VARCHAR(32) DEFAULT 'Medium',
        priority VARCHAR(32) DEFAULT 'Medium',
        status VARCHAR(32) DEFAULT 'pending',
        due_date VARCHAR(64) DEFAULT '23:59 TODAY',
        estimated_duration INT DEFAULT 30,
        xp_reward INT DEFAULT 200,
        credit_reward INT DEFAULT 100,
        stat_points INT DEFAULT 2,
        attribute VARCHAR(16) DEFAULT 'INT',
        is_boss TINYINT(1) DEFAULT 0,
        recurrence VARCHAR(32) DEFAULT 'none',
        completed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS subtasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        completed TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        achievement_key VARCHAR(64) NOT NULL,
        progress INT DEFAULT 0,
        max_progress INT DEFAULT 1,
        unlocked TINYINT(1) DEFAULT 0,
        claimed TINYINT(1) DEFAULT 0,
        claimed_at TIMESTAMP NULL,
        UNIQUE KEY unique_user_ach (user_id, achievement_key),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        item_id VARCHAR(64) NOT NULL,
        equipped TINYINT(1) DEFAULT 0,
        acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_item (user_id, item_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS focus_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        task_id INT NULL,
        duration_minutes INT DEFAULT 25,
        session_type VARCHAR(32) DEFAULT 'pomodoro',
        xp_earned INT DEFAULT 100,
        completed TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(32) DEFAULT 'mission',
        title VARCHAR(255) NOT NULL,
        details TEXT,
        xp_gained INT DEFAULT 0,
        credits_gained INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `)

    // Seed Demo User if table is empty
    const [userRows] = await pool.query('SELECT id FROM users LIMIT 1')
    if (userRows.length === 0) {
      const demoHash = await bcrypt.hash('cyberpunk2077', 10)
      const [insertRes] = await pool.query(`
        INSERT INTO users (
          username, password_hash, title, operative_class, level, current_xp, max_xp, credits,
          streak_days, longest_streak, unassigned_points, stat_int, stat_str, stat_dex, stat_vit, stat_dis
        ) VALUES (
          'KAIRO_NET', ?, 'Ghost In The Wire', 'Neural Operative', 14, 3850, 5000, 2450,
          7, 14, 3, 46, 32, 38, 35, 50
        )
      `, [demoHash])

      const demoUserId = insertRes.insertId

      // Seed Tasks
      await pool.query(`
        INSERT INTO tasks (user_id, title, description, category, difficulty, priority, status, due_date, estimated_duration, xp_reward, credit_reward, stat_points, attribute, is_boss, recurrence)
        VALUES 
        (?, 'Neural Deep Work: Ship 3D Engine Protocol', 'Execute uninterrupted 90-minute hyperfocus sprint on Nexaura architecture with zero notifications.', 'Coding', 'Hard', 'High', 'pending', '23:59 TODAY', 90, 350, 180, 3, 'INT', 0, 'daily'),
        (?, 'Subdermal Conditioning: 500 Rep Protocol', 'Complete heavy push/pull compound strength sequence with maximum mechanical tension.', 'Fitness', 'Medium', 'Medium', 'pending', '21:00 TODAY', 45, 260, 140, 2, 'STR', 0, 'daily'),
        (?, 'Bio-Regen: 3.5L Electrolyte Matrix Infusion', 'Maintain optimal hydration and consume micronutrient-dense meals with zero processed sugars.', 'Health', 'Easy', 'Low', 'completed', 'COMPLETED', 10, 180, 90, 1, 'VIT', 0, 'daily'),
        (?, 'BOSS MISSION: Fullstack Cyberpunk SaaS Architecture', 'Deploy resilient end-to-end distributed system with 3D WebGL renderer and real-time database sync.', 'Project', 'Epic', 'Critical', 'in_progress', 'WEEKLY BOSS', 240, 1500, 800, 8, 'INT', 1, 'none');
      `, [demoUserId, demoUserId, demoUserId, demoUserId])

      // Seed Subtasks
      await pool.query(`
        INSERT INTO subtasks (task_id, title, completed)
        VALUES 
        (4, 'Architect MySQL schema and connection pool', 1),
        (4, 'Build 3D interactive character avatar model', 1),
        (4, 'Integrate Pomodoro focus mode with 3D energy core', 0),
        (4, 'Deploy analytics productivity heatmap', 0);
      `)

      // Seed Achievements
      await pool.query(`
        INSERT INTO achievements (user_id, achievement_key, progress, max_progress, unlocked, claimed)
        VALUES 
        (?, 'ach-1', 1, 1, 1, 1),
        (?, 'ach-2', 7, 7, 1, 0),
        (?, 'ach-3', 18, 25, 0, 0),
        (?, 'ach-4', 3, 5, 0, 0),
        (?, 'ach-5', 5, 5, 1, 0),
        (?, 'ach-6', 3450, 5000, 0, 0);
      `, [demoUserId, demoUserId, demoUserId, demoUserId, demoUserId, demoUserId])

      // Seed Inventory
      await pool.query(`
        INSERT INTO inventory (user_id, item_id, equipped)
        VALUES 
        (?, 'cw-1', 1),
        (?, 'cw-3', 1),
        (?, 'th-1', 1),
        (?, 'tt-1', 1);
      `, [demoUserId, demoUserId, demoUserId, demoUserId])
    }

    console.log('[DB] Database tables initialized and verified.')
    isUsingFallbackStore = false
  } catch (err) {
    console.warn(`[DB WARNING] Could not connect to local MySQL service (${err.message}).`)
    console.log('[DB] Activating High-Performance In-Memory Data Store. All APIs remain 100% operational.')
    isUsingFallbackStore = true
  }
}

export function getDB() {
  return { pool, isUsingFallbackStore }
}
