import http from 'http';
import assert from 'assert';
import crypto from 'crypto';
import { handleApiRequest } from '../server/apiRouter.cjs';
import { hashPassword, verifyPassword, generateSalt, getAuthorizedUsers, setUserPassword, readDb, writeDb } from '../server/db.cjs';

console.log('================================================================');
console.log('  TEST SUITE: PRODUCTION SECURITY REMEDIATION VERIFICATION      ');
console.log('================================================================\n');

let total = 0;
let passed = 0;

function check(desc, condition) {
  total++;
  if (condition) {
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${total}] ${desc}`);
  } else {
    console.error(`\x1b[31m✖ FAIL\x1b[0m [Assert ${total}] ${desc}`);
    throw new Error(`Failed assertion: ${desc}`);
  }
}

async function runSuite() {
  const server = http.createServer((req, res) => handleApiRequest(req, res));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // Clean initial state
    const initDb = readDb();
    delete initDb.userCredentials;
    initDb.rateLimits = {};
    writeDb(initDb);
    // -------------------------------------------------------------------------
    // 1. Password Hashing Algorithm & Salt Uniqueness (Point 5)
    // -------------------------------------------------------------------------
    console.log('--- 1. PBKDF2-HMAC-SHA512 Hashing & Salt Uniqueness ---');
    const salt1 = generateSalt();
    const salt2 = generateSalt();
    check('Unique salts generated for different invocations', salt1 !== salt2 && salt1.length === 32);

    const hash1 = hashPassword('TestComplexPass#2026', salt1);
    const hash2 = hashPassword('TestComplexPass#2026', salt2);
    check('Identical passwords with different salts yield different hashes (no rainbow table exposure)', hash1 !== hash2);
    check('Hash output length is 128 hex chars (64 bytes SHA-512)', hash1.length === 128);

    check('verifyPassword validates correct password with salt', verifyPassword('TestComplexPass#2026', hash1, salt1) === true);
    check('verifyPassword rejects incorrect password', verifyPassword('WrongPassword123', hash1, salt1) === false);
    check('verifyPassword rejects empty or null password/salt', verifyPassword('', hash1, salt1) === false && verifyPassword('pass', '', '') === false);

    // -------------------------------------------------------------------------
    // 2. Fails-Closed Behavior When Unconfigured (Point 3)
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Fails-Closed Authentication Enforcement ---');
    // Clear in-memory env vars for admin and db userCredentials
    const originalAdminPass = process.env.ADMIN_PASSWORD;
    const originalKavithaPass = process.env.ADMIN_KAVITHA_PASSWORD;
    delete process.env.ADMIN_PASSWORD;

    const dbBackup = readDb();
    const tempDb = JSON.parse(JSON.stringify(dbBackup));
    delete tempDb.userCredentials?.admin;
    writeDb(tempDb);

    const unconfiguredLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'SomeRandomPassword123!' })
    });
    check('Unconfigured account strictly fails closed (HTTP 503)', unconfiguredLogin.status === 503);
    const unconfiguredBody = await unconfiguredLogin.json();
    check('Fails-closed response explains missing server-side configuration', unconfiguredBody.error.includes('failed closed'));

    // Restore db
    writeDb(dbBackup);
    if (originalAdminPass) process.env.ADMIN_PASSWORD = originalAdminPass;

    // -------------------------------------------------------------------------
    // 3. Compromised Passwords Rejection (Point 1)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Compromised Passwords Rejection ---');
    process.env.ADMIN_KAVITHA_PASSWORD = 'LegitimateNewSecurePassword#2026';
    const oldP1 = Buffer.from('VGlydXBhdGlAQ0EyMDI2', 'base64').toString('utf8');
    const oldP2 = Buffer.from('S2F2aXRoYUFzc29jIzIwMjY=', 'base64').toString('utf8');

    const rejectOldKavitha = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'kavitha', password: oldP1 })
    });
    check('Compromised kavitha password strictly rejected (HTTP 401)', rejectOldKavitha.status === 401);

    const rejectOldAdmin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: oldP2 })
    });
    check('Compromised admin password strictly rejected (HTTP 401 or 503)', rejectOldAdmin.status === 401 || rejectOldAdmin.status === 503);

    // -------------------------------------------------------------------------
    // 4. Password-Change & Revoke-All Endpoint Authorization & CSRF (Point 4)
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Password Change & Revoke-All CSRF & Authorization ---');
    // Clear test IP rate-limit lockout before valid login step
    const rateDb = readDb();
    delete rateDb.rateLimits?.['127.0.0.1_kavitha'];
    delete rateDb.rateLimits?.['127.0.0.1_admin'];
    writeDb(rateDb);

    // Log in with legitimate password to get token
    const validLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'https://kavithaassociates.com'
      },
      body: JSON.stringify({ username: 'kavitha', password: 'LegitimateNewSecurePassword#2026' })
    });
    check('Login with legitimate password succeeds (HTTP 200)', validLogin.status === 200);
    const validData = await validLogin.json();
    const token = validData.session.token;

    // Unauthenticated password change attempt
    const unauthChange = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: 'foo', newPassword: 'bar' })
    });
    check('Unauthenticated change-password request rejected (HTTP 401)', unauthChange.status === 401);

    // Cross-origin CSRF password change attempt (evil origin)
    const csrfChange = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://evil-attacker-site.com'
      },
      body: JSON.stringify({ 
        currentPassword: 'LegitimateNewSecurePassword#2026', 
        newPassword: 'BrandNewPassword#999' 
      })
    });
    check('Cross-origin CSRF password change attempt rejected (HTTP 403 Forbidden)', csrfChange.status === 403);

    // Malformed/untrusted referer CSRF attempt
    const csrfRefererChange = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': 'https://evil-attacker-site.com/phishing'
      },
      body: JSON.stringify({ 
        currentPassword: 'LegitimateNewSecurePassword#2026', 
        newPassword: 'BrandNewPassword#999' 
      })
    });
    check('Cross-origin referer CSRF password change attempt rejected (HTTP 403 Forbidden)', csrfRefererChange.status === 403);

    // Weak password rejection (< 12 chars)
    const weakPassChange = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://kavithaassociates.com'
      },
      body: JSON.stringify({ 
        currentPassword: 'LegitimateNewSecurePassword#2026', 
        newPassword: 'Short1!' 
      })
    });
    check('Password change rejects passwords under 12 characters (HTTP 400)', weakPassChange.status === 400);

    // Incorrect current password
    const wrongCurrentChange = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://kavithaassociates.com'
      },
      body: JSON.stringify({ 
        currentPassword: 'WrongCurrentPassword123!', 
        newPassword: 'BrandNewStrongPassword#2026' 
      })
    });
    check('Password change rejects incorrect current password (HTTP 401)', wrongCurrentChange.status === 401);

    // Legitimate password change
    const successfulChange = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://kavithaassociates.com'
      },
      body: JSON.stringify({ 
        currentPassword: 'LegitimateNewSecurePassword#2026', 
        newPassword: 'BrandNewStrongPassword#2026' 
      })
    });
    check('Legitimate password change succeeds (HTTP 200)', successfulChange.status === 200);

    // Old token should now be invalidated because userRevocationEpochs was bumped!
    const oldTokenReq = await fetch(`${baseUrl}/api/admin/enquiries`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    check('Previous token invalidated after password change (HTTP 401)', oldTokenReq.status === 401);

    // Login with new password succeeds
    const newPassLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'https://kavithaassociates.com'
      },
      body: JSON.stringify({ username: 'kavitha', password: 'BrandNewStrongPassword#2026' })
    });
    check('Login with newly updated password succeeds (HTTP 200)', newPassLogin.status === 200);
    const newSession = await newPassLogin.json();
    const newToken = newSession.session.token;

    // CSRF on revoke-all endpoint
    const csrfRevoke = await fetch(`${baseUrl}/api/admin/auth/revoke-all`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${newToken}`,
        'Origin': 'https://evil-attacker.com'
      }
    });
    check('Cross-origin CSRF revoke-all request rejected (HTTP 403 Forbidden)', csrfRevoke.status === 403);

    // Legitimate revoke-all
    const legitimateRevoke = await fetch(`${baseUrl}/api/admin/auth/revoke-all`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${newToken}`,
        'Origin': 'https://kavithaassociates.com'
      }
    });
    check('Legitimate revoke-all succeeds (HTTP 200)', legitimateRevoke.status === 200);

    // Token is now invalidated
    const postRevokeReq = await fetch(`${baseUrl}/api/admin/enquiries`, {
      headers: { 'Authorization': `Bearer ${newToken}` }
    });
    check('Token immediately rejected after revoke-all (HTTP 401)', postRevokeReq.status === 401);

    // Cleanup test credentials in temp db
    const finalDb = readDb();
    delete finalDb.userCredentials?.kavitha;
    delete finalDb.userCredentials?.admin;
    writeDb(finalDb);

    console.log('\n================================================================');
    console.log(`TOTAL REMEDIATION ASSERTIONS: ${total}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${total - passed}`);
    console.log('================================================================');

  } finally {
    server.close();
  }
}

runSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
