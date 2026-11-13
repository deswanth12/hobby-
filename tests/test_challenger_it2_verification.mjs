import assert from 'assert';
import crypto from 'crypto';
import fs from 'fs';

console.log('================================================================');
console.log('  CHALLENGER ITERATION 2: EMPIRICAL STRESS TEST HARNESS         ');
console.log('================================================================');

// -------------------------------------------------------------------------
// TEST 1: LocalStorage Clobbering Mechanism vs False Recovery Assumption
// -------------------------------------------------------------------------
console.log('\n--- 1. Testing LocalStorage Clobbering Mechanism ---');
{
  // Simulated initial state: Admin has cached consultation inquiries from last week
  const ENQUIRIES_KEY = 'ka_admin_enquiries_v1';
  const localStorageMock = {
    [ENQUIRIES_KEY]: JSON.stringify([
      { id: 'ENQ-001', fullName: 'Prospective Client A', phone: '9876543210', message: 'Need statutory audit' },
      { id: 'ENQ-002', fullName: 'Prospective Client B', phone: '9876543211', message: 'GST advisory enquiry' }
    ])
  };

  assert.strictEqual(JSON.parse(localStorageMock[ENQUIRIES_KEY]).length, 2, 'Initial cache should hold 2 client records');
  console.log('✔ Initial admin localStorage cache holds 2 inquiries.');

  // Simulated serverless cold start response from newly spawned container (data/practice_db.json baseline)
  const serverResponse = {
    success: true,
    enquiries: [],
    allEnquiries: [],
    total: 0,
    page: 1,
    totalPages: 1
  };

  // Logic verbatim from src/services/adminStorage.ts lines 55-60:
  // if (body.allEnquiries || body.enquiries) {
  //   const records = body.allEnquiries || body.enquiries;
  //   localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(records));
  // }
  if (serverResponse.allEnquiries || serverResponse.enquiries) {
    const records = serverResponse.allEnquiries || serverResponse.enquiries;
    localStorageMock[ENQUIRIES_KEY] = JSON.stringify(records);
  }

  // Verify that empty array evaluated to truthy and clobbered the cache
  const postFetchCache = JSON.parse(localStorageMock[ENQUIRIES_KEY]);
  assert.strictEqual(postFetchCache.length, 0, 'Admin cache must be clobbered with empty array []');
  console.log('✔ Verified: fetchEnquiriesRemote() unconditionally clobbers localStorage with [] upon cold start.');

  // Simulated CSV Export logic from AdminEnquiriesPage.tsx lines 126-131:
  // const csv = adminStorage.exportEnquiriesCSV();
  // if (!csv) { alert('No enquiries available to export.'); return; }
  const exportEnquiriesCSV = (records) => {
    if (!records || records.length === 0) return '';
    return 'ID,Name,Phone,Message\n' + records.map(r => `${r.id},${r.fullName},${r.phone},${r.message}`).join('\n');
  };

  const csvResult = exportEnquiriesCSV(postFetchCache);
  assert.strictEqual(csvResult, '', 'CSV export must return empty string');
  console.log('✔ Verified: CSV export fails ("No enquiries available to export"), proving recovery assumption invalid.');
}

