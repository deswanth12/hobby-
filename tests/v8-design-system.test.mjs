import fs from 'fs';
import path from 'path';

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✔ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`✖ FAIL: ${message}`);
    failCount++;
  }
}

// WCAG relative luminance & contrast ratio calculation
function sRGBToLin(colorVal) {
  return colorVal <= 0.04045 ? colorVal / 12.92 : Math.pow((colorVal + 0.055) / 1.055, 2.4);
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16) / 255,
    g: parseInt(clean.substring(2, 4), 16) / 255,
    b: parseInt(clean.substring(4, 6), 16) / 255,
  };
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * sRGBToLin(r) + 0.7152 * sRGBToLin(g) + 0.0722 * sRGBToLin(b);
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

console.log('================================================================');
console.log('  TEST: V8.0 DESIGN SYSTEM & SHARED COMPONENTS VERIFICATION     ');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// Suite 1: Root Deliverable Documentation
// -----------------------------------------------------------------------------
console.log('▶ Suite 1: Root Deliverables Publication');
const designSystemDoc = path.resolve('V80_DESIGN_SYSTEM.md');
const archDoc = path.resolve('V80_FRONTEND_ARCHITECTURE.md');

assert(fs.existsSync(designSystemDoc), 'V80_DESIGN_SYSTEM.md exists at root');
assert(fs.existsSync(archDoc), 'V80_FRONTEND_ARCHITECTURE.md exists at root');

if (fs.existsSync(designSystemDoc)) {
  const content = fs.readFileSync(designSystemDoc, 'utf8');
  assert(content.includes('The Botanical Ledger'), 'Design System specifies The Botanical Ledger identity');
  assert(content.includes('#071B14') && content.includes('#B49A64') && content.includes('#F1EBDD'), 'Design System documents core palette hex codes');
  assert(content.includes('#7E5E1E'), 'Design System documents WCAG AA Dark Bronze token (#7E5E1E)');
  assert(content.includes('Cormorant Garamond') && content.includes('Inter'), 'Design System documents serif & sans pairing');
}

if (fs.existsSync(archDoc)) {
  const content = fs.readFileSync(archDoc, 'utf8');
  assert(content.includes('src/v8/'), 'Architecture specification defines src/v8/ directory tree');
  assert(content.includes('Triple-Layer Draft Quarantine'), 'Architecture defines draft isolation contracts');
}

// -----------------------------------------------------------------------------
// Suite 2: Tailwind Configuration & Centralized Tokens
// -----------------------------------------------------------------------------
console.log('\n▶ Suite 2: Tailwind Configuration & Design Tokens');
const tailwindConfigPath = path.resolve('tailwind.config.js');
assert(fs.existsSync(tailwindConfigPath), 'tailwind.config.js exists');

if (fs.existsSync(tailwindConfigPath)) {
  const content = fs.readFileSync(tailwindConfigPath, 'utf8');
  assert(content.includes('evergreen'), 'tailwind.config.js defines evergreen color family');
  assert(content.includes('bronze'), 'tailwind.config.js defines bronze color family');
  assert(content.includes('walnut'), 'tailwind.config.js defines walnut color family');
  assert(content.includes('warmivory'), 'tailwind.config.js defines warmivory color family');
  assert(content.includes('softsage'), 'tailwind.config.js defines softsage color family');
  assert(content.includes('mutedborder'), 'tailwind.config.js defines mutedborder color token');

  // Verify legacy admin key preservation
  assert(content.includes('darkgreen:') || content.includes('chambers:'), 'Preserves legacy brand.darkgreen / brand.chambers for admin views');
  assert(content.includes('brightgold:') || content.includes('gold:'), 'Preserves legacy brand.brightgold for admin views');
  assert(content.includes('cream:'), 'Preserves legacy brand.cream for admin views');
  assert(content.includes('forest:'), 'Preserves legacy brand.forest for admin views');

  // Fluid typography scale
  assert(content.includes('fluid-h1') && content.includes('fluid-h2') && content.includes('fluid-body'), 'Defines fluid typography clamp scales');
  assert(content.includes('kicker'), 'Defines kicker letter spacing');
  assert(content.includes('editorial'), 'Defines editorial transition timing function');
}

