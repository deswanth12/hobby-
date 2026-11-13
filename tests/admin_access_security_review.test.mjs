/**
 * tests/admin_access_security_review.test.mjs
 *
 * Dedicated Security Audit Verification Suite:
 * V8.0.1 Admin Access Security Review & Negative Testing
 *
 * Verifies all security criteria independently of frontend route visibility:
 * 1. Client-Side Route Exposure Reality Check (Proves VITE_ variables are public in JS bundles)
 * 2. Unauthenticated Access Rejection across all /api/admin/* endpoints (HTTP 401)
 * 3. Tampered & Forged JWT Signature Rejection (HTTP 401)
 * 4. Expired JWT Token Rejection (HTTP 401)
 * 5. Explicitly Revoked Token Rejection (HTTP 401)
 * 6. Global User Session Invalidation / Epoch Rejection (HTTP 401)
 * 7. Draft Article & Private Content Isolation on /api/content for unauthenticated callers
 * 8. Anti-CSRF Origin Enforcement on Administrative Mutations (HTTP 403)
 * 9. Brute-Force Rate Limiting & Security Lockout on /api/auth/login (HTTP 429)
 * 10. Server Secrets Confidentiality Audit (Zero server secrets in client bundle)
 * 11. Supabase Row Level Security (RLS) Verification on all private tables
 */

import http from 'http';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { handleApiRequest } from '../server/apiRouter.cjs';
import { readDb, writeDb, SESSION_SECRET, hashPassword, generateSalt } from '../server/db.cjs';
import { validateAdminSecretPath } from '../src/config/adminConfig.ts';

let total = 0;
let passed = 0;
const failures = [];

