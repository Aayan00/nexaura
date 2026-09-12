import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nexaura_exe',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;
let isConnected = false;
let connectionError = null;

// In-Memory Fallback Store (Ensures 0% downtime and instant prototyping)
export const memoryStore = {
  users: [
    {
      id: 'usr_cypher_01',
      username: 'V_CYPHER',
      email: 'cypher@nexaura.exe',
      password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyUIXe/08F7J4nQzQW28k81l1y5h5V6a', // cyberpunk2077
      created_at: new Date().toISOString(),
    },
  ],
  user_stats: [
    {
      id: 'stat_01',
      user_id: 'usr_cypher_01',
      level: 14,
      xp: 4250,
      credits: 1250,
      streak: 7,
      longest_streak: 14,
      last_active_date: new Date().toISOString().split('T')[0],
      character_class: 'Netrunner Prime',
      intelligence: 18,
      strength: 12,
      dexterity: 15,
      vitality: 14,
      discipline: 16,
      unassigned_points: 3,
      theme: 'neon-cyan',
      equipped_weapon: 'Mono-wire Whip',
      equipped_armor: 'Arasaka Nano-Weave',
      equipped_implant: 'Neural Co-Processor V2',
      title: 'Legendary Netrunner',
    },
  ],
  tasks: [
    {
      id: 'task_01',
      user_id: 'usr_cypher_01',
      title: 'Neural Net Optimization Protocol',
      description: 'Refactor mission state engine and subtask synchronization pipelines.',
      category: 'Coding',
      difficulty: 'Hard',
      priority: 'S',
      status: 'pending',
      due_date: new Date(Date.now() + 86400000).toISOString(),
      estimated_duration: 45,
      xp_reward: 100,
      credit_reward: 30,
      attribute_reward: 'Intellect',
      recurrence: 'none',
      is_boss: false,
      boss_name: null,
      boss_max_hp: 100,
      boss_current_hp: 100,
      completed_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: 'task_boss_01',
      user_id: 'usr_cypher_01',
      title: 'Slay Corrupted AI Overlord (Arasaka Root)',
      description: 'Multi-stage boss battle directive. Complete nested subroutines to neutralize core defense matrices.',
      category: 'Coding',
      difficulty: 'Epic',
      priority: 'S',
      status: 'in_progress',
      due_date: new Date(Date.now() + 172800000).toISOString(),
      estimated_duration: 90,
      xp_reward: 250,
      credit_reward: 75,
      attribute_reward: 'Discipline',
      recurrence: 'none',
      is_boss: true,
      boss_name: 'Arasaka Sub-Net Daemon',
      boss_max_hp: 300,
      boss_current_hp: 200,
      completed_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: 'task_02',
      user_id: 'usr_cypher_01',
      title: 'Cybernetic Physical Conditioning',
      description: 'Perform 45-minute HIIT and resistance circuit to boost physical chassis rating.',
      category: 'Fitness',
      difficulty: 'Medium',
      priority: 'A',
      status: 'pending',
      due_date: new Date(Date.now() + 43200000).toISOString(),
      estimated_duration: 45,
      xp_reward: 50,
      credit_reward: 15,
      attribute_reward: 'Strength',
      recurrence: 'daily',
      is_boss: false,
      boss_name: null,
      boss_max_hp: 100,
      boss_current_hp: 100,
      completed_at: null,
      created_at: new Date().toISOString(),
    },
  ],
  subtasks: [
    { id: 'sub_01', task_id: 'task_01', title: 'Audit API routes and parameter contracts', completed: true },
    { id: 'sub_02', task_id: 'task_01', title: 'Implement database connection resilience', completed: false },
    { id: 'sub_03', task_id: 'task_01', title: 'Verify frontend state synchronization', completed: false },
    { id: 'sub_b01', task_id: 'task_boss_01', title: 'Bypass Firewall Layer 1 (Subnet Probe)', completed: true },
    { id: 'sub_b02', task_id: 'task_boss_01', title: 'Inject ICE-Breaker Payload', completed: false },
    { id: 'sub_b03', task_id: 'task_boss_01', title: 'Purge Corrupted Core Memory Blocks', completed: false },
  ],
  achievements: [
    {
      id: 'ach_01',
      user_id: 'usr_cypher_01',
      title: 'First Neural Synapse',
      description: 'Complete your initial RPG mission directive in Nexaura.',
      icon: 'Zap',
      category: 'Missions',
      requirement_type: 'missions_completed',
      requirement_value: 1,
      xp_reward: 100,
      credit_reward: 50,
      unlocked: true,
      claimed: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'ach_02',
      user_id: 'usr_cypher_01',
      title: 'Cyber Samurai',
      description: 'Achieve a continuous 7-day productivity streak.',
      icon: 'Flame',
      category: 'Streak',
      requirement_type: 'streak_days',
      requirement_value: 7,
      xp_reward: 300,
      credit_reward: 150,
      unlocked: true,
      claimed: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'ach_03',
      user_id: 'usr_cypher_01',
      title: 'Boss Vanquisher',
      description: 'Defeat an S-Tier Boss Quest and claim double bounties.',
      icon: 'ShieldAlert',
      category: 'Boss',
      requirement_type: 'bosses_defeated',
      requirement_value: 1,
      xp_reward: 500,
      credit_reward: 250,
      unlocked: false,
      claimed: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'ach_04',
      user_id: 'usr_cypher_01',
      title: 'Deep Work Master',
      description: 'Log over 300 cumulative minutes in the 3D Focus Chamber.',
      icon: 'Clock',
      category: 'Focus',
      requirement_type: 'focus_minutes',
      requirement_value: 300,
      xp_reward: 400,
      credit_reward: 200,
      unlocked: true,
      claimed: false,
      created_at: new Date().toISOString(),
    },
  ],
  inventory: [
    { id: 'inv_01', user_id: 'usr_cypher_01', item_id: 'cw_01', equipped: true, purchased_at: new Date().toISOString() },
    { id: 'inv_02', user_id: 'usr_cypher_01', item_id: 'th_01', equipped: true, purchased_at: new Date().toISOString() },
  ],
  focus_sessions: [
    {
      id: 'foc_01',
      user_id: 'usr_cypher_01',
      task_id: 'task_01',
      duration_minutes: 25,
      notes: 'Deep refactoring session for mission controller.',
      xp_gained: 50,
      credits_gained: 20,
      completed_at: new Date().toISOString(),
    },
  ],
  activity_logs: [
    {
      id: 'act_01',
      user_id: 'usr_cypher_01',
      type: 'MISSION_COMPLETE',
      description: 'Neutralized security exploit in ICE gate.',
      xp_delta: 100,
      credits_delta: 30,
      created_at: new Date().toISOString(),
    },
    {
      id: 'act_02',
      user_id: 'usr_cypher_01',
      type: 'FOCUS_SESSION',
      description: 'Completed 25m Neural Dive in Focus Chamber.',
      xp_delta: 50,
      credits_delta: 20,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};

export async function initDB() {
  try {
    // 1. Attempt server connection
    const serverConnection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
    });

    await serverConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\`;`);
    await serverConnection.end();

    // 2. Create connection pool to the database
    pool = mysql.createPool(DB_CONFIG);

    // 3. Create all 8 tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_stats (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL UNIQUE,
        level INT DEFAULT 1,
        xp INT DEFAULT 0,
        credits INT DEFAULT 500,
        streak INT DEFAULT 1,
        longest_streak INT DEFAULT 1,
        last_active_date DATE,
        character_class VARCHAR(50) DEFAULT 'Netrunner',
        intelligence INT DEFAULT 10,
        strength INT DEFAULT 10,
        dexterity INT DEFAULT 10,
        vitality INT DEFAULT 10,
        discipline INT DEFAULT 10,
        unassigned_points INT DEFAULT 0,
        theme VARCHAR(50) DEFAULT 'neon-cyan',
        equipped_weapon VARCHAR(50),
        equipped_armor VARCHAR(50),
        equipped_implant VARCHAR(50),
        title VARCHAR(50) DEFAULT 'Novice Netrunner',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) DEFAULT 'Coding',
        difficulty VARCHAR(20) DEFAULT 'Medium',
        priority VARCHAR(20) DEFAULT 'B',
        status VARCHAR(20) DEFAULT 'pending',
        due_date DATETIME,
        estimated_duration INT DEFAULT 30,
        xp_reward INT DEFAULT 50,
        credit_reward INT DEFAULT 15,
        attribute_reward VARCHAR(50) DEFAULT 'Intellect',
        recurrence VARCHAR(50) DEFAULT 'none',
        is_boss BOOLEAN DEFAULT FALSE,
        boss_name VARCHAR(100),
        boss_max_hp INT DEFAULT 100,
        boss_current_hp INT DEFAULT 100,
        completed_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS subtasks (
        id VARCHAR(36) PRIMARY KEY,
        task_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(36),
        title VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        category VARCHAR(50),
        requirement_type VARCHAR(50),
        requirement_value INT,
        xp_reward INT,
        credit_reward INT,
        unlocked BOOLEAN DEFAULT FALSE,
        claimed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        item_id VARCHAR(50) NOT NULL,
        equipped BOOLEAN DEFAULT FALSE,
        purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS focus_sessions (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        task_id VARCHAR(36),
        duration_minutes INT NOT NULL,
        notes TEXT,
        xp_gained INT DEFAULT 0,
        credits_gained INT DEFAULT 0,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        xp_delta INT DEFAULT 0,
        credits_delta INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    isConnected = true;
    connectionError = null;
    console.log('✅ [Nexaura DB] Connected to MySQL database:', DB_CONFIG.database);
    return true;
  } catch (err) {
    isConnected = false;
    connectionError = err.message;
    console.warn('⚠️ [Nexaura DB] MySQL connection unavailable:', err.message);
    console.log('⚡ [Nexaura DB] Operating with high-performance in-memory repository store.');
    return false;
  }
}

export function isDBConnected() {
  return isConnected;
}

export function getConnectionError() {
  return connectionError;
}

export async function query(sql, params = []) {
  if (isConnected && pool) {
    try {
      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.warn('[Nexaura DB Query Error]:', err.message);
      throw err;
    }
  }
  return null;
}

export { pool };
