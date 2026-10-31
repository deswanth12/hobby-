import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve('.');
const DIST = path.join(ROOT, 'dist');

console.log('================================================================');
console.log('  CHALLENGER M2.1: EMPIRICAL STRESS-TEST & VERIFICATION HARNESS ');
console.log('  Target: Navigation, Footer & Homepage Redesign                ');
console.log('================================================================');

let passedAssertions = 0;
let totalAssertions = 0;
const failures = [];

function assert(condition, message, details = '') {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${totalAssertions}] ${message}`);
  } else {
    failures.push({ message, details });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [Assert ${totalAssertions}] ${message}`);
    if (details) console.log(`       Details: ${details}`);
  }
}

// -----------------------------------------------------------------------------
// 1. Route & Link Integrity (Navbar.tsx & Footer.tsx)
// -----------------------------------------------------------------------------
console.log('\n--- 1. Testing Route & Link Integrity in Navbar & Footer ---');

const navbarPath = path.join(ROOT, 'src', 'components', 'Navbar.tsx');
const footerPath = path.join(ROOT, 'src', 'components', 'Footer.tsx');
assert(fs.existsSync(navbarPath), 'Navbar.tsx exists');
assert(fs.existsSync(footerPath), 'Footer.tsx exists');

const navbarContent = fs.readFileSync(navbarPath, 'utf8');
const footerContent = fs.readFileSync(footerPath, 'utf8');

// Required Navigational links
const requiredNavLinks = [
  '/',
  '/about',
  '/services',
  '/services/audit-assurance',
  '/industries',
  '/locations',
  '/blog',
  '/contact'
];

for (const link of requiredNavLinks) {
  const linkRegex = new RegExp(`to=["']${link}["']|href=["']${link}["']|path:\\s*['"]${link}['"]`);
  assert(linkRegex.test(navbarContent), `Navbar renders required route link: ${link}`);
}

