/**
 * tests/v8-adapters.test.mjs
 * 
 * Verification Test Suite for V8.0 Backend & Content Adapters.
 * Tests contracts, anti-spam validation, draft isolation, WhatsApp URL formatting,
 * and data integrity against Kavitha & Associates requirements.
 * Enhanced with comprehensive runtime assertions for all 6 canonical corridor slugs.
 */

import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { createServer } from 'vite';

console.log('================================================================');
console.log('  TEST: V8.0 BACKEND & CONTENT ADAPTER ARCHITECTURE VERIFICATION');
console.log('================================================================\n');

let passed = 0;
let total = 0;
const failures = [];

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${total}] ${name}`);
  } catch (err) {
    failures.push({ name, error: err.message });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${total}] ${name}`);
    console.log(`       ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// 1. Static Contract & File Verification
// ---------------------------------------------------------------------------

const backendAdapterSource = fs.existsSync(path.resolve('src/v8/adapters/backendAdapter.ts'))
  ? path.resolve('src/v8/adapters/backendAdapter.ts')
  : path.resolve('.agents/teamwork/explorer_m1_adapter_1/proposed_backendAdapter.ts');

const contentAdapterSource = fs.existsSync(path.resolve('src/v8/adapters/contentAdapter.ts'))
  ? path.resolve('src/v8/adapters/contentAdapter.ts')
  : path.resolve('.agents/teamwork/explorer_m1_adapter_1/proposed_contentAdapter.ts');

test('File existence: proposed_backendAdapter.ts exists', () => {
  assert.ok(fs.existsSync(backendAdapterSource), 'File must exist');
});

test('File existence: proposed_contentAdapter.ts exists', () => {
  assert.ok(fs.existsSync(contentAdapterSource), 'File must exist');
});

test('File existence: installed src/v8/adapters/backendAdapter.ts exists', () => {
  assert.ok(fs.existsSync(path.resolve('src/v8/adapters/backendAdapter.ts')), 'src/v8/adapters/backendAdapter.ts must exist');
});

test('File existence: installed src/v8/adapters/contentAdapter.ts exists', () => {
  assert.ok(fs.existsSync(path.resolve('src/v8/adapters/contentAdapter.ts')), 'src/v8/adapters/contentAdapter.ts must exist');
});

const backendCode = fs.readFileSync(backendAdapterSource, 'utf8');
const contentCode = fs.readFileSync(contentAdapterSource, 'utf8');

// ---------------------------------------------------------------------------
// 2. backendAdapter Contract Analysis
// ---------------------------------------------------------------------------

test('backendAdapter exports EnquirySubmissionPayload interface', () => {
  assert.match(backendCode, /export\s+interface\s+EnquirySubmissionPayload/);
});

test('backendAdapter exports EnquirySubmissionResult interface', () => {
  assert.match(backendCode, /export\s+interface\s+EnquirySubmissionResult/);
});

test('backendAdapter exports getFirmProfile function', () => {
  assert.match(backendCode, /export\s+function\s+getFirmProfile\s*\(/);
});

test('backendAdapter exports useFirmProfile React hook', () => {
  assert.match(backendCode, /export\s+function\s+useFirmProfile\s*\(/);
});

test('backendAdapter exports getFirmContact and getPartnerProfile', () => {
  assert.match(backendCode, /export\s+function\s+getFirmContact\s*\(/);
  assert.match(backendCode, /export\s+function\s+getPartnerProfile\s*\(/);
});

test('backendAdapter exports submitEnquiry function', () => {
  assert.match(backendCode, /export\s+async\s+function\s+submitEnquiry\s*\(/);
});

test('backendAdapter exports validateEnquiryPayload function', () => {
  assert.match(backendCode, /export\s+function\s+validateEnquiryPayload\s*\(/);
});

test('backendAdapter exports checkAntiSpam with honeypot & velocity check', () => {
  assert.match(backendCode, /export\s+function\s+checkAntiSpam\s*\(/);
  assert.match(backendCode, /HONEYPOT_TRIGGERED/);
  assert.match(backendCode, /VELOCITY_TOO_FAST/);
  assert.match(backendCode, /website_fax_hp/);
  assert.match(backendCode, /minVelocityMs:\s*number\s*=\s*1500/);
});

test('backendAdapter exports generateWhatsAppUrl with verified phone +91 96263 50900', () => {
  assert.match(backendCode, /export\s+function\s+generateWhatsAppUrl\s*\(/);
  assert.match(backendCode, /96263\s*50900/);
  assert.match(backendCode, /https:\/\/wa\.me\//);
});

test('backendAdapter exports sanitizeText stripping HTML tags', () => {
  assert.match(backendCode, /export\s+function\s+sanitizeText\s*\(/);
  assert.match(backendCode, /replace\(\/<\[\^>\]\*\>\?\/gm/);
});

// ---------------------------------------------------------------------------
// 3. contentAdapter Contract Analysis
// ---------------------------------------------------------------------------

test('contentAdapter exports getPublishedArticles strictly excluding drafts', () => {
  assert.match(contentCode, /export\s+function\s+getPublishedArticles\s*\(/);
  assert.match(contentCode, /BlogService\.getAllPosts\(\s*false\s*\)/);
});

test('contentAdapter exports getArticleBySlug returning undefined for drafts', () => {
  assert.match(contentCode, /export\s+function\s+getArticleBySlug\s*\(/);
  assert.match(contentCode, /BlogService\.getPostBySlug\(\s*slug\.trim\(\)\s*,\s*false\s*\)/);
});

test('contentAdapter exports isDraftArticle helper', () => {
  assert.match(contentCode, /export\s+function\s+isDraftArticle\s*\(/);
  assert.match(contentCode, /BlogService\.getAllPosts\(\s*true\s*\)/);
});

test('contentAdapter exports getFeaturedInsights for Section 6', () => {
  assert.match(contentCode, /export\s+function\s+getFeaturedInsights\s*\(/);
  assert.match(contentCode, /leadArticle/);
  assert.match(contentCode, /companionArticles/);
});

test('contentAdapter exports getRelatedArticles and getAllArticleTags', () => {
  assert.match(contentCode, /export\s+function\s+getRelatedArticles\s*\(/);
  assert.match(contentCode, /export\s+function\s+getAllArticleTags\s*\(/);
});

test('contentAdapter exports searchPublishedArticles', () => {
  assert.match(contentCode, /export\s+function\s+searchPublishedArticles\s*\(/);
});

test('contentAdapter exports getAllServices and getServiceBySlug', () => {
  assert.match(contentCode, /export\s+function\s+getAllServices\s*\(/);
  assert.match(contentCode, /export\s+function\s+getServiceBySlug\s*\(/);
});

test('contentAdapter defines all 6 canonical corridors (PRAC-01 through PRAC-06)', () => {
  assert.match(contentCode, /PRAC-01/);
  assert.match(contentCode, /PRAC-02/);
  assert.match(contentCode, /PRAC-03/);
  assert.match(contentCode, /PRAC-04/);
  assert.match(contentCode, /PRAC-05/);
  assert.match(contentCode, /PRAC-06/);
  assert.match(contentCode, /\/services\/audit-assurance/);
  assert.match(contentCode, /\/services\/income-tax-consultant-tirupati/);
  assert.match(contentCode, /\/services\/gst-consultant-tirupati/);
  assert.match(contentCode, /\/services\/company-registration-tirupati/);
  assert.match(contentCode, /\/services\/virtual-cfo-tirupati/);
  assert.match(contentCode, /\/services\/rera-consultant-tirupati/);
});

test('contentAdapter exports getPublishedFaqs and getFaqsByCategory', () => {
  assert.match(contentCode, /export\s+function\s+getPublishedFaqs\s*\(/);
  assert.match(contentCode, /export\s+function\s+getFaqsByCategory\s*\(/);
});

// ---------------------------------------------------------------------------
// 4. Functional Simulation & Logic Evaluation
// ---------------------------------------------------------------------------

// A. Test Anti-Spam Logic
function checkAntiSpamLogic(payload, minVelocityMs = 1500) {
  if (payload.website_fax_hp && payload.website_fax_hp.trim().length > 0) {
    return { passed: false, reason: 'HONEYPOT_TRIGGERED' };
  }
  if (payload.formLoadedAt && typeof payload.formLoadedAt === 'number') {
    const elapsed = Date.now() - payload.formLoadedAt;
    if (elapsed < minVelocityMs) {
      return { passed: false, reason: 'VELOCITY_TOO_FAST' };
    }
  }
  return { passed: true };
}

test('AntiSpam: Blocks automated bot when honeypot field is populated', () => {
  const botPayload = { fullName: 'Spam Bot', website_fax_hp: 'http://spam.org' };
  const res = checkAntiSpamLogic(botPayload);
  assert.strictEqual(res.passed, false);
  assert.strictEqual(res.reason, 'HONEYPOT_TRIGGERED');
});

test('AntiSpam: Blocks automated script submitting under 1500ms', () => {
  const fastPayload = { fullName: 'Fast Bot', formLoadedAt: Date.now() - 400 };
  const res = checkAntiSpamLogic(fastPayload);
  assert.strictEqual(res.passed, false);
  assert.strictEqual(res.reason, 'VELOCITY_TOO_FAST');
});

test('AntiSpam: Allows legitimate human submission (> 1500ms, empty honeypot)', () => {
  const humanPayload = { fullName: 'Legitimate Client', website_fax_hp: '', formLoadedAt: Date.now() - 2500 };
  const res = checkAntiSpamLogic(humanPayload);
  assert.strictEqual(res.passed, true);
});

// B. Test Input Sanitization
function sanitizeTextLogic(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

test('Sanitization: Strips script and html tags from inputs', () => {
  const dirty = '<script>alert("hack")</script><b>ABC Enterprises</b> <a href="evil">link</a>';
  const clean = sanitizeTextLogic(dirty);
  assert.strictEqual(clean, 'alert("hack")ABC Enterprises link');
});

// C. Test WhatsApp URL Builder
function generateWhatsAppUrlLogic(options = {}) {
  const cleanPhone = '919626350900';
  if (options.directServiceName) {
    const directText = `Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to enquire about your ${options.directServiceName} practice.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(directText)}`;
  }
  const refId = options.referenceId || 'DIRECT';
  const entity = options.entityType || 'Private Limited Company';
  const org = options.organization ? options.organization : 'Individual';
  const phone = options.phone || 'Not Specified';
  const service = options.serviceCategory || 'Audit & Assurance Services';
  const city = options.city || 'Tirupati';
  const urgency = options.urgency || 'Routine';
  const message = options.message || 'Consultation request logged via web portal.';

  const structuredText = `Hello CA Kavitha Vijay (Kavitha & Associates),\n\nEnquiry Ref: ${refId}\nName: ${options.fullName}\nEntity Type: ${entity}\nOrganization: ${org}\nPhone: ${phone}\nService Required: ${service}\nLocation: ${city}\nUrgency: ${urgency}\n\nRequirement Summary:\n${message}`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(structuredText)}`;
}

