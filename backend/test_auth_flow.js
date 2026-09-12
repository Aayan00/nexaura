// Comprehensive Automated Authentication and Data Isolation Test Suite
// Covers Scenarios A through K

const API_BASE = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('🧪 Starting Nexaura Auth & Security Test Suite...\n');

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

  const testSuffix = Date.now().toString().slice(-5);
  const testUser = {
    username: `cyber_test_${testSuffix}`,
    email: `test_${testSuffix}@nexaura.net`,
    password: 'password123#',
  };

  // Helper for requests with manual cookie management
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
    // -------------------------------------------------------------
    // Test 1: Unauthenticated request to protected endpoints -> 401
    // -------------------------------------------------------------
    console.log('[1] Testing Protected Endpoints without Auth...');
    const unauthMe = await makeRequest('/auth/me');
    assert(unauthMe.status === 401, 'GET /api/auth/me returns 401 when unauthenticated');

    const unauthTasks = await makeRequest('/tasks');
    assert(unauthTasks.status === 401, 'GET /api/tasks returns 401 when unauthenticated');

    const unauthProfile = await makeRequest('/user/profile');
    assert(unauthProfile.status === 401, 'GET /api/user/profile returns 401 when unauthenticated');

    const unauthShop = await makeRequest('/shop/items');
    assert(unauthShop.status === 401, 'GET /api/shop/items returns 401 when unauthenticated');

    // -------------------------------------------------------------
    // Test 2: Input Validation Failures on Registration
    // -------------------------------------------------------------
    console.log('\n[2] Testing Registration Input Validations...');
    const shortUser = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: 'ab', email: 'valid@net.com', password: 'password123' }),
    });
    assert(shortUser.status === 400, 'Rejects username with < 3 characters (400)');

    const badEmail = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: 'validUser', email: 'notanemail', password: 'password123' }),
    });
    assert(badEmail.status === 400, 'Rejects invalid email format (400)');

    const shortPass = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: 'validUser', email: 'valid@net.com', password: 'short' }),
    });
    assert(shortPass.status === 400, 'Rejects password with < 8 characters (400)');

    // -------------------------------------------------------------
    // Test 3: Successful Registration
    // -------------------------------------------------------------
    console.log('\n[3] Testing Successful Registration...');
    const regRes = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser),
    });
    assert(regRes.status === 201, 'POST /api/auth/register returns 201 Created');
    assert(regRes.data?.success === true, 'Response indicates success: true');
    assert(regRes.data?.user?.username === testUser.username, 'Returned user matches registered username');

    // -------------------------------------------------------------
    // Test 4: Duplicate Registration Checks (Username & Email)
    // -------------------------------------------------------------
    console.log('\n[4] Testing Duplicate Checks...');
    const dupEmail = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: `different_${testSuffix}`,
        email: testUser.email,
        password: 'password123#',
      }),
    });
    assert(dupEmail.status === 409, 'Rejects duplicate email with 409 Conflict');

    const dupUsername = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: testUser.username,
        email: `different_${testSuffix}@nexaura.net`,
        password: 'password123#',
      }),
    });
    assert(dupUsername.status === 409, 'Rejects duplicate username with 409 Conflict');

    // -------------------------------------------------------------
    // Test 5: Login with Wrong Password
    // -------------------------------------------------------------
    console.log('\n[5] Testing Login with Invalid Credentials...');
    const badLogin = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: testUser.username,
        password: 'wrong_password_xyz',
      }),
    });
    assert(badLogin.status === 401, 'Login with incorrect password returns 401');

    const unknownUserLogin = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'non_existent_runner_99999',
        password: 'password123#',
      }),
    });
    assert(unknownUserLogin.status === 401, 'Login with non-existent user returns 401');

    // -------------------------------------------------------------
    // Test 6: Successful Login via Username
    // -------------------------------------------------------------
    console.log('\n[6] Testing Successful Login (Username + Password)...');
    const loginRes = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: testUser.username,
        password: testUser.password,
      }),
    });
    assert(loginRes.status === 200, 'POST /api/auth/login returns 200 OK');
    assert(loginRes.data?.success === true, 'Login response success: true');
    assert(loginRes.data?.user?.username === testUser.username, 'Login returns correct user profile');
    assert(!!loginRes.setCookie, 'Login establishes session cookie');

    const userCookie = loginRes.setCookie ? loginRes.setCookie.split(';')[0] : null;

    // -------------------------------------------------------------
    // Test 7: Successful Login via Email
    // -------------------------------------------------------------
    console.log('\n[7] Testing Successful Login (Email + Password)...');
    const emailLoginRes = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
    assert(emailLoginRes.status === 200, 'POST /api/auth/login by email returns 200 OK');

    // -------------------------------------------------------------
    // Test 8: Session Persistence & GET /api/auth/me
    // -------------------------------------------------------------
    console.log('\n[8] Testing Authenticated Session (GET /api/auth/me)...');
    const meRes = await makeRequest('/auth/me', {}, userCookie);
    assert(meRes.status === 200, 'GET /api/auth/me with session cookie returns 200');
    assert(meRes.data?.user?.username === testUser.username, 'Me endpoint identifies current authenticated user');

    // -------------------------------------------------------------
    // Test 9: Accessing Protected Routes with Session
    // -------------------------------------------------------------
    console.log('\n[9] Testing Protected Route Access with Active Session...');
    const tasksRes = await makeRequest('/tasks', {}, userCookie);
    assert(tasksRes.status === 200, 'GET /api/tasks returns 200 with session');

    const profileRes = await makeRequest('/user/profile', {}, userCookie);
    assert(profileRes.status === 200, 'GET /api/user/profile returns 200 with session');

    const shopRes = await makeRequest('/shop/items', {}, userCookie);
    assert(shopRes.status === 200, 'GET /api/shop/items returns 200 with session');

    const achRes = await makeRequest('/achievements', {}, userCookie);
    assert(achRes.status === 200, 'GET /api/achievements returns 200 with session');

    // -------------------------------------------------------------
    // Test 10: User Data Isolation (User 1 vs User 2)
    // -------------------------------------------------------------
    console.log('\n[10] Testing User Data Isolation...');
    // Create task for User 1
    const taskTitle = `Secret Directive ${Date.now()}`;
    const createTaskRes = await makeRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: taskTitle,
        description: 'Classified task only visible to User 1',
        category: 'Personal',
        difficulty: 'medium',
        stat_type: 'INT',
      }),
    }, userCookie);
    assert(createTaskRes.status === 201 || createTaskRes.status === 200, 'User 1 creates a private task');

    // Register User 2
    const user2 = {
      username: `agent_b_${testSuffix}`,
      email: `agent_b_${testSuffix}@nexaura.net`,
      password: 'password456#',
    };
    await makeRequest('/auth/register', { method: 'POST', body: JSON.stringify(user2) });
    const user2Login = await makeRequest('/auth/login', { method: 'POST', body: JSON.stringify(user2) });
    const user2Cookie = user2Login.setCookie ? user2Login.setCookie.split(';')[0] : null;

    // Fetch tasks as User 2
    const user2Tasks = await makeRequest('/tasks', {}, user2Cookie);
    const hasUser1Task = (user2Tasks.data?.tasks || []).some((t) => t.title === taskTitle);
    assert(!hasUser1Task, "User 2 CANNOT see User 1's task (strict user isolation confirmed)");

    // -------------------------------------------------------------
    // Test 11: Logout Flow
    // -------------------------------------------------------------
    console.log('\n[11] Testing Logout...');
    const logoutRes = await makeRequest('/auth/logout', { method: 'POST' }, userCookie);
    assert(logoutRes.status === 200, 'POST /api/auth/logout returns 200 OK');

    const afterLogoutMe = await makeRequest('/auth/me', {}, userCookie);
    assert(afterLogoutMe.status === 401, 'After logout, GET /api/auth/me returns 401');

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Unexpected test failure:', err);
    process.exit(1);
  }
}

runTests();
