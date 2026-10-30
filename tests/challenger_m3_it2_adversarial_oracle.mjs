/**
 * CHALLENGER M3 ITERATION 2: ADVERSARIAL ORACLE & STRESS HARNESS
 * Independent verification script for Milestone 3 Remediation Gate.
 */
import fs from 'fs';
import path from 'path';

const projectRoot = 'c:\\kavitha ca';
const targetPages = [
  { name: 'AboutPage', file: 'src/pages/AboutPage.tsx', canonical: '/about' },
  { name: 'ServicesPage', file: 'src/pages/ServicesPage.tsx', canonical: '/services' },
  { name: 'AuditAssurancePage', file: 'src/pages/AuditAssurancePage.tsx', canonical: '/services/audit-assurance' },
  { name: 'IndustriesPage', file: 'src/pages/IndustriesPage.tsx', canonical: '/industries' },
  { name: 'LocationsPage', file: 'src/pages/LocationsPage.tsx', canonical: '/locations' },
];

let total = 0;
let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message, details = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`✔ [PASS ${total}] ${message}`);
  } else {
    failed++;
    const errMsg = `✖ [FAIL ${total}] ${message}${details ? ` -> ${details}` : ''}`;
    console.error(errMsg);
    failures.push(errMsg);
  }
}

console.log('================================================================');
console.log('  CHALLENGER M3 IT2: ADVERSARIAL ORACLE FOR REMEDIATION GATE    ');
console.log('================================================================\n');

// 1. Target files existence
targetPages.forEach(p => {
  const fullPath = path.join(projectRoot, p.file);
  assert(fs.existsSync(fullPath), `${p.name} exists at ${p.file}`);
});

// Load file contents
const pages = targetPages.map(p => ({
  ...p,
  content: fs.readFileSync(path.join(projectRoot, p.file), 'utf-8')
}));

// Load firmData.ts
const firmDataContent = fs.readFileSync(path.join(projectRoot, 'src/data/firmData.ts'), 'utf-8');

console.log('\n--- 1. Specific Remediation Verification: AboutPage Phone Touch Target ---');
const about = pages.find(p => p.name === 'AboutPage');
const phoneRegex = /<a\s+href=\{`tel:\${firm\.contact\.primaryPhoneClean}`\}([^>]*?)>/;
const phoneMatch = about.content.match(phoneRegex);
assert(phoneMatch !== null, 'AboutPage contains primaryPhoneClean telephone link');
if (phoneMatch) {
  const attrs = phoneMatch[1];
  assert(
    attrs.includes('min-h-[44px]'),
    'AboutPage telephone link explicitly enforces min-h-[44px] touch target',
    `Found attributes: ${attrs}`
  );
  assert(
    attrs.includes('inline-flex') || attrs.includes('flex'),
    'AboutPage telephone link uses flex display for vertical centering with min-h',
    `Found attributes: ${attrs}`
  );
}

console.log('\n--- 2. Exhaustive Interactive Touch Target Sizing (WCAG 2.5.5 AAA >= 44px) ---');
pages.forEach(p => {
  const tagRegex = /<(a|Link|button)\b([^>]*?)>/g;
  let match;
  let interactiveCount = 0;
  const nonCompliant = [];

  while ((match = tagRegex.exec(p.content)) !== null) {
    interactiveCount++;
    const fullTag = match[0];
    const attrs = match[2];

    const hasMinHeight = /min-h-\[44px\]/.test(attrs);
    const hasExplicitH = /\bh-(11|12|14|16|\[44px\]|\[48px\])\b/.test(attrs);
    const hasStandardTactile = /btn-pill-action/.test(attrs);
    const isAdequatePadding = /py-(3|3\.5|4)\b/.test(attrs) && /px-(4|5|6)\b/.test(attrs);

    if (!(hasMinHeight || hasExplicitH || hasStandardTactile || isAdequatePadding)) {
      nonCompliant.push(fullTag.replace(/\s+/g, ' ').slice(0, 100));
    }
  }

  assert(
    nonCompliant.length === 0,
    `${p.name}: All ${interactiveCount} interactive elements satisfy >= 44px touch target ergonomics`,
    `Violations: ${nonCompliant.join(' ; ')}`
  );
});

console.log('\n--- 3. Semantic Heading Hierarchy & SEOHead Architecture ---');
pages.forEach(p => {
  // Exactly 1 h1
  const h1Matches = p.content.match(/<h1\b[^>]*>/g) || [];
  assert(h1Matches.length === 1, `${p.name} has exactly 1 <h1> tag (found ${h1Matches.length})`);

  // h2 section headings
  const h2Matches = p.content.match(/<h2\b[^>]*>/g) || [];
  assert(h2Matches.length >= 2, `${p.name} has structured <h2> section headings (found ${h2Matches.length})`);

  // SEOHead with matching canonicalPath
  const seoRegex = new RegExp(`<SEOHead[^>]*canonicalPath="${p.canonical}"`);
  assert(seoRegex.test(p.content), `${p.name} contains SEOHead with canonicalPath="${p.canonical}"`);
});