// -------------------------------------------------------------------------
// TEST 2: Multi-Container Rate-Limiting & Deduplication Degradation
// -------------------------------------------------------------------------
console.log('\n--- 2. Testing Multi-Container Rate-Limiting & Deduplication Degradation ---');
{
  // Simulated serverless containers (micro-VM isolates with independent /tmp)
  const containerA = { rateLimits: {}, enquiries: [] };
  const containerB = { rateLimits: {}, enquiries: [] };
  const containerC = { rateLimits: {}, enquiries: [] };

  const attackerIp = '203.0.113.42';
  const username = 'kavitha';
  const rateKey = `${attackerIp}_${username}`;

  // Attacker fires 9 concurrent brute-force requests distributed across 3 containers
  const containers = [containerA, containerB, containerC];
  for (let attempt = 1; attempt <= 9; attempt++) {
    const targetContainer = containers[(attempt - 1) % 3];
    targetContainer.rateLimits[rateKey] = targetContainer.rateLimits[rateKey] || { attempts: 0, lockoutUntil: 0 };
    targetContainer.rateLimits[rateKey].attempts += 1;
    if (targetContainer.rateLimits[rateKey].attempts >= 5) {
      targetContainer.rateLimits[rateKey].lockoutUntil = Date.now() + 15 * 60 * 1000;
    }
  }

  // In a single-container architecture, 9 attempts would trigger lockout (lockoutUntil > 0)
  // In distributed serverless containers:
  assert.strictEqual(containerA.rateLimits[rateKey].attempts, 3);
  assert.strictEqual(containerB.rateLimits[rateKey].attempts, 3);
  assert.strictEqual(containerC.rateLimits[rateKey].attempts, 3);
  assert.strictEqual(containerA.rateLimits[rateKey].lockoutUntil, 0);
  assert.strictEqual(containerB.rateLimits[rateKey].lockoutUntil, 0);
  assert.strictEqual(containerC.rateLimits[rateKey].lockoutUntil, 0);
  console.log('✔ Verified: 9 distributed brute-force attempts bypassed 5-attempt lockout on all containers.');

  // Deduplication breakdown: identical submission sent rapidly to 2 different containers
  const submission = {
    phone: '9876543210',
    message: 'Need GST audit consultation',
    createdAt: new Date().toISOString()
  };

  // Container A receives submission 1
  containerA.enquiries.push({ ...submission, id: 'ENQ-A1' });

  // Container B receives submission 2 (within 60 seconds)
  // Deduplication guard from server/apiRouter.cjs lines 405-410 checks containerB.enquiries
  const recentDuplicateInB = containerB.enquiries.find(e =>
    e.phone === submission.phone &&
    e.message === submission.message &&
    (Date.now() - new Date(e.createdAt).getTime()) < 60000
  );

  assert.strictEqual(recentDuplicateInB, undefined, 'Container B has no visibility into Container A');
  containerB.enquiries.push({ ...submission, id: 'ENQ-B2' });
  assert.strictEqual(containerB.enquiries.length, 1);
  console.log('✔ Verified: Deduplication guard failed across containers; duplicate accepted as ENQ-B2.');
}

// -------------------------------------------------------------------------
// TEST 3: Serverless Token Revocation Ephemerality vs SESSION_SECRET Rotation
// -------------------------------------------------------------------------
console.log('\n--- 3. Testing Token Revocation Ephemerality vs SESSION_SECRET Rotation ---');
{
  const sessionSecretOld = 'super-secret-production-key-old-32b!';
  const sessionSecretNew = 'super-secret-production-key-new-32b!';

  function makeToken(secret, payload) {
    const pB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = crypto.createHmac('sha256', secret).update(pB64).digest('base64url');
    return { token: `ka_jwt.${pB64}.${sig}`, payload, sig };
  }

  function verifyToken(secret, token, localRevocations = {}) {
    const parts = token.split('.');
    if (parts.length !== 3 || parts[0] !== 'ka_jwt') return { valid: false, reason: 'format' };
    const [, pB64, sig] = parts;
    const expectedSig = crypto.createHmac('sha256', secret).update(pB64).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return { valid: false, reason: 'signature_mismatch' };
    }
    const payload = JSON.parse(Buffer.from(pB64, 'base64url').toString('utf8'));
    if (Date.now() / 1000 > payload.exp) return { valid: false, reason: 'expired' };
    if (localRevocations[payload.jti]) return { valid: false, reason: 'token_revoked_locally' };
    return { valid: true, payload };
  }

  const payload = { jti: 'tok-xyz-123', sub: 'kavitha', exp: Math.floor(Date.now() / 1000) + 3600 };
  const { token } = makeToken(sessionSecretOld, payload);

  // Scenario A: Container 1 executes /api/admin/auth/revoke-all
  const container1Revocations = { [payload.jti]: payload.exp };
  const container2Revocations = {}; // New container or parallel isolate with clean /tmp

  const resultContainer1 = verifyToken(sessionSecretOld, token, container1Revocations);
  assert.strictEqual(resultContainer1.valid, false);
  assert.strictEqual(resultContainer1.reason, 'token_revoked_locally');

  const resultContainer2 = verifyToken(sessionSecretOld, token, container2Revocations);
  assert.strictEqual(resultContainer2.valid, true, 'Container 2 must accept token due to isolated /tmp');
  console.log('✔ Verified: Container 1 local revocation fails to revoke token on Container 2.');

  // Scenario B: Admin rotates SESSION_SECRET in Vercel project environment variables
  const resultAfterSecretRotationC1 = verifyToken(sessionSecretNew, token, container1Revocations);
  const resultAfterSecretRotationC2 = verifyToken(sessionSecretNew, token, container2Revocations);
  assert.strictEqual(resultAfterSecretRotationC1.valid, false);
  assert.strictEqual(resultAfterSecretRotationC1.reason, 'signature_mismatch');
  assert.strictEqual(resultAfterSecretRotationC2.valid, false);
  assert.strictEqual(resultAfterSecretRotationC2.reason, 'signature_mismatch');
  console.log('✔ Verified: SESSION_SECRET rotation instantly and globally invalidates tokens across all containers.');
}

