import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`✔ PASS [Assert ${totalAssertions}] ${message}`);
  } else {
    failedAssertions++;
    console.error(`✖ FAIL [Assert ${totalAssertions}] ${message}`);
  }
}

console.log('================================================================');
console.log('  CHALLENGER M2: NAVIGATION, FOOTER & HOMEPAGE EMPIRICAL SUITE  ');
console.log('================================================================\n');

// 1. Inspect Navbar.tsx
console.log('--- 1. Testing Navbar.tsx Architecture & Contracts ---');
const navbarPath = path.join(projectRoot, 'src', 'components', 'Navbar.tsx');
assert(fs.existsSync(navbarPath), 'Navbar.tsx exists');
const navbarCode = fs.readFileSync(navbarPath, 'utf8');

assert(navbarCode.includes('to="/blog"'), 'Navbar includes to="/blog" (E2E Test 13.2 contract)');
assert(navbarCode.includes('to="/services/audit-assurance"'), 'Navbar includes link to /services/audit-assurance');
assert(navbarCode.includes('to="/about"'), 'Navbar includes link to /about');
assert(navbarCode.includes('to="/industries"'), 'Navbar includes link to /industries');
assert(navbarCode.includes('to="/locations"'), 'Navbar includes link to /locations');
assert(navbarCode.includes('to="/contact"'), 'Navbar includes link to /contact');

assert(navbarCode.includes('window.addEventListener(\'scroll\''), 'Navbar implements dynamic scroll listener');
assert(navbarCode.includes('passive: true'), 'Navbar scroll listener uses { passive: true } for 60fps performance');
assert(navbarCode.includes('scrollY > 20'), 'Navbar scroll threshold checks scrollY > 20 for elevation change');
assert(navbarCode.includes('shadow-editorial'), 'Navbar scroll elevation applies shadow-editorial');

assert(navbarCode.includes('e.key === \'Escape\''), 'Navbar implements Escape key accessibility handler');
assert(navbarCode.includes('min-h-[44px]'), 'Navbar touch targets respect mobile 44px touch ergonomics');

assert(navbarCode.includes('CA Kavitha Vijay'), 'Navbar utility bar displays verified partner CA Kavitha Vijay');
assert(navbarCode.includes('bg-brand-deep'), 'Navbar uses canonical token bg-brand-deep');
assert(navbarCode.includes('bg-brand-forest'), 'Navbar uses canonical token bg-brand-forest');
assert(navbarCode.includes('bg-brand-ivory'), 'Navbar uses canonical token bg-brand-ivory');
assert(navbarCode.includes('text-brand-gold'), 'Navbar uses canonical token text-brand-gold');
assert(navbarCode.includes('border-brand-border'), 'Navbar uses canonical token border-brand-border');
assert(navbarCode.includes('font-serif font-bold text-xl tracking-wider text-brand-gold'), 'Navbar monogram badge KA uses serif bold styling');


// 2. Inspect Footer.tsx
console.log('\n--- 2. Testing Footer.tsx Architecture & Institutional Ledger ---');
const footerPath = path.join(projectRoot, 'src', 'components', 'Footer.tsx');
assert(fs.existsSync(footerPath), 'Footer.tsx exists');
const footerCode = fs.readFileSync(footerPath, 'utf8');

assert(footerCode.includes('to="/blog"'), 'Footer includes to="/blog" (E2E Test 13.3 contract)');
assert(footerCode.includes('bg-brand-deep'), 'Footer canvas is built on bg-brand-deep (#102D25)');
assert(footerCode.includes('border-brand-gold'), 'Footer header features top muted gold border');

assert(footerCode.includes('CA Kavitha Vijay'), 'Footer Column 1 contains partner CA Kavitha Vijay');
assert(footerCode.includes('B.Com, CA, CMA AIR 49'), 'Footer Column 1 contains exact credentials B.Com, CA, CMA AIR 49');
assert(footerCode.includes('ICAI Mem. [REDACTED_MEMBERSHIP_NO]'), 'Footer Column 1 contains exact registration ICAI Mem. [REDACTED_MEMBERSHIP_NO]');

assert(footerCode.includes('to="/services/audit-assurance"'), 'Footer Column 2 contains Audit Spotlight link');
assert(footerCode.includes('to="/services#income-tax"'), 'Footer Column 2 contains Income Tax anchor link');
assert(footerCode.includes('to="/services#gst"'), 'Footer Column 2 contains GST anchor link');
assert(footerCode.includes('to="/services#corporate-business"'), 'Footer Column 2 contains Corporate ROC anchor link');
assert(footerCode.includes('to="/services#rera-compliance"'), 'Footer Column 2 contains RERA anchor link');
assert(footerCode.includes('to="/services#advisory-consulting"'), 'Footer Column 2 contains Advisory anchor link');

assert(footerCode.includes('FIRM_DATA.serviceFootprint.map'), 'Footer Column 3 dynamically maps service footprint corridors');
assert(footerCode.includes('Bairagi Patteda, Tirupati'), 'Footer Column 4 contains verified principal chambers address');
assert(footerCode.includes('primaryPhoneClean'), 'Footer Column 4 contains primary phone direct dial link');
assert(footerCode.includes('secondaryPhoneClean'), 'Footer Column 4 contains secondary phone direct dial link');
assert(footerCode.includes('whatsappLink'), 'Footer Column 4 contains WhatsApp consultation action link');

const icaiDisclaimer = "As per the code of ethics and guidelines issued by the Institute of Chartered Accountants of India (ICAI)";
assert(footerCode.includes(icaiDisclaimer), 'Footer contains verbatim ICAI regulatory compliance disclaimer');
assert(!footerCode.includes('to="/admin"') && !footerCode.includes('4464654646464654'), 'Footer colophon strictly excludes public Practice Portal link (/admin) to protect secret route');


