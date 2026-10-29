const http = require('http');

const BASE_URL = 'http://127.0.0.1:5173';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders = { ...headers };
    let payload = null;

    if (body) {
      payload = JSON.stringify(body);
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(url, { method, headers: reqHeaders }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('KAVITHA & ASSOCIATES — SHARED PERSISTENCE & SECURITY VERIFICATION');
  console.log('================================================================\n');

  let allPassed = true;
  let testNum = 1;

  function assert(name, condition) {
    console.log(`  ${testNum.toString().padStart(2)}. ${name.padEnd(65)} [${condition ? '✓ PASS' : '✗ FAIL'}]`);
    if (!condition) allPassed = false;
    testNum++;
  }

  // Test 1: Shared Database Health
  const health = await request('GET', '/api/status');
  assert('Server API reports shared database engine', health.status === 200 && health.data.engine === 'shared-database');

  // Test 2: Unauthorized Read of Private Enquiries
  const unauthRead = await request('GET', '/api/admin/enquiries');
  assert('Unauthenticated GET /api/admin/enquiries rejected with 401', unauthRead.status === 401);

  // Test 3: Unauthorized Mutation of Private Records
  const unauthPatch = await request('PATCH', '/api/admin/enquiries/ENQ-FAKE', { status: 'closed' });
  assert('Unauthenticated PATCH /api/admin/enquiries rejected with 401', unauthPatch.status === 401);

  // Test 4: Unauthorized Deletion
  const unauthDelete = await request('DELETE', '/api/admin/enquiries/ENQ-FAKE');
  assert('Unauthenticated DELETE /api/admin/enquiries rejected with 401', unauthDelete.status === 401);

  // Test 5: Unauthorized Content Overwrite
  const unauthContent = await request('PUT', '/api/admin/content/services/income-tax', { title: 'Hacked' });
  assert('Unauthenticated PUT /api/admin/content/services rejected with 401', unauthContent.status === 401);

  // Test 6: Public Form Input Validation (< 2 char name)
  const invalidName = await request('POST', '/api/enquiries', {
    fullName: 'X',
    phone: '9848012345',
    message: 'Valid requirement message here.'
  });
  assert('Public form rejects short client name (< 2 chars) with 400', invalidName.status === 400);

  // Test 7: Public Form Genuine Submission
  const validSubmission = await request('POST', '/api/enquiries', {
    fullName: 'Sreenivas Naidu (Tirupati Agro)',
    entityType: 'Private Limited Company',
    organization: 'Tirupati Agro Processing Pvt Ltd',
    phone: '+91 94401 23456',
    email: 'sreenivas@tirupatiagro.com',
    serviceCategory: 'Taxation & Statutory Compliances',
    city: 'Tirupati',
    urgency: 'statutory-deadline',
    message: 'Urgent consultation requested for GST annual reconciliation and filing before statutory deadline.'
  });
  assert('Public contact form submits successfully with 201 Created', validSubmission.status === 201 && validSubmission.data.enquiry?.id);
  const createdEnquiryId = validSubmission.data.enquiry?.id;

  // Test 8: Login Failure with Invalid Password
  const badLogin = await request('POST', '/api/auth/login', {
    username: 'kavitha',
    password: 'WrongPassword123'
  });
  assert('Login with incorrect password rejected with 401', badLogin.status === 401);

  // Test 9: Valid Authentication for Managing Partner
  const goodLogin = await request('POST', '/api/auth/login', {
    username: 'kavitha',
    password: 'Tirupati@CA2026'
  });
  assert('Authorized login succeeds and returns session token', goodLogin.status === 200 && goodLogin.data.session?.token);
  const token = goodLogin.data.session?.token;

  // Test 10: Authenticated Enquiry Access
  const authEnquiries = await request('GET', '/api/admin/enquiries', null, {
    'Authorization': `Bearer ${token}`
  });
  const found = (authEnquiries.data.enquiries || []).find(e => e.id === createdEnquiryId);
  assert('Authenticated admin retrieves genuine enquiry submitted from public form', authEnquiries.status === 200 && Boolean(found));

  // Test 11: Authenticated Status Update & Notes
  const updateRes = await request('PATCH', `/api/admin/enquiries/${createdEnquiryId}`, {
    status: 'in-progress',
    followUpNotes: 'Discussed with CA Kavitha; scheduled chambers audit on Monday.'
  }, {
    'Authorization': `Bearer ${token}`
  });
  assert('Authenticated admin transitions status to "in-progress" and adds notes', updateRes.status === 200 && updateRes.data.enquiry.status === 'in-progress');

  // Test 12: Content Management & Public Sync
  const updateService = await request('PUT', '/api/admin/content/services/income-tax', {
    title: 'Income Tax & Appellate Services',
    shortDescription: 'Strategic direct tax planning, corporate filing, scrutiny representation, and appellate support.',
    fullDescription: 'Comprehensive direct tax services from routine return preparation to complex dispute resolution before appellate authorities.',
    statutoryFramework: 'Income Tax Act 1961',
    targetClients: 'Corporates and High Net Worth Taxpayers',
    status: 'published'
  }, {
    'Authorization': `Bearer ${token}`
  });
  assert('Authenticated admin updates service content', updateService.status === 200 && updateService.data.service.title === 'Income Tax & Appellate Services');

  // Test 13: Public Content Sync (Public reads the updated service)
  const publicContent = await request('GET', '/api/content');
  const pubMatch = (publicContent.data.services || []).find(s => s.id === 'income-tax');
  assert('Public /api/content immediately reflects the updated service title', publicContent.status === 200 && pubMatch?.title === 'Income Tax & Appellate Services');

  console.log('\n================================================================');
  console.log(allPassed ? 'ALL SHARED PERSISTENCE & SECURITY TESTS PASSED — VERIFIED!' : 'SOME TESTS FAILED');
  console.log('================================================================\n');
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
