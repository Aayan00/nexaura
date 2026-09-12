// Nexaura.exe Backend Comprehensive Verification Test Suite
const API_BASE = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('--- STARTING NEXAURA SYSTEM VALIDATION ---');
  let passed = 0;
  let total = 7;

  try {
    // 1. Health Check
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    console.log('[1] Server Health Check:', healthData);
    if (healthData.success) passed++;

    // 2. Auth / User Profile
    const userRes = await fetch(`${API_BASE}/user/profile`);
    const userData = await userRes.json();
    console.log('[2] User Profile API:', userData.success ? 'PASS' : 'FAIL', `Operative: ${userData.user?.username} Level: ${userData.user?.level}`);
    if (userData.success) passed++;

    // 3. Tasks API
    const taskRes = await fetch(`${API_BASE}/tasks`);
    const taskData = await taskRes.json();
    console.log('[3] Tasks/Missions API:', taskData.success ? 'PASS' : 'FAIL', `Total Missions: ${taskData.tasks?.length} Boss count: ${taskData.tasks?.filter(t => t.isBoss).length}`);
    if (taskData.success) passed++;

    // 4. Shop API
    const shopRes = await fetch(`${API_BASE}/shop/items`);
    const shopData = await shopRes.json();
    console.log('[4] Black Market API:', shopData.success ? 'PASS' : 'FAIL', `Total Items: ${shopData.items?.length}`);
    if (shopData.success) passed++;

    // 5. Achievements API
    const achRes = await fetch(`${API_BASE}/achievements`);
    const achData = await achRes.json();
    console.log('[5] Achievements API:', achData.success ? 'PASS' : 'FAIL', `Total Accolades: ${achData.achievements?.length}`);
    if (achData.success) passed++;

    // 6. Focus API
    const focusRes = await fetch(`${API_BASE}/focus/history`);
    const focusData = await focusRes.json();
    console.log('[6] Focus Reactor API:', focusData.success ? 'PASS' : 'FAIL', `History sessions: ${focusData.sessions?.length}`);
    if (focusData.success) passed++;

    // 7. Heatmap API
    const heatRes = await fetch(`${API_BASE}/user/heatmap`);
    const heatData = await heatRes.json();
    console.log('[7] 52-Week Heatmap API:', heatData.success ? 'PASS' : 'FAIL', `Days logged: ${heatData.heatmap?.length}`);
    if (heatData.success) passed++;

    console.log(`--- VALIDATION RESULT: ${passed}/${total} TESTS PASSED ---`);
    if (passed === total) {
      console.log('✅ ALL REST ENDPOINTS OPERATIONAL & VERIFIED');
    }
  } catch (err) {
    console.error('Validation test error:', err.message);
  }
}

runTests();