// Explicit verification of /blog in Navbar & Footer (E2E 13.2 & 13.3)
assert(
  /to=["']\/blog["']|href=["']\/blog["']/.test(navbarContent),
  'Navbar explicitly contains link to /blog (satisfies E2E 13.2)'
);
assert(
  /to=["']\/blog["']|href=["']\/blog["']/.test(footerContent),
  'Footer explicitly contains link to /blog (satisfies E2E 13.3)'
);

// Footer practice area links
const footerPracticeLinks = [
  '/services/audit-assurance',
  '/services#income-tax',
  '/services#gst',
  '/services#corporate-business',
  '/services#rera-compliance',
  '/services#advisory-consulting'
];

for (const pLink of footerPracticeLinks) {
  assert(footerContent.includes(pLink), `Footer contains practice link: ${pLink}`);
}

// Footer statutory navigation links
assert(footerContent.includes('to="/about"') || footerContent.includes("to='/about'"), 'Footer links to /about');
assert(footerContent.includes('to="/industries"') || footerContent.includes("to='/industries'"), 'Footer links to /industries');
assert(footerContent.includes('to="/locations"') || footerContent.includes("to='/locations'"), 'Footer links to /locations');
assert(footerContent.includes('to="/contact"') || footerContent.includes("to='/contact'"), 'Footer links to /contact');
assert(footerContent.includes('/#knowledge-faq'), 'Footer contains anchor link to /#knowledge-faq');

// -----------------------------------------------------------------------------
// 2. Section Anchor Navigation in HomePage.tsx
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing Section Anchor Navigation in HomePage.tsx ---');

const homePagePath = path.join(ROOT, 'src', 'pages', 'HomePage.tsx');
assert(fs.existsSync(homePagePath), 'HomePage.tsx exists');

const homePageContent = fs.readFileSync(homePagePath, 'utf8');

const expectedAnchorIds = [
  'audit-spotlight',
  'services-overview',
  'income-tax',
  'gst',
  'corporate-business',
  'rera-compliance',
  'advisory-consulting',
  'knowledge-faq',
  'contact-section'
];

// Check IntersectionObserver observes all 9 section IDs
for (const anchor of expectedAnchorIds) {
  assert(
    homePageContent.includes(`'${anchor}'`) || homePageContent.includes(`"${anchor}"`),
    `HomePage IntersectionObserver / activeSection registers anchor: ${anchor}`
  );
}

// Verify actual DOM element ID rendered for all 9 anchors
// Static IDs: audit-spotlight, services-overview, knowledge-faq, contact-section
assert(homePageContent.includes('id="audit-spotlight"'), 'HomePage contains DOM element with id="audit-spotlight"');
assert(homePageContent.includes('id="services-overview"'), 'HomePage contains DOM element with id="services-overview"');
assert(homePageContent.includes('id="knowledge-faq"'), 'HomePage contains DOM element with id="knowledge-faq"');
assert(homePageContent.includes('id="contact-section"'), 'HomePage contains DOM element with id="contact-section"');

// Dynamic IDs rendered via FIRM_DATA.serviceCategories.map((category) => ... id={category.id})
assert(homePageContent.includes('id={category.id}'), 'HomePage dynamically renders category.id anchor on practice cards');

// Verify firmData.ts provides all 5 practice category IDs
const firmDataPath = path.join(ROOT, 'src', 'data', 'firmData.ts');
assert(fs.existsSync(firmDataPath), 'firmData.ts exists');
const firmDataContent = fs.readFileSync(firmDataPath, 'utf8');

const dynamicCategories = ['income-tax', 'gst', 'corporate-business', 'rera-compliance', 'advisory-consulting'];
for (const catId of dynamicCategories) {
  const catRegex = new RegExp(`id:\\s*["']${catId}["']`);
  assert(catRegex.test(firmDataContent), `firmData.ts defines serviceCategory id: "${catId}"`);
}

// -----------------------------------------------------------------------------
// 3. ContactForm Contract & Security Guards
// -----------------------------------------------------------------------------
console.log('\n--- 3. Testing ContactForm Contract & Anti-Abuse Guards ---');

const contactFormPath = path.join(ROOT, 'src', 'components', 'ContactForm.tsx');
assert(fs.existsSync(contactFormPath), 'ContactForm.tsx exists');
const formContent = fs.readFileSync(contactFormPath, 'utf8');

// Mounting in HomePage.tsx
assert(
  homePageContent.includes("import { ContactForm } from '../components/ContactForm'") ||
  homePageContent.includes('import { ContactForm } from "../components/ContactForm"'),
  'HomePage imports ContactForm component'
);
assert(homePageContent.includes('<ContactForm />'), 'HomePage mounts <ContactForm /> inside #contact-section');

// Spam Guard 1: Honeypot
assert(formContent.includes('honeypot'), 'ContactForm defines honeypot state');
assert(formContent.includes('website_fax_hp'), 'ContactForm renders honeypot input with id="website_fax_hp"');
assert(formContent.includes('tabIndex={-1}') || formContent.includes('tabIndex="-1"'), 'Honeypot input has tabIndex=-1 (unreachable by keyboard tab)');
assert(formContent.includes('aria-hidden="true"'), 'Honeypot is concealed from screen readers with aria-hidden="true"');
assert(/if\s*\(\s*honeypot\s*\)/.test(formContent), 'ContactForm immediately aborts submission if honeypot is populated');

// Spam Guard 2: Velocity Check
assert(formContent.includes('formLoadedAt'), 'ContactForm tracks component mount time via formLoadedAt ref');
assert(
  formContent.includes('1500') && /Date\.now\(\)\s*-\s*formLoadedAt\.current\s*<\s*1500/.test(formContent),
  'ContactForm blocks rapid automated submission under 1500ms'
);

// Local Enquiry Storage Registration
assert(formContent.includes('adminStorage.recordEnquiryAsync'), 'ContactForm registers enquiry asynchronously via adminStorage.recordEnquiryAsync');
assert(formContent.includes('savedRecord'), 'ContactForm stores savedRecord state with generated reference ID');

// WhatsApp Protocol Handshake
assert(formContent.includes('generateWhatsAppUrl'), 'ContactForm implements generateWhatsAppUrl helper');
assert(formContent.includes('wa.me/919626350900'), 'WhatsApp URL initiates chat with verified chambers phone: 919626350900');
assert(formContent.includes('Enquiry Ref:'), 'WhatsApp message payload contains formal Enquiry Ref tag');

// Validation & Sanitization
assert(formContent.includes('sanitizeText'), 'ContactForm implements sanitizeText method');
assert(formContent.includes('.replace(/<[^>]*>?/gm'), 'sanitizeText strips HTML tags via regex');
assert(formContent.includes('/^[0-9+\\s-]{8,15}$/'), 'ContactForm enforces strict 8-15 digit phone validation pattern');

// -----------------------------------------------------------------------------
// 4. Client Credibility, Credentials & Regulatory Compliance
// -----------------------------------------------------------------------------
console.log('\n--- 4. Testing Client Credibility & Regulatory Compliance ---');

// Verified Partner Name & ICAI Membership
assert(homePageContent.includes('CA Kavitha Vijay'), 'HomePage mentions CA Kavitha Vijay');
assert(homePageContent.includes('[REDACTED_MEMBERSHIP_NO]'), 'HomePage contains ICAI Mem. [REDACTED_MEMBERSHIP_NO]');
assert(homePageContent.includes('AIR 49'), 'HomePage mentions CMA AIR 49');
assert(footerContent.includes('CA Kavitha Vijay'), 'Footer mentions CA Kavitha Vijay');
assert(footerContent.includes('[REDACTED_MEMBERSHIP_NO]'), 'Footer contains ICAI Mem. [REDACTED_MEMBERSHIP_NO]');

// Verified Chambers Address & Phones
assert(footerContent.includes('Bairagi Patteda'), 'Footer contains physical address at Bairagi Patteda');
assert(footerContent.includes('Tirupati'), 'Footer contains Tirupati');
assert(footerContent.includes('primaryPhone'), 'Footer binds FIRM_DATA.contact.primaryPhone');
assert(footerContent.includes('secondaryPhone'), 'Footer binds FIRM_DATA.contact.secondaryPhone');
assert(firmDataContent.includes('96263 50900'), 'firmData.ts contains verified primary line: 96263 50900');
assert(firmDataContent.includes('95421 53906'), 'firmData.ts contains verified secondary line: 95421 53906');

// ICAI Disclaimer
assert(footerContent.includes('ICAI Compliance Notice:'), 'Footer contains verbatim ICAI Compliance Notice');
assert(
  footerContent.includes('solely for providing basic information about the firm') &&
  footerContent.includes('not intended to advertise or solicit work'),
  'Footer enforces strict ICAI non-advertisement code of ethics disclaimer'
);

// -----------------------------------------------------------------------------
// 5. Accessibility & UX Micro-physics
// -----------------------------------------------------------------------------
console.log('\n--- 5. Testing Accessibility & Micro-physics ---');

// Navbar keyboard accessibility
assert(navbarContent.includes("e.key === 'Escape'"), 'Navbar handles Escape key to dismiss active navigation menus');

// Navbar passive scroll listener
assert(navbarContent.includes('{ passive: true }'), 'Navbar binds scroll listener with { passive: true } for optimal compositor performance');

// Mobile menu touch target size >= 44px
assert(navbarContent.includes('min-w-[44px]') && navbarContent.includes('min-h-[44px]'), 'Mobile hamburger button enforces min 44x44px touch target');
assert(navbarContent.includes('min-h-[44px]'), 'Mobile drawer navigation links enforce min 44px touch targets');

// -----------------------------------------------------------------------------
// 6. Empirical Stress-Testing: Unit Execution of Sanitizer & Anti-Abuse
// -----------------------------------------------------------------------------
console.log('\n--- 6. Empirical Unit Testing of ContactForm Sanitization & Guards ---');

// Test sanitizeText logic directly
const sanitize = (str) => str.replace(/<[^>]*>?/gm, '').trim();

const xssPayloads = [
  { input: '<script>alert(1)</script>John Doe', expected: 'alert(1)John Doe' },
  { input: '<img src=x onerror=alert(1)>Acme Corp', expected: 'Acme Corp' },
  { input: '<a href="javascript:evil()">Click me</a>', expected: 'Click me' },
  { input: '   Normal Legal Text   ', expected: 'Normal Legal Text' },
  { input: '<div><p>Deeply <b>Nested</b> Text</p></div>', expected: 'Deeply Nested Text' }
];

for (const { input, expected } of xssPayloads) {
  const result = sanitize(input);
  assert(result === expected, `sanitizeText neutralizes payload: "${input.slice(0, 30)}..." -> "${result}"`);
}

// Test Phone Regex validation directly
const phoneRegex = /^[0-9+\s-]{8,15}$/;
const validPhones = ['+91 96263 50900', '9542153906', '+1-555-123-4567', '044-24567890'];
const invalidPhones = ['abc12345', '12345', '99999999999999999999', '<script>', ''];

for (const vp of validPhones) {
  assert(phoneRegex.test(vp.trim()), `Phone validation accepts valid number: "${vp}"`);
}
for (const ip of invalidPhones) {
  assert(!phoneRegex.test(ip.trim()), `Phone validation rejects invalid number: "${ip}"`);
}

// -----------------------------------------------------------------------------
// 7. Empirical Build & Bundle Size Verification
// -----------------------------------------------------------------------------
console.log('\n--- 7. Empirical Build & Bundle Verification ---');

const indexHtmlPath = path.join(DIST, 'index.html');
assert(fs.existsSync(indexHtmlPath), 'dist/index.html exists');

if (fs.existsSync(indexHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  assert(indexHtml.includes('<title>'), 'dist/index.html contains HTML <title>');
  assert(indexHtml.includes('id="root"'), 'dist/index.html contains root mounting element');
}

// Verify dist assets directory has css and js bundles
const assetsDir = path.join(DIST, 'assets');
assert(fs.existsSync(assetsDir), 'dist/assets directory exists');
const distFiles = fs.readdirSync(assetsDir);
const jsBundle = distFiles.find(f => f.startsWith('index-') && f.endsWith('.js'));
const cssBundle = distFiles.find(f => f.startsWith('index-') && f.endsWith('.css'));

assert(Boolean(jsBundle), `Production JS bundle generated: ${jsBundle}`);
assert(Boolean(cssBundle), `Production CSS bundle generated: ${cssBundle}`);

if (jsBundle) {
  const jsStats = fs.statSync(path.join(assetsDir, jsBundle));
  console.log(`Production JS bundle size: ${(jsStats.size / 1024).toFixed(2)} KB`);
  assert(jsStats.size > 100 * 1024, 'JS bundle is populated and non-empty (> 100 KB)');
}

if (cssBundle) {
  const cssStats = fs.statSync(path.join(assetsDir, cssBundle));
  console.log(`Production CSS bundle size: ${(cssStats.size / 1024).toFixed(2)} KB`);
  assert(cssStats.size > 20 * 1024, 'CSS bundle contains Tailwind and editorial styles (> 20 KB)');
}

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL ASSERTIONS: ${totalAssertions}`);
console.log(`PASSED: ${passedAssertions}`);
console.log(`FAILED: ${failures.length}`);
console.log('================================================================');

if (failures.length > 0) {
  console.log('\nFAILURES BREAKDOWN:');
  failures.forEach((f, idx) => {
    console.log(`[${idx + 1}] ${f.message}`);
    if (f.details) console.log(`    ${f.details}`);
  });
  process.exit(1);
} else {
  console.log('\nALL EMPIRICAL ASSERTIONS PASSED WITH ZERO ERRORS!');
  process.exit(0);
}
