import assert from 'node:assert';
import http from 'node:http';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { handleApiRequest } = require('../server/apiRouter.cjs');
const { readDb, writeDb, SESSION_SECRET } = require('../server/db.cjs');
const durable = require('../server/durableStorage.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('================================================================================');
console.log('       CHALLENGER EMPIRICAL ADVERSARIAL STRESS-TEST HARNESS                     ');
console.log('       Milestone: Empirical Security Challenge Gate (challenger_gate_adv_1)     ');
console.log('================================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testLogs = [];

async function runTest(category, name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    const msg = `[PASS] [${category}] ${name}`;
    console.log(`  \x1b[32m✔\x1b[0m ${msg}`);
    testLogs.push({ status: 'PASS', category, name });
  } catch (err) {
    failedTests++;
    const msg = `[FAIL] [${category}] ${name} -> ${err.message}`;
    console.log(`  \x1b[31m✖\x1b[0m ${msg}`);
    testLogs.push({ status: 'FAIL', category, name, error: err.message, stack: err.stack });
  }
}

// Helper to issue valid cryptographic admin token for testing
function issueValidAdminToken(username = 'admin', customClaims = {}) {
  const payload = {
    sub: username,
    name: 'Administrator',
    role: 'admin',
    jti: 'challenger-jti-' + crypto.randomBytes(12).toString('hex'),
    iat: Math.floor(Date.now() / 1000) + 10,
    exp: Math.floor(Date.now() / 1000) + 3600,
    ...customClaims
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url');
  return `ka_jwt.${payloadB64}.${sig}`;
}

async function startEphemeralServer() {
  const server = http.createServer((req, res) => {
    handleApiRequest(req, res).catch(err => {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message }));
    });
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  return { server, baseUrl };
}

async function main() {
  const originalDb = JSON.parse(JSON.stringify(readDb()));
  const { server, baseUrl } = await startEphemeralServer();

  try {
    console.log(`Ephemeral Test Server listening at: ${baseUrl}\n`);

    // =========================================================================
    // SECTION 1: AUTHENTICATION BYPASS & PROTOTYPE POLLUTION PROBES
    // =========================================================================
    console.log('--- 1. Auth Bypass & Prototype Pollution Probes ---');

    const adminEndpoints = [
      { method: 'GET', path: '/api/admin/enquiries' },
      { method: 'PATCH', path: '/api/admin/enquiries/ENQ-PROBE-1', body: { status: 'contacted' } },
      { method: 'DELETE', path: '/api/admin/enquiries/ENQ-PROBE-1' },
      { method: 'POST', path: '/api/admin/services', body: { id: 'probe-srv', title: 'Probe Srv' } },
      { method: 'PUT', path: '/api/admin/services/probe-srv', body: { title: 'Probe Updated' } },
      { method: 'DELETE', path: '/api/admin/services/probe-srv' },
      { method: 'PUT', path: '/api/admin/services/reorder', body: { orderedIds: ['probe-srv'] } },
      { method: 'POST', path: '/api/admin/faqs', body: { id: 'probe-faq', question: 'Q', answer: 'A' } },
      { method: 'PUT', path: '/api/admin/faqs/probe-faq', body: { question: 'Q2' } },
      { method: 'DELETE', path: '/api/admin/faqs/probe-faq' },
      { method: 'PUT', path: '/api/admin/faqs/reorder', body: { orderedIds: ['probe-faq'] } },
      { method: 'PUT', path: '/api/admin/settings', body: { practiceName: 'Hacked Practice' } },
      { method: 'PUT', path: '/api/admin/content/posts/probe-post', body: { title: 'Hacked Post' } },
      { method: 'DELETE', path: '/api/admin/content/posts/probe-post' },
      { method: 'POST', path: '/api/admin/auth/change-password', body: { currentPassword: 'a', newPassword: 'b' } },
      { method: 'GET', path: '/api/admin/export' }
    ];

    const prototypePollutionTokens = [
      'constructor',
      '__proto__',
      'prototype',
      'toString',
      'valueOf',
      'toLocaleString',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'hasOwnProperty'
    ];

    for (const token of prototypePollutionTokens) {
      await runTest('AUTH-PROTOTYPE', `Authorization: Bearer ${token} against GET /api/admin/enquiries`, async () => {
        const res = await fetch(`${baseUrl}/api/admin/enquiries`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const body = await res.json();
        assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
        assert.strictEqual(body.success, false);
      });
    }

    const typeConfusionTokens = [
      'null',
      'undefined',
      '',
      'true',
      'false',
      '[object Object]',
      'NaN'
    ];

    for (const token of typeConfusionTokens) {
      await runTest('AUTH-TYPE-CONFUSION', `Authorization: Bearer ${token} returns HTTP 401`, async () => {
        const res = await fetch(`${baseUrl}/api/admin/enquiries`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const body = await res.json();
        assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
        assert.strictEqual(body.success, false);
      });
    }

    // Cookie-based prototype pollution probes
    for (const prop of ['constructor', '__proto__', 'toString', 'valueOf']) {
      await runTest('AUTH-COOKIE-POLLUTION', `Cookie ka_admin_session=${prop} returns HTTP 401`, async () => {
        const res = await fetch(`${baseUrl}/api/admin/enquiries`, {
          headers: { 'Cookie': `ka_admin_session=${prop}` }
        });
        const body = await res.json();
        assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
        assert.strictEqual(body.success, false);
      });
    }

    // Comprehensive probe across ALL 16 admin endpoints with Bearer constructor
    for (const ep of adminEndpoints) {
      await runTest('AUTH-MATRIX', `Bearer constructor rejected across ${ep.method} ${ep.path}`, async () => {
        const res = await fetch(`${baseUrl}${ep.path}`, {
          method: ep.method,
          headers: {
            'Authorization': 'Bearer constructor',
            'Content-Type': 'application/json'
          },
          body: ep.body ? JSON.stringify(ep.body) : undefined
        });
        const body = await res.json();
        assert.strictEqual(res.status, 401, `Expected 401 on ${ep.method} ${ep.path}, got ${res.status}`);
        assert.strictEqual(body.success, false);
      });
    }

    // Malformed JWT Probes
    const malformedJwtVectors = [
      { name: '1-part token', token: 'ka_jwt.onlyheader' },
      { name: '2-part token', token: 'ka_jwt.eyJzdWIiOiJhZG1pbiJ9' },
      { name: '4-part token', token: 'ka_jwt.part1.part2.part3' },
      { name: 'Invalid base64url payload', token: 'ka_jwt.!!!notbase64!!!.invalidsig' },
      { name: 'Non-JSON base64url payload', token: `ka_jwt.${Buffer.from('not json text').toString('base64url')}.sig` },
      { name: 'Forged signature', token: `ka_jwt.${Buffer.from(JSON.stringify({ sub: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.forgedSignature123` },
      { name: 'Expired JWT', token: (() => {
          const exp = Math.floor(Date.now() / 1000) - 300; // 5 min in past
          const payloadB64 = Buffer.from(JSON.stringify({ sub: 'admin', exp, jti: 'exp-jti-1' })).toString('base64url');
          const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url');
          return `ka_jwt.${payloadB64}.${sig}`;
        })()
      },
      { name: 'Revoked JTI in DB', token: (() => {
          const jti = 'revoked-jti-challenger-' + Date.now();
          const db = readDb();
          db.revokedTokens = db.revokedTokens || {};
          db.revokedTokens[jti] = Math.floor(Date.now() / 1000) + 3600;
          writeDb(db);
          const payloadB64 = Buffer.from(JSON.stringify({ sub: 'admin', exp: Math.floor(Date.now() / 1000) + 3600, jti })).toString('base64url');
          const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url');
          return `ka_jwt.${payloadB64}.${sig}`;
        })()
      },
      { name: 'User Epoch Revoked token', token: (() => {
          const db = readDb();
          db.userRevocationEpochs = db.userRevocationEpochs || {};
          db.userRevocationEpochs['admin'] = Math.floor(Date.now() / 1000) + 500;
          writeDb(db);
          const payloadB64 = Buffer.from(JSON.stringify({
            sub: 'admin',
            iat: Math.floor(Date.now() / 1000), // iat < userEpoch
            exp: Math.floor(Date.now() / 1000) + 3600,
            jti: 'epoch-revoked-jti'
          })).toString('base64url');
          const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url');
          return `ka_jwt.${payloadB64}.${sig}`;
        })()
      }
    ];

    for (const vector of malformedJwtVectors) {
      await runTest('AUTH-JWT-TAMPER', `Malformed JWT (${vector.name}) strictly rejected with HTTP 401`, async () => {
        const res = await fetch(`${baseUrl}/api/admin/enquiries`, {
          headers: { 'Authorization': `Bearer ${vector.token}` }
        });
        const body = await res.json();
        assert.strictEqual(res.status, 401, `Expected 401 for ${vector.name}, got ${res.status}`);
        assert.strictEqual(body.success, false);
      });
    }

    // Reset user revocation epoch
    const freshDb = readDb();
    delete freshDb.userRevocationEpochs['admin'];
    writeDb(freshDb);

    // =========================================================================
    // SECTION 2: PUBLIC CONTENT LEAKAGE & QUARANTINE PROBES
    // =========================================================================
    console.log('\n--- 2. Public Content Leakage & Quarantine Probes ---');

    await runTest('CONTENT-QUARANTINE', 'Unauthenticated GET /api/content omits all administrative dataset keys', async () => {
      const res = await fetch(`${baseUrl}/api/content`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();

      // Top-level forbidden administrative keys
      assert.strictEqual(data.allServices, undefined, 'allServices MUST NOT be returned unauthenticated');
      assert.strictEqual(data.deletedServices, undefined, 'deletedServices MUST NOT be returned unauthenticated');
      assert.strictEqual(data.allFaqs, undefined, 'allFaqs MUST NOT be returned unauthenticated');
      assert.strictEqual(data.deletedFaqs, undefined, 'deletedFaqs MUST NOT be returned unauthenticated');
      assert.strictEqual(data.allPosts, undefined, 'allPosts MUST NOT be returned unauthenticated');
      assert.strictEqual(data.enquiries, undefined, 'enquiries MUST NOT be returned unauthenticated');
      assert.strictEqual(data.totalEnquiries, undefined, 'totalEnquiries MUST NOT be returned unauthenticated');

      // Allowed public keys
      assert.ok(Array.isArray(data.services), 'services must be an array');
      assert.ok(Array.isArray(data.faqs), 'faqs must be an array');
      assert.ok(Array.isArray(data.posts), 'posts must be an array');
      assert.ok(typeof data.settings === 'object', 'settings must be an object');
    });

    await runTest('CONTENT-CANARY-ISOLATION', 'Unauthenticated GET /api/content never leaks injected draft or deleted canary records', async () => {
      const db = readDb();
      const CANARY_DRAFT_SRV = 'CANARY_DRAFT_SERVICE_987';
      const CANARY_DEL_SRV = 'CANARY_DELETED_SERVICE_654';
      const CANARY_DRAFT_FAQ = 'CANARY_DRAFT_FAQ_321';
      const CANARY_DEL_FAQ = 'CANARY_DELETED_FAQ_111';
      const CANARY_DRAFT_POST = 'CANARY_DRAFT_POST_888';
      const CANARY_DEL_POST = 'CANARY_DELETED_POST_444';

      db.services = [
        { id: 'pub-srv-1', title: 'Pub Service', status: 'published', order: 1 },
        { id: 'draft-srv-canary', title: CANARY_DRAFT_SRV, status: 'draft', order: 2 },
        { id: 'del-srv-canary', title: CANARY_DEL_SRV, status: 'published', deletedAt: '2026-11-01T00:00:00Z', order: 3 }
      ];
      db.deletedServices = [
        { id: 'del-srv-history', title: CANARY_DEL_SRV, status: 'published' }
      ];
      db.faqs = [
        { id: 'pub-faq-1', question: 'Pub Q?', answer: 'Pub A', status: 'published', order: 1 },
        { id: 'draft-faq-canary', question: CANARY_DRAFT_FAQ, answer: 'Draft A', status: 'draft', order: 2 },
        { id: 'del-faq-canary', question: CANARY_DEL_FAQ, answer: 'Del A', status: 'published', deletedAt: '2026-11-01T00:00:00Z', order: 3 }
      ];
      db.deletedFaqs = [
        { id: 'del-faq-history', question: CANARY_DEL_FAQ, answer: 'Del A' }
      ];
      db.posts = [
        { slug: 'pub-post-1', title: 'Pub Blog Post', draft: false },
        { slug: 'draft-post-canary', title: CANARY_DRAFT_POST, draft: true },
        { slug: 'del-post-canary', title: CANARY_DEL_POST, draft: false, deletedAt: '2026-11-01T00:00:00Z' }
      ];
      writeDb(db);

      const res = await fetch(`${baseUrl}/api/content`);
      assert.strictEqual(res.status, 200);
      const rawText = await res.text();

      // Deep string inspection across entire response text
      assert.ok(!rawText.includes(CANARY_DRAFT_SRV), `Leaked draft service: ${CANARY_DRAFT_SRV}`);
      assert.ok(!rawText.includes(CANARY_DEL_SRV), `Leaked deleted service: ${CANARY_DEL_SRV}`);
      assert.ok(!rawText.includes(CANARY_DRAFT_FAQ), `Leaked draft FAQ: ${CANARY_DRAFT_FAQ}`);
      assert.ok(!rawText.includes(CANARY_DEL_FAQ), `Leaked deleted FAQ: ${CANARY_DEL_FAQ}`);
      assert.ok(!rawText.includes(CANARY_DRAFT_POST), `Leaked draft post: ${CANARY_DRAFT_POST}`);
      assert.ok(!rawText.includes(CANARY_DEL_POST), `Leaked deleted post: ${CANARY_DEL_POST}`);

      // Verify that the legitimate published service and FAQ ARE present
      assert.ok(rawText.includes('Pub Service'));
      assert.ok(rawText.includes('Pub Q?'));
      assert.ok(rawText.includes('Pub Blog Post'));
    });

    const paramPollutionQueries = [
      '?admin=true',
      '?includeDrafts=true',
      '?role=admin',
      '?status=all',
      '?status=draft',
      '?deleted=true',
      '?__proto__[admin]=true'
    ];

    for (const q of paramPollutionQueries) {
      await runTest('CONTENT-PARAM-POLLUTION', `GET /api/content${q} maintains strict quarantine`, async () => {
        const res = await fetch(`${baseUrl}/api/content${q}`);
        assert.strictEqual(res.status, 200);
        const data = await res.json();
        assert.strictEqual(data.allServices, undefined);
        assert.strictEqual(data.deletedServices, undefined);
        assert.strictEqual(data.allFaqs, undefined);
        assert.strictEqual(data.deletedFaqs, undefined);
        assert.strictEqual(data.allPosts, undefined);
      });
    }

    await runTest('CONTENT-ADMIN-AUTHORIZED', 'Authenticated admin receives full management dataset', async () => {
      const adminToken = issueValidAdminToken();
      const res = await fetch(`${baseUrl}/api/content`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data.allServices), 'allServices must be present for authenticated admin');
      assert.ok(Array.isArray(data.deletedServices), 'deletedServices must be present for authenticated admin');
      assert.ok(Array.isArray(data.allFaqs), 'allFaqs must be present for authenticated admin');
      assert.ok(Array.isArray(data.deletedFaqs), 'deletedFaqs must be present for authenticated admin');
      assert.ok(Array.isArray(data.allPosts), 'allPosts must be present for authenticated admin');
    });

    // =========================================================================
    // SECTION 3: RATE LIMITING PERMUTATION ATTACK
    // =========================================================================
    console.log('\n--- 3. Rate Limiting Permutation Attack ---');

    process.env.ADMIN_KAVITHA_PASSWORD = 'LegitimateKavithaPassword#2026';
    process.env.ADMIN_PASSWORD = 'LegitimateAdminPassword#2026';

    await runTest('RATE-LIMIT-PERMUTATION', 'Brute force credential stuffing with username permutations triggers 5-attempt lockout', async () => {
      // Set test IP header
      const testIp = '198.51.100.155';

      // Reset rate limits for test IP
      const db = readDb();
      db.rateLimits = db.rateLimits || {};
      delete db.rateLimits[`${testIp}_kavitha`];
      writeDb(db);
      await durable.clearLoginRateLimit(`${testIp}_kavitha`);

      // 5 permutations targeting kavitha
      const permutations = [
        'kavitha@test1.com',
        'kavitha@test2.com',
        'KAVITHA@domain.com',
        'cakavithasrj@gmail.com',
        'kavitha'
      ];

      for (let i = 0; i < permutations.length; i++) {
        const username = permutations[i];
        const res = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CF-Connecting-IP': testIp
          },
          body: JSON.stringify({ username, password: 'WrongPassword#999' })
        });
        const data = await res.json();
        assert.strictEqual(res.status, 401, `Attempt ${i + 1} with ${username} expected 401, got ${res.status}`);
        const expectedRemaining = 4 - i;
        assert.ok(
          data.error.includes(`${expectedRemaining} attempts remaining`),
          `Attempt ${i + 1} expected '${expectedRemaining} attempts remaining', got '${data.error}'`
        );
      }

      // 6th attempt with ANY permutation must trigger HTTP 429
      const lockedRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CF-Connecting-IP': testIp
        },
        body: JSON.stringify({ username: 'KAVITHA@fresh-attack.com', password: 'WrongPassword#999' })
      });
      const lockData = await lockedRes.json();
      assert.strictEqual(lockedRes.status, 429, `6th attempt expected 429 Account Locked, got ${lockedRes.status}`);
      assert.strictEqual(lockData.success, false);
      assert.ok(
        lockData.error.includes('Account locked due to consecutive failed attempts'),
        `Error message must report account lockout, got '${lockData.error}'`
      );

      // 7th attempt with raw prefix 'cakavithasrj' must also be locked out
      const lockedRes2 = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CF-Connecting-IP': testIp
        },
        body: JSON.stringify({ username: 'cakavithasrj', password: 'WrongPassword#999' })
      });
      assert.strictEqual(lockedRes2.status, 429);

      // User Isolation: verify that another user account is NOT locked out by kavitha's lockout
      const otherUserRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CF-Connecting-IP': testIp
        },
        body: JSON.stringify({ username: 'admin', password: 'WrongPassword#999' })
      });
      assert.strictEqual(otherUserRes.status, 401, `Separate account 'admin' should not be locked out; got ${otherUserRes.status}`);
      const otherData = await otherUserRes.json();
      assert.ok(otherData.error.includes('4 attempts remaining'));
    });

    // =========================================================================
    // SECTION 4: CORS ORIGIN PREFLIGHT & MUTATION DEFENSE PROBES
    // =========================================================================
    console.log('\n--- 4. CORS Origin Preflight & Header Reflection Probes ---');

    const maliciousOrigins = [
      'https://kavithaassociates-evil.vercel.app',
      'https://malicious.com',
      'https://evil-kavithaassociates.com',
      'https://kavithaassociates.com.attacker.com',
      'https://kavithaassociates.vercel.app.attacker.com',
      'https://attacker-kavitha-and-associates.pages.dev',
      'http://kavithaassociates.com',
      'https://random-tenant.vercel.app',
      'null'
    ];

    for (const origin of maliciousOrigins) {
      await runTest('CORS-PREFLIGHT-BLOCK', `OPTIONS preflight for untrusted origin '${origin}' does NOT reflect Access-Control-Allow-Origin`, async () => {
        const res = await fetch(`${baseUrl}/api/content`, {
          method: 'OPTIONS',
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'GET'
          }
        });
        assert.strictEqual(res.status, 204);
        const acao = res.headers.get('access-control-allow-origin');
        assert.strictEqual(acao, null, `Untrusted origin '${origin}' must NOT have Access-Control-Allow-Origin reflected; got '${acao}'`);
      });

      await runTest('CORS-GET-BLOCK', `GET /api/content for untrusted origin '${origin}' does NOT reflect Access-Control-Allow-Origin`, async () => {
        const res = await fetch(`${baseUrl}/api/content`, {
          headers: { 'Origin': origin }
        });
        const acao = res.headers.get('access-control-allow-origin');
        assert.strictEqual(acao, null, `Untrusted origin '${origin}' must NOT be reflected on GET; got '${acao}'`);
      });
    }

    const whitelistedOrigins = [
      'https://kavithaassociates.com',
      'https://www.kavithaassociates.com',
      'https://kavitha-and-associates.pages.dev',
      'https://staging.kavitha-and-associates.pages.dev',
      'https://kavithaassociates.vercel.app',
      'http://localhost:5173',
      'http://127.0.0.1:3000'
    ];

    for (const origin of whitelistedOrigins) {
      await runTest('CORS-WHITELIST-ALLOW', `OPTIONS preflight reflects whitelisted origin '${origin}'`, async () => {
        const res = await fetch(`${baseUrl}/api/content`, {
          method: 'OPTIONS',
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'GET'
          }
        });
        assert.strictEqual(res.status, 204);
        const acao = res.headers.get('access-control-allow-origin');
        assert.strictEqual(acao, origin, `Whitelisted origin '${origin}' should be reflected; got '${acao}'`);
        assert.strictEqual(res.headers.get('vary'), 'Origin');
      });
    }

    // Anti-CSRF on Admin Mutations: Valid token + Untrusted Origin = 403 Forbidden
    await runTest('ANTI-CSRF-MUTATION', 'Admin POST mutation with valid JWT but untrusted Origin returns HTTP 403 Forbidden', async () => {
      const adminToken = issueValidAdminToken();
      const res = await fetch(`${baseUrl}/api/admin/services`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Origin': 'https://malicious.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: 'csrf-srv', title: 'CSRF Srv' })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 403, `Expected 403 Forbidden, got ${res.status}`);
      assert.strictEqual(data.success, false);
      assert.ok(data.error.includes('Cross-origin administrative mutation denied'));
    });

    await runTest('ANTI-CSRF-DELETE', 'Admin DELETE mutation with valid JWT but attacker Vercel Origin returns HTTP 403 Forbidden', async () => {
      const adminToken = issueValidAdminToken();
      const res = await fetch(`${baseUrl}/api/admin/enquiries/ENQ-CSRF-1`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Origin': 'https://kavithaassociates-evil.vercel.app',
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      assert.strictEqual(res.status, 403, `Expected 403 Forbidden, got ${res.status}`);
      assert.strictEqual(data.success, false);
      assert.ok(data.error.includes('Cross-origin administrative mutation denied'));
    });

  } finally {
    writeDb(originalDb);
    server.close();
  }

  console.log('\n================================================================================');
  console.log(`TOTAL CHALLENGER TESTS : ${totalTests}`);
  console.log(`PASSED                 : ${passedTests}`);
  console.log(`FAILED                 : ${failedTests}`);
  console.log('================================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Challenger test runner encountered fatal exception:', err);
  process.exit(1);
});
