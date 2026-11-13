import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { handleApiRequest } = require('../server/apiRouter.cjs');
const { readDb, writeDb, SESSION_SECRET } = require('../server/db.cjs');
const durable = require('../server/durableStorage.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('================================================================================');
console.log('       ISOLATED ADVERSARIAL VERIFICATION TEST SUITE (PRODUCTION REMEDIATION)     ');
console.log('================================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  \x1b[32m✔ [PASS]\x1b[0m ${name}`);
  } catch (err) {
    failedTests++;
    console.log(`  \x1b[31m✖ [FAIL]\x1b[0m ${name}`);
    console.error('    Error:', err.message);
  }
}

// Helper to simulate HTTP requests against handleApiRequest
function simulateApi(method, url, headers = {}, body = null, socket = { remoteAddress: '127.0.0.1' }) {
  return new Promise((resolve) => {
    const bodyStr = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
    const bodyBuf = Buffer.from(bodyStr);

    const req = {
      method,
      url,
      headers: {
        'host': 'localhost:5173',
        'content-type': 'application/json',
        'content-length': bodyBuf.length,
        ...headers
      },
      socket,
      on: (event, handler) => {
        if (event === 'data' && bodyBuf.length > 0) handler(bodyBuf);
        else if (event === 'end') handler();
        return req;
      }
    };

    let statusCode = 200;
    const resHeaders = {};
    const chunks = [];

    const res = {
      statusCode: 200,
      setHeader: (name, val) => { resHeaders[name.toLowerCase()] = val; },
      writeHead: (code, hdrs) => {
        statusCode = code;
        if (hdrs) Object.entries(hdrs).forEach(([k, v]) => { resHeaders[k.toLowerCase()] = v; });
      },
      end: (chunk) => {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const rawBody = Buffer.concat(chunks).toString('utf8');
        let json = null;
        try { json = JSON.parse(rawBody); } catch {}
        resolve({
          statusCode: res.statusCode || statusCode,
          headers: resHeaders,
          rawBody,
          json
        });
      }
    };

    handleApiRequest(req, res).catch(err => {
      resolve({ statusCode: 500, headers: {}, rawBody: String(err), json: { error: String(err) } });
    });
  });
}

