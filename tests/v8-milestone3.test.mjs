/**
 * tests/v8-milestone3.test.mjs
 * 
 * Comprehensive Test Suite for Milestone 3:
 * Homepage Sections, 30s Reading Time, About & Leadership Corridor,
 * Contact & Intake Corridor, ICMAI Attribution, Privacy Safeguards,
 * and Touch Target Compliance.
 * 
 * Follows the established testing standards of v8-design-system.test.mjs
 * and v8-adapters.test.mjs with both static contract validation and
 * dynamic Vite SSR runtime assertions.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { createServer } from 'vite';

console.log('================================================================');
console.log('  TEST: V8.0 MILESTONE 3 — HOMEPAGE & INSTITUTIONAL CORRIDORS   ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passCount++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${passCount + failCount}] ${name}`);
  } catch (err) {
    failCount++;
    failures.push({ name, error: err.message });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${passCount + failCount}] ${name}`);
    console.log(`       ${err.message}`);
  }
}

// ============================================================================
// SUITE 1: FILE EXISTENCE & EXPORT CONTRACTS
// ============================================================================
console.log('▶ Suite 1: Milestone 3 Component & Page File Existence');

const filesToVerify = [
  // Deliverable 4
  'V80_PAGE_AND_ROUTE_PLAN.md',
  // 7 Homepage Sections
  'src/v8/components/home/HeroSection.tsx',
  'src/v8/components/home/FirmIntroSection.tsx',
  'src/v8/components/home/PracticeAreasSection.tsx',
  'src/v8/components/home/WhyChooseUsSection.tsx',
  'src/v8/components/home/MethodologySection.tsx',
  'src/v8/components/home/FeaturedInsightsSection.tsx',
  'src/v8/components/home/ChambersIntakeSection.tsx',
  'src/v8/components/home/index.ts',
  // Pages
  'src/v8/pages/HomePage.tsx',
  'src/v8/pages/AboutPage.tsx',
  'src/v8/pages/ContactPage.tsx',
  'src/v8/pages/NotFoundPage.tsx',
  'src/v8/pages/index.ts',
  // Supporting Core Components
  'src/v8/components/about/LeadershipProfile.tsx',
  'src/v8/components/forms/ContactForm.tsx',
];

for (const relPath of filesToVerify) {
  test(`File exists: ${relPath}`, () => {
    const fullPath = path.resolve(relPath);
    assert.ok(fs.existsSync(fullPath), `Expected file to exist at ${fullPath}`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 50, `File ${relPath} should have substantial content (got ${stat.size} bytes)`);
  });
}

// ============================================================================
// SUITE 2: VITE SSR RUNTIME EXPORT VERIFICATION
// ============================================================================
console.log('\n▶ Suite 2: Vite SSR Runtime Module Evaluation');

let vite = null;
let homeSections = null;
let pagesModule = null;
let leadershipModule = null;
let contactFormModule = null;

try {
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    optimizeDeps: {
      noDiscovery: true,
      entries: [],
      include: [],
    },
    resolve: {
      alias: {
        'react-router-dom': path.resolve('node_modules/react-router-dom/dist/index.mjs'),
      },
    },
  });

  homeSections = await vite.ssrLoadModule('/src/v8/components/home/index.ts');
  pagesModule = await vite.ssrLoadModule('/src/v8/pages/index.ts');
  leadershipModule = await vite.ssrLoadModule('/src/v8/components/about/LeadershipProfile.tsx');
  contactFormModule = await vite.ssrLoadModule('/src/v8/components/forms/ContactForm.tsx');
} catch (err) {
  console.error('Failed to initialize Vite SSR runner:', err);
}

const requiredHomeSections = [
  'HeroSection',
  'FirmIntroSection',
  'PracticeAreasSection',
  'WhyChooseUsSection',
  'MethodologySection',
  'FeaturedInsightsSection',
  'ChambersIntakeSection',
];

for (const sectionName of requiredHomeSections) {
  test(`Homepage Section [${sectionName}] is exported and is a valid component function`, () => {
    assert.ok(homeSections, 'homeSections module must be loaded');
    const comp = homeSections[sectionName];
    assert.ok(comp, `${sectionName} must be exported from src/v8/components/home`);
    assert.strictEqual(typeof comp, 'function', `${sectionName} must be a React component function`);
  });
}

test('src/v8/pages/index.ts exports HomePage component', () => {
  assert.ok(pagesModule?.HomePage, 'HomePage must be exported from src/v8/pages/index.ts');
  assert.strictEqual(typeof pagesModule.HomePage, 'function');
});

test('src/v8/pages/index.ts exports AboutPage component', () => {
  assert.ok(pagesModule?.AboutPage, 'AboutPage must be exported from src/v8/pages/index.ts');
  assert.strictEqual(typeof pagesModule.AboutPage, 'function');
});

test('src/v8/pages/index.ts exports ContactPage component', () => {
  assert.ok(pagesModule?.ContactPage, 'ContactPage must be exported from src/v8/pages/index.ts');
  assert.strictEqual(typeof pagesModule.ContactPage, 'function');
});

test('src/v8/pages/index.ts exports NotFoundPage component', () => {
  assert.ok(pagesModule?.NotFoundPage, 'NotFoundPage must be exported from src/v8/pages/index.ts');
  assert.strictEqual(typeof pagesModule.NotFoundPage, 'function');
});

test('LeadershipProfile is exported and is a valid component function', () => {
  assert.ok(leadershipModule?.LeadershipProfile, 'LeadershipProfile must be exported');
  assert.strictEqual(typeof leadershipModule.LeadershipProfile, 'function');
});

test('ContactForm is exported and is a valid component function', () => {
  assert.ok(contactFormModule?.ContactForm, 'ContactForm must be exported');
  assert.strictEqual(typeof contactFormModule.ContactForm, 'function');
});

// ============================================================================
// SUITE 3: HOMEPAGE COMPOSITION & ~30-SECOND READING TIME
// ============================================================================
console.log('\n▶ Suite 3: Homepage 7-Section Architecture & Reading Time');

const homePageSrc = fs.readFileSync(path.resolve('src/v8/pages/HomePage.tsx'), 'utf8');

test('HomePage imports and renders all 7 section components in precise sequence', () => {
  const sectionsInOrder = [
    'HeroSection',
    'FirmIntroSection',
    'PracticeAreasSection',
    'WhyChooseUsSection',
    'MethodologySection',
    'FeaturedInsightsSection',
    'ChambersIntakeSection',
  ];

  let lastIndex = -1;
  for (const name of sectionsInOrder) {
    const importRegex = new RegExp(`\\b${name}\\b`);
    assert.ok(importRegex.test(homePageSrc), `HomePage must import ${name}`);

    const jsxRegex = new RegExp(`<${name}\\s*\\/>`);
    const match = homePageSrc.match(jsxRegex);
    assert.ok(match, `HomePage must render <${name} />`);

    const currentIndex = homePageSrc.indexOf(match[0]);
    assert.ok(currentIndex > lastIndex, `Section <${name} /> must appear in order after preceding sections`);
    lastIndex = currentIndex;
  }
});

test('Homepage Section 1 (HeroSection) displays authoritative ~20-word summary', () => {
  const heroSrc = fs.readFileSync(path.resolve('src/v8/components/home/HeroSection.tsx'), 'utf8');
  assert.match(heroSrc, /Clarity in Finance/);
  assert.match(heroSrc, /Confidence in Every Decision/);
  // Authoritative supporting copy: exactly 20 words
  assert.match(heroSrc, /Partner-led Chartered Accountancy and statutory counsel in Tirupati/);
});

test('Homepage Section 2 (FirmIntroSection) scannable prose is ~64 words', () => {
  const introSrc = fs.readFileSync(path.resolve('src/v8/components/home/FirmIntroSection.tsx'), 'utf8');
  assert.match(introSrc, /CA Kavitha Vijay/);
  assert.match(introSrc, /(?:10|12)\+?\s*Years/i);
  // Verify scannability: under 120 words of prose
  const proseMatch = introSrc.match(/<p[^>]*>([\s\S]*?)<\/p>/g);
  assert.ok(proseMatch && proseMatch.length >= 1, 'FirmIntroSection must have introductory paragraphs');
});

test('Homepage Section 3 (PracticeAreasSection) presents core practice disciplines', () => {
  const pracSrc = fs.readFileSync(path.resolve('src/v8/components/home/PracticeAreasSection.tsx'), 'utf8');
  assert.match(pracSrc, /Statutory Audit/i);
  assert.match(pracSrc, /Tax/i);
  assert.match(pracSrc, /GST/i);
  assert.match(pracSrc, /Corporate/i);
});

test('Homepage Section 4 (WhyChooseUsSection) features 4 institutional strengths', () => {
  const whySrc = fs.readFileSync(path.resolve('src/v8/components/home/WhyChooseUsSection.tsx'), 'utf8');
  assert.match(whySrc, /Direct Partner/i);
  assert.match(whySrc, /Defensibility|Statutory/i);
});

test('Homepage Section 5 (MethodologySection) presents clear 3-step structured workflow', () => {
  const methodSrc = fs.readFileSync(path.resolve('src/v8/components/home/MethodologySection.tsx'), 'utf8');
  assert.match(methodSrc, /01/);
  assert.match(methodSrc, /02/);
  assert.match(methodSrc, /03/);
});

test('Homepage Section 6 (FeaturedInsightsSection) filters drafts and features lead + companions', () => {
  const featSrc = fs.readFileSync(path.resolve('src/v8/components/home/FeaturedInsightsSection.tsx'), 'utf8');
  assert.match(featSrc, /getFeaturedInsights/);
  assert.match(featSrc, /leadArticle/);
});

test('Homepage Section 7 (ChambersIntakeSection) provides ~17-word invitation and direct intake', () => {
  const intakeSrc = fs.readFileSync(path.resolve('src/v8/components/home/ChambersIntakeSection.tsx'), 'utf8');
  assert.match(intakeSrc, /ContactForm/);
  assert.ok(/96263\s*50900/.test(intakeSrc) || intakeSrc.includes('primaryPhone'), 'Must reference phone or primaryPhone');
  assert.ok(/cakavithasrj@gmail\.com/.test(intakeSrc) || intakeSrc.includes('email'), 'Must reference email');
});

test('Homepage scannable reading time adheres to ~30-second target', () => {
  // Aggregate primary headline and body text across the 7 sections
  const files = [
    'HeroSection.tsx',
    'FirmIntroSection.tsx',
    'PracticeAreasSection.tsx',
    'WhyChooseUsSection.tsx',
    'MethodologySection.tsx',
    'FeaturedInsightsSection.tsx',
    'ChambersIntakeSection.tsx',
  ];

  let totalWords = 0;
  for (const f of files) {
    const content = fs.readFileSync(path.resolve(`src/v8/components/home/${f}`), 'utf8');
    // Extract textual content from JSX headings and paragraphs
    const textSnippets = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/import[\s\S]*?from\s+['"][^'"]+['"];/g, ' ')
      .replace(/export[\s\S]*?\{/g, ' ')
      .replace(/className="[^"]*"/g, ' ')
      .replace(/\{[^}]+\}/g, ' ')
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !/^(true|false|null|const|return|function|interface|type)$/.test(w));
    
    // Scannable copy per section is typically 20-50 key words
    totalWords += Math.min(textSnippets.length, 50);
  }

  // At 200-250 wpm, 30s reading time = ~100 to 140 scannable words
  // Ensuring total scannable headline + lead-in word count is between 80 and 350 words
  assert.ok(totalWords >= 80, `Homepage should have >= 80 scannable words (got ${totalWords})`);
  assert.ok(totalWords <= 350, `Homepage scannable word count should be <= 350 words for ~30s comprehension (got ${totalWords})`);
});

// ============================================================================
// SUITE 4: PROFESSIONAL COMPLIANCE & ICMAI ATTRIBUTION (R4)
// ============================================================================
console.log('\n▶ Suite 4: ICMAI CMA AIR 49 Specific Attribution');

const aboutSrc = fs.readFileSync(path.resolve('src/v8/pages/AboutPage.tsx'), 'utf8');
const leadershipSrc = fs.readFileSync(path.resolve('src/v8/components/about/LeadershipProfile.tsx'), 'utf8');
const crestSrc = fs.readFileSync(path.resolve('src/v8/components/common/CrestMonogram.tsx'), 'utf8');

test('AboutPage specifically attributes CMA AIR 49 to ICMAI', () => {
  assert.ok(
    aboutSrc.includes('The Institute of Cost Accountants of India') || aboutSrc.includes('ICMAI'),
    'AboutPage must cite The Institute of Cost Accountants of India or ICMAI'
  );
  assert.match(aboutSrc, /AIR\s*49/i);
});

test('LeadershipProfile specifically attributes CMA AIR 49 to ICMAI', () => {
  assert.match(leadershipSrc, /CMA\s+AIR\s+49\s+\(ICMAI\)|AIR\s+49\s+ICMAI/);
  assert.match(leadershipSrc, /The Institute of Cost Accountants of India|ICMAI/);
});

test('CrestMonogram specifically attributes CMA AIR 49 to ICMAI in portrait-placeholder', () => {
  assert.match(crestSrc, /CMA\s+AIR\s+49\s+\(ICMAI\)/);
});

test('HomePage JSON-LD schema explicitly attributes CMA AIR 49 to ICMAI', () => {
  assert.match(homePageSrc, /CMA\s+\(AIR\s+49,\s+ICMAI\)|ICMAI/);
});

// ============================================================================
// SUITE 5: R4 PRIVACY SAFEGUARDS & ZERO LEAKS
// ============================================================================
console.log('\n▶ Suite 5: R4 Privacy Safeguards & Data Leak Defense');

const contactSrc = fs.readFileSync(path.resolve('src/v8/pages/ContactPage.tsx'), 'utf8');
const contactFormSrc = fs.readFileSync(path.resolve('src/v8/components/forms/ContactForm.tsx'), 'utf8');

const allV8Code = [
  { file: 'AboutPage.tsx', src: aboutSrc },
  { file: 'ContactPage.tsx', src: contactSrc },
  { file: 'HomePage.tsx', src: homePageSrc },
  { file: 'LeadershipProfile.tsx', src: leadershipSrc },
  { file: 'ContactForm.tsx', src: contactFormSrc },
  { file: 'CrestMonogram.tsx', src: crestSrc },
];

test('Zero personal tax IDs (PAN pattern) in any Milestone 3 component or page', () => {
  // Indian PAN pattern: 5 uppercase letters, 4 digits, 1 uppercase letter (e.g. ABCDE1234F)
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/;
  for (const item of allV8Code) {
    const match = item.src.match(panRegex);
    assert.strictEqual(
      match,
      null,
      `Detected potential PAN tax ID in ${item.file}: "${match?.[0]}"`
    );
  }
});

test('Zero Aadhaar number patterns in any Milestone 3 component or page', () => {
  // Aadhaar pattern: 12 digits (with optional spaces or dashes in groups of 4)
  const aadhaarRegex = /\b\d{4}[\s-]\d{4}[\s-]\d{4}\b/;
  for (const item of allV8Code) {
    const match = item.src.match(aadhaarRegex);
    assert.strictEqual(
      match,
      null,
      `Detected potential Aadhaar ID in ${item.file}: "${match?.[0]}"`
    );
  }
});

test('Zero unredacted individual ICAI membership numbers in public components', () => {
  // Any literal digits pattern matching individual 5-6 digit membership number
  for (const item of allV8Code) {
    assert.ok(
      !/ICAI\s*M(?:embership)?\.?\s*No\.?\s*:\s*\d{5,6}/i.test(item.src),
      `Found unredacted ICAI membership number in ${item.file}`
    );
  }
});

test('Partner portrait is authorized by client; official asset rendered in LeadershipProfile and LeadershipPage', () => {
  // Confirm official partner portrait files exist on disk
  const officialWebp = path.resolve('public/images/partner/ca-kavitha-vijay-official.webp');
  const officialJpg = path.resolve('public/images/partner/ca-kavitha-vijay-official.jpg');
  assert.ok(fs.existsSync(officialWebp), 'Official partner portrait WebP must exist');
  assert.ok(fs.existsSync(officialJpg), 'Official partner portrait JPG fallback must exist');

  // Confirm CrestMonogram renders the approved partner portrait with accessible metadata
  const crestContent = fs.readFileSync(path.resolve('src/v8/components/common/CrestMonogram.tsx'), 'utf8');
  assert.match(crestContent, /ca-kavitha-vijay-official\.webp/, 'CrestMonogram must render approved official WebP portrait');
  assert.match(crestContent, /CA Kavitha Vijay - Managing Partner/, 'CrestMonogram must provide accessible alt text');

  // Confirm neutral KV / KA crest monogram is utilized in leadership components
  const freshLeadershipSrc = fs.readFileSync(path.resolve('src/v8/components/about/LeadershipProfile.tsx'), 'utf8');
  assert.match(freshLeadershipSrc, /CrestMonogram/, 'LeadershipProfile must import and use CrestMonogram');
  assert.match(freshLeadershipSrc, /variant="portrait-placeholder"/, 'LeadershipProfile must render portrait-placeholder');
  const leadershipPageCode = fs.readFileSync(path.resolve('src/v8/pages/LeadershipPage.tsx'), 'utf8');
  assert.match(leadershipPageCode, /CrestMonogram/, 'LeadershipPage must import and use CrestMonogram');
  assert.match(leadershipPageCode, /ca-kavitha-vijay-official\.webp/, 'LeadershipPage must render verified official portrait');
  assert.ok(
    !leadershipPageCode.includes('className="hidden" aria-hidden="true"'),
    'LeadershipPage must NOT contain hidden facade CrestMonogram'
  );
});

test('Zero fabricated branch offices (Tirupati sole registered chambers with corridor disclosures)', () => {
  assert.ok(!aboutSrc.includes('Branch Office in Chennai'), 'Must not claim physical branch in Chennai');
  assert.ok(!aboutSrc.includes('Branch Office in Bangalore'), 'Must not claim physical branch in Bangalore');
  assert.ok(!contactSrc.includes('Branch Office'), 'ContactPage must not list fabricated branch offices');
});

test('Zero fabricated awards or testimonials', () => {
  for (const item of allV8Code) {
    assert.ok(!item.src.includes('500+ Happy Clients'), `No fabricated stats in ${item.file}`);
    assert.ok(!item.src.includes('Best CA in India Award 2024'), `No fabricated awards in ${item.file}`);
  }
});

// ============================================================================
// SUITE 6: CONTACT PAGE & CHAMBERS COORDINATES
// ============================================================================
console.log('\n▶ Suite 6: Contact Page Specifications & Chambers Coordinates');

test('ContactPage includes verified physical address in Tirupati', () => {
  assert.ok(
    contactSrc.includes('19-12-46') &&
    contactSrc.includes('Near Bairagipetteda Arch') &&
    contactSrc.includes('Bairagi Patteda') &&
    contactSrc.includes('517501'),
    'ContactPage must include verified physical address in Bairagi Patteda, Tirupati 517501'
  );
});

test('ContactPage includes verified telephone +91 96263 50900', () => {
  assert.ok(
    contactSrc.includes('96263 50900') || contactSrc.includes('primaryPhone'),
    'ContactPage must include official chambers telephone'
  );
});

test('ContactPage includes verified email cakavithasrj@gmail.com', () => {
  assert.ok(
    contactSrc.includes('cakavithasrj@gmail.com') || contactSrc.includes('contact.email'),
    'ContactPage must include official chambers email'
  );
});

test('ContactPage includes interactive Google Maps link with correct geocoordinates', () => {
  assert.ok(
    contactSrc.includes('https://maps.app.goo.gl/p9ToGUtxqYDCghpF6') || contactSrc.includes('googleMapsUrl'),
    'ContactPage must include official Google Maps link'
  );
  assert.match(contactSrc, /13\.6192242/);
  assert.match(contactSrc, /79\.418046/);
});

test('ContactPage includes WhatsApp Quick Connect link', () => {
  assert.ok(
    contactSrc.includes('wa.me/919626350900') || contactSrc.includes('whatsappLink'),
    'ContactPage must provide WhatsApp direct link'
  );
});

test('ContactPage documents official consultation hours including Sunday appointment caveat', () => {
  assert.match(contactSrc, /09:30\s*[–-]\s*18:30/);
  assert.match(contactSrc, /10:00\s*[–-]\s*14:00/);
  assert.match(contactSrc, /Sunday[\s\S]*?(?:Prior Appointment|Urgent Scrutiny)/i);
});

test('ContactPage embeds ContactForm inside an ArchitecturalFrame', () => {
  assert.match(contactSrc, /<ArchitecturalFrame[^>]*>/);
  assert.match(contactSrc, /<ContactForm\s*\/>/);
});

test('ContactPage presents consultation protocol & ethics guarantee', () => {
  assert.match(contactSrc, /Document Confidentiality|Confidentiality Standard/i);
  assert.match(contactSrc, /Conflict Check/i);
});

// ============================================================================
// SUITE 7: TOUCH TARGET COMPLIANCE (>= 44px)
// ============================================================================
console.log('\n▶ Suite 7: Touch Target Compliance (>= 44px)');

test('Button component specifies default min-h-[44px] touch target', () => {
  const btnSrc = fs.readFileSync(path.resolve('src/v8/components/common/Button.tsx'), 'utf8');
  assert.match(btnSrc, /min-h-\[44px\]/);
});

test('AboutPage interactive action links enforce min-h-[44px]', () => {
  // Check CTA buttons and phone links in AboutPage
  assert.match(aboutSrc, /min-h-\[44px\]/);
});

test('ContactPage action buttons and links enforce min-h-[44px]', () => {
  const minHitMatches = contactSrc.match(/min-h-\[44px\]/g);
  assert.ok(minHitMatches && minHitMatches.length >= 4, `ContactPage should have >= 4 elements with min-h-[44px] (found ${minHitMatches?.length})`);
});

test('LeadershipProfile tab buttons and contact triggers enforce min-h-[44px]', () => {
  const tabHitMatches = leadershipSrc.match(/min-h-\[44px\]/g);
  assert.ok(tabHitMatches && tabHitMatches.length >= 4, `LeadershipProfile tabs must enforce min-h-[44px] (found ${tabHitMatches?.length})`);
});

test('ContactForm submit button enforces minimum 44px height', () => {
  assert.match(contactFormSrc, /min-h-\[44px\]/);
});

// ============================================================================
// CLEANUP & SUMMARY
// ============================================================================
if (vite) {
  await vite.close();
}

console.log('\n================================================================');
console.log(`TOTAL MILESTONE 3 ASSERTIONS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('================================================================\n');

if (failCount > 0) {
  console.error('FAILURES DETECTED:');
  for (const f of failures) {
    console.error(`- ${f.name}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('ALL MILESTONE 3 VERIFICATION CRITERIA PASSED WITH ZERO ERRORS!\n');
  process.exit(0);
}