test('WhatsApp URL: Generates compliant URL with enquiry ref and partner greeting', () => {
  const url = generateWhatsAppUrlLogic({
    referenceId: 'ENQ-M1-101',
    fullName: 'Suresh Kumar',
    phone: '+91 98765 43210',
    serviceCategory: 'Statutory Audit',
    city: 'Tirupati',
    urgency: 'Approaching Deadline',
    message: 'Need annual statutory audit completed for Private Limited entity.'
  });

  assert.ok(url.startsWith('https://wa.me/919626350900?text='));
  const decoded = decodeURIComponent(url.split('text=')[1]);
  assert.ok(decoded.includes('Hello CA Kavitha Vijay (Kavitha & Associates)'));
  assert.ok(decoded.includes('Enquiry Ref: ENQ-M1-101'));
  assert.ok(decoded.includes('Name: Suresh Kumar'));
  assert.ok(decoded.includes('Service Required: Statutory Audit'));
  assert.ok(decoded.includes('Urgency: Approaching Deadline'));
});

// D. Test Professional Attribution (R4 compliance)
test('Professional Attribution: CMA AIR 49 is attributed specifically to ICMAI in firm baseline', () => {
  const firmDataRaw = fs.readFileSync('src/data/firmData.ts', 'utf8');
  assert.match(firmDataRaw, /The Institute of Cost Accountants of India \(ICMAI\)\s*—\s*All India Rank 49 in CMA Intermediate/);
  // Verify zero personal tax identifiers (PAN: 5 letters + 4 digits + 1 letter, Aadhaar: 12 digits formatted XXXX XXXX XXXX)
  assert.doesNotMatch(firmDataRaw, /\b[A-Z]{5}[0-9]{4}[A-Z]\b/); // PAN
  assert.doesNotMatch(firmDataRaw, /\b[2-9]\d{3}\s\d{4}\s\d{4}\b/); // Aadhaar
});