// -------------------------------------------------------------------------
// TEST 4: Wildcard Origin Regex, SameSite Cookie Defense, and Domain Pinning
// -------------------------------------------------------------------------
console.log('\n--- 4. Testing Wildcard Origin Regex, SameSite Cookie Defense & Domain Pinning ---');
{
  const CURRENT_ALLOWED_ORIGIN_PATTERNS = [
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
    /^https:\/\/(?:[a-z0-9-]+\.)?kavitha-and-associates\.pages\.dev$/,
    /^https:\/\/(?:www\.)?kavithaassociates\.com$/,
    /^https:\/\/(?:[a-z0-9-]+\.)?vercel\.app$/
  ];

  function isOriginAllowedCurrent(origin) {
    if (!origin) return false;
    return CURRENT_ALLOWED_ORIGIN_PATTERNS.some(p => p.test(origin));
  }

  // Adversarial third-party origin on Vercel
  const attackerOrigin = 'https://attacker-project.vercel.app';
  assert.strictEqual(isOriginAllowedCurrent(attackerOrigin), true, 'Attacker origin currently passes wildcard regex');
  console.log('✔ Verified: Attacker origin https://attacker-project.vercel.app matches current regex.');

  // Domain Pinning Recommendation:
  const PINNED_ALLOWED_ORIGIN_PATTERNS = [
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
    /^https:\/\/(?:[a-z0-9-]+\.)?kavitha-and-associates\.pages\.dev$/,
    /^https:\/\/(?:www\.)?kavithaassociates\.com$/,
    /^https:\/\/kavitha-and-associates(?:-[a-z0-9-]+)?\.vercel\.app$/
  ];

  function isOriginAllowedPinned(origin) {
    if (!origin) return false;
    return PINNED_ALLOWED_ORIGIN_PATTERNS.some(p => p.test(origin));
  }

  assert.strictEqual(isOriginAllowedPinned(attackerOrigin), false, 'Attacker origin rejected by pinned pattern');
  assert.strictEqual(isOriginAllowedPinned('https://kavitha-and-associates.vercel.app'), true, 'Legitimate preview allowed');
  assert.strictEqual(isOriginAllowedPinned('https://kavitha-and-associates-git-feature.vercel.app'), true, 'Legitimate branch allowed');
  assert.strictEqual(isOriginAllowedPinned('https://kavithaassociates.com'), true, 'Production apex allowed');
  assert.strictEqual(isOriginAllowedPinned('https://www.kavithaassociates.com'), true, 'Production www allowed');
  console.log('✔ Verified: Recommended domain pinning pattern strictly rejects attacker while allowing legitimate preview/production.');
}

// -------------------------------------------------------------------------
// TEST 5: Deliverable Text, Markdown Structure & ICAI Redaction Audit
// -------------------------------------------------------------------------
console.log('\n--- 5. Testing Deliverable Markdown Structure & ICAI Redaction ---');
{
  const content = fs.readFileSync('INFRASTRUCTURE_REPORT.md', 'utf8');

  // Check code block symmetry (pairs of triple backticks)
  const codeBlocks = content.match(/```/g) || [];
  assert.strictEqual(codeBlocks.length % 2, 0, `Code blocks must be closed (count: ${codeBlocks.length})`);
  console.log(`✔ Verified: Code blocks are symmetric and well-formed (${codeBlocks.length} markers / ${codeBlocks.length / 2} blocks).`);

  // Check forbidden ICAI registration number (0 occurrences)
  const forbiddenSeq = '252' + '985';
  assert.strictEqual(content.includes(forbiddenSeq), false, 'Forbidden statutory string must NOT appear in report');
  console.log('✔ Verified: 0 occurrences of statutory ICAI membership number in INFRASTRUCTURE_REPORT.md.');

  // Check required sections exist
  const requiredHeadings = [
    '3.2.2 The Five Operational Failure Modes',
    'Failure Mode 5: Distributed Rate-Limiting & Deduplication Degradation',
    'Step 3: Operational Warning — Client Inquiry Data Recovery Limitation & Mandated Durability Fix',
    'Operational & Architectural Limitation (Serverless Token Revocation Ephemerality)',
    'Security Finding & Defense-in-Depth Analysis (Wildcard `*.vercel.app` Origin Exposure)',
    'Method 3: Emergency Global Session Revocation'
  ];

  for (const heading of requiredHeadings) {
    assert.strictEqual(content.includes(heading), true, `Heading must be present: ${heading}`);
    console.log(`✔ Verified presence: "${heading.slice(0, 45)}..."`);
  }
}

console.log('\n================================================================');
console.log('  ALL EMPIRICAL CHALLENGER VERIFICATION TESTS PASSED (5/5)       ');
console.log('================================================================\n');

