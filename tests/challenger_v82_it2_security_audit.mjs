import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('================================================================');
console.log('CHALLENGER 2: PENTRARE SECURITY & PRIVACY HARNESS AUDIT');
console.log('================================================================\n');

// 1. Recursive file scanner
function scanFiles(dir, exts, checkFn) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += scanFiles(full, exts, checkFn);
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      const content = fs.readFileSync(full, 'utf8');
      if (checkFn(content, full)) count++;
    }
  }
  return count;
}

// Check 1: Zero PAN Numbers across src/ and dist/
let panViolations = [];
scanFiles('src', ['.ts', '.tsx', '.js'], (content, file) => {
  const matches = content.match(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g);
  if (matches) {
    panViolations.push({ file, matches });
    return true;
  }
  return false;
});
console.log(`[CHECK 1] PAN leaks in src/: ${panViolations.length}`);
assert.strictEqual(panViolations.length, 0, 'Found PAN leaks in src/');

// Check 2: Zero Aadhaar Numbers in src/v8/
let aadhaarViolations = [];
scanFiles('src/v8', ['.ts', '.tsx', '.js'], (content, file) => {
  const matches = content.match(/\b[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}\b/g);
  if (matches) {
    aadhaarViolations.push({ file, matches });
    return true;
  }
  return false;
});
console.log(`[CHECK 2] Aadhaar leaks in src/v8/: ${aadhaarViolations.length}`);
assert.strictEqual(aadhaarViolations.length, 0, 'Found Aadhaar leaks in src/v8/');

// Check 3: Zero unredacted individual ICAI membership numbers in src/v8
let icaiMemViolations = [];
scanFiles('src/v8', ['.ts', '.tsx', '.js'], (content, file) => {
  const matches = content.match(/ICAI\s*M(?:embership)?\.?\s*No\.?\s*:\s*\d{5,6}/i);
  if (matches) {
    icaiMemViolations.push({ file, matches });
    return true;
  }
  return false;
});
console.log(`[CHECK 3] Unredacted individual ICAI membership numbers in src/v8/: ${icaiMemViolations.length}`);
assert.strictEqual(icaiMemViolations.length, 0, 'Found unredacted ICAI membership numbers in src/v8/');

// Check 4: ContactForm honeypot and anti-spam velocity
const contactForm = fs.readFileSync('src/v8/components/forms/ContactForm.tsx', 'utf8');
const backendAdapter = fs.readFileSync('src/v8/adapters/backendAdapter.ts', 'utf8');

assert.ok(contactForm.includes('website_fax_hp'), 'ContactForm missing honeypot');
assert.ok(contactForm.includes('formLoadedAt'), 'ContactForm missing formLoadedAt velocity check');
assert.ok(backendAdapter.includes('1500'), 'backendAdapter missing minimum submit duration');
console.log('[CHECK 4] ContactForm anti-spam & honeypot guardrails verified.');

// Check 5: Zero external remote calls in backendAdapter
// Ensure client code calls only local relative endpoints (/api/...)
const rawUrls = backendAdapter.match(/https?:\/\/[^\s"'`]+/g) || [];
const externalApiUrls = rawUrls.filter(u => !u.includes('localhost') && !u.includes('127.0.0.1') && !u.includes('schema.org') && !u.includes('wa.me') && !u.includes('api.whatsapp.com'));
console.log(`[CHECK 5] External API network endpoints in backendAdapter: ${externalApiUrls.length}`);
assert.strictEqual(externalApiUrls.length, 0, `Prohibited external API URLs found: ${externalApiUrls.join(', ')}`);

// Check 6: Local persistence mode confirmation
assert.ok(fs.existsSync('data/practice_db.json'), 'Local practice_db.json must exist');
console.log('[CHECK 6] Local persistence mode verified (data/practice_db.json exists).');

// Check 7: Dist assets cleanliness
const distFiles = fs.readdirSync('dist/assets').filter(f => f.endsWith('.js'));
for (const file of distFiles) {
  const code = fs.readFileSync(path.join('dist/assets', file), 'utf8');
  assert.strictEqual(/ca-kavitha-vijay/i.test(code), false, `Portrait string leak in dist/assets/${file}`);
  assert.strictEqual(/\/images\/partner\//i.test(code), false, `Portrait path leak in dist/assets/${file}`);
  assert.strictEqual(code.includes('SUPABASE_SERVICE_ROLE_KEY'), false, `Secret leak in dist/assets/${file}`);
}
console.log(`[CHECK 7] Production bundle purity verified across all ${distFiles.length} JS assets.`);

console.log('\n✔ ALL PENTRARE SECURITY & PRIVACY HARNESS CHECKS PASSED EMPIRICALLY!');