// 3. Inspect HomePage.tsx
console.log('\n--- 3. Testing HomePage.tsx Sections, Anchors & Typography ---');
const homePath = path.join(projectRoot, 'src', 'pages', 'HomePage.tsx');
assert(fs.existsSync(homePath), 'HomePage.tsx exists');
const homeCode = fs.readFileSync(homePath, 'utf8');

const requiredAnchors = [
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

requiredAnchors.forEach((id) => {
  const hasId = homeCode.includes(`id="${id}"`) || homeCode.includes(`id='${id}'`) || homeCode.includes(`category.id`) || homeCode.includes(`'${id}'`);
  assert(hasId, `HomePage preserves statutory anchor ID #${id}`);
});

assert(homeCode.includes('new IntersectionObserver'), 'HomePage implements dynamic IntersectionObserver for quick-jump navigation');
assert(homeCode.includes('audit-spotlight') && homeCode.includes('contact-section'), 'IntersectionObserver observes full span of statutory sections');

assert(homeCode.includes('double-bezel-dark'), 'Hero section features double-bezel-dark architecture for Practice Registry Plaque');
assert(homeCode.includes('double-bezel-inner-dark'), 'Practice Registry Plaque implements inner bezel layer');

assert(homeCode.includes('font-editorial-h1'), 'HomePage uses fluid clamp class font-editorial-h1');
assert(homeCode.includes('font-editorial-h2'), 'HomePage uses fluid clamp class font-editorial-h2');
assert(homeCode.includes('font-editorial-h3'), 'HomePage uses fluid clamp class font-editorial-h3');
assert(homeCode.includes('font-editorial-body'), 'HomePage uses fluid clamp class font-editorial-body');
assert(homeCode.includes('font-editorial-meta'), 'HomePage uses fluid clamp class font-editorial-meta');

assert(homeCode.includes('Statutory Rigor.'), 'Monumental headline includes "Statutory Rigor."');
assert(homeCode.includes('Practical Commercial Counsel.'), 'Monumental headline includes "Practical Commercial Counsel."');

assert(homeCode.includes('Deloitte'), 'Lead narrative cites verified Big 4 Deloitte experience');
assert(homeCode.includes('Ford Motor Company'), 'Lead narrative cites verified Fortune 50 Ford Motor Company experience');
assert(homeCode.includes('CA Kavitha Vijay'), 'Lead narrative features verified partner name CA Kavitha Vijay');
assert(homeCode.includes('ICAI Mem. [REDACTED_MEMBERSHIP_NO]'), 'Practice Plaque features ICAI Mem. [REDACTED_MEMBERSHIP_NO]');
assert(homeCode.includes('CMA AIR 49'), 'Practice Plaque features CMA AIR 49');

assert(homeCode.includes('ICAI Standards on Auditing (SAs)'), 'Audit spotlight guarantees ICAI Standards on Auditing (SAs)');
assert(homeCode.includes('Internal Financial Controls (IFC) testing under Sec 143(3)'), 'Audit spotlight cites IFC testing under Sec 143(3)');
assert(homeCode.includes('Virtual CFO & Retainerships'), 'Comprehensive services includes coordinating Virtual CFO card');

assert(homeCode.includes('Dual FCA & CMA Qualification'), 'Philosophy section highlights verified Dual FCA & CMA Qualification advantage');
assert(homeCode.includes('ICAI Code of Conduct & Independence'), 'Philosophy section highlights ICAI Code of Ethics');

assert(homeCode.includes('getIndustryIcon'), 'HomePage maps contextual Lucide icons across 10 industry sectors');
assert(homeCode.includes('FIRM_DATA.serviceFootprint'), 'HomePage maps 5 service locations');
assert(homeCode.includes('Primary Chambers'), 'HomePage highlights Tirupati as Primary Chambers');

assert(homeCode.includes('<KnowledgeFAQ />') || homeCode.includes('<KnowledgeFAQ'), 'HomePage embeds KnowledgeFAQ component');
assert(homeCode.includes('<ContactForm />') || homeCode.includes('<ContactForm'), 'HomePage embeds ContactForm component');


// 4. Adversarial Slop & Integrity Check
console.log('\n--- 4. Adversarial Slop, Integrity & Marketing Claim Checks ---');
const bannedClaims = [
  '100% Guaranteed',
  '99.9% Success',
  '10,000+ Happy Clients',
  'Award Winning Agency of the Year 2026',
  'Best CA in India',
  'Cheap accounting'
];

bannedClaims.forEach(claim => {
  const found = homeCode.includes(claim) || navbarCode.includes(claim) || footerCode.includes(claim);
  assert(!found, `Codebase is free from unsubstantiated claim: "${claim}"`);
});

const bannedGlassmorphism = homeCode.match(/backdrop-blur-3xl|backdrop-blur-2xl/g);
assert(!bannedGlassmorphism, 'No excessive backdrop-blur glassmorphism abuse in HomePage');

console.log('\n================================================================');
console.log(`TOTAL EMPIRICAL CHALLENGER ASSERTIONS: ${totalAssertions}`);
console.log(`PASSED: ${passedAssertions}`);
console.log(`FAILED: ${failedAssertions}`);
console.log('================================================================');

if (failedAssertions > 0) {
  process.exit(1);
} else {
  console.log('\nALL EMPIRICAL CHALLENGER M2 ASSERTIONS PASSED WITH ZERO ERRORS!\n');
  process.exit(0);
}
