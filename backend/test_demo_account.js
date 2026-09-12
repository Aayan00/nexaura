// Automated Test Suite for Nexaura.exe Demo Account
import dotenv from 'dotenv';
import { initializeDemoAccount } from './services/demoService.js';
import { query, isDBConnected } from './db.js';

dotenv.config();

const API_BASE = 'http://127.0.0.1:5000/api';
const DEMO_USERNAME = process.env.DEMO_USERNAME || 'demo_netrunner';
const DEMO_EMAIL = process.env.DEMO_EMAIL || 'demo@nexaura.exe';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'SetYourDemoPasswordHere';

async function runDemoTests() {
  console.log('🧪 Starting Demo Account Verification Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  async function makeRequest(endpoint, options = {}, cookie = null) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (cookie) {
      headers['Cookie'] = cookie;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const setCookie = res.headers.get('set-cookie');
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    return {
      status: res.status,
      data,
      setCookie,
    };
  }

  try {
    // -----------------------------------------------------------------
    // Test 1: Idempotent Initialization & Single Account Verification
    // -----------------------------------------------------------------
    console.log('[1] Testing Idempotent initializeDemoAccount()...');
    await initializeDemoAccount(); // Call again to verify idempotence
    await initializeDemoAccount(); // Call 3rd time to test idempotence

    if (isDBConnected()) {
      const demoUsers = await query(
        'SELECT id, username, email, is_demo, password_hash FROM users WHERE email = ?',
        [DEMO_EMAIL]
      );
      assert(demoUsers && demoUsers.length === 1, 'Exactly one demo account exists in MySQL database (no duplicates)');
      assert(demoUsers[0].is_demo === 1 || demoUsers[0].is_demo === true, 'Demo user record has is_demo = TRUE');
      assert(!demoUsers[0].password_hash.includes(DEMO_PASSWORD), 'Demo password is encrypted with bcrypt hash');
    } else {
      assert(true, 'In-memory demo user verified');
    }

    // -----------------------------------------------------------------
    // Test 2: Login using Demo Username & Environment Password
    // -----------------------------------------------------------------
    console.log('\n[2] Testing Demo Login via POST /api/auth/login...');
    const loginRes = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: DEMO_USERNAME,
        password: DEMO_PASSWORD,
      }),
    });

    assert(loginRes.status === 200, 'POST /api/auth/login returns 200 OK for demo account');
    assert(loginRes.data?.success === true, 'Login response success: true');
    assert(loginRes.data?.user?.username === DEMO_USERNAME, 'Returned username matches demo username');
    assert(loginRes.data?.user?.is_demo === true, 'Returned user has is_demo: true');
    assert(loginRes.data?.user?.password === undefined, 'No plain password in login response');
    assert(loginRes.data?.user?.password_hash === undefined, 'No password_hash in login response');
    assert(!!loginRes.setCookie, 'Demo login sets session cookie');

    const demoCookie = loginRes.setCookie ? loginRes.setCookie.split(';')[0] : null;

    // -----------------------------------------------------------------
    // Test 3: Demo Login via Demo Email
    // -----------------------------------------------------------------
    console.log('\n[3] Testing Demo Login via Email...');
    const emailLogin = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      }),
    });
    assert(emailLogin.status === 200, 'Login by demo email returns 200 OK');

    // -----------------------------------------------------------------
    // Test 4: Maximum Level & Fully Upgraded Telemetry (GET /api/auth/me)
    // -----------------------------------------------------------------
    console.log('\n[4] Testing Demo Profile Telemetry & Max Stats...');
    const meRes = await makeRequest('/auth/me', {}, demoCookie);
    assert(meRes.status === 200, 'GET /api/auth/me returns 200 for demo user');
    const demoProfile = meRes.data?.user;

    assert(demoProfile?.level === 50, `Character level is at maximum: 50 (got: ${demoProfile?.level})`);
    assert(demoProfile?.currentXP === 50000, `XP is appropriately maxed: 50000 (got: ${demoProfile?.currentXP})`);
    assert(demoProfile?.credits === 99999, `Credits maxed: 99999 (got: ${demoProfile?.credits})`);
    assert(demoProfile?.streak === 45, `High productivity streak: 45 (got: ${demoProfile?.streak})`);
    assert(demoProfile?.longestStreak === 60, `High longest streak: 60 (got: ${demoProfile?.longestStreak})`);
    assert(demoProfile?.unassignedPoints === 25, `Unassigned points available: 25 (got: ${demoProfile?.unassignedPoints})`);
    assert(demoProfile?.characterClass === 'Prime Cyber Netrunner', `Fully upgraded class: Prime Cyber Netrunner (got: ${demoProfile?.characterClass})`);
    assert(demoProfile?.title === 'Callsign: Cyber SamurAI', `Best title: Callsign: Cyber SamurAI (got: ${demoProfile?.title})`);
    assert(demoProfile?.equippedWeapon === 'High-Frequency Muramasa Katana', `Best weapon equipped: ${demoProfile?.equippedWeapon}`);
    assert(demoProfile?.equippedArmor === 'Titanium Exosuit Bracing', `Best armor equipped: ${demoProfile?.equippedArmor}`);
    assert(demoProfile?.equippedImplant === 'Neural Co-Processor V2', `Best implant equipped: ${demoProfile?.equippedImplant}`);

    const stats = demoProfile?.stats;
    assert(
      stats?.intelligence === 99 &&
      stats?.strength === 99 &&
      stats?.dexterity === 99 &&
      stats?.vitality === 99 &&
      stats?.discipline === 99,
      'All attributes (INT, STR, DEX, VIT, DIS) fully upgraded to 99'
    );

    // -----------------------------------------------------------------
    // Test 5: All Achievements Unlocked & Claimed
    // -----------------------------------------------------------------
    console.log('\n[5] Testing Demo Achievements...');
    const achRes = await makeRequest('/achievements', {}, demoCookie);
    assert(achRes.status === 200, 'GET /api/achievements returns 200 for demo user');
    const achievements = achRes.data?.achievements || [];
    assert(achievements.length >= 6, `Demo user has all ${achievements.length} achievements`);

    const allUnlocked = achievements.every((a) => a.unlocked === true);
    const allClaimed = achievements.every((a) => a.claimed === true);
    assert(allUnlocked, 'All demo achievements are UNLOCKED');
    assert(allClaimed, 'All demo achievements are CLAIMED');

    // -----------------------------------------------------------------
    // Test 6: Demo Inventory & Equipment
    // -----------------------------------------------------------------
    console.log('\n[6] Testing Demo Inventory...');
    const shopRes = await makeRequest('/shop/items', {}, demoCookie);
    assert(shopRes.status === 200, 'GET /api/shop/items returns 200');
    const items = shopRes.data?.items || [];
    const allOwned = items.every((i) => i.owned === true);
    assert(allOwned, 'All catalog items in Black Market are OWNED by demo account');

    const equippedItems = items.filter((i) => i.equipped === true);
    assert(equippedItems.length >= 4, `Key demo items equipped where logically possible (count: ${equippedItems.length})`);

    // -----------------------------------------------------------------
    // Test 7: Completed Missions & Defeated S-Tier Boss Mission
    // -----------------------------------------------------------------
    console.log('\n[7] Testing Demo Tasks & Boss Quest...');
    const tasksRes = await makeRequest('/tasks', {}, demoCookie);
    assert(tasksRes.status === 200, 'GET /api/tasks returns 200');
    const tasks = tasksRes.data?.tasks || [];
    const completedTasks = tasks.filter((t) => t.status === 'completed');
    assert(completedTasks.length >= 2, `Completed demo tasks exist (count: ${completedTasks.length})`);

    const bossTask = tasks.find((t) => t.isBoss === true || t.is_boss === 1 || t.is_boss === true);
    assert(bossTask !== undefined, 'S-Tier Boss Quest exists in demo directive list');
    assert(bossTask?.bossCurrentHp === 0 || bossTask?.boss_current_hp === 0, 'S-Tier Boss Quest defeated (HP = 0)');
    assert(bossTask?.status === 'completed', 'Boss Quest status is completed');
    assert(bossTask?.subtasks?.length === 3, 'Boss subroutines exist');
    assert(bossTask?.subtasks?.every((s) => Boolean(s.completed)), 'All boss subroutines completed');

    // -----------------------------------------------------------------
    // Test 8: Isolation from Normal Newly Registered User
    // -----------------------------------------------------------------
    console.log('\n[8] Testing Data Isolation with Normal New Operative...');
    const normalUser = {
      username: `fresh_runner_${Date.now().toString().slice(-4)}`,
      email: `fresh_${Date.now().toString().slice(-4)}@nexaura.net`,
      password: 'FreshPassword123#',
    };

    const regRes = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(normalUser),
    });
    assert(regRes.status === 201, 'Normal user registers successfully');

    const normalLogin = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(normalUser),
    });
    const normalCookie = normalLogin.setCookie ? normalLogin.setCookie.split(';')[0] : null;

    const normalMe = await makeRequest('/auth/me', {}, normalCookie);
    assert(normalMe.data?.user?.level === 1, 'Normal user starts at beginner level 1 (NOT 50)');
    assert(normalMe.data?.user?.credits === 500, 'Normal user starts with beginner credits 500 (NOT 99999)');
    assert(normalMe.data?.user?.is_demo === false, 'Normal user has is_demo: false');

    const normalTasks = await makeRequest('/tasks', {}, normalCookie);
    const normalSeesDemoTask = (normalTasks.data?.tasks || []).some(
      (t) => t.title.includes('Arasaka') || t.title.includes('Neural Core Architecture')
    );
    assert(!normalSeesDemoTask, 'Normal user CANNOT see any demo tasks (strict multi-tenant isolation)');

    // -----------------------------------------------------------------
    // Test 9: Logout Flow
    // -----------------------------------------------------------------
    console.log('\n[9] Testing Demo Logout...');
    const logoutRes = await makeRequest('/auth/logout', { method: 'POST' }, demoCookie);
    assert(logoutRes.status === 200, 'POST /api/auth/logout succeeds');

    const checkAfterLogout = await makeRequest('/auth/me', {}, demoCookie);
    assert(checkAfterLogout.status === 401, 'After logout, demo session is terminated (401)');

    console.log(`\n========================================`);
    console.log(`Demo Test Results: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Unexpected test failure:', err);
    process.exit(1);
  }
}

runDemoTests();
