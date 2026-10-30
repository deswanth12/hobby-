import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve('.');
const DIST = path.join(ROOT, 'dist');

console.log('================================================================');
console.log('  CHALLENGER 2: ADVERSARIAL EMPIRICAL HARNESS (MILESTONE 3)     ');
console.log('================================================================\n');

let total = 0;
let passed = 0;
const failures = [];
const warnings = [];

function assert(cond, desc, errDetails = '') {
  total++;
  if (cond) {
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${total}] ${desc}`);
  } else {
    failures.push({ desc, errDetails });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [Assert ${total}] ${desc}`);
    if (errDetails) console.log(`       Details: ${errDetails}`);
  }
}

function warn(cond, desc, details = '') {
  if (!cond) {
    warnings.push({ desc, details });
    console.log(`\x1b[33m⚠ WARN\x1b[0m ${desc}`);
    if (details) console.log(`       Details: ${details}`);
  }
}

// Target pages
const pages = [
  { name: 'AboutPage', file: 'src/pages/AboutPage.tsx', route: '/about' },
  { name: 'ServicesPage', file: 'src/pages/ServicesPage.tsx', route: '/services' },
  { name: 'AuditAssurancePage', file: 'src/pages/AuditAssurancePage.tsx', route: '/services/audit-assurance' },
  { name: 'IndustriesPage', file: 'src/pages/IndustriesPage.tsx', route: '/industries' },
  { name: 'LocationsPage', file: 'src/pages/LocationsPage.tsx', route: '/locations' },
];

const pageContents = pages.map(p => {
  const fullPath = path.join(ROOT, p.file);
  const content = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : '';
  return { ...p, content, fullPath };
});

const firmDataContent = fs.readFileSync(path.join(ROOT, 'src/data/firmData.ts'), 'utf8');

// -----------------------------------------------------------------------------
// SECTION 1: ADVERSARIAL SCAN FOR AI TROPES & PROHIBITED PATTERNS
// -----------------------------------------------------------------------------
console.log('\n--- Section 1: Adversarial Scan for Banned AI Tropes ---');

pageContents.forEach(({ name, content }) => {
  // Prohibit rounded-3xl (oversized bubbly cards)
  const rounded3xlMatches = content.match(/rounded-3xl/g) || [];
  assert(rounded3xlMatches.length === 0, `${name}: Zero rounded-3xl oversized card classes`, `Found: ${rounded3xlMatches.length}`);

  // Prohibit floating blur orbs
  const hasFloatingBlur = /animate-float/.test(content) && /blur-(2xl|3xl)/.test(content);
  assert(!hasFloatingBlur, `${name}: Zero floating blur orb decorators`);

  // Prohibit generic AI gradients (bg-gradient-to-r, bg-gradient-to-br, etc.)
  const gradientMatches = content.match(/bg-gradient-to-[a-z]+/g) || [];
  assert(gradientMatches.length === 0, `${name}: Zero generic AI gradient backgrounds`, `Found: ${gradientMatches.join(', ')}`);

  // Prohibit fake marketing statistics
  const fakeStats = /(100% Client Satisfaction|500\+\s*Happy Clients|1000\+\s*Audits Completed|Best CA Firm in India|Award Winning Chartered Accountants)/i;
  assert(!fakeStats.test(content), `${name}: Zero fabricated marketing statistics or claims`);

  // Prohibit fake client testimonials (ensure no client review quote cards or testimonial headings exist)
  const fakeTestimonials = /(<h[1-6][^>]*>[^<]*Client Testimonials[^<]*<\/h[1-6]>|TestimonialCard|<blockquote)/i;
  assert(!fakeTestimonials.test(content), `${name}: Zero fabricated client testimonials (ICAI compliance)`);

  // Verify backdrop-blur is only used on sticky navigation, not random floating cards
  const backdropMatches = content.match(/backdrop-blur/g) || [];
  if (backdropMatches.length > 0) {
    const isStickyNav = /sticky.*backdrop-blur|backdrop-blur.*sticky/.test(content);
    assert(isStickyNav, `${name}: backdrop-blur is strictly restricted to sticky navigation`);
  } else {
    assert(true, `${name}: No superfluous backdrop-blur detected`);
  }
});

// -----------------------------------------------------------------------------
// SECTION 2: TOUCH ERGONOMICS & INTERACTIVE ELEMENT SIZING
// -----------------------------------------------------------------------------
console.log('\n--- Section 2: Touch Ergonomics & Interactive Target Sizing (>= 44px) ---');