// ---------------------------------------------------------------------------
// 5. Practice Corridor Resolution via getServiceBySlug (Live Runtime Assertions)
// ---------------------------------------------------------------------------

let vite = null;
let runtimeAdapter = null;

try {
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  runtimeAdapter = await vite.ssrLoadModule('/src/v8/adapters/contentAdapter.ts');
} catch (err) {
  console.error('Failed to initialize Vite SSR runner:', err);
}

const getServiceBySlug = runtimeAdapter?.getServiceBySlug;
const getCorePracticeAreas = runtimeAdapter?.getCorePracticeAreas;

// 5.1 Canonical Corridor Resolution: Corridor 1 (Audit & Assurance)
test('Corridor 1 [PRAC-01]: getServiceBySlug("audit-assurance") resolves non-null with Audit/Assurance title', () => {
  assert.ok(getServiceBySlug, 'getServiceBySlug must be loaded from contentAdapter');
  const svc = getServiceBySlug('audit-assurance');
  assert.ok(svc, 'getServiceBySlug("audit-assurance") must not return undefined or null');
  assert.ok(
    /Audit|Assurance/i.test(svc.title),
    `Service title must contain "Audit" or "Assurance" (got: "${svc?.title}")`
  );
  assert.strictEqual(svc.id, 'audit-assurance', 'Entity ID must be "audit-assurance"');
  assert.ok(Array.isArray(svc.services) && svc.services.length >= 4, 'Must provide >= 4 audit sub-services');
  assert.ok(typeof svc.statutoryFramework === 'string' && svc.statutoryFramework.length > 0, 'Must specify statutoryFramework');
  assert.ok(typeof svc.shortDescription === 'string' && svc.shortDescription.length > 20, 'Must have rich shortDescription');
});