console.log('\n--- 4. Verified Client Credentials & Zero Hallucination Rigor ---');
const corpus = pages.map(p => p.content).join('\n') + '\n' + firmDataContent;

// Stale name check
assert(!/CA KavithaVijay SRJ/.test(pages.map(p => p.content).join(' ')), 'Zero stale CA KavithaVijay SRJ in M3 pages');

// Verbatim credentials
assert(corpus.includes('CA Kavitha Vijay'), 'Partner name CA Kavitha Vijay present across corpus');
assert(corpus.includes('252985'), 'ICAI Membership 252985 verified');
assert(/AIR 49/i.test(corpus), 'CMA Inter AIR 49 verified');
assert(/Deloitte/i.test(corpus), 'Deloitte institutional pedigree verified');
assert(/Ford Motor Company/i.test(corpus), 'Ford Motor Company internal audit pedigree verified');
assert(/Manohar Chowdhry/i.test(corpus), 'Manohar Chowdhry & Associates pedigree verified');
assert(/Move the Dot/i.test(corpus) && /Live the Dot/i.test(corpus), 'Move/Live the Dot awards verified');
assert(/13°37'09\.3"N\s*79°25'04\.9"E/.test(corpus), 'Tirupati chambers GPS DMS coordinates verified');
assert(/517501/.test(corpus), 'Tirupati PIN 517501 verified');
assert(/96263 50900/.test(corpus), 'Phone +91 96263 50900 verified');

console.log('\n--- 5. Anti-Trope & Luxury Editorial Design System Compliance ---');
const bannedTropes = [
  { name: 'Oversized rounded-3xl cards', pattern: /\brounded-3xl\b/ },
  { name: 'Floating blur decorators', pattern: /animate-float/ },
  { name: 'Extreme blur blobbing', pattern: /\bblur-(2xl|3xl)\b/ },
  { name: 'Fake 5-star claims', pattern: /\b(5-star|five star)\b/i },
  { name: 'Fake happy client claims', pattern: /\b(happy clients|what our clients say)\b/i },
  { name: 'Guaranteed marketing claims', pattern: /\b(100% Guaranteed|99\.9% Success)\b/i },
  { name: 'Cheap CA superlatives', pattern: /\b(Best CA in|Cheap CA)\b/i },
];

pages.forEach(p => {
  bannedTropes.forEach(t => {
    const hasTrope = t.pattern.test(p.content);
    assert(!hasTrope, `${p.name}: Clean of banned trope [${t.name}]`);
  });
});

console.log('\n--- 6. Internal Anchor Link & Section Resolution ---');
// ServicesPage anchor jump bar
const services = pages.find(p => p.name === 'ServicesPage');
const servAnchors = [...services.content.matchAll(/href="(#[a-z0-9-]+)"/g)].map(m => m[1]);
assert(servAnchors.length >= 6, `ServicesPage has >= 6 jump anchors (found ${servAnchors.length})`);
servAnchors.forEach(anchor => {
  const targetId = anchor.substring(1);
  const existsInPage = new RegExp(`id="${targetId}"`).test(services.content);
  const existsInFirm = firmDataContent.includes(`id: "${targetId}"`);
  assert(existsInPage || existsInFirm, `ServicesPage anchor ${anchor} resolves to element in DOM or firmData`);
});

// IndustriesPage anchor jump bar
const industries = pages.find(p => p.name === 'IndustriesPage');
assert(
  /href={`#\${ind\.id}`}/.test(industries.content),
  'IndustriesPage uses dynamic sector anchor mapping'
);
assert(
  /id={ind\.id}/.test(industries.content),
  'IndustriesPage targets define id={ind.id}'
);
assert(
  /scroll-mt-32/.test(industries.content),
  'IndustriesPage targets include scroll-mt-32 offset to avoid sticky header occlusion'
);

console.log('\n--- 7. Editorial Typography & Layout Classes ---');
const editorialClasses = [
  'font-editorial-h1',
  'font-editorial-h2',
  'font-editorial-h3',
  'font-editorial-body',
  'font-editorial-meta'
];

pages.forEach(p => {
  editorialClasses.forEach(c => {
    assert(p.content.includes(c), `${p.name} actively uses .${c}`);
  });
});

console.log('\n================================================================');
console.log(`TOTAL ADVERSARIAL ORACLE ASSERTIONS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('================================================================');

if (failed === 0) {
  console.log('\nVERDICT: APPROVE');
  process.exit(0);
} else {
  console.error('\nVERDICT: REQUEST_CHANGES');
  console.error('Failure breakdown:\n' + failures.join('\n'));
  process.exit(1);
}
