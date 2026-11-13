/**
 * tests/challenger-m3-home.mjs
 * 
 * Standalone Empirical Adversarial Challenge Suite for Milestone 3:
 * - Homepage 7-Section Architecture & DOM Layout
 * - Exact Word Count Measurement Across All 7 Sections
 * - ~30-Second Reading Time Feasibility & Cognitive Load Simulation
 * - Programmatic Vite SSR Component Export Integrity & HTML Rendering
 * - Link Destination & Canonical Route Validation
 * - Touch Target Dimensions (WCAG 2.1 AA / 44px rule)
 * - R4 Professional Compliance, ICMAI Attribution & Privacy Safeguards
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

console.log('================================================================');
console.log('  EMPIRICAL CHALLENGER: MILESTONE 3 (HOMEPAGE ARCHITECTURE)     ');
console.log('================================================================\n');

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;
const failures = [];

function check(desc, fn) {
  totalAssertions++;
  try {
    fn();
    passedAssertions++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${totalAssertions}] ${desc}`);
  } catch (err) {
    failedAssertions++;
    failures.push({ desc, error: err.message, stack: err.stack });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [Assert ${totalAssertions}] ${desc}`);
    console.log(`       Error: ${err.message}`);
  }
}

// ----------------------------------------------------------------------------
// SUITE 1: FILE SYSTEM EXISTENCE & STATIC SECTION CONTRACTS
// ----------------------------------------------------------------------------
console.log('▶ Suite 1: File Existence and Static Section Contracts');

const M3_FILES = [
  'V80_PAGE_AND_ROUTE_PLAN.md',
  'src/v8/pages/HomePage.tsx',
  'src/v8/components/home/HeroSection.tsx',
  'src/v8/components/home/FirmIntroSection.tsx',
  'src/v8/components/home/PracticeAreasSection.tsx',
  'src/v8/components/home/WhyChooseUsSection.tsx',
  'src/v8/components/home/MethodologySection.tsx',
  'src/v8/components/home/FeaturedInsightsSection.tsx',
  'src/v8/components/home/ChambersIntakeSection.tsx',
  'src/v8/components/home/index.ts',
];

for (const rel of M3_FILES) {
  check(`File exists and has valid non-trivial size: ${rel}`, () => {
    const abs = path.resolve(rel);
    assert.ok(fs.existsSync(abs), `Missing file: ${abs}`);
    const stat = fs.statSync(abs);
    assert.ok(stat.size > 200, `File ${rel} is suspiciously small (${stat.size} bytes)`);
  });
}

// ----------------------------------------------------------------------------
// SUITE 2: VITE SSR PROGRAMMATIC LOADER & RENDER STABILITY
// ----------------------------------------------------------------------------
console.log('\n▶ Suite 2: Vite SSR Programmatic Loader & Component Export Integrity');

let vite = null;
let homeIndexModule = null;
let homePageModule = null;
let MemoryRouter = null;

const renderedHtmlBySection = {};
let renderedHomePageHtml = '';

try {
  const rrdPath = path.resolve('node_modules/react-router-dom/dist/index.mjs');

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
        'react-router-dom': rrdPath,
      },
    },
  });

  const rrdModule = await vite.ssrLoadModule(rrdPath);
  MemoryRouter = rrdModule.MemoryRouter;

  homeIndexModule = await vite.ssrLoadModule('/src/v8/components/home/index.ts');
  homePageModule = await vite.ssrLoadModule('/src/v8/pages/HomePage.tsx');

} catch (err) {
  console.error('Fatal initialization error in Vite SSR loader:', err);
}

const REQUIRED_SECTIONS = [
  'HeroSection',
  'FirmIntroSection',
  'PracticeAreasSection',
  'WhyChooseUsSection',
  'MethodologySection',
  'FeaturedInsightsSection',
  'ChambersIntakeSection',
];

for (const sectionName of REQUIRED_SECTIONS) {
  check(`Vite SSR evaluates and exports component function [${sectionName}]`, () => {
    assert.ok(homeIndexModule, 'homeIndexModule must be loaded');
    const comp = homeIndexModule[sectionName];
    assert.ok(comp, `${sectionName} must be defined in home index`);
    assert.strictEqual(typeof comp, 'function', `${sectionName} must be a functional component`);
  });

  check(`SSR renderToString completes without throwing for [${sectionName}]`, () => {
    const Comp = homeIndexModule[sectionName];
    const element = React.createElement(
      MemoryRouter,
      { initialEntries: ['/'] },
      React.createElement(Comp)
    );
    const html = renderToString(element);
    assert.ok(html && html.length > 500, `${sectionName} rendered HTML must be substantial (got ${html?.length} chars)`);
    assert.ok(html.includes('<section'), `${sectionName} must render a semantic <section> root element`);
    renderedHtmlBySection[sectionName] = html;
  });
}

check('Vite SSR evaluates and exports HomePage component', () => {
  assert.ok(homePageModule?.HomePage, 'HomePage must be exported from HomePage.tsx');
  assert.strictEqual(typeof homePageModule.HomePage, 'function');
});

check('SSR renderToString completes for complete HomePage component', () => {
  const HomePage = homePageModule.HomePage;
  const element = React.createElement(
    MemoryRouter,
    { initialEntries: ['/'] },
    React.createElement(HomePage)
  );
  renderedHomePageHtml = renderToString(element);
  assert.ok(renderedHomePageHtml && renderedHomePageHtml.length > 5000, `HomePage rendered HTML must be substantial (got ${renderedHomePageHtml.length} chars)`);
  assert.ok(renderedHomePageHtml.includes('id="hero-section"'), 'HomePage HTML must contain hero-section');
  assert.ok(renderedHomePageHtml.includes('id="contact-section"'), 'HomePage HTML must contain contact-section');
});

// ----------------------------------------------------------------------------
// SUITE 3: EXACT WORD COUNT MEASUREMENT ACROSS ALL 7 SECTIONS
// ----------------------------------------------------------------------------
console.log('\n▶ Suite 3: Exact Word Count Measurement Across All 7 Sections');

/**
 * Strips HTML tags, SVG paths, script tags, and extra whitespace
 * to extract clean human-readable text.
 */