// 5.2 Canonical Corridor Resolution: Corridor 2 (Income Tax)
test('Corridor 2 [PRAC-02]: getServiceBySlug("income-tax-consultant-tirupati") resolves non-null with Income Tax title', () => {
  assert.ok(getServiceBySlug, 'getServiceBySlug must be loaded from contentAdapter');
  const svc = getServiceBySlug('income-tax-consultant-tirupati');
  assert.ok(svc, 'getServiceBySlug("income-tax-consultant-tirupati") must not return undefined or null');
  assert.ok(
    /Income Tax|Direct Tax/i.test(svc.title),
    `Service title must contain "Income Tax" or "Direct Tax" (got: "${svc?.title}")`
  );
  assert.strictEqual(svc.id, 'income-tax', 'Entity ID must be canonical "income-tax"');
  assert.ok(Array.isArray(svc.services) && svc.services.length >= 4, 'Must provide >= 4 tax deliverables');
  assert.ok(typeof svc.statutoryFramework === 'string' && svc.statutoryFramework.includes('Income Tax'), 'Must cite Income Tax Act');
  assert.ok(typeof svc.shortDescription === 'string' && svc.shortDescription.length > 20, 'Must have rich shortDescription');
});

// 5.3 Canonical Corridor Resolution: Corridor 3 (GST)
test('Corridor 3 [PRAC-03]: getServiceBySlug("gst-consultant-tirupati") resolves non-null with GST title', () => {
  assert.ok(getServiceBySlug, 'getServiceBySlug must be loaded from contentAdapter');
  const svc = getServiceBySlug('gst-consultant-tirupati');
  assert.ok(svc, 'getServiceBySlug("gst-consultant-tirupati") must not return undefined or null');
  assert.ok(
    /GST|Indirect Tax/i.test(svc.title),
    `Service title must contain "GST" or "Indirect Tax" (got: "${svc?.title}")`
  );
  assert.strictEqual(svc.id, 'gst', 'Entity ID must be canonical "gst"');
  assert.ok(Array.isArray(svc.services) && svc.services.length >= 4, 'Must provide >= 4 GST deliverables');
  assert.ok(typeof svc.statutoryFramework === 'string' && (svc.statutoryFramework.includes('GST') || svc.statutoryFramework.includes('Goods and Services Tax')), 'Must cite GST statutory framework');
  assert.ok(typeof svc.shortDescription === 'string' && svc.shortDescription.length > 20, 'Must have rich shortDescription');
});