// -----------------------------------------------------------------------------
// Suite 3: Index CSS Tokens & Architectural Utilities
// -----------------------------------------------------------------------------
console.log('\n▶ Suite 3: Index CSS Variables & Architectural Utilities');
const indexCssPath = path.resolve('src/index.css');
assert(fs.existsSync(indexCssPath), 'src/index.css exists');

if (fs.existsSync(indexCssPath)) {
  const content = fs.readFileSync(indexCssPath, 'utf8');
  assert(content.includes('--color-deep-evergreen: #071B14;'), 'Declares --color-deep-evergreen in :root');
  assert(content.includes('--color-forest-green: #183529;'), 'Declares --color-forest-green in :root');
  assert(content.includes('--color-antique-bronze: #B49A64;'), 'Declares --color-antique-bronze in :root');
  assert(content.includes('--color-antique-bronze-dark: #7E5E1E;'), 'Declares --color-antique-bronze-dark in :root');
  assert(content.includes('--color-warm-ivory: #F1EBDD;'), 'Declares --color-warm-ivory in :root');
  assert(content.includes('--color-walnut-brown: #35271F;'), 'Declares --color-walnut-brown in :root');

  // Architectural Utilities
  assert(content.includes('.double-bezel-evergreen'), 'Implements .double-bezel-evergreen utility');
  assert(content.includes('.double-bezel-ivory'), 'Implements .double-bezel-ivory utility');
  assert(content.includes('.hairline-divider-bronze'), 'Implements .hairline-divider-bronze utility');
  assert(content.includes('.dual-arrow-badge'), 'Implements .dual-arrow-badge micro-physics');
  assert(content.includes('.btn-tactile'), 'Implements .btn-tactile press physics');
  assert(content.includes('.corner-bracket'), 'Implements .corner-bracket architectural accents');
}

// -----------------------------------------------------------------------------
// Suite 4: V8 Shared Components Existence & Modular Exports
// -----------------------------------------------------------------------------
console.log('\n▶ Suite 4: V8 Shared Components Modular Implementation');
const requiredComponents = [
  'src/v8/components/common/CrestMonogram.tsx',
  'src/v8/components/common/Button.tsx',
  'src/v8/components/common/ArchitecturalFrame.tsx',
  'src/v8/components/common/Badge.tsx',
  'src/v8/components/common/Accordion.tsx',
  'src/v8/components/common/Tabs.tsx',
  'src/v8/components/common/LoadingSkeleton.tsx',
  'src/v8/components/common/ErrorBoundary.tsx',
  'src/v8/components/common/NotFoundPage.tsx',
  'src/v8/components/forms/ContactForm.tsx',
  'src/v8/components/layout/PublicLayout.tsx',
  'src/v8/components/layout/Navbar.tsx',
  'src/v8/components/layout/Footer.tsx',
  'src/v8/components/layout/MobileDrawer.tsx',
  'src/v8/components/layout/SkipToContent.tsx',
  'src/v8/components/layout/ScrollProgress.tsx',
  'src/v8/components/layout/BackToTop.tsx',
  'src/v8/components/layout/FloatingWhatsApp.tsx',
];

for (const compPath of requiredComponents) {
  assert(fs.existsSync(path.resolve(compPath)), `Component file exists: ${compPath}`);
}

// -----------------------------------------------------------------------------
// Suite 5: Regulatory Compliance & Safeguards (R4)
// -----------------------------------------------------------------------------
console.log('\n▶ Suite 5: Regulatory Compliance & Privacy Safeguards (R4)');
const crestContent = fs.readFileSync(path.resolve('src/v8/components/common/CrestMonogram.tsx'), 'utf8');
assert(crestContent.includes('CMA AIR 49 (ICMAI)') || crestContent.includes('ICMAI'), 'CrestMonogram attributes CMA AIR 49 specifically to ICMAI');
assert(!crestContent.includes('[REDACTED_MEMBERSHIP_NO]') && !crestContent.includes('238692'), 'CrestMonogram excludes individual ICAI membership numbers');
assert(crestContent.includes('KV') && crestContent.includes('KA'), 'CrestMonogram renders neutral Roman initials KV / KA');