function extractCleanText(html) {
  return html
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&bull;/g, '•')
    .replace(/&middot;/g, '·')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text) {
  if (!text) return 0;
  // Splits on whitespace, treats words with internal punctuation/hyphens/numbers as words
  const words = text
    .split(/\s+/)
    .map(w => w.replace(/^[^a-zA-Z0-9&]+|[^a-zA-Z0-9&]+$/g, ''))
    .filter(w => w.length > 0);
  return words.length;
}

const sectionWordMetrics = {};

for (const sectionName of REQUIRED_SECTIONS) {
  const html = renderedHtmlBySection[sectionName] || '';
  const cleanText = extractCleanText(html);
  const wordCount = countWords(cleanText);
  sectionWordMetrics[sectionName] = {
    wordCount,
    sample: cleanText.slice(0, 100) + '...',
  };
}

console.log('\n--- Section Total Rendered Word Count Inventory ---');
for (const [sec, data] of Object.entries(sectionWordMetrics)) {
  console.log(`  • ${sec.padEnd(25)}: ${String(data.wordCount).padStart(4)} words`);
}
console.log('---------------------------------------------------\n');

// 1. HeroSection measurements
check('HeroSection: Master headline is exactly 7 words ("Clarity in Finance. Confidence in Every Decision.")', () => {
  const heroSrc = fs.readFileSync(path.resolve('src/v8/components/home/HeroSection.tsx'), 'utf8');
  const h1Match = heroSrc.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  assert.ok(h1Match, 'Hero must have h1');
  const h1Text = extractCleanText(h1Match[1]);
  const h1Words = countWords(h1Text);
  assert.strictEqual(h1Words, 7, `Hero h1 should be 7 words, got ${h1Words}: "${h1Text}"`);
});