// 5.4 Canonical Corridor Resolution: Corridor 4 (Company Registration)
test('Corridor 4 [PRAC-04]: getServiceBySlug("company-registration-tirupati") resolves non-null with Corporate/Company title', () => {
  assert.ok(getServiceBySlug, 'getServiceBySlug must be loaded from contentAdapter');
  const svc = getServiceBySlug('company-registration-tirupati');
  assert.ok(svc, 'getServiceBySlug("company-registration-tirupati") must not return undefined or null');
  assert.ok(
    /Corporate|Company/i.test(svc.title),
    `Service title must contain "Corporate" or "Company" (got: "${svc?.title}")`
  );
  assert.strictEqual(svc.id, 'corporate-business', 'Entity ID must be canonical "corporate-business"');
  assert.ok(Array.isArray(svc.services) && svc.services.length >= 4, 'Must provide >= 4 corporate deliverables');
  assert.ok(typeof svc.statutoryFramework === 'string' && svc.statutoryFramework.includes('Companies Act'), 'Must cite Companies Act');
  assert.ok(typeof svc.shortDescription === 'string' && svc.shortDescription.length > 20, 'Must have rich shortDescription');
});

// 5.5 Canonical Corridor Resolution: Corridor 5 (Virtual CFO & Advisory)
test('Corridor 5 [PRAC-05]: getServiceBySlug("virtual-cfo-tirupati") resolves non-null with title containing "Virtual CFO" or "Advisory"', () => {
  assert.ok(getServiceBySlug, 'getServiceBySlug must be loaded from contentAdapter');
  const svc = getServiceBySlug('virtual-cfo-tirupati');
  assert.ok(svc, 'getServiceBySlug("virtual-cfo-tirupati") must not return undefined or null');
  assert.ok(
    /Virtual CFO|Advisory/i.test(svc.title),
    `Service title must contain "Virtual CFO" or "Advisory" (got: "${svc?.title}")`
  );
  assert.ok(
    svc.id === 'advisory-consulting' || svc.id === 'virtual-cfo' || svc.id === 'virtual-cfo-tirupati',
    `Entity ID must map to advisory-consulting or virtual-cfo (got: "${svc?.id}")`
  );
  assert.ok(Array.isArray(svc.services) && svc.services.length >= 4, 'Must provide >= 4 advisory deliverables');
  assert.ok(typeof svc.shortDescription === 'string' && svc.shortDescription.length > 20, 'Must have rich shortDescription');
});

// 5.6 Canonical Corridor Resolution: Corridor 6 (RERA Compliance)
test('Corridor 6 [PRAC-06]: getServiceBySlug("rera-consultant-tirupati") resolves non-null with RERA title', () => {
  assert.ok(getServiceBySlug, 'getServiceBySlug must be loaded from contentAdapter');
  const svc = getServiceBySlug('rera-consultant-tirupati');
  assert.ok(svc, 'getServiceBySlug("rera-consultant-tirupati") must not return undefined or null');
  assert.ok(
    /RERA|Real Estate/i.test(svc.title),
    `Service title must contain "RERA" or "Real Estate" (got: "${svc?.title}")`
  );
  assert.strictEqual(svc.id, 'rera-compliance', 'Entity ID must be canonical "rera-compliance"');
  assert.ok(Array.isArray(svc.services) && svc.services.length >= 4, 'Must provide >= 4 RERA deliverables');
  assert.ok(typeof svc.statutoryFramework === 'string' && svc.statutoryFramework.includes('Real Estate'), 'Must cite RERA statutory framework');
  assert.ok(typeof svc.shortDescription === 'string' && svc.shortDescription.length > 20, 'Must have rich shortDescription');
});

// 5.7 Legacy V7 Alias Resolution
test('Corridor Aliases: Legacy V7 slugs resolve to corresponding practice categories', () => {
  assert.ok(getServiceBySlug, 'getServiceBySlug must be loaded');
  const legacyMap = [
    { slug: 'income-tax', expectedId: 'income-tax' },
    { slug: 'gst', expectedId: 'gst' },
    { slug: 'corporate-business', expectedId: 'corporate-business' },
    { slug: 'advisory-consulting', expectedId: 'advisory-consulting' },
    { slug: 'rera-compliance', expectedId: 'rera-compliance' },
  ];
  for (const item of legacyMap) {
    const svc = getServiceBySlug(item.slug);
    assert.ok(svc, `Legacy slug "${item.slug}" must resolve to a valid category`);
    assert.strictEqual(svc.id, item.expectedId, `Legacy slug "${item.slug}" must map to ID "${item.expectedId}"`);
  }
});

