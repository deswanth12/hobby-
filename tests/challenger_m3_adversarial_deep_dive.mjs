import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');

console.log('================================================================');
console.log('  CHALLENGER M3: ADVERSARIAL DEEP DIVE & INTEGRITY HARNESS       ');
console.log('================================================================\n');

let total = 0;
let passed = 0;
let failed = 0;
const failures = [];

function check(desc, condition, extra = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`\x1b[32m✔ [PASS ${total}]\x1b[0m ${desc}`);
  } else {
    failed++;
    failures.push({ desc, extra });
    console.log(`\x1b[31m✖ [FAIL ${total}]\x1b[0m ${desc}`);
    if (extra) console.log(`   Detail: ${extra}`);
  }
}

// 1. Files under test
const files = {
  about: { path: 'src/pages/AboutPage.tsx', code: fs.readFileSync('src/pages/AboutPage.tsx', 'utf8') },
  services: { path: 'src/pages/ServicesPage.tsx', code: fs.readFileSync('src/pages/ServicesPage.tsx', 'utf8') },
  audit: { path: 'src/pages/AuditAssurancePage.tsx', code: fs.readFileSync('src/pages/AuditAssurancePage.tsx', 'utf8') },
  industries: { path: 'src/pages/IndustriesPage.tsx', code: fs.readFileSync('src/pages/IndustriesPage.tsx', 'utf8') },
  locations: { path: 'src/pages/LocationsPage.tsx', code: fs.readFileSync('src/pages/LocationsPage.tsx', 'utf8') },
};

const appCode = fs.readFileSync('src/App.tsx', 'utf8');
const navbarCode = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
const footerCode = fs.readFileSync('src/components/Footer.tsx', 'utf8');
const indexCss = fs.readFileSync('src/index.css', 'utf8');
const distCssFiles = fs.readdirSync('dist/assets').filter(f => f.endsWith('.css'));
const compiledCss = distCssFiles.map(f => fs.readFileSync(path.join('dist/assets', f), 'utf8')).join('\n');

console.log('--- SUITE 1: CSS Compilation & Design Token Presence in Dist Bundle ---');
// Verify clamp tokens actually made it into compiled CSS
check('Compiled CSS includes font-editorial-h1 rule', compiledCss.includes('.font-editorial-h1'));
check('Compiled CSS includes font-editorial-h2 rule', compiledCss.includes('.font-editorial-h2'));
check('Compiled CSS includes font-editorial-h3 rule', compiledCss.includes('.font-editorial-h3'));
check('Compiled CSS includes font-editorial-body rule', compiledCss.includes('.font-editorial-body'));
check('Compiled CSS includes font-editorial-meta rule', compiledCss.includes('.font-editorial-meta'));
check('Compiled CSS includes brand-forest color hex (#153f32)', compiledCss.includes('#153f32') || compiledCss.includes('21,63,50') || compiledCss.includes('21 63 50'));
check('Compiled CSS includes brand-deep color hex (#102d25)', compiledCss.includes('#102d25') || compiledCss.includes('16,45,37') || compiledCss.includes('16 45 37'));
check('Compiled CSS includes brand-gold color hex (#c3a66b)', compiledCss.includes('#c3a66b') || compiledCss.includes('195,166,107') || compiledCss.includes('195 166 107'));
check('Compiled CSS includes brand-ivory color hex (#f5f1e8)', compiledCss.includes('#f5f1e8') || compiledCss.includes('245,241,232') || compiledCss.includes('245 241 232'));

console.log('\n--- SUITE 2: Internal Anchor & Hash Link Integrity ---');
// 2.1 ServicesPage anchor hashes:
// Links pointing to #... on ServicesPage
const servicesAnchors = [
  'audit-spotlight-banner',
  'income-tax',
  'gst',
  'corporate-business',
  'rera-compliance',
  'advisory-consulting',
  'virtual-cfo'
];
servicesAnchors.forEach(a => {
  const hasTarget = files.services.code.includes(`id="${a}"`) || (files.services.code.includes('id={category.id}') && ['income-tax', 'gst', 'corporate-business', 'rera-compliance', 'advisory-consulting'].includes(a));
  check(`ServicesPage resolves internal anchor target #${a}`, hasTarget);
});

// Footer links pointing to ServicesPage anchors
const footerServicesHashes = ['#income-tax', '#gst', '#corporate-business', '#rera-compliance', '#advisory-consulting'];
footerServicesHashes.forEach(h => {
  check(`Footer links to /services${h}`, footerCode.includes(`/services${h}`));
});

// 2.2 IndustriesPage jump bar anchors
const industryAnchors = [
  'startups', 'msmes', 'manufacturing', 'real-estate', 'retail',
  'healthcare', 'education', 'ecommerce', 'professionals', 'ngos'
];
industryAnchors.forEach(ind => {
  check(`IndustriesPage jump bar links to #${ind}`, files.industries.code.includes(`href="#${ind}"`) || files.industries.code.includes(`href={\`#\${ind.id}\`}`));
  check(`IndustriesPage resolves section id="${ind}"`, files.industries.code.includes(`id="${ind}"`) || files.industries.code.includes('id={ind.id}'));
});

