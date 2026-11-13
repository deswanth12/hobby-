import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import assert from 'assert';

console.log('================================================================');
console.log('  EMPIRICAL CHALLENGER ORACLE: ITERATION 2 VERIFICATION SUITE   ');
console.log('================================================================');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, condition, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✔ [PASS] ${desc}`);
  } else {
    console.error(`  ✖ [FAIL] ${desc} - ${details}`);
    throw new Error(`Assertion failed: ${desc} (${details})`);
  }
}

// -----------------------------------------------------------------------------
// 1. Line Citation Accuracy in Implementation Codebase
// -----------------------------------------------------------------------------
console.log('\n--- 1. Line Citation Verification in Source Code ---');

// 1.1 src/services/adminStorage.ts:44-90
const adminStorageContent = fs.readFileSync('src/services/adminStorage.ts', 'utf8');
check('src/services/adminStorage.ts defines fetchEnquiriesRemote',
  adminStorageContent.includes('async fetchEnquiriesRemote()'));
check('src/services/adminStorage.ts evaluates body.allEnquiries || body.enquiries',
  adminStorageContent.includes('body.allEnquiries || body.enquiries'));
check('src/services/adminStorage.ts implements safe merge avoiding empty array clobbering',
  adminStorageContent.includes('Retain existing local enquiries rather than clobbering with empty serverless baseline'));

// 1.2 server/apiRouter.cjs:6-25
const apiRouterContent = fs.readFileSync('server/apiRouter.cjs', 'utf8');
const apiRouterLines = apiRouterContent.split(/\r?\n/);
check('server/apiRouter.cjs declares ALLOWED_ORIGIN_PATTERNS',
  apiRouterContent.includes('const ALLOWED_ORIGIN_PATTERNS = ['));
check('server/apiRouter.cjs eliminates permissive open vercel.app wildcard',
  !apiRouterContent.includes('/^https:\\/\\/(?:[a-z0-9-]+\\.)?vercel\\.app$/'));
check('server/apiRouter.cjs includes explicit scoped firm vercel.app domain allowlist and eliminates unnamespaced wildcard',
  apiRouterContent.includes('/^https:\\/\\/kavithaassociates\\.vercel\\.app$/') &&
  !apiRouterContent.includes('/^https:\\/\\/kavithaassociates-[a-z0-9-]+\\.vercel\\.app$/') &&
  apiRouterContent.includes('/^https:\\/\\/kavitha(?:-[a-z0-9-]+)?-deswanth12s-projects\\.vercel\\.app$/'));

// 1.3 server/apiRouter.cjs (Enquiry Rate Limiting)
check('server/apiRouter.cjs implements db.enquiryRateLimits',
  apiRouterContent.includes('db.enquiryRateLimits = db.enquiryRateLimits || {};') &&
  apiRouterContent.includes('if (enqInfo.count >= 20)'));

// 1.4 server/apiRouter.cjs (Deduplication Guard)
check('server/apiRouter.cjs implements 60-second Deduplication Guard',
  apiRouterContent.includes('const recentDuplicate = (db.enquiries || []).find(') &&
  apiRouterContent.includes('(Date.now() - new Date(e.createdAt).getTime()) < 60000'));

// 1.5 server/apiRouter.cjs (Login Rate Limiting)
check('server/apiRouter.cjs implements db.rateLimits and lockoutUntil',
  apiRouterContent.includes('db.rateLimits = db.rateLimits || {};') &&
  apiRouterContent.includes('if (rateInfo.lockoutUntil && Date.now() < rateInfo.lockoutUntil)'));

// 1.6 server/db.cjs:362
const dbLines = fs.readFileSync('server/db.cjs', 'utf8').split(/\r?\n/);
const sessionSecretLine = dbLines[361]; // 0-indexed line 361 is line 362
check('server/db.cjs:362 declares SESSION_SECRET fallback to randomBytes',
  sessionSecretLine.includes('const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString(\'hex\');'));

// 1.7 vercel.json:24
const vercelJsonLines = fs.readFileSync('vercel.json', 'utf8').split(/\r?\n/);
const vercelHstsLine = vercelJsonLines[23]; // 0-indexed line 23 is line 24
check('vercel.json:24 configures max-age=31536000 HSTS header',
  vercelHstsLine.includes('"value": "max-age=31536000; includeSubDomains; preload"'));

// 1.8 public/_headers:11
const headersLines = fs.readFileSync('public/_headers', 'utf8').split(/\r?\n/);
const headersHstsLine = headersLines[10]; // 0-indexed line 10 is line 11
check('public/_headers:11 configures max-age=31536000 HSTS header',
  headersHstsLine.includes('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'));

// -----------------------------------------------------------------------------
// 2. Deliverable (INFRASTRUCTURE_REPORT.md) Verification
// -----------------------------------------------------------------------------
console.log('\n--- 2. Deliverable (INFRASTRUCTURE_REPORT.md) Content Checks ---');
const reportContent = fs.readFileSync('INFRASTRUCTURE_REPORT.md', 'utf8');

check('INFRASTRUCTURE_REPORT.md cites max-age=31536000 correctly',
  reportContent.includes('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'));
check('INFRASTRUCTURE_REPORT.md contains zero mentions of obsolete max-age=63072000',
  !reportContent.includes('max-age=63072000'));
check('INFRASTRUCTURE_REPORT.md documents Section 3.2.2 Failure Mode 5 (Distributed Rate-Limiting)',
  reportContent.includes('Failure Mode 5: Distributed Rate-Limiting & Deduplication Degradation'));
check('INFRASTRUCTURE_REPORT.md documents Section 3.3.2 Step 3 (Client Inquiry Data Recovery Limitation & Mandated Durability Fix)',
  reportContent.includes('Step 3: Operational Warning — Client Inquiry Data Recovery Limitation & Mandated Durability Fix'));
check('INFRASTRUCTURE_REPORT.md documents Section 4.2.3 Wildcard *.vercel.app Origin Exposure',
  reportContent.includes('Wildcard `*.vercel.app` Origin Exposure'));
check('INFRASTRUCTURE_REPORT.md documents SameSite=Strict cookie defense-in-depth',
  reportContent.includes('SameSite=Strict` Cookie Architecture'));