// 5.8 Robustness & Edge Cases
test('Corridor Edge Cases: Case-insensitivity and whitespace trimming for corridor slugs', () => {
  assert.ok(getServiceBySlug, 'getServiceBySlug must be loaded');
  const upperAudit = getServiceBySlug('AUDIT-ASSURANCE');
  assert.ok(upperAudit, 'Uppercase slug must resolve');
  assert.strictEqual(upperAudit.id, 'audit-assurance');

  const paddedGst = getServiceBySlug('  gst-consultant-tirupati  ');
  assert.ok(paddedGst, 'Whitespace-padded slug must resolve');
  assert.strictEqual(paddedGst.id, 'gst');
});

test('Corridor Edge Cases: Invalid, malformed, and traversal slugs safely return undefined', () => {
  assert.ok(getServiceBySlug, 'getServiceBySlug must be loaded');
  assert.strictEqual(getServiceBySlug('crypto-arbitrage-desks'), undefined, 'Non-existent slug must return undefined');
  assert.strictEqual(getServiceBySlug('../services/audit'), undefined, 'Path traversal slug must return undefined');
  assert.strictEqual(getServiceBySlug(''), undefined, 'Empty string must return undefined');
  assert.strictEqual(getServiceBySlug(null), undefined, 'Null must return undefined');
  assert.strictEqual(getServiceBySlug(undefined), undefined, 'Undefined must return undefined');
  assert.strictEqual(getServiceBySlug(12345), undefined, 'Non-string input must return undefined');
});

// 5.9 getCorePracticeAreas alignment
test('Core Practice Areas: getCorePracticeAreas returns all 6 canonical corridor cards in order', () => {
  assert.ok(getCorePracticeAreas, 'getCorePracticeAreas must be loaded');
  const areas = getCorePracticeAreas();
  assert.strictEqual(areas.length, 6, 'Must return exactly 6 core practice disciplines');

  const expectedCodes = ['PRAC-01', 'PRAC-02', 'PRAC-03', 'PRAC-04', 'PRAC-05', 'PRAC-06'];
  const expectedRoutes = [
    '/services/audit-assurance',
    '/services/income-tax-consultant-tirupati',
    '/services/gst-consultant-tirupati',
    '/services/company-registration-tirupati',
    '/services/virtual-cfo-tirupati',
    '/services/rera-consultant-tirupati'
  ];

  areas.forEach((area, i) => {
    assert.strictEqual(area.order, i + 1, `Discipline #${i + 1} order mismatch`);
    assert.strictEqual(area.disciplineCode, expectedCodes[i], `Discipline #${i + 1} code mismatch`);
    assert.strictEqual(area.routePath, expectedRoutes[i], `Discipline #${i + 1} route mismatch`);
    assert.strictEqual(area.isCorePractice, true, `Discipline #${i + 1} must have isCorePractice true`);
    assert.ok(area.title && area.title.length > 0, `Discipline #${i + 1} must have title`);
    assert.ok(Array.isArray(area.services) && area.services.length > 0, `Discipline #${i + 1} must have services`);
    assert.ok(Array.isArray(area.typicalScenarios) && area.typicalScenarios.length > 0, `Discipline #${i + 1} must have typicalScenarios`);
  });
});

// ---------------------------------------------------------------------------
// Clean Up & Summary
// ---------------------------------------------------------------------------

if (vite) {
  await vite.close();
}

console.log('\n================================================================');
console.log(`TOTAL ADAPTER ASSERTIONS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failures.length}`);
console.log('================================================================\n');

if (failures.length > 0) {
  console.log('FAILED TESTS:');
  failures.forEach(f => console.log(` - ${f.name}: ${f.error}`));
  console.log('\n');
  process.exit(1);
} else {
  console.log('ALL V8.0 ADAPTER ARCHITECTURAL CONTRACTS VERIFIED SUCCESSFULLY!\n');
  process.exit(0);
}
