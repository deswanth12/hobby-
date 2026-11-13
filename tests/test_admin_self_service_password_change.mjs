import http from 'http';
import fs from 'fs';
import path from 'path';
import { handleApiRequest } from '../server/apiRouter.cjs';
import { readDb, writeDb } from '../server/db.cjs';

console.log('================================================================');
console.log('  TEST SUITE: ADMIN SELF-SERVICE PASSWORD CHANGE VERIFICATION   ');
console.log('================================================================\n');

const DB_PATH = path.resolve('data/practice_db.json');
const originalDbRaw = fs.readFileSync(DB_PATH, 'utf8');

const originalEnvAdmin = process.env.ADMIN_PASSWORD;
const originalEnvKavitha = process.env.ADMIN_KAVITHA_PASSWORD;
const originalSessionSecret = process.env.SESSION_SECRET;

let total = 0;
let passed = 0;

function check(desc, condition, detail = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${total}] ${desc} ${detail ? `(${detail})` : ''}`);
  } else {
    console.error(`\x1b[31m✖ FAIL\x1b[0m [Assert ${total}] ${desc} ${detail ? `(${detail})` : ''}`);
    throw new Error(`Assertion failed: ${desc}`);
  }
}

async function runTestSuite() {
  const server = http.createServer((req, res) => handleApiRequest(req, res));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // Isolated test environment credentials
    process.env.SESSION_SECRET = 'audit_session_secret_12345678901234567890123456789012';
    process.env.ADMIN_PASSWORD = 'TestAdminPass#2026!';
    process.env.ADMIN_KAVITHA_PASSWORD = 'OriginalKavithaSecret#999!';

    // Clean baseline test DB
    const db = readDb();
    delete db.userCredentials;
    delete db.userRevocationEpochs;
    db.rateLimits = {};
    writeDb(db);

    console.log('--- 1. Authenticate Dedicated Test Account (`admin`) ---');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'https://kavithaassociates.com' },
      body: JSON.stringify({ username: 'admin', password: 'TestAdminPass#2026!' })
    });
    check('Initial login with test admin password succeeds (HTTP 200)', loginRes.status === 200);
    const loginData = await loginRes.json();
    const adminToken = loginData?.session?.token;
    check('Valid session token received for admin', Boolean(adminToken));

    console.log('\n--- 2. Incorrect Current Password Rejection ---');
    const wrongCurrentRes = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'Origin': 'https://kavithaassociates.com'
      },
      body: JSON.stringify({
        currentPassword: 'IncorrectOldPassword123!',
        newPassword: 'UpdatedAdminSecret#2027!'
      })
    });
    check('Incorrect current password rejected (HTTP 401)', wrongCurrentRes.status === 401);
    const wrongData = await wrongCurrentRes.json();
    check('Error message identifies incorrect current password', wrongData.error === 'Incorrect current password.');

    console.log('\n--- 3. Weak Password Rejection (Server-side Enforced) ---');
    // 3a. Under 12 characters
    const shortRes = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'Origin': 'https://kavithaassociates.com'
      },
      body: JSON.stringify({
        currentPassword: 'TestAdminPass#2026!',
        newPassword: 'Short#1'
      })
    });
    check('Password under 12 characters rejected (HTTP 400)', shortRes.status === 400);

    // 3b. Missing uppercase
    const noUpperRes = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'Origin': 'https://kavithaassociates.com'
      },
      body: JSON.stringify({
        currentPassword: 'TestAdminPass#2026!',
        newPassword: 'lowercase_only_password_123!'
      })
    });
    check('Password missing uppercase rejected (HTTP 400)', noUpperRes.status === 400);

    // 3c. Missing number
    const noNumberRes = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'Origin': 'https://kavithaassociates.com'
      },
      body: JSON.stringify({
        currentPassword: 'TestAdminPass#2026!',
        newPassword: 'NoNumbersInThisPassword!'
      })
    });
    check('Password missing digits rejected (HTTP 400)', noNumberRes.status === 400);

    // 3d. Missing special character
    const noSpecialRes = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'Origin': 'https://kavithaassociates.com'
      },
      body: JSON.stringify({
        currentPassword: 'TestAdminPass#2026!',
        newPassword: 'AlphanumericOnly123456'
      })
    });
    check('Password missing special characters rejected (HTTP 400)', noSpecialRes.status === 400);

    console.log('\n--- 4. Valid Password Update With Durable Credential Lookup ---');
    const validChangeRes = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'Origin': 'https://kavithaassociates.com'
      },
      body: JSON.stringify({
        currentPassword: 'TestAdminPass#2026!',
        newPassword: 'UpdatedAdminSecret#2027!'
      })
    });
    check('Valid password update succeeds (HTTP 200)', validChangeRes.status === 200);
    const validChangeData = await validChangeRes.json();
    check('Success message returned with confirmation of PBKDF2-SHA512', 
      validChangeData.success && validChangeData.message.includes('PBKDF2-SHA512')
    );
    const setCookie = validChangeRes.headers.get('set-cookie');
    check('Set-Cookie header clears ka_admin_session cookie on client', 
      Boolean(setCookie && setCookie.includes('ka_admin_session=') && setCookie.includes('Max-Age=0'))
    );

    console.log('\n--- 5. Session Revocation (Immediate Invalidation of Old Token) ---');
    const oldSessionAttempt = await fetch(`${baseUrl}/api/admin/enquiries`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    check('Previous session token is immediately invalidated (HTTP 401)', oldSessionAttempt.status === 401);

    console.log('\n--- 6. Rejection of Old Password ---');
    const oldPassLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'https://kavithaassociates.com' },
      body: JSON.stringify({ username: 'admin', password: 'TestAdminPass#2026!' })
    });
    check('Login with former password rejected (HTTP 401)', oldPassLogin.status === 401);

    console.log('\n--- 7. Successful Authentication with New Password ---');
    const newPassLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'https://kavithaassociates.com' },
      body: JSON.stringify({ username: 'admin', password: 'UpdatedAdminSecret#2027!' })
    });
    check('Login with newly updated password succeeds (HTTP 200)', newPassLogin.status === 200);
    const newLoginData = await newPassLogin.json();
    const newAdminToken = newLoginData?.session?.token;
    check('New valid session token issued', Boolean(newAdminToken));

    console.log('\n--- 8. Durability Across Simulated Cold Start / Process Restart ---');
    await new Promise(resolve => server.close(resolve));
    const server2 = http.createServer((req, res) => handleApiRequest(req, res));
    await new Promise(resolve => server2.listen(0, '127.0.0.1', resolve));
    const port2 = server2.address().port;
    const baseUrl2 = `http://127.0.0.1:${port2}`;

    const restartLogin = await fetch(`${baseUrl2}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'https://kavithaassociates.com' },
      body: JSON.stringify({ username: 'admin', password: 'UpdatedAdminSecret#2027!' })
    });
    check('New password survives restart and authenticates successfully (HTTP 200)', restartLogin.status === 200);
    await new Promise(resolve => server2.close(resolve));

    console.log('\n--- 9. Account Isolation: Kavitha Account Remains Untouched ---');
    const server3 = http.createServer((req, res) => handleApiRequest(req, res));
    await new Promise(resolve => server3.listen(0, '127.0.0.1', resolve));
    const port3 = server3.address().port;
    const baseUrl3 = `http://127.0.0.1:${port3}`;

    const kavithaLogin = await fetch(`${baseUrl3}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'https://kavithaassociates.com' },
      body: JSON.stringify({ username: 'kavitha', password: 'OriginalKavithaSecret#999!' })
    });
    check('Kavitha credentials unaffected by admin password change (HTTP 200)', kavithaLogin.status === 200);
    await new Promise(resolve => server3.close(resolve));

    console.log('\n================================================================');
    console.log(`  SELF-SERVICE PASSWORD CHANGE AUDIT: ${passed} / ${total} TESTS PASSED (100%)`);
    console.log('================================================================');

  } finally {
    server.close();
    fs.writeFileSync(DB_PATH, originalDbRaw);
    if (originalEnvAdmin !== undefined) process.env.ADMIN_PASSWORD = originalEnvAdmin;
    else delete process.env.ADMIN_PASSWORD;
    if (originalEnvKavitha !== undefined) process.env.ADMIN_KAVITHA_PASSWORD = originalEnvKavitha;
    else delete process.env.ADMIN_KAVITHA_PASSWORD;
    if (originalSessionSecret !== undefined) process.env.SESSION_SECRET = originalSessionSecret;
    else delete process.env.SESSION_SECRET;
    console.log('\n[Cleanup] Test sandbox environment and baseline database restored cleanly.');
  }
}

runTestSuite().catch(err => {
  console.error('Test Suite Failed:', err);
  fs.writeFileSync(DB_PATH, originalDbRaw);
  process.exit(1);
});