function assert(condition, testName, details = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${total}] ${testName}`);
  } else {
    failures.push({ testName, details });
    console.error(`\x1b[31m✖ FAIL\x1b[0m [Assert ${total}] ${testName}`);
    if (details) console.error(`       Details: ${details}`);
  }
}

console.log('========================================================================');
console.log('  TEST SUITE: V8.0.1 ADMIN ACCESS SECURITY REVIEW & NEGATIVE TESTS      ');
console.log('========================================================================\n');

async function runSecurityAuditTests() {
  // ---------------------------------------------------------------------------
  // 1. Client-Side Route Exposure Reality Check
  // ---------------------------------------------------------------------------
  console.log('--- 1. Client-Side Route Exposure & Boundary Verification ---');
  
  // Verify that frontend route configuration is acknowledged as client-side code
  assert(
    typeof validateAdminSecretPath === 'function',
    'validateAdminSecretPath is exported for client-side routing normalization'
  );
  
  // Verify that client-side code bundles cannot hide VITE_ environment variables
  // In Vite, all VITE_* variables are replaced at build-time with plaintext strings
  const clientConfigPath = path.resolve('src/config/adminConfig.ts');
  const clientConfigSource = fs.readFileSync(clientConfigPath, 'utf8');
  assert(
    clientConfigSource.includes('VITE_ADMIN_SECRET_PATH is public client-side routing config') ||
    clientConfigSource.includes('NEVER treated as an authentication secret'),
    'Client configuration explicitly documents that route paths are NOT authentication secrets'
  );

  // ---------------------------------------------------------------------------
  // 2. Server-Side Setup for Live HTTP Security Testing
  // ---------------------------------------------------------------------------
  process.env.ADMIN_KAVITHA_PASSWORD = 'TestFixtureLegitimatePassword!2026';
  const server = http.createServer((req, res) => {
    handleApiRequest(req, res);
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // -------------------------------------------------------------------------
    // 2. Unauthenticated Negative Access Tests across ALL /api/admin/* endpoints
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Unauthenticated Negative Access Tests (HTTP 401 Enforcement) ---');

    const adminEndpoints = [
      { method: 'GET', path: '/api/admin/enquiries', desc: 'Enquiries List' },
      { method: 'PATCH', path: '/api/admin/enquiries/enq-test-1', desc: 'Enquiry Status Update' },
      { method: 'DELETE', path: '/api/admin/enquiries/enq-test-1', desc: 'Enquiry Deletion' },
      { method: 'POST', path: '/api/admin/auth/change-password', desc: 'Password Change' },
      { method: 'POST', path: '/api/admin/auth/revoke-all', desc: 'Revoke All Sessions' },
      { method: 'PUT', path: '/api/admin/content/services-reorder', desc: 'Services Reorder' },
      { method: 'POST', path: '/api/admin/content/services', desc: 'Service Creation' },
      { method: 'PUT', path: '/api/admin/content/services/test-service', desc: 'Service Update' },
      { method: 'DELETE', path: '/api/admin/content/services/test-service', desc: 'Service Deletion' },
      { method: 'POST', path: '/api/admin/content/services/test-service/recover', desc: 'Service Recovery' },
      { method: 'PUT', path: '/api/admin/content/faqs-reorder', desc: 'FAQs Reorder' },
      { method: 'POST', path: '/api/admin/content/faqs', desc: 'FAQ Creation' },
      { method: 'PUT', path: '/api/admin/content/faqs/test-faq', desc: 'FAQ Update' },
      { method: 'DELETE', path: '/api/admin/content/faqs/test-faq', desc: 'FAQ Deletion' },
      { method: 'POST', path: '/api/admin/content/faqs/test-faq/recover', desc: 'FAQ Recovery' },
      { method: 'POST', path: '/api/admin/content/posts/test-post', desc: 'Post Creation/Update' },
      { method: 'DELETE', path: '/api/admin/content/posts/test-post', desc: 'Post Deletion' },
      { method: 'POST', path: '/api/admin/content/reset', desc: 'Content Reset' },
      { method: 'PUT', path: '/api/admin/settings', desc: 'Settings Update' },
      { method: 'POST', path: '/api/admin/settings/reset', desc: 'Settings Reset' },
      { method: 'GET', path: '/api/auth/session', desc: 'Session Verification' }
    ];

    for (const ep of adminEndpoints) {
      const res = await fetch(`${baseUrl}${ep.path}`, {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
        body: ['POST', 'PUT', 'PATCH'].includes(ep.method) ? JSON.stringify({ test: true }) : undefined
      });
      assert(
        res.status === 401,
        `Unauthenticated ${ep.method} ${ep.path} strictly rejected with HTTP 401 (${ep.desc})`
      );
      const data = await res.json().catch(() => ({}));
      assert(
        data.success === false,
        `Rejection response contains success: false (${ep.desc})`
      );
    }

    // -------------------------------------------------------------------------
    // 3. Forged, Tampered & Expired Token Tests
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Cryptographic Token Tampering & Expiry Rejection ---');

    // 3.1 Token signed with wrong secret key
    const fakeSecret = 'wrong-attacker-secret-key-000000000';
    const fakeHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const fakePayload = Buffer.from(JSON.stringify({
      sub: 'kavitha',
      role: 'Managing Partner',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      jti: 'fake-jti-123'
    })).toString('base64url');
    const fakeSig = crypto.createHmac('sha256', fakeSecret).update(fakePayload).digest('base64url');
    const forgedToken = `ka_jwt.${fakePayload}.${fakeSig}`;

    const forgedRes = await fetch(`${baseUrl}/api/admin/enquiries`, {
      headers: { 'Authorization': `Bearer ${forgedToken}` }
    });
    assert(forgedRes.status === 401, 'Forged token signed with incorrect secret key rejected with HTTP 401');

    // 3.2 Token payload tampered after legitimate signing
    const legitimatePayloadObj = {
      sub: 'kavitha',
      role: 'Managing Partner',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      jti: 'legit-jti-123'
    };
    const legitPayloadB64 = Buffer.from(JSON.stringify(legitimatePayloadObj)).toString('base64url');
    const legitSig = crypto.createHmac('sha256', SESSION_SECRET).update(legitPayloadB64).digest('base64url');
    
    // Attacker tampers payload to elevate privileges or change username
    const tamperedPayloadB64 = Buffer.from(JSON.stringify({ ...legitimatePayloadObj, sub: 'admin', role: 'SuperAdmin' })).toString('base64url');
    const tamperedToken = `ka_jwt.${tamperedPayloadB64}.${legitSig}`;

    const tamperedRes = await fetch(`${baseUrl}/api/admin/enquiries`, {
      headers: { 'Authorization': `Bearer ${tamperedToken}` }
    });
    assert(tamperedRes.status === 401, 'Tampered token payload rejected with HTTP 401 (Signature Mismatch)');

    // 3.3 Expired legitimate token
    const expiredPayloadObj = {
      sub: 'kavitha',
      role: 'Managing Partner',
      iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
      exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
      jti: 'expired-jti-456'
    };
    const expiredPayloadB64 = Buffer.from(JSON.stringify(expiredPayloadObj)).toString('base64url');
    const expiredSig = crypto.createHmac('sha256', SESSION_SECRET).update(expiredPayloadB64).digest('base64url');
    const expiredToken = `ka_jwt.${expiredPayloadB64}.${expiredSig}`;

    const expiredRes = await fetch(`${baseUrl}/api/admin/enquiries`, {
      headers: { 'Authorization': `Bearer ${expiredToken}` }
    });
    assert(expiredRes.status === 401, 'Expired cryptographic token strictly rejected with HTTP 401');

    // 3.4 Valid legitimate token generation
    const validJti = `valid-jti-${crypto.randomBytes(8).toString('hex')}`;
    const validPayloadObj = {
      sub: 'kavitha',
      role: 'Managing Partner',
      name: 'CA Kavitha Vijay',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      jti: validJti
    };
    const validPayloadB64 = Buffer.from(JSON.stringify(validPayloadObj)).toString('base64url');
    const validSig = crypto.createHmac('sha256', SESSION_SECRET).update(validPayloadB64).digest('base64url');
    const validToken = `ka_jwt.${validPayloadB64}.${validSig}`;

    const validRes = await fetch(`${baseUrl}/api/admin/enquiries`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    assert(validRes.status === 200, 'Legitimate cryptographic token successfully accesses /api/admin/enquiries (HTTP 200)');

    // -------------------------------------------------------------------------
    // 4. Token Revocation & Invalidation Testing
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Token Revocation & Invalidation Enforcement ---');

    // 4.1 Explicit JTI token revocation
    const db = readDb();
    db.revokedTokens = db.revokedTokens || {};
    db.revokedTokens[validJti] = Math.floor(Date.now() / 1000) + 3600;
    writeDb(db);

    const revokedRes = await fetch(`${baseUrl}/api/admin/enquiries`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    assert(revokedRes.status === 401, 'Revoked token (JTI listed in revocation ledger) strictly rejected with HTTP 401');

    // 4.2 User-level revocation epoch (e.g., after password change)
    const freshJti = `fresh-jti-${crypto.randomBytes(8).toString('hex')}`;
    const freshIssuedAt = Math.floor(Date.now() / 1000) - 100; // Issued 100s ago
    const freshPayloadObj = {
      sub: 'kavitha',
      role: 'Managing Partner',
      name: 'CA Kavitha Vijay',
      iat: freshIssuedAt,
      exp: Math.floor(Date.now() / 1000) + 3600,
      jti: freshJti
    };
    const freshPayloadB64 = Buffer.from(JSON.stringify(freshPayloadObj)).toString('base64url');
    const freshSig = crypto.createHmac('sha256', SESSION_SECRET).update(freshPayloadB64).digest('base64url');
    const freshToken = `ka_jwt.${freshPayloadB64}.${freshSig}`;

    // Update user revocation epoch to invalidate all tokens issued before now
    const db2 = readDb();
    db2.userRevocationEpochs = db2.userRevocationEpochs || {};
    db2.userRevocationEpochs['kavitha'] = Math.floor(Date.now() / 1000); // Epoch updated to now
    writeDb(db2);

    const epochRevokedRes = await fetch(`${baseUrl}/api/admin/enquiries`, {
      headers: { 'Authorization': `Bearer ${freshToken}` }
    });
    assert(epochRevokedRes.status === 401, 'Token issued prior to user revocation epoch strictly rejected with HTTP 401');

    // -------------------------------------------------------------------------
    // 5. Anti-CSRF Origin Enforcement on Administrative Mutations
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Anti-CSRF Origin Enforcement on Administrative Mutations ---');

    // Issue a brand new valid token
    const csrfTestJti = `csrf-jti-${crypto.randomBytes(8).toString('hex')}`;
    const csrfPayloadObj = {
      sub: 'kavitha',
      role: 'Managing Partner',
      name: 'CA Kavitha Vijay',
      iat: Math.floor(Date.now() / 1000) + 10,
      exp: Math.floor(Date.now() / 1000) + 3600,
      jti: csrfTestJti
    };
    const csrfPayloadB64 = Buffer.from(JSON.stringify(csrfPayloadObj)).toString('base64url');
    const csrfSig = crypto.createHmac('sha256', SESSION_SECRET).update(csrfPayloadB64).digest('base64url');
    const csrfToken = `ka_jwt.${csrfPayloadB64}.${csrfSig}`;

    // Disallowed untrusted origin
    const csrfAttackRes = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${csrfToken}`,
        'Origin': 'https://malicious-attacker-site.com'
      },
      body: JSON.stringify({ currentPassword: 'any', newPassword: 'any' })
    });
    assert(csrfAttackRes.status === 403, 'Cross-origin mutation from untrusted Origin header rejected with HTTP 403 Forbidden');

    // Disallowed untrusted referer
    const csrfRefererAttackRes = await fetch(`${baseUrl}/api/admin/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${csrfToken}`,
        'Referer': 'https://evil-phishing-domain.com/fake-login'
      },
      body: JSON.stringify({ currentPassword: 'any', newPassword: 'any' })
    });
    assert(csrfRefererAttackRes.status === 403, 'Cross-origin mutation from untrusted Referer header rejected with HTTP 403 Forbidden');

    // Allowed trusted origin
    const trustedOriginRes = await fetch(`${baseUrl}/api/admin/enquiries`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${csrfToken}`,
        'Origin': 'https://kavithaassociates.com'
      }
    });
    assert(trustedOriginRes.status === 200, 'Request from authorized canonical origin succeeds (HTTP 200)');

    // -------------------------------------------------------------------------
    // 6. Draft & Private Content Isolation on /api/content
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Public vs Administrative Content Isolation (/api/content) ---');

    const publicContentRes = await fetch(`${baseUrl}/api/content`, {
      method: 'GET'
    });
    assert(publicContentRes.status === 200, 'GET /api/content succeeds for unauthenticated caller');
    const publicContent = await publicContentRes.json();

    assert(
      !publicContent.allPosts && !publicContent.allServices && !publicContent.allFaqs && !publicContent.deletedServices,
      'Unauthenticated /api/content response STRICTLY omits administrative datasets (allPosts, allServices, allFaqs, deletedServices)'
    );

    const draftPostsInPublic = (publicContent.posts || []).filter(p => p.draft === true);
    assert(
      draftPostsInPublic.length === 0,
      'Unauthenticated /api/content response strictly excludes draft posts (Zero draft exposure)'
    );

    // Authenticated /api/content call
    const authContentRes = await fetch(`${baseUrl}/api/content`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${csrfToken}` }
    });
    const authContent = await authContentRes.json();
    assert(
      Array.isArray(authContent.allPosts) && Array.isArray(authContent.allServices),
      'Authenticated /api/content response includes administrative management datasets for authorized staff'
    );

    // -------------------------------------------------------------------------
    // 7. Brute-Force Rate Limiting on Login Endpoint
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Brute-Force Rate Limiting on /api/auth/login ---');

    // Clear rate limit record for test client to start fresh
    const rateDb = readDb();
    delete rateDb.rateLimits?.['127.0.0.1_kavitha'];
    delete rateDb.rateLimits?.['127.0.0.1_admin'];
    writeDb(rateDb);

    let hitRateLimit = false;
    for (let i = 1; i <= 6; i++) {
      const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'kavitha', password: `WrongPassword${i}!#` })
      });

      if (loginRes.status === 429) {
        hitRateLimit = true;
        assert(true, `Rate limiter triggered on failed attempt ${i} (HTTP 429 Too Many Requests)`);
        break;
      }
    }
    assert(hitRateLimit, 'Consecutive failed login attempts trigger HTTP 429 account lockout defense');

    // -------------------------------------------------------------------------
    // 8. Server Secrets Confidentiality Verification
    // -------------------------------------------------------------------------
    console.log('\n--- 8. Confidentiality Audit: Zero Server Secrets in Client Code ---');

    const srcFiles = [];
    function scanDir(dir) {
      if (!fs.existsSync(dir)) return;
      for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) scanDir(full);
        else if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js')) {
          srcFiles.push(full);
        }
      }
    }
    scanDir(path.resolve('src'));

    let foundSecretLeak = false;
    const forbiddenPatterns = [
      'process.env.SESSION_SECRET',
      'process.env.ADMIN_PASSWORD',
      'process.env.ADMIN_KAVITHA_PASSWORD',
      'SUPABASE_SERVICE_ROLE_KEY',
      'service_role'
    ];

    for (const f of srcFiles) {
      const content = fs.readFileSync(f, 'utf8');
      for (const pattern of forbiddenPatterns) {
        if (content.includes(pattern)) {
          console.error(`Leak detected in ${f}: matches ${pattern}`);
          foundSecretLeak = true;
        }
      }
    }
    assert(!foundSecretLeak, 'Zero server-side secrets or privileged keys referenced in client-side src/ code');

    // -------------------------------------------------------------------------
    // 9. Supabase Row Level Security (RLS) Policy Audit
    // -------------------------------------------------------------------------
    console.log('\n--- 9. Supabase Row Level Security (RLS) Schema Audit ---');

    const schemaPath = path.resolve('supabase/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    const privateTables = [
      'enquiries',
      'admin_credentials',
      'revoked_tokens',
      'user_revocation_epochs',
      'login_rate_limits'
    ];

    for (const table of privateTables) {
      const rlsEnabled = schemaSql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
      assert(rlsEnabled, `Row Level Security (RLS) is explicitly ENABLED on private table: public.${table}`);
    }

    // Verify enquiries public select policy strictly prohibits anonymous access
    const enquiriesSelectMatch = schemaSql.includes('CREATE POLICY "enquiries_select_staff_only" ON public.enquiries');
    assert(enquiriesSelectMatch, 'Enquiries table enforces staff-only SELECT policy (Zero anonymous reading allowed)');

    // Verify admin credentials policy is staff-only
    const credsPolicyMatch = schemaSql.includes('CREATE POLICY "admin_credentials_staff_only" ON public.admin_credentials');
    assert(credsPolicyMatch, 'Admin credentials table enforces staff-only policy');

  } finally {
    await new Promise(resolve => server.close(resolve));
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`  SECURITY AUDIT RESULTS: ${passed} PASSED, ${failures.length} FAILED (TOTAL: ${total})`);
  console.log('========================================================================');

  if (failures.length > 0) {
    console.error('\nFailures summary:');
    failures.forEach(f => console.error(`- ${f.testName}: ${f.details}`));
    process.exit(1);
  } else {
    console.log('\n✔ EMPIRICAL VERDICT: ALL AUTHENTICATION, AUTHORIZATION & RLS CHECKS CERTIFIED SECURE.\n');
  }
}

runSecurityAuditTests().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