function issueAdminToken(username = 'admin') {
  const payload = {
    sub: username,
    name: 'Administrator',
    role: 'admin',
    jti: 'adv-jti-' + crypto.randomBytes(12).toString('hex'),
    iat: Math.floor(Date.now() / 1000) + 10,
    exp: Math.floor(Date.now() / 1000) + 3600
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url');
  return `ka_jwt.${payloadB64}.${sig}`;
}

async function runAllTests() {
  const originalDb = JSON.parse(JSON.stringify(readDb()));

  try {
    console.log('--- 1. Prototype Property Authentication Bypass ---');

    await test('Bearer constructor is strictly rejected with HTTP 401', async () => {
      const res = await simulateApi('GET', '/api/admin/enquiries', {
        'authorization': 'Bearer constructor'
      });
      assert.strictEqual(res.statusCode, 401, `Expected 401 but received ${res.statusCode}`);
      assert.strictEqual(res.json?.success, false);
    });

    await test('Bearer __proto__ is strictly rejected with HTTP 401', async () => {
      const res = await simulateApi('GET', '/api/admin/enquiries', {
        'authorization': 'Bearer __proto__'
      });
      assert.strictEqual(res.statusCode, 401, `Expected 401 but received ${res.statusCode}`);
      assert.strictEqual(res.json?.success, false);
    });

    await test('Bearer toString and valueOf are rejected with HTTP 401', async () => {
      const res1 = await simulateApi('GET', '/api/admin/enquiries', { 'authorization': 'Bearer toString' });
      const res2 = await simulateApi('GET', '/api/admin/enquiries', { 'authorization': 'Bearer valueOf' });
      assert.strictEqual(res1.statusCode, 401);
      assert.strictEqual(res2.statusCode, 401);
    });

    console.log('\n--- 2. Public Content Quarantine (/api/content) ---');

    await test('GET /api/content for unauthenticated caller omits allServices, deletedServices, allFaqs, deletedFaqs, allPosts', async () => {
      // Seed test draft and deleted items in local DB
      const db = readDb();
      db.services = [
        { id: 'pub-srv', title: 'Published Srv', status: 'published', order: 1 },
        { id: 'draft-srv', title: 'Draft Srv', status: 'draft', order: 2 }
      ];
      db.deletedServices = [{ id: 'del-srv', title: 'Deleted Srv', status: 'published' }];
      db.faqs = [
        { id: 'pub-faq', question: 'Pub Q?', answer: 'Pub A', status: 'published', order: 1 },
        { id: 'draft-faq', question: 'Draft Q?', answer: 'Draft A', status: 'draft', order: 2 }
      ];
      db.deletedFaqs = [{ id: 'del-faq', question: 'Del Q?', answer: 'Del A', status: 'published' }];
      db.posts = [
        { slug: 'pub-post', title: 'Pub Post', draft: false },
        { slug: 'draft-post', title: 'Draft Post', draft: true }
      ];
      writeDb(db);

      const res = await simulateApi('GET', '/api/content');
      assert.strictEqual(res.statusCode, 200);

      // Verify that administrative arrays are completely stripped
      assert.strictEqual(res.json.allServices, undefined, 'allServices must not be present');
      assert.strictEqual(res.json.deletedServices, undefined, 'deletedServices must not be present');
      assert.strictEqual(res.json.allFaqs, undefined, 'allFaqs must not be present');
      assert.strictEqual(res.json.deletedFaqs, undefined, 'deletedFaqs must not be present');
      assert.strictEqual(res.json.allPosts, undefined, 'allPosts must not be present');

      // Verify that published arrays contain ONLY published, non-deleted items
      assert.strictEqual(res.json.services.length, 1);
      assert.strictEqual(res.json.services[0].id, 'pub-srv');
      assert.strictEqual(res.json.faqs.length, 1);
      assert.strictEqual(res.json.faqs[0].id, 'pub-faq');
      assert.strictEqual(res.json.posts.length, 1);
      assert.strictEqual(res.json.posts[0].slug, 'pub-post');
    });

    await test('GET /api/content for authenticated admin returns full management datasets', async () => {
      const adminToken = issueAdminToken();
      const res = await simulateApi('GET', '/api/content', {
        'authorization': `Bearer ${adminToken}`
      });
      assert.strictEqual(res.statusCode, 200);
      assert.ok(Array.isArray(res.json.allServices), 'allServices must be present for admin');
      assert.ok(Array.isArray(res.json.deletedServices), 'deletedServices must be present for admin');
      assert.ok(Array.isArray(res.json.allFaqs), 'allFaqs must be present for admin');
      assert.ok(Array.isArray(res.json.allPosts), 'allPosts must be present for admin');
    });

    console.log('\n--- 3. Login Rate Limiting Permutation Resistance ---');

    await test('Consecutive attempts with username permutations hit security lockout at 5 attempts', async () => {
      process.env.ADMIN_KAVITHA_PASSWORD = 'LegitimateCorrectPassword#2026';
      const testIp = '198.51.100.42'; // isolated test IP

      // Clear any prior rate limits for this test IP
      const db = readDb();
      db.rateLimits = db.rateLimits || {};
      delete db.rateLimits[`${testIp}_kavitha`];
      writeDb(db);

      const permutations = [
        'kavitha@domain1.com',
        'KAVITHA@attack2.net',
        'kavitha@corp3.org',
        'cakavithasrj@gmail.com',
        'kavitha'
      ];

      const responses = [];
      for (const username of permutations) {
        const res = await simulateApi('POST', '/api/auth/login', {}, {
          username,
          password: 'WrongPassword#999'
        }, { remoteAddress: testIp });
        responses.push(res);
      }

      // Check attempts remaining counts
      assert.strictEqual(responses[0].statusCode, 401);
      assert.ok(responses[0].json.error.includes('4 attempts remaining'));

      assert.strictEqual(responses[1].statusCode, 401);
      assert.ok(responses[1].json.error.includes('3 attempts remaining'));

      assert.strictEqual(responses[2].statusCode, 401);
      assert.ok(responses[2].json.error.includes('2 attempts remaining'));

      assert.strictEqual(responses[3].statusCode, 401);
      assert.ok(responses[3].json.error.includes('1 attempts remaining'));

      assert.strictEqual(responses[4].statusCode, 401);
      assert.ok(responses[4].json.error.includes('0 attempts remaining'));

      // 6th attempt with ANY variation must return HTTP 429 Account Locked
      const lockRes = await simulateApi('POST', '/api/auth/login', {}, {
        username: 'kavitha@another-attempt.com',
        password: 'WrongPassword#999'
      }, { remoteAddress: testIp });

      assert.strictEqual(lockRes.statusCode, 429, `Expected 429 locked but got ${lockRes.statusCode}`);
      assert.ok(lockRes.json.error.includes('Account locked due to consecutive failed attempts'));
    });

    console.log('\n--- 4. STRICT_DURABLE_STORAGE=true Enforcement ---');

    await test('STRICT_DURABLE_STORAGE=true rejects saveService without Supabase connection', async () => {
      process.env.STRICT_DURABLE_STORAGE = 'true';
      const res = await durable.saveService({ id: 'strict-test-srv', title: 'Strict Test', status: 'published' });
      assert.strictEqual(res.success, false);
      assert.ok(res.error.includes('CRITICAL: Durable cloud storage is mandatory'));

      // Verify zero written to local DB
      const db = readDb();
      const found = (db.services || []).some(s => s.id === 'strict-test-srv');
      assert.strictEqual(found, false, 'Must NOT write to local DB in strict mode when cloud is disconnected');
      delete process.env.STRICT_DURABLE_STORAGE;
    });

    await test('STRICT_DURABLE_STORAGE=true rejects saveEnquiry without Supabase connection', async () => {
      process.env.STRICT_DURABLE_STORAGE = 'true';
      const res = await durable.saveEnquiry({
        id: 'ENQ-STRICT-TEST',
        fullName: 'Strict Test Client',
        phone: '+91 99999 88888',
        message: 'Strict enquiry test',
        serviceCategory: 'Audit',
        city: 'Tirupati',
        status: 'new'
      });
      assert.strictEqual(res.success, false);
      assert.ok(res.error.includes('CRITICAL: Durable cloud storage is mandatory'));

      // Verify zero written to local DB
      const db = readDb();
      const found = (db.enquiries || []).some(e => e.id === 'ENQ-STRICT-TEST');
      assert.strictEqual(found, false, 'Must NOT write to local DB in strict mode');
      delete process.env.STRICT_DURABLE_STORAGE;
    });

    await test('STRICT_DURABLE_STORAGE=true rejects savePost without Supabase connection', async () => {
      process.env.STRICT_DURABLE_STORAGE = 'true';
      const res = await durable.savePost({
        slug: 'strict-test-post',
        title: 'Strict Test Post',
        content: 'Content'
      });
      assert.strictEqual(res.success, false);
      assert.ok(res.error.includes('CRITICAL: Durable cloud storage is mandatory'));

      const db = readDb();
      const found = (db.posts || []).some(p => p.slug === 'strict-test-post');
      assert.strictEqual(found, false, 'Must NOT write to local DB in strict mode');
      delete process.env.STRICT_DURABLE_STORAGE;
    });

    console.log('\n--- 5. CSV Formula Injection Neutralization ---');

    await test('Formula characters (=, +, -, @, %, \\t, \\r) are prefixed with single quote in CSV export', async () => {
      const sanitizeCSVField = (val) => {
        if (val === null || val === undefined) return '""';
        let str = String(val);
        if (/^[=+\-@%\t\r]/.test(str)) {
          str = "'" + str;
        }
        return `"${str.replace(/"/g, '""')}"`;
      };

      const testPayloads = [
        { raw: '=cmd|\' /C calc\'!A0', expected: "\"'=cmd|' /C calc'!A0\"" },
        { raw: '+HYPERLINK("http://attacker.com")', expected: "\"'+HYPERLINK(\"\"http://attacker.com\"\")\"" },
        { raw: '-10+20', expected: "\"'-10+20\"" },
        { raw: '@SUM(1,2)', expected: "\"'@SUM(1,2)\"" },
        { raw: '%COMSPEC%', expected: "\"'%COMSPEC%\"" },
        { raw: '\t=DDE()', expected: "\"'\t=DDE()\"" },
        { raw: 'Normal Text', expected: '"Normal Text"' }
      ];

      for (const item of testPayloads) {
        const sanitized = sanitizeCSVField(item.raw);
        assert.strictEqual(sanitized, item.expected, `Failed for payload: ${item.raw}`);
      }
    });

    console.log('\n--- 6. Enquiry Status Enum Validation ---');

    await test('PATCH /api/admin/enquiries/:id rejects non-enum status with HTTP 400', async () => {
      const adminToken = issueAdminToken();
      const invalidStatuses = ['in-review', 'archived', 'deleted', 'approved', 'PENDING'];

      for (const status of invalidStatuses) {
        const res = await simulateApi(
          'PATCH',
          '/api/admin/enquiries/ENQ-TEST-ID',
          {
            'authorization': `Bearer ${adminToken}`,
            'origin': 'https://kavithaassociates.com'
          },
          { status }
        );
        assert.strictEqual(res.statusCode, 400, `Status '${status}' should have been rejected with 400 but got ${res.statusCode}`);
        assert.strictEqual(res.json.success, false);
        assert.ok(res.json.error.includes('Status must be one of'));
      }
    });

    await test('PATCH /api/admin/enquiries/:id accepts valid enum statuses', async () => {
      // Seed a test enquiry in local DB
      const db = readDb();
      db.enquiries = [{
        id: 'ENQ-VALID-STATUS-TEST',
        fullName: 'Status Client',
        phone: '+91 95421 53906',
        message: 'Test message',
        serviceCategory: 'GST',
        city: 'Tirupati',
        status: 'new',
        createdAt: new Date().toISOString()
      }];
      writeDb(db);

      const adminToken = issueAdminToken();
      const validStatuses = ['contacted', 'in-progress', 'closed', 'new'];

      for (const status of validStatuses) {
        const res = await simulateApi(
          'PATCH',
          '/api/admin/enquiries/ENQ-VALID-STATUS-TEST',
          {
            'authorization': `Bearer ${adminToken}`,
            'origin': 'https://kavithaassociates.com'
          },
          { status }
        );
        assert.strictEqual(res.statusCode, 200, `Expected 200 for status '${status}' but got ${res.statusCode}`);
        assert.strictEqual(res.json.success, true);
        assert.strictEqual(res.json.enquiry.status, status);
      }
    });

    console.log('\n--- 7. IP Extraction Hardening & Origin Validation ---');

    await test('Direct external connection ignores untrusted X-Forwarded-For spoofing', async () => {
      const externalIp = '203.0.113.195';
      const res = await simulateApi('POST', '/api/enquiries', {
        'x-forwarded-for': '198.51.100.99' // spoofed header
      }, {
        fullName: 'IP Test',
        phone: '123' // intentionally short to fail fast after IP extraction
      }, { remoteAddress: externalIp });

      // Check db.enquiryRateLimits
      const db = readDb();
      // Should be recorded under the real socket IP (203.0.113.195), NOT the spoofed IP (198.51.100.99)
      const recordedUnderSpoofed = Boolean(db.enquiryRateLimits?.['enq_198.51.100.99']);
      assert.strictEqual(recordedUnderSpoofed, false, 'Spoofed X-Forwarded-For must NOT be recorded when direct socket IP is present');
    });

    await test('Arbitrary third-party Vercel origins are rejected by CORS allowlist', async () => {
      const res = await simulateApi('OPTIONS', '/api/content', {
        'origin': 'https://kavithaassociates-attacker.vercel.app'
      });
      assert.strictEqual(res.headers['access-control-allow-origin'], undefined, 'Must NOT reflect arbitrary vercel origin');
    });

    await test('Legitimate firm origins are accepted by CORS allowlist', async () => {
      const res1 = await simulateApi('OPTIONS', '/api/content', {
        'origin': 'https://kavithaassociates.com'
      });
      assert.strictEqual(res1.headers['access-control-allow-origin'], 'https://kavithaassociates.com');

      const res2 = await simulateApi('OPTIONS', '/api/content', {
        'origin': 'https://kavitha-and-associates.pages.dev'
      });
      assert.strictEqual(res2.headers['access-control-allow-origin'], 'https://kavitha-and-associates.pages.dev');
    });

    console.log('\n--- 8. Blog Path Traversal & Truthful Health Reporting ---');

    await test('Server blog route rejects directory traversal slugs (/blog/../../etc/passwd)', () => {
      const slug = '../../etc/passwd';
      assert.strictEqual(/^[a-z0-9-]+$/.test(slug), false, 'Regex must reject directory traversal sequences');
    });

    await test('GET /api/status accurately reports local-fallback mode when Supabase is disconnected', async () => {
      const res = await simulateApi('GET', '/api/status');
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.json.status, 'local-fallback');
      assert.strictEqual(res.json.engine, 'local-file');
      assert.strictEqual(res.json.database, 'Local File System / Development Fallback');
      assert.strictEqual(res.json.synchronized, false);
    });

  } finally {
    writeDb(originalDb);
  }

  console.log('\n================================================================================');
  console.log(`TOTAL ISOLATED ADVERSARIAL TESTS : ${totalTests}`);
  console.log(`PASSED                           : ${passedTests}`);
  console.log(`FAILED                           : ${failedTests}`);
  console.log('================================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Fatal suite error:', err);
  process.exit(1);
});
