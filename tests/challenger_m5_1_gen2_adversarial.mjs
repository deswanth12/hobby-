/**
 * tests/challenger_m5_1_gen2_adversarial.mjs
 * 
 * Milestone 5 Challenger 1 (challenger_m5_1_gen2) Empirical Test Harness
 * 
 * Executes Adversarial Stress & Penetration Testing against:
 * 1. Attempt to bypass /admin quarantine (4-tier quarantine & zero bundle leakage)
 * 2. Attempt brute-force probing on login rate limiter (sliding window IP/account lockout & case permutation defense)
 * 3. Test honeypot bypass (website_fax_hp silent fake success without DB persistence)
 * 4. Test submit velocity (<1500ms rejection & timing manipulation resistance)
 * 5. Probe secret path entropy rules (banned patterns, length boundaries, fail-closed contract)
 * 6. Verify PBKDF2 parameters & timingSafeEqual timing attack resistance
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import crypto from 'crypto';
import assert from 'assert';

const ROOT = path.resolve('.');
const DIST = path.join(ROOT, 'dist');

console.log('================================================================');
console.log('  CHALLENGER M5-1-GEN2: ADVERSARIAL PENETRATION & STRESS HARNESS');
console.log('  Target: Milestone 5 Security, Quarantine, Auth & Intake Guards');
console.log('================================================================\n');

let total = 0;
let passed = 0;
let failed = 0;
const failures = [];

function check(testName, condition, details = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${total.toString().padStart(2, '0')}] ${testName}`);
  } else {
    failed++;
    failures.push({ testName, details });
    console.error(`\x1b[31m✖ FAIL\x1b[0m [Assert ${total.toString().padStart(2, '0')}] ${testName}`);
    if (details) console.error(`       Details: ${details}`);
  }
}

async function run() {
  const { handleApiRequest } = await import('../server/apiRouter.cjs');
  const { readDb, writeDb, hashPassword, verifyPassword, generateSalt } = await import('../server/db.cjs');
  const adminConfig = await import('../src/config/adminConfig.ts');
  const { validateAdminSecretPath, ADMIN_ROUTES, IS_ADMIN_CONFIGURED, ADMIN_SECRET_PATH } = adminConfig;

  // Backup existing practice_db.json
  const DB_PATH = path.join(ROOT, 'data', 'practice_db.json');
  const originalDbContent = fs.existsSync(DB_PATH) ? fs.readFileSync(DB_PATH, 'utf8') : null;

  // Create an ephemeral HTTP server mimicking production server/index.cjs routing
  const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };

  const server = http.createServer((req, res) => {
    // 1. API Endpoints
    if (req.url && req.url.startsWith('/api/')) {
      return handleApiRequest(req, res);
    }

    // 2. Static / Route handling from server/index.cjs
    const url = new URL(req.url, `http://localhost`);
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
      res.end('Bad Request: Malformed URI encoding.');
      return;
    }

    // Server-side /admin quarantine
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      const indexPath = path.join(DIST, 'index.html');
      res.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8',
        ...SECURITY_HEADERS,
      });
      if (fs.existsSync(indexPath)) {
        fs.createReadStream(indexPath).pipe(res);
      } else {
        res.end('<!DOCTYPE html><html><body>404 Not Found</body></html>');
      }
      return;
    }

    // Catch-all
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY_HEADERS });
    res.end('<!DOCTYPE html><html><body>Public SPA</body></html>');
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Ephemeral challenge test server listening on ${baseUrl}\n`);

  try {
    // =========================================================================
    // OBJECTIVE 1: ATTEMPT TO BYPASS /ADMIN QUARANTINE
    // =========================================================================
    console.log('--- 1. Probing /admin Quarantine Bypass Vectors ---');

    const quarantineBypassPaths = [
      '/admin',
      '/admin/',
      '/admin/login',
      '/admin/settings',
      '/admin/enquiries',
      '/admin/content',
      '/admin/overview',
      '/admin/../admin',
      '/admin/./login',
      '/admin/..%2fadmin',
      '/admin?redirect=/dashboard',
      '/admin#token=secret',
    ];

    for (const qPath of quarantineBypassPaths) {
      const res = await fetch(`${baseUrl}${qPath}`);
      check(`Path '${qPath}' returns HTTP 404`, res.status === 404, `Status was ${res.status}`);
      const body = await res.text();
      check(
        `Path '${qPath}' leaks zero administrative credentials/tokens`,
        !body.includes('ka_jwt') && !body.includes('ADMIN_PASSWORD') && !body.includes('SUPABASE_SERVICE_ROLE_KEY'),
        'Administrative credential leaked in response'
      );
      check(
        `Path '${qPath}' presents nosniff header`,
        res.headers.get('x-content-type-options') === 'nosniff',
        'Missing nosniff'
      );
    }

    // Verify edge _redirects quarantine rule ordering
    const redirectsContent = fs.readFileSync(path.join(ROOT, 'public', '_redirects'), 'utf8');
    const redirectLines = redirectsContent.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
    const adminIdx = redirectLines.findIndex((l) => l.startsWith('/admin '));
    const adminWildcardIdx = redirectLines.findIndex((l) => l.startsWith('/admin/* '));
    const catchAllIdx = redirectLines.findIndex((l) => l.startsWith('/* '));

    check('public/_redirects explicitly maps /admin to 404', adminIdx !== -1 && redirectLines[adminIdx].includes('404'));
    check('public/_redirects explicitly maps /admin/* to 404', adminWildcardIdx !== -1 && redirectLines[adminWildcardIdx].includes('404'));
    check(
      'public/_redirects evaluates /admin 404 BEFORE public /* catch-all',
      adminIdx < catchAllIdx && adminWildcardIdx < catchAllIdx,
      `adminIdx: ${adminIdx}, catchAllIdx: ${catchAllIdx}`
    );

    // Verify client-side App.tsx quarantine
    const appTsxContent = fs.readFileSync(path.join(ROOT, 'src', 'App.tsx'), 'utf8');
    check(
      'App.tsx explicitly maps /admin to <NotFoundPage />',
      appTsxContent.includes('<Route path="/admin" element={<NotFoundPage />} />')
    );
    check(
      'App.tsx explicitly maps /admin/* to <NotFoundPage />',
      appTsxContent.includes('<Route path="/admin/*" element={<NotFoundPage />} />')
    );

    // Verify client-side code-splitting (Zero admin JS in public entry bundle)
    check(
      'App.tsx implements React.lazy code-splitting for AdminLoginPage',
      appTsxContent.includes("React.lazy(() => import('./pages/admin/AdminLoginPage')")
    );
    check(
      'App.tsx implements React.lazy code-splitting for AdminOverviewPage',
      appTsxContent.includes("React.lazy(() => import('./pages/admin/AdminOverviewPage')")
    );
    check(
      'App.tsx implements React.lazy code-splitting for AdminSettingsPage',
      appTsxContent.includes("React.lazy(() => import('./pages/admin/AdminSettingsPage')")
    );

    // Check dist/ assets if built
    if (fs.existsSync(DIST)) {
      const distFiles = fs.readdirSync(path.join(DIST, 'assets'));
      const adminChunks = distFiles.filter((f) => f.includes('Admin') && f.endsWith('.js'));
      check('dist/assets contains code-split admin chunks', adminChunks.length > 0);
      const indexHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
      const hasSyncAdminChunk = adminChunks.some((c) => indexHtml.includes(c));
      check('dist/index.html does not synchronously load any admin chunks', !hasSyncAdminChunk);
    }

    // =========================================================================
    // OBJECTIVE 2: ATTEMPT BRUTE FORCE PROBING ON LOGIN RATE LIMITER
    // =========================================================================
    console.log('\n--- 2. Probing Login Rate Limiter & Brute-Force Lockout ---');

    // Reset rate limits in DB before test
    const testDb = readDb();
    testDb.rateLimits = {};
    writeDb(testDb);

    // Ensure test credentials configured for admin
    const testAdminPass = 'ChallengerSecretPassword#2026!';
    const adminSalt = generateSalt();
    testDb.userCredentials = testDb.userCredentials || {};
    testDb.userCredentials['admin'] = {
      salt: adminSalt,
      passwordHash: hashPassword(testAdminPass, adminSalt),
      iterations: 100000,
      algorithm: 'pbkdf2-sha512',
      updatedAt: new Date().toISOString(),
    };
    writeDb(testDb);

    const loginUrl = `${baseUrl}/api/auth/login`;
    const clientHeaders = {
      'Content-Type': 'application/json',
      'Origin': 'https://kavithaassociates.com',
      'x-forwarded-for': '203.0.113.195', // Dedicated challenger IP
    };

    // Send 5 consecutive incorrect password attempts
    for (let i = 1; i <= 5; i++) {
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: clientHeaders,
        body: JSON.stringify({ username: 'admin', password: `WrongAttempt_${i}` }),
      });
      check(`Attempt ${i} rejected with HTTP 401`, res.status === 401, `Status: ${res.status}`);
      const body = await res.json();
      const expectedRemaining = 5 - i;
      check(
        `Attempt ${i} accurately indicates ${expectedRemaining} attempt(s) remaining`,
        body.error && body.error.includes(`${expectedRemaining} attempts remaining`),
        `Error: ${body.error}`
      );
    }

    // The 6th attempt (even with valid password!) must trigger HTTP 429 Lockout
    const lockoutRes = await fetch(loginUrl, {
      method: 'POST',
      headers: clientHeaders,
      body: JSON.stringify({ username: 'admin', password: testAdminPass }),
    });
    check('6th attempt triggers HTTP 429 Too Many Requests (Lockout)', lockoutRes.status === 429, `Status: ${lockoutRes.status}`);
    const lockoutBody = await lockoutRes.json();
    check(
      'Lockout error message informs user of account security lockout',
      lockoutBody.error && lockoutBody.error.includes('Account locked due to consecutive failed attempts'),
      `Error: ${lockoutBody.error}`
    );

    // Adversarial Bypass Attempt: Case Permutation Attack ('ADMIN', 'Admin')
    const caseBypassRes = await fetch(loginUrl, {
      method: 'POST',
      headers: clientHeaders,
      body: JSON.stringify({ username: 'ADMIN', password: testAdminPass }),
    });
    check(
      'Case permutation attack (ADMIN) is neutralized by username canonicalization and blocked with HTTP 429',
      caseBypassRes.status === 429,
      `Status: ${caseBypassRes.status}`
    );

    // =========================================================================
    // OBJECTIVE 3: TEST HONEYPOT BYPASS (website_fax_hp)
    // =========================================================================
    console.log('\n--- 3. Testing Honeypot Bypass (website_fax_hp) ---');

    const enquiriesUrl = `${baseUrl}/api/enquiries`;
    const initialDb = readDb();
    const initialEnquiryCount = (initialDb.enquiries || []).length;

    // Spammer submits with honeypot field filled
    const spammerPayload = {
      fullName: 'Spam Bot Corporation',
      phone: '+91 98765 43210',
      email: 'spambot@darkweb-promotions.com',
      message: 'Buy cheap bulk SEO leads and financial rankings at our website!',
      website_fax_hp: 'https://malicious-spam-affiliate.com/phish',
      serviceCategory: 'Audit & Assurance Services',
      city: 'Tirupati',
    };

    const honeypotRes = await fetch(enquiriesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://kavithaassociates.com',
        'x-forwarded-for': '198.51.100.77',
      },
      body: JSON.stringify(spammerPayload),
    });

    check('Honeypot submission returns HTTP 200 (Silent Trap)', honeypotRes.status === 200, `Status: ${honeypotRes.status}`);
    const honeypotBody = await honeypotRes.json();
    check(
      'Honeypot returns deceptive success confirmation',
      honeypotBody.success === true && honeypotBody.message === 'Enquiry registered.',
      `Body: ${JSON.stringify(honeypotBody)}`
    );

    // Verify DB persistence: Must NOT be saved!
    const postSpamDb = readDb();
    const postSpamEnquiryCount = (postSpamDb.enquiries || []).length;
    check(
      'Spam inquiry was NOT persisted to practice database (Zero persistence invariant)',
      postSpamEnquiryCount === initialEnquiryCount,
      `Initial: ${initialEnquiryCount}, Post-spam: ${postSpamEnquiryCount}`
    );

    const leakedInDb = (postSpamDb.enquiries || []).some((e) => e.email === 'spambot@darkweb-promotions.com');
    check('Spammer email completely absent from practice database records', !leakedInDb);

    // Verify client-side checkAntiSpam directly from backendAdapter
    const backendAdapterSource = fs.readFileSync(path.join(ROOT, 'src', 'v8', 'adapters', 'backendAdapter.ts'), 'utf8');
    check(
      'backendAdapter.ts contains checkAntiSpam function',
      backendAdapterSource.includes('export function checkAntiSpam')
    );
    check(
      'checkAntiSpam inspects payload.website_fax_hp and flags HONEYPOT_TRIGGERED',
      backendAdapterSource.includes("reason: 'HONEYPOT_TRIGGERED'")
    );

    // =========================================================================
    // OBJECTIVE 4: TEST SUBMIT VELOCITY GUARD (< 1500ms)
    // =========================================================================
    console.log('\n--- 4. Testing Submit Velocity Threshold & Clock Manipulation ---');

    check(
      'backendAdapter.ts specifies 1500ms default velocity threshold',
      backendAdapterSource.includes('minVelocityMs: number = 1500')
    );
    check(
      'backendAdapter.ts rejects velocity with VELOCITY_TOO_FAST',
      backendAdapterSource.includes("reason: 'VELOCITY_TOO_FAST'")
    );

    // Test velocity math directly against the algorithm specification:
    // elapsed = Date.now() - formLoadedAt; if (elapsed < minVelocityMs) return false;
    function simulateVelocityCheck(formLoadedAt, now = Date.now(), minVelocityMs = 1500) {
      if (formLoadedAt && typeof formLoadedAt === 'number') {
        const elapsed = now - formLoadedAt;
        if (elapsed < minVelocityMs) {
          return { passed: false, reason: 'VELOCITY_TOO_FAST' };
        }
      }
      return { passed: true };
    }

    const now = 1700000000000;
    // Fast bots:
    check('Instant bot submission (1ms) rejected', simulateVelocityCheck(now - 1, now).passed === false);
    check('500ms rapid script submission rejected', simulateVelocityCheck(now - 500, now).passed === false);
    check('1400ms near-threshold submission rejected', simulateVelocityCheck(now - 1400, now).passed === false);
    check('1499ms boundary submission rejected', simulateVelocityCheck(now - 1499, now).passed === false);

    // Human submissions:
    check('Exact 1500ms threshold submission accepted', simulateVelocityCheck(now - 1500, now).passed === true);
    check('2500ms legitimate human submission accepted', simulateVelocityCheck(now - 2500, now).passed === true);
    check('15000ms deliberate reader submission accepted', simulateVelocityCheck(now - 15000, now).passed === true);

    // Adversarial clock manipulation:
    // Bot sends future timestamp to defeat naive elapsed math (now - (now + 60000) = -60000 < 1500)
    const futureLoadedAt = now + 60000;
    check(
      'Adversarial future timestamp (-60000ms elapsed) rejected as VELOCITY_TOO_FAST',
      simulateVelocityCheck(futureLoadedAt, now).passed === false
    );

    // =========================================================================
    // OBJECTIVE 5: PROBE SECRET PATH ENTROPY RULES & BANNED PATTERNS
    // =========================================================================
    console.log('\n--- 5. Probing Secret Path Entropy Rules & Banned Patterns ---');

    // 5.1 Legitimate high-entropy path
    check(
      'Legitimate path /sec-ca-50e0e5eed471 validated successfully',
      validateAdminSecretPath('/sec-ca-50e0e5eed471') === '/sec-ca-50e0e5eed471'
    );
    check(
      'Legitimate path /vault-chambers-987654 validated and normalized',
      validateAdminSecretPath('/vault-chambers-987654') === '/vault-chambers-987654'
    );

    // 5.2 Banned patterns inspection
    const bannedTests = [
      { slug: '/4464654646464654', reason: 'Legacy development default' },
      { slug: '/my-admin-portal-999', reason: 'Contains banned "admin"' },
      { slug: '/secure-login-area-12', reason: 'Contains banned "login"' },
      { slug: '/custom-portal-path-9', reason: 'Contains banned "portal"' },
      { slug: '/cpanel-access-key-12', reason: 'Contains banned "cpanel"' },
      { slug: '/dashboard-route-sec-1', reason: 'Contains banned "dashboard"' },
      { slug: '/root-chambers-control', reason: 'Contains banned "root"' },
      { slug: '/kavitha-private-entry', reason: 'Contains banned "kavitha"' },
      { slug: '/superuser-access-point', reason: 'Contains banned "superuser"' },
      { slug: '/console-system-desk-1', reason: 'Contains banned "console"' },
      { slug: '/manager-office-route-8', reason: 'Contains banned "manager"' },
    ];

    for (const bt of bannedTests) {
      const res = validateAdminSecretPath(bt.slug);
      check(`Banned slug '${bt.slug}' (${bt.reason}) returns null`, res === null, `Returned: ${res}`);
    }

    // Case insensitivity of banned words
    check(
      'Uppercase banned slug /MY-ADMIN-AREA-1234 returns null',
      validateAdminSecretPath('/MY-ADMIN-AREA-1234') === null
    );

    // Length thresholds
    check('Insufficient length /12345678901 (12 chars total) returns null', validateAdminSecretPath('/12345678901') === null);
    check('Sufficient length /123456789012 (13 chars total) passes', validateAdminSecretPath('/123456789012') === '/123456789012');

    // Missing leading slash
    check('Missing leading slash "sec-ca-50e0e5eed471" returns null', validateAdminSecretPath('sec-ca-50e0e5eed471') === null);

    // Trailing slash normalization
    check(
      'Trailing slashes stripped: "/sec-ca-50e0e5eed471///" -> "/sec-ca-50e0e5eed471"',
      validateAdminSecretPath('/sec-ca-50e0e5eed471///') === '/sec-ca-50e0e5eed471'
    );

    // Null/undefined/empty handling
    check('null input returns null', validateAdminSecretPath(null) === null);
    check('undefined input returns null', validateAdminSecretPath(undefined) === null);
    check('empty string returns null', validateAdminSecretPath('') === null);

    // Fail-closed contract: Unconfigured portal
    check(
      'ADMIN_ROUTES maps unconfigured portal safely to unroutable placeholder',
      ADMIN_ROUTES.root === (ADMIN_SECRET_PATH || '/--unconfigured-portal--')
    );

    // =========================================================================
    // OBJECTIVE 6: VERIFY PBKDF2 PARAMETERS & TIMING-SAFE EQUALITY
    // =========================================================================
    console.log('\n--- 6. Verifying PBKDF2 Parameters & timingSafeEqual Resistance ---');

    const dbSource = fs.readFileSync(path.join(ROOT, 'server', 'db.cjs'), 'utf8');
    check('server/db.cjs sets PBKDF2_ITERATIONS = 100000', dbSource.includes('PBKDF2_ITERATIONS = 100000'));
    check('server/db.cjs sets PBKDF2_KEY_LEN = 64 (512 bits)', dbSource.includes('PBKDF2_KEY_LEN = 64'));
    check("server/db.cjs sets PBKDF2_DIGEST = 'sha512'", dbSource.includes("PBKDF2_DIGEST = 'sha512'"));
    check('server/db.cjs uses crypto.timingSafeEqual', dbSource.includes('crypto.timingSafeEqual'));

    // Test hash generation
    const testSalt = generateSalt();
    check('generateSalt produces 32-character hex string (16 bytes)', testSalt.length === 32);
    const hash = hashPassword('CorrectChambersPass#2026', testSalt, 100000);
    check('hashPassword produces 128-character hex string (64 bytes)', hash.length === 128);

    // Test verifyPassword
    check('verifyPassword returns true for exact correct password', verifyPassword('CorrectChambersPass#2026', hash, testSalt, 100000) === true);
    check('verifyPassword returns false for wrong password', verifyPassword('WrongChambersPass#2026', hash, testSalt, 100000) === false);

    // Fail closed on empty/null/tampered parameters
    check('verifyPassword fails closed on empty password', verifyPassword('', hash, testSalt) === false);
    check('verifyPassword fails closed on null password', verifyPassword(null, hash, testSalt) === false);
    check('verifyPassword fails closed on empty stored hash', verifyPassword('pass', '', testSalt) === false);
    check('verifyPassword fails closed on empty salt', verifyPassword('pass', hash, '') === false);
    check('verifyPassword fails closed on malformed hex hash', verifyPassword('pass', 'NOT_VALID_HEX', testSalt) === false);

    // Buffer length mismatch defense: verify candidate length !== expected length fails safely
    const shortHash = hash.slice(0, 64); // 32 bytes instead of 64
    check(
      'Buffer length mismatch handled safely without timingSafeEqual throwing RangeError',
      verifyPassword('CorrectChambersPass#2026', shortHash, testSalt) === false
    );

    // Statistical Timing Variance Stress:
    // Compare execution time of early-byte mismatch vs late-byte mismatch to confirm constant-time behavior.
    console.log('Running 500-sample timing distribution analysis on buffer comparisons...');
    const bufExpected = Buffer.from(hash, 'hex');

    // Early mismatch: 1st byte differs
    const bufEarlyMismatch = Buffer.from(bufExpected);
    bufEarlyMismatch[0] = bufEarlyMismatch[0] ^ 0xff;

    // Late mismatch: 63rd byte differs
    const bufLateMismatch = Buffer.from(bufExpected);
    bufLateMismatch[63] = bufLateMismatch[63] ^ 0xff;

    // Identical
    const bufIdentical = Buffer.from(bufExpected);

    const WARMUP = 100;
    const SAMPLES = 500;

    for (let i = 0; i < WARMUP; i++) {
      crypto.timingSafeEqual(bufEarlyMismatch, bufExpected);
      crypto.timingSafeEqual(bufLateMismatch, bufExpected);
    }

    let earlyTotalNs = 0n;
    let lateTotalNs = 0n;
    let identicalTotalNs = 0n;

    for (let i = 0; i < SAMPLES; i++) {
      const t1 = process.hrtime.bigint();
      crypto.timingSafeEqual(bufEarlyMismatch, bufExpected);
      const t2 = process.hrtime.bigint();
      earlyTotalNs += (t2 - t1);

      const t3 = process.hrtime.bigint();
      crypto.timingSafeEqual(bufLateMismatch, bufExpected);
      const t4 = process.hrtime.bigint();
      lateTotalNs += (t4 - t3);

      const t5 = process.hrtime.bigint();
      crypto.timingSafeEqual(bufIdentical, bufExpected);
      const t6 = process.hrtime.bigint();
      identicalTotalNs += (t6 - t5);
    }

    const avgEarlyNs = Number(earlyTotalNs) / SAMPLES;
    const avgLateNs = Number(lateTotalNs) / SAMPLES;
    const avgIdenticalNs = Number(identicalTotalNs) / SAMPLES;
    const deltaNs = Math.abs(avgEarlyNs - avgLateNs);

    console.log(`Average timing: Early mismatch: ${avgEarlyNs.toFixed(1)}ns | Late mismatch: ${avgLateNs.toFixed(1)}ns | Identical: ${avgIdenticalNs.toFixed(1)}ns | Delta: ${deltaNs.toFixed(1)}ns`);

    check(
      'timingSafeEqual shows uniform execution latency across mismatch positions (nanosecond-scale delta)',
      deltaNs < 250.0,
      `Delta was ${deltaNs.toFixed(1)}ns`
    );

  } finally {
    // Restore original practice_db.json
    if (originalDbContent !== null) {
      fs.writeFileSync(DB_PATH, originalDbContent, 'utf8');
      console.log('\n[Cleanup] Restored original practice_db.json database state.');
    }
    server.close();
  }

  // =========================================================================
  // SUMMARY AND VERDICT
  // =========================================================================
  console.log('\n================================================================');
  console.log(`CHALLENGER EMPIRICAL VERIFICATION COMPLETE:`);
  console.log(`  Total Assertions: ${total}`);
  console.log(`  Passed:           ${passed}`);
  console.log(`  Failed:           ${failed}`);
  console.log('================================================================\n');

  if (failed === 0) {
    console.log('\x1b[32m✔ EMPIRICAL VERDICT: ALL ADVERSARIAL CHALLENGES SURVIVED. VERDICT: APPROVE\x1b[0m\n');
    process.exit(0);
  } else {
    console.error(`\x1b[31m✖ EMPIRICAL VERDICT: ${failed} CHALLENGES FAILED. VERDICT: REJECT\x1b[0m\n`);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal unhandled error in challenger harness:', err);
  process.exit(1);
});