pageContents.forEach(({ name, content }) => {
  // Extract all <a>, <Link, <button elements
  const tagRegex = /<(a|Link|button)\b([^>]*?)>/g;
  let match;
  let elementCount = 0;
  let nonCompliantElements = [];

  while ((match = tagRegex.exec(content)) !== null) {
    elementCount++;
    const fullTag = match[0];
    const attrs = match[2];

    const hasMinHeight = /min-h-\[44px\]/.test(attrs);
    const hasExplicitH = /\bh-(11|12|14|16|\[44px\]|\[48px\])\b/.test(attrs);
    const hasStandardTactile = /btn-pill-action/.test(attrs);
    const isAdequatePadding = /py-(3|3\.5|4)\b/.test(attrs) && /px-(4|5|6)\b/.test(attrs);

    const isCompliant = hasMinHeight || hasExplicitH || hasStandardTactile || isAdequatePadding;
    if (!isCompliant) {
      nonCompliantElements.push(fullTag.substring(0, 100));
    }
  }

  assert(
    nonCompliantElements.length === 0,
    `${name}: All ${elementCount} interactive elements satisfy >= 44px touch target ergonomics`,
    `Non-compliant tags: ${nonCompliantElements.join(' | ')}`
  );
});

// -----------------------------------------------------------------------------
// SECTION 3: ANCHOR LINK SYMMETRY & SCROLL-MARGIN INTEGRITY
// -----------------------------------------------------------------------------
console.log('\n--- Section 3: Anchor Link Symmetry & Scroll Offset Alignment ---');

// ServicesPage jump bar verification
const servicesContent = pageContents.find(p => p.name === 'ServicesPage').content;
const servicesJumpLinks = [...servicesContent.matchAll(/href="(#[a-z0-9-]+)"/g)].map(m => m[1]);

assert(servicesJumpLinks.length >= 6, `ServicesPage defines >= 6 quick jump links (found ${servicesJumpLinks.length})`);

servicesJumpLinks.forEach(jump => {
  const targetId = jump.replace('#', '');
  // Target can be either explicit id="targetId" or dynamic category.id (like income-tax, gst, etc.)
  const explicitIdRegex = new RegExp(`id="${targetId}"`);
  const isDirect = explicitIdRegex.test(servicesContent);
  const isFirmData = firmDataContent.includes(`id: "${targetId}"`);
  
  assert(
    isDirect || isFirmData,
    `ServicesPage jump anchor ${jump} resolves to target element in DOM or firmData`
  );

  // If directly defined, check scroll-mt to prevent sticky header occlusion
  if (isDirect) {
    const sectionSnippet = servicesContent.substring(servicesContent.indexOf(`id="${targetId}"`) - 100, servicesContent.indexOf(`id="${targetId}"`) + 100);
    assert(
      /scroll-mt-(24|28|32)/.test(sectionSnippet),
      `Target element for ${jump} has scroll-margin offset to clear sticky header`
    );
  }
});

// IndustriesPage jump bar verification
const industriesContent = pageContents.find(p => p.name === 'IndustriesPage').content;
const industriesJumpLinks = [...industriesContent.matchAll(/href={`#\${([a-zA-Z0-9_.]+)}`}/g)].map(m => m[1]);
assert(
  /href={`#\${ind\.id}`}/.test(industriesContent),
  `IndustriesPage maps dynamic sector jump anchors via href={'#' + ind.id}`
);
assert(
  /id={ind\.id}/.test(industriesContent) && /scroll-mt-32/.test(industriesContent),
  `IndustriesPage sector targets bind id={ind.id} with scroll-mt-32 offset`
);

// -----------------------------------------------------------------------------
// SECTION 4: CLIENT DATA FIDELITY & CREDENTIAL RIGOR
// -----------------------------------------------------------------------------
console.log('\n--- Section 4: Verified Client Data & Professional Credential Rigor ---');

const fullCorpus = pageContents.map(p => p.content).join('\n') + '\n' + firmDataContent;

// 1. Partner Name Uniformity
assert(
  !/CA KavithaVijay SRJ/.test(pageContents.map(p => p.content).join(' ')),
  'Zero occurrences of stale "CA KavithaVijay SRJ" in M3 page components'
);
assert(
  fullCorpus.includes('CA Kavitha Vijay'),
  'Partner name correctly rendered as "CA Kavitha Vijay"'
);