console.log('\n--- SUITE 3: Interactive Touch Target Sizing (WCAG 2.5.5 AAA >= 44px) ---');
// For each file, inspect every <a>, <Link>, and <button> to ensure minimum touch height
Object.entries(files).forEach(([name, { code }]) => {
  // Regex to extract JSX tags for interactive elements
  const interactiveTags = code.match(/<(?:a|Link|button)\b[^>]*>/g) || [];
  let sub44Count = 0;
  const offending = [];

  interactiveTags.forEach(tag => {
    // Check if tag specifies min-h-[44px], min-h-11, h-11, h-12, py-3, py-3.5, py-4, or btn-tactile
    const hasMinH = /min-h-\[(?:44px|48px)\]|min-h-11|min-h-12|h-11|h-12|h-14/.test(tag);
    const hasSub44Padding = /py-(?:0\.5|1|1\.5|2)\b/.test(tag) && !hasMinH;
    if (hasSub44Padding) {
      sub44Count++;
      offending.push(tag);
    }
  });

  check(`${name} has zero sub-44px interactive tags with small padding (found ${sub44Count})`, sub44Count === 0, offending.slice(0, 2).join('\n'));
});

console.log('\n--- SUITE 4: Verified Credentials & Cross-Route Consistency ---');
// Verified partner details
const verifiedName = 'CA Kavitha Vijay';
const unverifiedVariants = ['CA KavithaVijay SRJ', 'CA KavithaVijay', 'Kavitha & Co.', 'Kavitha and Co'];

Object.entries(files).forEach(([name, { code }]) => {
  check(`${name} does NOT contain unverified name variants`, !unverifiedVariants.some(v => code.includes(v)));
});

// Check ICAI Membership number
check('AboutPage cites ICAI Mem. 252985', files.about.code.includes('252985'));
check('AuditAssurancePage cites ICAI Mem. 252985', files.audit.code.includes('252985'));
check('LocationsPage cites ICAI Mem. 252985', files.locations.code.includes('252985'));

// Check CMA AIR 49
check('AboutPage cites CMA AIR 49', files.about.code.includes('AIR 49'));
check('ServicesPage cites CMA AIR 49', files.services.code.includes('AIR 49'));
check('AuditAssurancePage cites CMA AIR 49', files.audit.code.includes('AIR 49'));

// Check Chambers location
check('AboutPage cites Tirupati chambers', files.about.code.includes('Tirupati'));
check('LocationsPage cites Tirupati chambers PIN 517501', files.locations.code.includes('517501'));
check('LocationsPage cites GPS coordinates DMS 13°37\'09.3"N', files.locations.code.includes('13°37\'09.3"N'));

console.log('\n--- SUITE 5: Zero Slop & ICAI Regulatory Integrity ---');
const bannedSlop = [
  'animate-float',
  'blur-3xl',
  'blur-2xl',
  '5-star',
  'five star',
  'happy clients',
  'what our clients say',
  '100% Guaranteed',
  '99.9% Success',
  'Best CA in',
  'Cheap CA'
];

Object.entries(files).forEach(([name, { code }]) => {
  bannedSlop.forEach(term => {
    check(`${name} does NOT contain slop keyword "${term}"`, !code.toLowerCase().includes(term.toLowerCase()));
  });
});

console.log('\n--- SUITE 6: Semantic Heading Structure & Accessibility ---');
Object.entries(files).forEach(([name, { code }]) => {
  // Check that each page has exactly one <h1>
  const h1Matches = code.match(/<h1\b[^>]*>/g) || [];
  check(`${name} has exactly one <h1> element (found ${h1Matches.length})`, h1Matches.length === 1);

  // Check that all <h2> elements exist
  const h2Matches = code.match(/<h2\b[^>]*>/g) || [];
  check(`${name} has structured <h2> section headings (found ${h2Matches.length})`, h2Matches.length >= 1);

  // Check SEOHead canonicalPath matches the route
  const expectedRoutes = {
    about: '/about',
    services: '/services',
    audit: '/services/audit-assurance',
    industries: '/industries',
    locations: '/locations'
  };
  check(`${name} defines SEOHead with canonicalPath="${expectedRoutes[name]}"`, code.includes(`canonicalPath="${expectedRoutes[name]}"`));
});

console.log('\n================================================================');
console.log(`TOTAL ADVERSARIAL ASSERTIONS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('================================================================');

if (failed > 0) {
  console.log('\nADVERSARIAL CHALLENGE FINDINGS:');
  failures.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.desc}`);
    if (f.extra) console.log(`     Details: ${f.extra}`);
  });
  process.exit(1);
} else {
  console.log('\nALL ADVERSARIAL CHALLENGES PASSED EMPIRICALLY WITH ZERO DEFECTS!\n');
  process.exit(0);
}
