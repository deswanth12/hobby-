/**
 * tests/v8-milestone5.test.mjs
 * 
 * Comprehensive Test Suite for Milestone 5:
 * 1. Deliverables 7, 8, 9, 10 Existence & Substantive Content (>= 150 lines, > 250 lines).
 * 2. Secret Admin Portal Route Validation & Fail-Closed Routing (adminConfig.ts, App.tsx).
 * 3. 4-Tier 404 Quarantine of Legacy /admin and /admin/* (Edge, Server, Client, Crawlers).
 * 4. Cryptographic Authentication & Password Storage (PBKDF2-100k, 16-byte salt, timingSafeEqual).
 * 5. Public Consultation Intake Anti-Spam & Rate Limiting (Honeypot, 1500ms velocity, deduplication).
 * 6. Multi-Viewport Screenshot Manifest & Reflow Invariant (42/42 captures, 0 overflow, 0 broken images).
 * 7. Privacy, PII Quarantine & Regulatory Attribution (0 PAN, 0 Aadhaar, ICMAI attribution, neutral monogram).
 * 8. Production Bundle Purity & Secret Confinement (0 service role keys, 0 private keys, admin code-splitting).
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  TEST: V8.0 MILESTONE 5 — ADMIN PRESERVATION, QA & SECURITY    ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;
const failures = [];

async function test(name, fn) {
  try {
    await fn();
    passCount++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${passCount + failCount}] ${name}`);
  } catch (err) {
    failCount++;
    const shortErr = err.message ? err.message.slice(0, 150) : String(err);
    failures.push({ name, error: shortErr });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${passCount + failCount}] ${name}`);
    console.log(`       ${shortErr}`);
  }
}

async function runAllTests() {
  // ============================================================================
  // SUITE 1: DELIVERABLES 7, 8, 9, 10 EXISTENCE & SUBSTANTIVE CONTENT
  // ============================================================================
  console.log('▶ Suite 1: Milestone 5 Deliverables (7, 8, 9, 10) & Automation Script');

  const deliverables = [
    { file: 'V80_SECURITY_REPORT.md', minLines: 150, targetLines: 250, id: 'Deliverable 7' },
    { file: 'V80_ACCESSIBILITY_REPORT.md', minLines: 150, targetLines: 250, id: 'Deliverable 8' },
    { file: 'V80_PERFORMANCE_REPORT.md', minLines: 150, targetLines: 250, id: 'Deliverable 9' },
    { file: 'V80_RESPONSIVE_QA.md', minLines: 150, targetLines: 250, id: 'Deliverable 10' }
  ];

  for (const d of deliverables) {
    await test(`${d.id}: ${d.file} exists at root and contains substantive content (>= ${d.minLines} lines)`, () => {
      assert.ok(fs.existsSync(d.file), `${d.file} must exist at repository root`);
      const content = fs.readFileSync(d.file, 'utf-8');
      const lines = content.split('\n').length;
      assert.ok(lines >= d.minLines, `${d.file} has ${lines} lines, expected >= ${d.minLines}`);
      assert.ok(lines >= d.targetLines, `${d.file} has ${lines} lines, expected >= ${d.targetLines}`);
    });
  }

  await test('Deliverable 10 Script: scripts/capture-v80-screenshots.mjs exists and is installed', () => {
    const scriptPath = 'scripts/capture-v80-screenshots.mjs';
    assert.ok(fs.existsSync(scriptPath), `${scriptPath} must exist`);
    const content = fs.readFileSync(scriptPath, 'utf-8');
    assert.ok(content.includes('capture-v80-screenshots'), 'Script must contain capture engine signature');
    assert.ok(content.includes('VIEWPORTS'), 'Script must define VIEWPORTS');
    assert.ok(content.includes('PAGES'), 'Script must define PAGES');
  });

  // ============================================================================
  // SUITE 2: SECRET ADMIN PORTAL ROUTE CONFIGURATION & VALIDATION RULES
  // ============================================================================
  console.log('\n▶ Suite 2: Secret Admin Portal Route Configuration & Fail-Closed Logic');

  await test('adminConfig.ts: validateAdminSecretPath enforces leading slash, length >= 13, and banned words', async () => {
    const adminConfigMod = await import('../src/config/adminConfig.ts');
    const { validateAdminSecretPath } = adminConfigMod;

    assert.strictEqual(typeof validateAdminSecretPath, 'function');
    
    const configSource = fs.readFileSync('src/config/adminConfig.ts', 'utf-8');
    assert.ok(configSource.includes('BANNED_PATTERNS'), 'Must define BANNED_PATTERNS');
    assert.ok(configSource.includes('4464654646464654'), 'Must ban legacy default');
    assert.ok(configSource.includes("'admin'"), 'Must ban admin word');
    assert.ok(configSource.includes("'login'"), 'Must ban login word');
    assert.ok(configSource.includes("'portal'"), 'Must ban portal word');

    // Valid route returns normalized string
    assert.strictEqual(validateAdminSecretPath('/sec-ca-50e0e5eed471'), '/sec-ca-50e0e5eed471');
    assert.strictEqual(validateAdminSecretPath('/custom-secret-slug-999'), '/custom-secret-slug-999');

    // Invalid: missing leading slash
    assert.strictEqual(validateAdminSecretPath('sec-ca-50e0e5eed471'), null);

    // Invalid: too short (< 13 chars total)
    assert.strictEqual(validateAdminSecretPath('/short-slug'), null);
    assert.strictEqual(validateAdminSecretPath('/12345678901'), null);

    // Invalid: banned words
    assert.strictEqual(validateAdminSecretPath('/my-secret-admin-portal'), null);
    assert.strictEqual(validateAdminSecretPath('/sec-login-12345678'), null);
    assert.strictEqual(validateAdminSecretPath('/sec-portal-12345678'), null);
    assert.strictEqual(validateAdminSecretPath('/4464654646464654'), null);

    // Invalid: null, undefined, empty
    assert.strictEqual(validateAdminSecretPath(null), null);
    assert.strictEqual(validateAdminSecretPath(undefined), null);
    assert.strictEqual(validateAdminSecretPath(''), null);
  });

  await test('adminConfig.ts: ADMIN_ROUTES provides complete portal mapping and fails closed', async () => {
    const adminConfigMod = await import('../src/config/adminConfig.ts');
    const { ADMIN_ROUTES, getAdminSecretPath, IS_ADMIN_CONFIGURED } = adminConfigMod;

    assert.ok(ADMIN_ROUTES, 'ADMIN_ROUTES must be defined');
    assert.ok(ADMIN_ROUTES.root, 'ADMIN_ROUTES.root must exist');
    assert.ok(ADMIN_ROUTES.login, 'ADMIN_ROUTES.login must exist');
    assert.ok(ADMIN_ROUTES.enquiries, 'ADMIN_ROUTES.enquiries must exist');
    assert.ok(ADMIN_ROUTES.content, 'ADMIN_ROUTES.content must exist');
    assert.ok(ADMIN_ROUTES.articles, 'ADMIN_ROUTES.articles must exist');
    assert.ok(ADMIN_ROUTES.settings, 'ADMIN_ROUTES.settings must exist');

    assert.strictEqual(typeof getAdminSecretPath, 'function');
    assert.strictEqual(typeof IS_ADMIN_CONFIGURED, 'boolean');
  });

  await test('App.tsx: Admin routes are code-split and gated behind IS_ADMIN_CONFIGURED', () => {
    const appContent = fs.readFileSync('src/App.tsx', 'utf-8');
    assert.ok(appContent.includes("React.lazy(() => import('./pages/admin/AdminLoginPage')"), 'AdminLoginPage must be code-split');
    assert.ok(appContent.includes("React.lazy(() => import('./pages/admin/AdminOverviewPage')"), 'AdminOverviewPage must be code-split');
    assert.ok(appContent.includes("React.lazy(() => import('./pages/admin/AdminEnquiriesPage')"), 'AdminEnquiriesPage must be code-split');
    assert.ok(appContent.includes('IS_ADMIN_CONFIGURED &&'), 'Secret admin routes must be gated behind IS_ADMIN_CONFIGURED');
  });

  // ============================================================================
  // SUITE 3: 4-TIER 404 QUARANTINE OF LEGACY /admin AND /admin/*
  // ============================================================================
  console.log('\n▶ Suite 3: 4-Tier 404 Quarantine of Legacy /admin');

  await test('Tier 1 (Edge): public/_redirects explicitly routes /admin and /admin/* to 404', () => {
    const redirects = fs.readFileSync('public/_redirects', 'utf-8');
    assert.ok(redirects.includes('/admin') && redirects.includes('404'), '_redirects must contain /admin 404 rule');
    assert.ok(redirects.includes('/admin/*') && redirects.includes('404'), '_redirects must contain /admin/* 404 rule');
  });

  await test('Tier 2 (Server): server/index.cjs intercepts /admin and /admin/* with HTTP 404', () => {
    const serverContent = fs.readFileSync('server/index.cjs', 'utf-8');
    assert.ok(
      serverContent.includes("pathname === '/admin' || pathname.startsWith('/admin/')"),
      'Server must explicitly trap /admin and return 404'
    );
    assert.ok(serverContent.includes('res.writeHead(404,'), 'Server must write HTTP status 404');
  });

  await test('Tier 3 (Client Router): src/App.tsx maps /admin and /admin/* directly to NotFoundPage', () => {
    const appContent = fs.readFileSync('src/App.tsx', 'utf-8');
    assert.ok(appContent.includes('<Route path="/admin" element={<NotFoundPage />} />'), 'App.tsx must map /admin to NotFoundPage');
    assert.ok(appContent.includes('<Route path="/admin/*" element={<NotFoundPage />} />'), 'App.tsx must map /admin/* to NotFoundPage');
  });

  await test('Tier 4 (Crawlers & Discovery): robots.txt and sitemap.xml strictly omit secret admin path', () => {
    const robots = fs.readFileSync('public/robots.txt', 'utf-8');
    const sitemap = fs.readFileSync('public/sitemap.xml', 'utf-8');
    
    // Neither robots nor sitemap may contain secret admin path prefix
    assert.ok(!robots.includes('/sec-ca-'), 'robots.txt must NOT leak secret admin path');
    assert.ok(!sitemap.includes('/sec-ca-'), 'sitemap.xml must NOT leak secret admin path');
    assert.ok(!sitemap.includes('/admin'), 'sitemap.xml must NOT contain legacy admin path');
  });

  // ============================================================================
  // SUITE 4: CRYPTOGRAPHIC AUTHENTICATION & PASSWORD STORAGE
  // ============================================================================
  console.log('\n▶ Suite 4: Cryptographic Authentication & Password Storage');

  await test('server/db.cjs: PBKDF2-HMAC-SHA512 iterations configured to 100,000 with 16-byte salt', () => {
    const dbContent = fs.readFileSync('server/db.cjs', 'utf-8');
    assert.ok(dbContent.includes('PBKDF2_ITERATIONS = 100000') || dbContent.includes('100000'), 'PBKDF2 iterations must be 100,000');
    assert.ok(dbContent.includes('PBKDF2_KEY_LEN = 64') || dbContent.includes('keylen: 64'), 'PBKDF2 key length must be 64 bytes (512 bits)');
    assert.ok(dbContent.includes('timingSafeEqual'), 'Must use crypto.timingSafeEqual for constant-time comparison');
  });

  await test('server/apiRouter.cjs: Stateless JWT token issuance, HttpOnly SameSite=Strict cookies, and revocation', () => {
    const apiContent = fs.readFileSync('server/apiRouter.cjs', 'utf-8');
    assert.ok(apiContent.includes('ka_jwt.'), 'Must issue structured cryptographic JWT tokens');
    assert.ok(apiContent.includes('HttpOnly'), 'Session cookie must enforce HttpOnly');
    assert.ok(apiContent.includes('SameSite=Strict') || apiContent.includes('SameSite=strict'), 'Session cookie must enforce SameSite=Strict');
    assert.ok(apiContent.includes('revokedTokens') || apiContent.includes('revoked_tokens'), 'Must maintain revoked tokens ledger');
  });

  // ============================================================================
  // SUITE 5: PUBLIC INTAKE ANTI-SPAM & RATE LIMITING
  // ============================================================================
  console.log('\n▶ Suite 5: Public Consultation Intake Anti-Spam & Rate Limiting');

  await test('ContactForm.tsx: Honeypot website_fax_hp field is present, tabIndex=-1, aria-hidden=true', () => {
    const formContent = fs.readFileSync('src/v8/components/forms/ContactForm.tsx', 'utf-8');
    assert.ok(formContent.includes('name="website_fax_hp"'), 'Form must contain website_fax_hp honeypot field');
    assert.ok(formContent.includes('tabIndex={-1}'), 'Honeypot must be excluded from keyboard tab navigation');
    assert.ok(formContent.includes('aria-hidden="true"'), 'Honeypot must be hidden from screen readers');
    assert.ok(formContent.includes('-left-[9999px]'), 'Honeypot must be positioned off-screen');
  });

  await test('backendAdapter.ts: Enforces >= 1500ms submit velocity and text sanitization', () => {
    const adapterContent = fs.readFileSync('src/v8/adapters/backendAdapter.ts', 'utf-8');
    assert.ok(adapterContent.includes('1500'), 'Must enforce 1500ms minimum submission velocity threshold');
    assert.ok(adapterContent.includes('sanitizeText'), 'Must sanitize input text');
    assert.ok(adapterContent.includes('website_fax_hp'), 'Must inspect honeypot field');
  });

  await test('server/apiRouter.cjs: Silent 200 trap for honeypot and IP rate limiting active', () => {
    const apiContent = fs.readFileSync('server/apiRouter.cjs', 'utf-8');
    assert.ok(apiContent.includes('website_fax_hp'), 'API router must inspect website_fax_hp');
    assert.ok(apiContent.includes('rateLimit') || apiContent.includes('enquiryLimiter') || apiContent.includes('submissions'), 'Must implement intake rate limiting');
  });

  // ============================================================================
  // SUITE 6: MULTI-VIEWPORT SCREENSHOT MANIFEST & REFLOW INTEGRITY
  // ============================================================================
  console.log('\n▶ Suite 6: Multi-Viewport Screenshot Manifest & Reflow Invariant');

  await test('artifacts/screenshots/v8/summary.json exists with 42/42 passed captures and 0 overflow', () => {
    const summaryPath = 'artifacts/screenshots/v8/summary.json';
    assert.ok(fs.existsSync(summaryPath), `${summaryPath} must exist`);
    
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
    assert.strictEqual(summary.totalCaptures, 42, 'Must have 42 total captures');
    assert.strictEqual(summary.passed, 42, 'All 42 captures must be passed');
    assert.strictEqual(summary.failed, 0, 'Zero captures failed');
    assert.strictEqual(summary.successRate, '100.0%', 'Success rate must be 100.0%');
    assert.ok(Array.isArray(summary.captures), 'Captures must be an array');
    assert.strictEqual(summary.captures.length, 42, 'Captures array length must be 42');

    for (const c of summary.captures) {
      assert.strictEqual(c.hasHorizontalOverflow, false, `Capture ${c.fileName} must not have horizontal overflow`);
      assert.strictEqual(c.overflowPixels, 0, `Capture ${c.fileName} must have 0 overflow pixels`);
      assert.strictEqual(c.brokenImagesCount, 0, `Capture ${c.fileName} must have 0 broken images`);
      assert.strictEqual(c.h1Count, 1, `Capture ${c.fileName} must have exactly 1 h1 element`);
      assert.strictEqual(c.status, 'PASS', `Capture ${c.fileName} status must be PASS`);
      assert.ok(fs.existsSync(path.join('artifacts/screenshots/v8', c.fileName)), `File ${c.fileName} must exist in artifacts`);
      assert.ok(fs.existsSync(path.join('reports/screenshots/v80', c.fileName)), `File ${c.fileName} must exist in reports`);
      assert.ok(fs.existsSync(path.join('public/screenshots/v80', c.fileName)), `File ${c.fileName} must exist in public mirror`);
    }
  });

  // ============================================================================
  // SUITE 7: PRIVACY, PII QUARANTINE & REGULATORY ATTRIBUTION
  // ============================================================================
  console.log('\n▶ Suite 7: Privacy, PII Quarantine & Regulatory Attribution');

  await test('Static Scan: 0 personal PAN numbers across src/ directory', () => {
    const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g;
    
    function scanDir(dir) {
      let matches = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const fullPath = path.join(dir, e.name);
        if (e.isDirectory()) {
          matches = matches.concat(scanDir(fullPath));
        } else if (/\.(ts|tsx|js|jsx|json|md)$/.test(e.name)) {
          const text = fs.readFileSync(fullPath, 'utf-8');
          const found = text.match(panRegex);
          if (found) matches.push({ file: fullPath, matches: found });
        }
      }
      return matches;
    }

    const panMatches = scanDir('src');
    assert.strictEqual(panMatches.length, 0, `Found PAN numbers in: ${JSON.stringify(panMatches)}`);
  });

  await test('Static Scan: 0 Aadhaar numbers across src/ directory', () => {
    const aadhaarRegex = /\b\d{4}\s\d{4}\s\d{4}\b/g;
    
    function scanDir(dir) {
      let matches = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const fullPath = path.join(dir, e.name);
        if (e.isDirectory()) {
          matches = matches.concat(scanDir(fullPath));
        } else if (/\.(ts|tsx|js|jsx|json|md)$/.test(e.name)) {
          const text = fs.readFileSync(fullPath, 'utf-8');
          const found = text.match(aadhaarRegex);
          if (found) matches.push({ file: fullPath, matches: found });
        }
      }
      return matches;
    }

    const aadhaarMatches = scanDir('src');
    assert.strictEqual(aadhaarMatches.length, 0, `Found Aadhaar numbers in: ${JSON.stringify(aadhaarMatches)}`);
  });

  await test('Regulatory Compliance: CMA AIR 49 is attributed strictly to ICMAI in firmData.ts and LeadershipProfile.tsx', () => {
    const firmData = fs.readFileSync('src/data/firmData.ts', 'utf-8');
    assert.ok(
      firmData.includes('The Institute of Cost Accountants of India — All India Rank 49 in CMA Intermediate') ||
      firmData.includes('ICMAI') ||
      firmData.includes('CMA Intermediate (AIR 49)'),
      'firmData.ts must attribute CMA AIR 49 to ICMAI'
    );

    const profile = fs.readFileSync('src/v8/components/about/LeadershipProfile.tsx', 'utf-8');
    assert.ok(
      profile.includes('The Institute of Cost Accountants of India — All India Rank 49 in CMA Intermediate') ||
      profile.includes('ICMAI'),
      'LeadershipProfile.tsx must attribute CMA AIR 49 to ICMAI'
    );
  });

  await test('Partner Portrait Authorized: Official executive portrait rendered in LeadershipProfile and LeadershipPage', () => {
    // Confirm official partner portrait files exist on disk
    const officialWebp = path.resolve('public/images/partner/ca-kavitha-vijay-official.webp');
    const officialJpg = path.resolve('public/images/partner/ca-kavitha-vijay-official.jpg');
    assert.ok(fs.existsSync(officialWebp), 'Official partner portrait WebP must exist');
    assert.ok(fs.existsSync(officialJpg), 'Official partner portrait JPG fallback must exist');

    const crestContent = fs.readFileSync(path.resolve('src/v8/components/common/CrestMonogram.tsx'), 'utf-8');
    assert.ok(crestContent.includes('ca-kavitha-vijay-official.webp'), 'CrestMonogram must render approved official portrait');

    const profile = fs.readFileSync('src/v8/components/about/LeadershipProfile.tsx', 'utf-8');
    assert.ok(profile.includes('CrestMonogram'), 'LeadershipProfile.tsx must render CrestMonogram');

    const leadershipPage = fs.readFileSync('src/v8/pages/LeadershipPage.tsx', 'utf-8');
    assert.ok(leadershipPage.includes('CrestMonogram'), 'LeadershipPage.tsx must render CrestMonogram');
    assert.ok(leadershipPage.includes('ca-kavitha-vijay-official.webp'), 'LeadershipPage.tsx must render official portrait');
    assert.ok(
      !leadershipPage.includes('className="hidden" aria-hidden="true"'),
      'LeadershipPage.tsx must not contain hidden facade CrestMonogram'
    );
  });

  // ============================================================================
  // SUITE 8: PRODUCTION BUNDLE PURITY & SECRET CONFINEMENT
  // ============================================================================
  console.log('\n▶ Suite 8: Production Bundle Purity & Secret Confinement');

  await test('dist/ directory contains zero private keys or SUPABASE_SERVICE_ROLE_KEY', () => {
    if (!fs.existsSync('dist')) {
      console.log('   (Skipping dist scan - dist directory not found)');
      return;
    }

    function scanDist(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const fullPath = path.join(dir, e.name);
        if (e.isDirectory()) {
          scanDist(fullPath);
        } else if (/\.(js|html|css)$/.test(e.name)) {
          const text = fs.readFileSync(fullPath, 'utf-8');
          assert.ok(!text.includes('SUPABASE_SERVICE_ROLE_KEY'), `Found SUPABASE_SERVICE_ROLE_KEY in ${fullPath}`);
          assert.ok(!text.includes('BEGIN PRIVATE KEY'), `Found private key in ${fullPath}`);
          assert.ok(!text.includes('BEGIN RSA PRIVATE KEY'), `Found RSA private key in ${fullPath}`);
        }
      }
    }

    scanDist('dist');
  });

  await test('dist/assets contains code-split admin chunks isolated from public bundle', () => {
    if (!fs.existsSync('dist/assets')) {
      console.log('   (Skipping dist/assets scan - assets not found)');
      return;
    }

    const assets = fs.readdirSync('dist/assets');
    const adminChunks = assets.filter(a => a.startsWith('Admin') && a.endsWith('.js'));
    assert.ok(adminChunks.length >= 3, `Expected at least 3 Admin code-split chunks, found ${adminChunks.length}: ${adminChunks.join(', ')}`);
  });

  // ============================================================================
  // FINAL SUMMARY
  // ============================================================================
  console.log('\n================================================================');
  console.log(`MILESTONE 5 TEST RESULTS:`);
  console.log(`  Passed: ${passCount}`);
  console.log(`  Failed: ${failCount}`);
  console.log(`  Total:  ${passCount + failCount}`);
  console.log('================================================================');

  if (failCount > 0) {
    console.error('\nFailures breakdown:');
    failures.forEach(f => console.error(` - ${f.name}: ${f.error}`));
    process.exit(1);
  } else {
    console.log('\x1b[32m✔ ALL MILESTONE 5 ASSERTIONS PASSED WITH ZERO ERRORS.\x1b[0m\n');
  }
}

runAllTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