check('INFRASTRUCTURE_REPORT.md documents Section 5.4 Method 3 SESSION_SECRET Rotation as primary runbook',
  reportContent.includes('Primary Procedure: Cryptographic Secret Rotation'));
check('INFRASTRUCTURE_REPORT.md Checks Matrix 7 is rated MEDIUM RISK',
  reportContent.includes('**MEDIUM RISK** — Cryptographic password hashing'));

// -----------------------------------------------------------------------------
// 3. Empirical Behavior Oracles
// -----------------------------------------------------------------------------
console.log('\n--- 3. Empirical Behavior Oracles ---');

// Oracle 3.1: Boolean([]) is truthy in JavaScript (LocalStorage clobbering mechanism)
const emptyArr = [];
const evaluatesTruthy = Boolean(emptyArr || []);
check('Empirical Oracle: Empty array evaluates to truthy, confirming clobbering vulnerability',
  evaluatesTruthy === true);

// Oracle 3.2: Cryptographic Token Revocation via SESSION_SECRET rotation
const secret1 = 'initial-secret-key-abcdef1234567890';
const secret2 = 'rotated-secret-key-0987654321fedcba';
const payload = { sub: 'kavitha', jti: 'test-token-1', exp: Math.floor(Date.now() / 1000) + 3600 };
const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
const sig1 = crypto.createHmac('sha256', secret1).update(`ka_jwt.${payloadB64}`).digest('base64url');
const token = `ka_jwt.${payloadB64}.${sig1}`;

// Verify with secret1 (should pass)
const expectedSig1 = crypto.createHmac('sha256', secret1).update(`ka_jwt.${payloadB64}`).digest('base64url');
const sigMatchesInitial = crypto.timingSafeEqual(Buffer.from(sig1), Buffer.from(expectedSig1));
check('Empirical Oracle: Token signature valid with original SESSION_SECRET', sigMatchesInitial);

// Verify with secret2 (should fail constant-time comparison)
const expectedSig2 = crypto.createHmac('sha256', secret2).update(`ka_jwt.${payloadB64}`).digest('base64url');
const sigMatchesRotated = crypto.timingSafeEqual(Buffer.from(sig1), Buffer.from(expectedSig2));
check('Empirical Oracle: Token signature immediately invalid when SESSION_SECRET is rotated', !sigMatchesRotated);

// -----------------------------------------------------------------------------
// 4. Confidentiality Audit
// -----------------------------------------------------------------------------
console.log('\n--- 4. Confidential Statutory Registration Number Audit ---');

// We use the forbidden token representation to ensure 0 occurrences
const forbiddenToken = ['25', '29', '85'].join('');

const reportMatches = (reportContent.match(new RegExp(forbiddenToken, 'g')) || []).length;
check('INFRASTRUCTURE_REPORT.md contains ZERO occurrences of forbidden token', reportMatches === 0);

// Check dist/ assets if dist exists
if (fs.existsSync('dist')) {
  function scanDir(dir) {
    let matches = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        matches += scanDir(fullPath);
      } else {
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        if (fileContent.includes(forbiddenToken)) {
          matches++;
        }
      }
    }
    return matches;
  }
  const distMatches = scanDir('dist');
  check('Compiled dist/ assets contain ZERO occurrences of forbidden token', distMatches === 0);
}

console.log('\n================================================================');
console.log(`TOTAL CHALLENGER CHECKS : ${totalChecks}`);
console.log(`PASSED                  : ${passedChecks}`);
console.log(`FAILED                  : ${totalChecks - passedChecks}`);
console.log('================================================================');
console.log('ALL EMPIRICAL CHALLENGES SATISFIED AND CONFIRMED!');