// 2. ICAI Membership Number
assert(
  fullCorpus.includes('252985'),
  'ICAI Membership Number 252985 verified in firm data and pages'
);

// 3. CMA All India Rank
assert(
  /AIR 49/i.test(fullCorpus),
  'CMA Inter All India Rank 49 (AIR 49) verified'
);

// 4. Institutional Pedigree (Deloitte, Ford, Manohar Chowdhry)
assert(
  /Deloitte/i.test(fullCorpus),
  'Big 4 Deloitte pedigree verified'
);
assert(
  /Ford Motor Company/i.test(fullCorpus),
  'MNC Ford Motor Company internal audit experience verified'
);
assert(
  /Manohar Chowdhry/i.test(fullCorpus),
  'Manohar Chowdhry & Associates association verified'
);

// 5. Verified Awards
assert(
  /Move the Dot/i.test(fullCorpus) && /Live the Dot/i.test(fullCorpus),
  'Client-approved awards "Move the Dot" & "Live the Dot" verified'
);

// 6. Tirupati Chambers Geodetic Coordinates & Address
assert(
  /13°37'09\.3"N\s*79°25'04\.9"E/.test(fullCorpus),
  'Exact verified Tirupati GPS DMS coordinates 13°37\'09.3"N 79°25\'04.9"E present'
);
assert(
  /517501/.test(fullCorpus) && /Bairagi Patteda/i.test(fullCorpus),
  'Tirupati Bairagi Patteda address and PIN 517501 present'
);

// 7. Verified Contact Phone Number
assert(
  /\+91 96263 50900/.test(fullCorpus) || /919626350900/.test(fullCorpus),
  'Official practice phone number +91 96263 50900 verified'
);

// -----------------------------------------------------------------------------
// SECTION 5: STATUTORY CITATIONS RIGOR
// -----------------------------------------------------------------------------
console.log('\n--- Section 5: Statutory Citations Rigor across Disciplines ---');

// AboutPage citations
assert(/Chartered Accountants Act, 1949/.test(pageContents[0].content), 'AboutPage cites Chartered Accountants Act, 1949');
assert(/ICAI Code of Ethics/.test(pageContents[0].content), 'AboutPage cites ICAI Code of Ethics');

// ServicesPage citations
assert(/Section 44AB/i.test(servicesContent), 'ServicesPage cites Section 44AB Income Tax');
assert(/RERA/i.test(servicesContent), 'ServicesPage cites RERA compliance');

// AuditAssurancePage citations
const auditContent = pageContents.find(p => p.name === 'AuditAssurancePage').content;
assert(/CARO 2020/i.test(auditContent), 'AuditAssurancePage cites CARO 2020');
assert(/SAs 200–599|SA 505|SA 300|SA 700/i.test(auditContent), 'AuditAssurancePage cites Standards on Auditing (SAs)');
assert(/UDIN/i.test(auditContent), 'AuditAssurancePage cites mandatory UDIN generation');

// IndustriesPage citations
assert(/80-IAC/i.test(industriesContent), 'IndustriesPage Startups cites Section 80-IAC');
assert(/43B\(h\)/i.test(industriesContent), 'IndustriesPage MSMEs cites Section 43B(h)');
assert(/Form 3/i.test(industriesContent), 'IndustriesPage Real Estate cites RERA Form 3');
assert(/44ADA/i.test(industriesContent), 'IndustriesPage Professionals cites Section 44ADA');
assert(/10A\/10AB|12AB/i.test(industriesContent), 'IndustriesPage NGOs cites Form 10A/10AB & Sec 12AB');

// -----------------------------------------------------------------------------
// SECTION 6: SITEMAP & BUILD ARTIFACT INTEGRITY
// -----------------------------------------------------------------------------
console.log('\n--- Section 6: Sitemap & Build Artifact Verification ---');

const sitemapPath = path.join(ROOT, 'public', 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'public/sitemap.xml exists');

if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  pages.forEach(p => {
    assert(sitemapContent.includes(p.route), `sitemap.xml includes route: ${p.route}`);
  });
}

// -----------------------------------------------------------------------------
// SUMMARY VERDICT
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL ADVERSARIAL ASSERTIONS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failures.length}`);
console.log(`WARNINGS: ${warnings.length}`);
console.log('================================================================\n');

if (failures.length > 0) {
  console.log('VERDICT: REQUEST_CHANGES');
  process.exit(1);
} else {
  console.log('VERDICT: APPROVE');
  process.exit(0);
}