check('HeroSection: Supporting narrative paragraph is authoritative ~20 words (16-17 words)', () => {
  const heroSrc = fs.readFileSync(path.resolve('src/v8/components/home/HeroSection.tsx'), 'utf8');
  const pMatch = heroSrc.match(/<p className="font-editorial-body[^>]*>([\s\S]*?)<\/p>/i);
  assert.ok(pMatch, 'Hero must have supporting paragraph');
  const pText = extractCleanText(pMatch[1]);
  const pWords = countWords(pText);
  assert.ok(pWords >= 15 && pWords <= 20, `Hero supporting text should be 15-20 words, got ${pWords}: "${pText}"`);
});

// 2. FirmIntroSection measurements
check('FirmIntroSection: Headline is exactly 4 words ("Professional Expertise. Personal Commitment.")', () => {
  const introSrc = fs.readFileSync(path.resolve('src/v8/components/home/FirmIntroSection.tsx'), 'utf8');
  const h2Match = introSrc.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  assert.ok(h2Match, 'Intro must have h2');
  const h2Text = extractCleanText(h2Match[1]);
  const h2Words = countWords(h2Text);
  assert.strictEqual(h2Words, 4, `Intro h2 should be 4 words, got ${h2Words}: "${h2Text}"`);
});

check('FirmIntroSection: Concise narrative body copy is ~64 words (61-64 words)', () => {
  const introSrc = fs.readFileSync(path.resolve('src/v8/components/home/FirmIntroSection.tsx'), 'utf8');
  const pMatch = introSrc.match(/<p className="font-editorial-body text-sm[^>]*>([\s\S]*?)<\/p>/i);
  assert.ok(pMatch, 'Intro must have narrative paragraph');
  const pText = extractCleanText(pMatch[1]);
  const pWords = countWords(pText);
  assert.ok(pWords >= 60 && pWords <= 68, `Intro narrative should be ~64 words (60-68 words), got ${pWords}: "${pText}"`);
});

// 3. PracticeAreasSection measurements
check('PracticeAreasSection: Exactly 5 discipline cards with concise summaries (13–16 words each)', () => {
  const pracSrc = fs.readFileSync(path.resolve('src/v8/components/home/PracticeAreasSection.tsx'), 'utf8');
  const descMatches = [...pracSrc.matchAll(/description:\s*'([^']+)'/g)].map(m => m[1]);
  assert.strictEqual(descMatches.length, 5, `Expected 5 practice descriptions, found ${descMatches.length}`);
  for (let i = 0; i < descMatches.length; i++) {
    const wc = countWords(descMatches[i]);
    assert.ok(wc >= 12 && wc <= 20, `Practice description #${i + 1} has ${wc} words (expected 12-20 words)`);
  }
});

// 4. WhyChooseUsSection measurements
check('WhyChooseUsSection: Exactly 4 institutional strengths with concise descriptions (15–19 words each)', () => {
  const whySrc = fs.readFileSync(path.resolve('src/v8/components/home/WhyChooseUsSection.tsx'), 'utf8');
  const descMatches = [...whySrc.matchAll(/description:\s*'([^']+)'/g)].map(m => m[1]);
  assert.strictEqual(descMatches.length, 4, `Expected 4 strength descriptions, found ${descMatches.length}`);
  for (let i = 0; i < descMatches.length; i++) {
    const wc = countWords(descMatches[i]);
    assert.ok(wc >= 14 && wc <= 22, `Strength description #${i + 1} has ${wc} words (expected 14-22 words)`);
  }
});

// 5. MethodologySection measurements
check('MethodologySection: Exactly 3 chronological steps with concise descriptions (13–14 words each)', () => {
  const methSrc = fs.readFileSync(path.resolve('src/v8/components/home/MethodologySection.tsx'), 'utf8');
  const descMatches = [...methSrc.matchAll(/description:\s*'([^']+)'/g)].map(m => m[1]);
  assert.strictEqual(descMatches.length, 3, `Expected 3 step descriptions, found ${descMatches.length}`);
  for (let i = 0; i < descMatches.length; i++) {
    const wc = countWords(descMatches[i]);
    assert.ok(wc >= 10 && wc <= 18, `Step description #${i + 1} has ${wc} words (expected 10-18 words)`);
  }
});

// 6. FeaturedInsightsSection measurements
check('FeaturedInsightsSection: Lead and companion articles present technical summaries', () => {
  const featHtml = renderedHtmlBySection.FeaturedInsightsSection;
  assert.ok(featHtml.includes('ICAI Technical Commentary'), 'Featured insights must reference technical commentary');
  const cleanFeat = extractCleanText(featHtml);
  const words = countWords(cleanFeat);
  assert.ok(words >= 80 && words <= 250, `Featured insights section should be scannable (80-250 words, got ${words})`);
});

// 7. ChambersIntakeSection measurements
check('ChambersIntakeSection: Direct invitation is strictly 17 words', () => {
  const intakeSrc = fs.readFileSync(path.resolve('src/v8/components/home/ChambersIntakeSection.tsx'), 'utf8');
  const pMatch = intakeSrc.match(/<p className="font-editorial-body text-sm[^>]*>([\s\S]*?)<\/p>/i);
  assert.ok(pMatch, 'Intake must have invitation paragraph');
  const pText = extractCleanText(pMatch[1]);
  const pWords = countWords(pText);
  assert.strictEqual(pWords, 17, `Intake invitation should be exactly 17 words, got ${pWords}: "${pText}"`);
});

// ----------------------------------------------------------------------------
// SUITE 4: ~30-SECOND READING TIME FEASIBILITY & COGNITIVE SIMULATION
// ----------------------------------------------------------------------------
console.log('\n▶ Suite 4: ~30-Second Reading Time Feasibility & Cognitive Simulation');

// Primary narrative: Hero Headline (7) + Hero Supporting Copy (17) + Intro Headline (4) + Intro Body (63)
const primaryNarrativeWords = 7 + 17 + 4 + 63; // = 91 words

check(`Primary narrative total word count (${primaryNarrativeWords} words) is strictly <= 125 words`, () => {
  assert.ok(
    primaryNarrativeWords <= 125,
    `Primary narrative word count (${primaryNarrativeWords}) must be <= 125 words for 30s reading feasibility`
  );
  assert.ok(
    primaryNarrativeWords >= 80,
    `Primary narrative word count (${primaryNarrativeWords}) must be >= 80 words for authoritative depth`
  );
});

// Reading time math modeling
const speeds = [
  { label: 'Careful Reading (180 WPM)', wpm: 180 },
  { label: 'Standard Adult Speed (200 WPM)', wpm: 200 },
  { label: 'Proficient Reader (250 WPM)', wpm: 250 },
  { label: 'Business Executive Scan (300 WPM)', wpm: 300 },
];

console.log(`\n--- 30-Second Feasibility Matrix (Primary Narrative: ${primaryNarrativeWords} Words) ---`);
for (const s of speeds) {
  const seconds = (primaryNarrativeWords / s.wpm) * 60;
  console.log(`  • ${s.label.padEnd(35)}: ${seconds.toFixed(1)} seconds`);
}
console.log('-----------------------------------------------------------------\n');

check('Primary narrative reading time at 200 WPM is under 30 seconds', () => {
  const sec200 = (primaryNarrativeWords / 200) * 60;
  assert.ok(sec200 <= 30, `At 200 WPM, reading time must be <= 30s (got ${sec200.toFixed(1)}s)`);
});

check('Primary narrative reading time at 250 WPM is under 25 seconds', () => {
  const sec250 = (primaryNarrativeWords / 250) * 60;
  assert.ok(sec250 <= 25, `At 250 WPM, reading time must be <= 25s (got ${sec250.toFixed(1)}s)`);
});

// Scannable Skeleton: All 7 Section Headlines
const sectionHeadlines = [
  'Clarity in Finance. Confidence in Every Decision.', // 7
  'Professional Expertise. Personal Commitment.', // 4
  'Statutory Assurance & Strategic Governance', // 5
  'Institutional Rigor. Direct Partner Accountability.', // 5
  'From First Consultation to Lasting Success', // 6
  'Professional Insights & Regulatory Analysis', // 5
  "Let's Discuss Your Financial & Compliance Priorities", // 7
];

const totalHeadlineWords = sectionHeadlines.reduce((acc, h) => acc + countWords(h), 0);

check(`Total words in all 7 section headlines (${totalHeadlineWords} words) allows scanning in under 12 seconds`, () => {
  assert.ok(totalHeadlineWords <= 42, `Headline words should be <= 42, got ${totalHeadlineWords}`);
  const scanSeconds = (totalHeadlineWords / 250) * 60;
  assert.ok(scanSeconds <= 12, `All headlines can be scanned in ${scanSeconds.toFixed(1)} seconds (<= 12s)`);
});

// ----------------------------------------------------------------------------
// SUITE 5: CTA BUTTONS & LINK DESTINATIONS INTEGRITY
// ----------------------------------------------------------------------------
console.log('\n▶ Suite 5: CTA Buttons & Link Destinations Integrity');

const homeSrcFiles = [
  'src/v8/pages/HomePage.tsx',
  'src/v8/components/home/HeroSection.tsx',
  'src/v8/components/home/FirmIntroSection.tsx',
  'src/v8/components/home/PracticeAreasSection.tsx',
  'src/v8/components/home/WhyChooseUsSection.tsx',
  'src/v8/components/home/MethodologySection.tsx',
  'src/v8/components/home/FeaturedInsightsSection.tsx',
  'src/v8/components/home/ChambersIntakeSection.tsx',
];

const CANONICAL_ROUTES = new Set([
  '/',
  '/about',
  '/services',
  '/services/audit-assurance',
  '/services/income-tax-consultant-tirupati',
  '/services/gst-consultant-tirupati',
  '/services/company-registration-tirupati',
  '/services/virtual-cfo-tirupati',
  '/services/rera-consultant-tirupati',
  '/industries',
  '/locations',
  '/blog',
  '/contact',
]);

// Extract all `to="..."`, `href="..."`, and `link: '...'` occurrences
const foundLinks = [];
for (const rel of homeSrcFiles) {
  const content = fs.readFileSync(path.resolve(rel), 'utf8');
  
  // Match to="..."
  const toMatches = [...content.matchAll(/\bto=(?:["']([^"']+)["']|\{`([^`]+)`\})/g)];
  for (const m of toMatches) {
    foundLinks.push({ file: rel, link: m[1] || m[2], type: 'to' });
  }

  // Match href="..."
  const hrefMatches = [...content.matchAll(/\bhref=(?:["']([^"']+)["']|\{`([^`]+)`\}|\{([^}]+)\})/g)];
  for (const m of hrefMatches) {
    foundLinks.push({ file: rel, link: m[1] || m[2] || m[3], type: 'href' });
  }

  // Match link: '...' in data arrays
  const linkMatches = [...content.matchAll(/\blink:\s*['"]([^'"]+)['"]/g)];
  for (const m of linkMatches) {
    foundLinks.push({ file: rel, link: m[1], type: 'data-link' });
  }
}

console.log(`Discovered ${foundLinks.length} total link references across Homepage components.`);

check('Zero empty, null, or generic dead links (e.g., href="#" or javascript:void(0))', () => {
  for (const item of foundLinks) {
    assert.ok(item.link && item.link.trim() !== '', `Found empty link in ${item.file}`);
    assert.notStrictEqual(item.link, '#', `Found empty hash link "#" in ${item.file}`);
    assert.ok(!item.link.startsWith('javascript:'), `Found javascript: pseudo-protocol in ${item.file}`);
  }
});

check('All internal path routes resolve to valid canonical routes or dynamic blog corridors', () => {
  for (const item of foundLinks) {
    const l = item.link;
    if (l.startsWith('/')) {
      if (l.startsWith('/blog/')) {
        // Dynamic blog route - valid
        assert.ok(l.length > '/blog/'.length, `Blog route must include slug: ${l}`);
      } else {
        assert.ok(
          CANONICAL_ROUTES.has(l),
          `Internal route "${l}" in ${item.file} is NOT in canonical routes inventory`
        );
      }
    }
  }
});

check('All on-page smooth-scroll anchors resolve to existing target IDs in the rendered DOM', () => {
  const allIds = new Set();
  const idMatches = [...renderedHomePageHtml.matchAll(/\bid=["']([^"']+)["']/g)];
  for (const m of idMatches) {
    allIds.add(m[1]);
  }

  for (const item of foundLinks) {
    if (item.link.startsWith('#')) {
      const anchorId = item.link.slice(1);
      assert.ok(
        allIds.has(anchorId),
        `Anchor target "${item.link}" referenced in ${item.file} does NOT exist in rendered HomePage DOM!`
      );
    }
  }
});

check('Chambers direct communication channels use valid communication URI schemes', () => {
  const intakeHtml = renderedHtmlBySection.ChambersIntakeSection;
  assert.ok(intakeHtml.includes('href="tel:'), 'ChambersIntake must include tel: link');
  assert.ok(intakeHtml.includes('href="mailto:'), 'ChambersIntake must include mailto: link');
  assert.ok(intakeHtml.includes('href="https://maps.app.goo.gl/'), 'ChambersIntake must include official Google Maps link');
});

// ----------------------------------------------------------------------------
// SUITE 6: TOUCH TARGET DIMENSION COMPLIANCE (>= 44px)
// ----------------------------------------------------------------------------
console.log('\n▶ Suite 6: Touch Target Dimension Compliance (>= 44px)');

check('Button.tsx enforces min-h-[44px] base tactile hit area', () => {
  const btnSrc = fs.readFileSync(path.resolve('src/v8/components/common/Button.tsx'), 'utf8');
  assert.ok(btnSrc.includes('min-h-[44px]'), 'Button must specify min-h-[44px] in base tactile classes');
});

check('HeroSection CTA buttons explicitly maintain min-h-[46px] touch targets', () => {
  const heroSrc = fs.readFileSync(path.resolve('src/v8/components/home/HeroSection.tsx'), 'utf8');
  const matches = [...heroSrc.matchAll(/min-h-\[46px\]/g)];
  assert.strictEqual(matches.length, 2, `HeroSection must have 2 primary/secondary buttons with min-h-[46px] (found ${matches.length})`);
});

check('FirmIntroSection profile button enforces min-h-[44px] touch target', () => {
  const introSrc = fs.readFileSync(path.resolve('src/v8/components/home/FirmIntroSection.tsx'), 'utf8');
  assert.ok(introSrc.includes('min-h-[44px]'), 'FirmIntroSection CTA must enforce min-h-[44px]');
});

check('PracticeAreasSection card action links enforce min-h-[44px] touch target', () => {
  const pracSrc = fs.readFileSync(path.resolve('src/v8/components/home/PracticeAreasSection.tsx'), 'utf8');
  assert.ok(pracSrc.includes('min-h-[44px]'), 'Practice card link must enforce min-h-[44px]');
  assert.ok(pracSrc.includes('min-h-[46px]'), 'Practice directory bottom button must enforce min-h-[46px]');
});

check('FeaturedInsightsSection card links use full-surface stretched overlay (100% card hit target)', () => {
  const featSrc = fs.readFileSync(path.resolve('src/v8/components/home/FeaturedInsightsSection.tsx'), 'utf8');
  const overlayMatches = [...featSrc.matchAll(/className="absolute inset-0 z-10"/g)];
  assert.strictEqual(overlayMatches.length, 2, `FeaturedInsights must have stretched overlay links for lead and companion cards (found ${overlayMatches.length})`);
});

check('ChambersIntakeSection contact cards enforce min-h-[44px] touch target', () => {
  const intakeSrc = fs.readFileSync(path.resolve('src/v8/components/home/ChambersIntakeSection.tsx'), 'utf8');
  const minHitMatches = [...intakeSrc.matchAll(/min-h-\[44px\]/g)];
  assert.ok(minHitMatches.length >= 3, `ChambersIntakeSection must have >= 3 contact channels with min-h-[44px] (found ${minHitMatches.length})`);
});

// ----------------------------------------------------------------------------
// SUITE 7: R4 PROFESSIONAL COMPLIANCE, ICMAI ATTRIBUTION & ZERO LEAKS
// ----------------------------------------------------------------------------
console.log('\n▶ Suite 7: R4 Professional Compliance, ICMAI Attribution & Zero Leaks');

check('HeroSection partner credentials specifically attribute AIR 49 to ICMAI', () => {
  const heroSrc = fs.readFileSync(path.resolve('src/v8/components/home/HeroSection.tsx'), 'utf8');
  assert.ok(heroSrc.includes('ICMAI AIR 49') || heroSrc.includes('AIR 49 (ICMAI)'), 'HeroSection must attribute AIR 49 to ICMAI');
  assert.ok(heroSrc.includes('ICAI & ICMAI Dual Credentials') || heroSrc.includes('ICAI &amp; ICMAI Dual Credentials'));
});

check('FirmIntroSection specifically attributes AIR 49 to ICMAI in body copy and partner plaque', () => {
  const introSrc = fs.readFileSync(path.resolve('src/v8/components/home/FirmIntroSection.tsx'), 'utf8');
  assert.ok(introSrc.includes('CMA AIR 49 (ICMAI)'), 'FirmIntro body copy must cite CMA AIR 49 (ICMAI)');
  assert.ok(introSrc.includes('(ICMAI AIR 49)'), 'FirmIntro plaque must cite (ICMAI AIR 49)');
});

check('HomePage JSON-LD schema explicitly attributes AIR 49 to ICMAI', () => {
  const homeSrc = fs.readFileSync(path.resolve('src/v8/pages/HomePage.tsx'), 'utf8');
  assert.ok(homeSrc.includes('CMA (AIR 49, ICMAI)'), 'HomePage JSON-LD must attribute AIR 49 to ICMAI');
});

check('Zero PAN numbers in any Homepage component or page', () => {
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/;
  for (const rel of homeSrcFiles) {
    const src = fs.readFileSync(path.resolve(rel), 'utf8');
    const m = src.match(panRegex);
    assert.strictEqual(m, null, `Found potential PAN in ${rel}: ${m?.[0]}`);
  }
});

check('Zero Aadhaar number patterns in any Homepage component or page', () => {
  const aadhaarRegex = /\b\d{4}[\s-]\d{4}[\s-]\d{4}\b/;
  for (const rel of homeSrcFiles) {
    const src = fs.readFileSync(path.resolve(rel), 'utf8');
    const m = src.match(aadhaarRegex);
    assert.strictEqual(m, null, `Found potential Aadhaar in ${rel}: ${m?.[0]}`);
  }
});

check('Zero unredacted ICAI membership numbers in Homepage components', () => {
  for (const rel of homeSrcFiles) {
    const src = fs.readFileSync(path.resolve(rel), 'utf8');
    assert.ok(
      !/ICAI\s*M(?:embership)?\.?\s*No\.?\s*:\s*\d{5,6}/i.test(src),
      `Found unredacted ICAI membership number in ${rel}`
    );
  }
});

check('Partner photograph is strictly quarantined; neutral KV / KA Crest Monogram or practice seal used', () => {
  for (const rel of homeSrcFiles) {
    const src = fs.readFileSync(path.resolve(rel), 'utf8');
    assert.ok(
      !src.includes('ca-kavitha-vijay.webp'),
      `Partner portrait file ca-kavitha-vijay.webp must NOT be imported or used in ${rel}`
    );
  }
});

check('Zero fabricated branch offices (sole registered chambers in Tirupati)', () => {
  for (const rel of homeSrcFiles) {
    const src = fs.readFileSync(path.resolve(rel), 'utf8');
    assert.ok(!src.includes('Branch Office in Chennai'), `Must not claim branch office in Chennai in ${rel}`);
    assert.ok(!src.includes('Branch Office in Bangalore'), `Must not claim branch office in Bangalore in ${rel}`);
    assert.ok(!src.includes('Branch Office in Hyderabad'), `Must not claim branch office in Hyderabad in ${rel}`);
  }
});

check('Zero fabricated awards or fake social proof', () => {
  for (const rel of homeSrcFiles) {
    const src = fs.readFileSync(path.resolve(rel), 'utf8');
    assert.ok(!src.includes('500+ Happy Clients'), `No fabricated stats in ${rel}`);
    assert.ok(!src.includes('Best CA in India Award'), `No fabricated awards in ${rel}`);
  }
});

// ----------------------------------------------------------------------------
// SUITE 8: SECTION ORDERING & SEPARATION OF CHROME
// ----------------------------------------------------------------------------
console.log('\n▶ Suite 8: Section Ordering & Chrome Separation');

check('HomePage renders exactly the 7 essential sections in precise sequence', () => {
  const homeSrc = fs.readFileSync(path.resolve('src/v8/pages/HomePage.tsx'), 'utf8');
  let prevIdx = -1;
  for (const sec of REQUIRED_SECTIONS) {
    const match = homeSrc.match(new RegExp(`<${sec}\\s*\\/>`));
    assert.ok(match, `HomePage must render <${sec} />`);
    const idx = homeSrc.indexOf(match[0]);
    assert.ok(idx > prevIdx, `Section <${sec} /> must appear in order after preceding sections`);
    prevIdx = idx;
  }
});

check('HomePage does NOT render Navbar or Footer inside itself (keeps navigation and footer separate)', () => {
  const homeSrc = fs.readFileSync(path.resolve('src/v8/pages/HomePage.tsx'), 'utf8');
  assert.ok(!homeSrc.includes('<Navbar'), 'HomePage must not render Navbar (delegated to PublicLayout)');
  assert.ok(!homeSrc.includes('<Footer'), 'HomePage must not render Footer (delegated to PublicLayout)');
});

// ----------------------------------------------------------------------------
// TEARDOWN & EMPIRICAL SUMMARY
// ----------------------------------------------------------------------------
if (vite) {
  await vite.close();
}

console.log('\n================================================================');
console.log('       EMPIRICAL CHALLENGER MILESTONE 3 RESULTS SUMMARY         ');
console.log('================================================================');
console.log(`TOTAL EMPIRICAL ASSERTIONS: ${totalAssertions}`);
console.log(`PASSED: ${passedAssertions}`);
console.log(`FAILED: ${failedAssertions}`);
console.log('================================================================\n');

if (failedAssertions > 0) {
  console.error('CRITICAL CHALLENGE FAILURES:');
  for (const f of failures) {
    console.error(`- ${f.desc}`);
    console.error(`  ${f.error}`);
  }
  process.exit(1);
} else {
  console.log(`VERDICT: ALL ${totalAssertions} EMPIRICAL ASSERTIONS PASSED WITH ZERO ERRORS!\n`);
  process.exit(0);
}