const footerContent = fs.readFileSync(path.resolve('src/v8/components/layout/Footer.tsx'), 'utf8');
assert(footerContent.includes('to="/blog"'), 'Footer maintains to="/blog" link for test continuity');
assert(footerContent.includes('serviceFootprint.map'), 'Footer retains serviceFootprint.map loop invariant');
assert(footerContent.includes('ICMAI'), 'Footer includes explicit ICMAI attribution');
assert(footerContent.includes('Tirupati'), 'Footer includes Tirupati chambers address');

const navbarContent = fs.readFileSync(path.resolve('src/v8/components/layout/Navbar.tsx'), 'utf8');
assert(navbarContent.includes('to="/blog"'), 'Navbar maintains to="/blog" link for test continuity');
assert(navbarContent.includes('ICMAI'), 'Navbar includes explicit ICMAI attribution');

// -----------------------------------------------------------------------------
// Suite 6: ContactForm Backend Integration & Anti-Spam Guards
// -----------------------------------------------------------------------------
console.log('\n▶ Suite 6: ContactForm Backend Integration & Anti-Spam');
const formContent = fs.readFileSync(path.resolve('src/v8/components/forms/ContactForm.tsx'), 'utf8');
assert(formContent.includes('website_fax_hp'), 'ContactForm implements website_fax_hp honeypot field');
assert(formContent.includes('formLoadedAt'), 'ContactForm tracks formLoadedAt for velocity defense');
assert(formContent.includes('submitEnquiry'), 'ContactForm imports and invokes submitEnquiry from backendAdapter');
assert(formContent.includes('fullName') && formContent.includes('phone') && formContent.includes('email') && formContent.includes('message'), 'ContactForm provides all required intake fields');
assert(formContent.includes('generateWhatsAppUrl'), 'ContactForm integrates generateWhatsAppUrl');

// -----------------------------------------------------------------------------
// Suite 7: Mathematical WCAG Contrast Ratios
// -----------------------------------------------------------------------------
console.log('\n▶ Suite 7: Mathematical Contrast Ratios (WCAG 2.1 AA / AAA)');
const crWalnutOnIvory = getContrastRatio('#35271F', '#F1EBDD');
assert(crWalnutOnIvory >= 7.0, `Walnut on Warm Ivory contrast is ${crWalnutOnIvory.toFixed(2)}:1 (Passes AAA >= 7:1)`);

const crDarkBronzeOnIvory = getContrastRatio('#7E5E1E', '#F1EBDD');
assert(crDarkBronzeOnIvory >= 4.5, `Dark Bronze on Warm Ivory contrast is ${crDarkBronzeOnIvory.toFixed(2)}:1 (Passes AA >= 4.5:1)`);

const crDarkBronzeOnCard = getContrastRatio('#7E5E1E', '#FAF7F0');
assert(crDarkBronzeOnCard >= 4.5, `Dark Bronze on Ivory Card contrast is ${crDarkBronzeOnCard.toFixed(2)}:1 (Passes AA >= 4.5:1)`);

const crBronzeOnEvergreen = getContrastRatio('#B49A64', '#071B14');
assert(crBronzeOnEvergreen >= 4.5, `Antique Bronze on Deep Evergreen contrast is ${crBronzeOnEvergreen.toFixed(2)}:1 (Passes AA >= 4.5:1)`);

const crIvoryOnEvergreen = getContrastRatio('#F1EBDD', '#071B14');
assert(crIvoryOnEvergreen >= 7.0, `Warm Ivory on Deep Evergreen contrast is ${crIvoryOnEvergreen.toFixed(2)}:1 (Passes AAA >= 7:1)`);

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL DESIGN SYSTEM ASSERTIONS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('ALL V8.0 DESIGN SYSTEM & COMPONENT ARCHITECTURAL CONTRACTS VERIFIED!');
}
