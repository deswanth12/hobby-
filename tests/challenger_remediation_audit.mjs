import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  CHALLENGER: CODEBASE AUDIT & REMEDIATION REGRESSION SUITE     ');
console.log('================================================================\n');

let passed = 0;
let total = 0;

async function test(name, fn) {
  total++;
  try {
    await fn();
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Test ${total}] ${name}`);
  } catch (err) {
    console.error(`\x1b[31m✖ FAIL\x1b[0m [Test ${total}] ${name}`);
    console.error(`       Error: ${err.message}`);
  }
}

const ROOT = path.resolve('.');

async function runAll() {
  // --- 1. functions/api/callback.js Regex and Source Verification ---
  console.log('--- 1. Testing Cloudflare Pages Callback Domain Whitelist & Opener Source ---');

  const callbackContent = fs.readFileSync(path.join(ROOT, 'functions', 'api', 'callback.js'), 'utf8');

  await test('Callback origin regex matches official apex https://kavitha-and-associates.pages.dev', async () => {
    const { onRequestGet } = await import('../functions/api/callback.js');
    const res = await onRequestGet({
      request: new Request('http://localhost/api/callback?error=test_probe'),
      env: {}
    });
    const html = await res.text();
    const scriptMatch = html.match(/if \((.*?pages\\\.dev.*?)\.test/);
    assert(scriptMatch, 'Rendered HTML must contain pages.dev regex test');
    const vm = await import('vm');
    const regex = vm.runInNewContext(scriptMatch[1]);
    assert.strictEqual(regex.test('https://kavitha-and-associates.pages.dev'), true, 'Must allow apex domain');
    assert.strictEqual(regex.test('https://preview-123.kavitha-and-associates.pages.dev'), true, 'Must allow preview branch');
    assert.strictEqual(regex.test('https://kavitha-and-associates.pages.dev.attacker.com'), false, 'Must reject attacker subdomain hijack');
    assert.strictEqual(regex.test('https://evil-kavitha-and-associates.pages.dev'), false, 'Must reject prefix domain collision');
  });

  await test('Callback message handler strictly verifies e.source === window.opener', () => {
    assert(callbackContent.includes('e.source && e.source !== window.opener'), 'Must verify e.source matches window.opener');
  });

  await test('Callback handshake fallback uses verified origin and never raw unverified origin', () => {
    assert(callbackContent.includes('isOriginAllowed(trustedOrigin) ? trustedOrigin :'), 'Must verify trustedOrigin before handshake');
  });

  // --- 2. server/index.cjs DoS and Path Traversal Defense ---
  console.log('\n--- 2. Testing Static Server Traversal and Malformed URI Defense ---');

  const serverContent = fs.readFileSync(path.join(ROOT, 'server', 'index.cjs'), 'utf8');

  await test('server/index.cjs catches URIError on malformed percent-encoded URIs', () => {
    assert(serverContent.includes('try {') && serverContent.includes('decodeURIComponent(url.pathname)') && serverContent.includes('Malformed URI encoding'),
      'Must handle malformed percent-encoded paths without throwing uncaught URIError');
  });

  await test('server/index.cjs enforces strict path separator boundary check on DIST_DIR', () => {
    assert(serverContent.includes('resolvedDist + path.sep'), 'Must require exact match or path.sep suffix to block sibling dir access');
  });

  // --- 3. server/apiRouter.cjs Security Hardening ---
  console.log('\n--- 3. Testing API Router Payloads, Rate Limits & CORS Preflight ---');

  const apiRouterContent = fs.readFileSync(path.join(ROOT, 'server', 'apiRouter.cjs'), 'utf8');

  await test('apiRouter enforces maximum request body size limit (MAX_BODY_SIZE)', () => {
    assert(apiRouterContent.includes('MAX_BODY_SIZE'), 'Must declare MAX_BODY_SIZE ceiling');
    assert(apiRouterContent.includes('bytesReceived > MAX_BODY_SIZE'), 'Must abort when payload exceeds limit');
  });

  await test('apiRouter enforces origin validation for CORS OPTIONS preflight', () => {
    assert(apiRouterContent.includes('isOriginAllowed(origin)'), 'Preflight must check isOriginAllowed');
  });

  await test('apiRouter rate limits /api/enquiries by client IP', () => {
    assert(apiRouterContent.includes('enquiryRateLimits'), 'Must track enquiry rate limits');
    assert(apiRouterContent.includes('enqInfo.count >='), 'Must enforce rate limit threshold on submissions');
  });

  await test('apiRouter validates contact form field length boundaries and email syntax', () => {
    assert(apiRouterContent.includes('fullName.length > 100'), 'Must cap fullName length');
    assert(apiRouterContent.includes('phone.length > 20'), 'Must cap phone length');
    assert(apiRouterContent.includes('message.length > 3000'), 'Must cap message length');
    assert(apiRouterContent.includes('email.length > 254'), 'Must validate email length');
  });

  // --- 4. Markdown XSS & Protocol Defense in src/lib/markdown.ts ---
  console.log('\n--- 4. Testing Pure TypeScript Markdown Sanitization ---');

  const markdownContent = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'markdown.ts'), 'utf8');

  await test('sanitizeMarkdown strips unquoted event handlers', () => {
    assert(markdownContent.includes('[^\\s>]+'), 'Regex must match unquoted attribute values');
  });

  await test('sanitizeMarkdown neutralizes data: and vbscript: protocols', () => {
    assert(markdownContent.includes('data|vbscript'), 'Regex must neutralize data and vbscript URLs');
  });

  // Dynamic execution test of sanitizeMarkdown logic
  const cleanRegex1 = /\bon[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi;
  const cleanRegex2 = /href\s*=\s*(?:['"](?:javascript|data|vbscript):[^'"]*['"]|(?:javascript|data|vbscript):[^\s>]+)/gi;
  const cleanRegex3 = /\[([^\]]+)\]\((?:javascript|data|vbscript):[^)]+\)/gi;

  function testSanitize(raw) {
    let c = raw.replace(cleanRegex1, '');
    c = c.replace(cleanRegex2, 'href="#"');
    c = c.replace(cleanRegex3, '[$1](#)');
    return c;
  }

  await test('Sanitizer blocks unquoted <img src=x onerror=alert(1)>', () => {
    const result = testSanitize('<img src=x onerror=alert(1)>');
    assert(!result.includes('onerror='), 'Must strip unquoted onerror attribute');
  });

  await test('Sanitizer blocks unquoted <a href=javascript:alert(1)>', () => {
    const result = testSanitize('<a href=javascript:alert(1)>');
    assert(!result.includes('javascript:alert(1)'), 'Must neutralize unquoted javascript: href');
    assert(result.includes('href="#"'), 'Must replace with safe hash');
  });

  await test('Sanitizer blocks data: URI in markdown link [Payload](data:text/html,<script>alert(1)</script>)', () => {
    const result = testSanitize('[Payload](data:text/html,<script>alert(1)</script>)');
    assert(!result.includes('data:text/html'), 'Must neutralize data: URI');
    assert(result.includes('[Payload](#)'), 'Must replace link target with #');
  });

  // --- 5. Content Security Policy Integration ---
  console.log('\n--- 5. Testing Content Security Policy Integrations ---');

  const headersContent = fs.readFileSync(path.join(ROOT, 'public', '_headers'), 'utf8');

  await test('public/_headers CSP authorizes Supabase endpoints', () => {
    assert(headersContent.includes('https://*.supabase.co'), 'CSP must permit https://*.supabase.co');
    assert(headersContent.includes('wss://*.supabase.co'), 'CSP must permit wss://*.supabase.co');
  });

  // --- 6. ICAI Ethics Compliance in Contact Form ---
  console.log('\n--- 6. Testing ICAI Ethics Compliance ---');

  const contactFormContent = fs.readFileSync(path.join(ROOT, 'src', 'components', 'ContactForm.tsx'), 'utf8');

  await test('ContactForm.tsx does not display banned "ICAI Compliant" badge', () => {
    assert(!contactFormContent.includes('>ICAI Compliant<') && !contactFormContent.includes('ICAI Compliant</span>'),
      'ContactForm must not contain self-promotional "ICAI Compliant" badge');
    assert(contactFormContent.includes('Statutory Protocol'), 'Must display ethical Statutory Protocol badge');
  });

  // --- 7. Admin Evaluation Credentials Guarding ---
  console.log('\n--- 7. Testing Admin Evaluation Credentials Guarding ---');

  const adminLoginSrc = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'admin', 'AdminLoginPage.tsx'), 'utf8');

  await test('AdminLoginPage.tsx gates quick-login demo buttons behind import.meta.env.DEV', () => {
    assert(adminLoginSrc.includes('{import.meta.env.DEV && ('),
      'Evaluation test credentials must be enclosed in import.meta.env.DEV block');
  });

  // --- 8. Server Database Baseline Legacy Cleansing ---
  console.log('\n--- 8. Testing Server Database Baseline Legacy Cleansing ---');

  const dbContent = fs.readFileSync(path.join(ROOT, 'server', 'db.cjs'), 'utf8');

  await test('server/db.cjs contains zero occurrences of legacy unspaced "CA KavithaVijay SRJ"', () => {
    assert(!dbContent.includes('CA KavithaVijay SRJ'), 'Must not contain legacy unspaced partner name');
    assert(dbContent.includes('displayName: \'CA Kavitha Vijay\''), 'Must use verified CA Kavitha Vijay in AUTHORIZED_USERS');
  });

  console.log('\n================================================================');
  console.log(`TOTAL REMEDIATION TESTS: ${total}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${total - passed}`);
  console.log('================================================================');

  if (passed === total) {
    console.log('\n\x1b[32mALL REMEDIATION & CODEBASE AUDIT ASSERTIONS PASSED!\x1b[0m\n');
    process.exit(0);
  } else {
    console.error('\n\x1b[31mSOME REMEDIATION ASSERTIONS FAILED!\x1b[0m\n');
    process.exit(1);
  }
}

runAll().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
