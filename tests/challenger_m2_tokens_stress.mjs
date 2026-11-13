import fs from 'fs';
import path from 'path';

let passCount = 0;
let failCount = 0;
const failureDetails = [];

function assert(condition, message, details = '') {
  if (condition) {
    passCount++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${passCount + failCount}] ${message}`);
  } else {
    failCount++;
    failureDetails.push({ message, details });
    console.error(`\x1b[31m✖ FAIL\x1b[0m [Assert ${passCount + failCount}] ${message}`);
    if (details) {
      console.error(`       Details: ${details}`);
    }
  }
}

// -----------------------------------------------------------------------------
// WCAG 2.1 Relative Luminance & Contrast Mathematics
// -----------------------------------------------------------------------------
function sRGBToLin(colorVal) {
  return colorVal <= 0.04045 ? colorVal / 12.92 : Math.pow((colorVal + 0.055) / 1.055, 2.4);
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '').trim();
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
console.log('  CHALLENGER M2.1: DESIGN TOKENS, WCAG MATH & CLAMP FUZZING     ');
console.log('  Adversarial Stress Test & Empirical Verification Suite        ');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// Vector 1: Mathematical Contrast Verification
// -----------------------------------------------------------------------------
console.log('▶ Vector 1: Mathematical Contrast Verification (WCAG 2.1 AA / AAA)');

const palette = {
  deepEvergreen: '#071B14',
  forestGreen: '#183529',
  botanicalGreen: '#294B39',
  evergreenSurface: '#0B241C',
  antiqueBronze: '#B49A64',
  antiqueBronzeHover: '#9E844E',
  darkBronze: '#7E5E1E',
  lightBronze: '#C8B282',
  warmIvory: '#F1EBDD',
  warmIvoryCard: '#FAF7F0',
  walnutBrown: '#35271F',
  walnutMuted: '#4D3B32',
  softSage: '#AAB4A0',
  mutedBorder: '#D8D0BE',
};

// 1.1 Exact pairwise contrast calculations
const crAntiqueBronzeOnWarmIvory = getContrastRatio(palette.antiqueBronze, palette.warmIvory);
console.log(`    • Antique Bronze (#B49A64) on Warm Ivory (#F1EBDD): ${crAntiqueBronzeOnWarmIvory.toFixed(2)}:1`);
assert(
  crAntiqueBronzeOnWarmIvory < 4.5,
  `Antique Bronze on Warm Ivory fails WCAG AA text threshold (${crAntiqueBronzeOnWarmIvory.toFixed(2)}:1 < 4.5:1), confirming mathematical hazard`,
  `Ratio: ${crAntiqueBronzeOnWarmIvory}`
);

const crDarkBronzeOnWarmIvory = getContrastRatio(palette.darkBronze, palette.warmIvory);
console.log(`    • Dark Bronze (#7E5E1E) on Warm Ivory (#F1EBDD): ${crDarkBronzeOnWarmIvory.toFixed(2)}:1`);
assert(
  crDarkBronzeOnWarmIvory >= 4.5,
  `Dark Bronze on Warm Ivory meets WCAG AA (>= 4.5:1) with ${crDarkBronzeOnWarmIvory.toFixed(2)}:1`,
  `Ratio: ${crDarkBronzeOnWarmIvory}`
);

const crDarkBronzeOnIvoryCard = getContrastRatio(palette.darkBronze, palette.warmIvoryCard);
console.log(`    • Dark Bronze (#7E5E1E) on Ivory Card (#FAF7F0): ${crDarkBronzeOnIvoryCard.toFixed(2)}:1`);
assert(
  crDarkBronzeOnIvoryCard >= 4.5,
  `Dark Bronze on Ivory Card meets WCAG AA (>= 4.5:1) with ${crDarkBronzeOnIvoryCard.toFixed(2)}:1`,
  `Ratio: ${crDarkBronzeOnIvoryCard}`
);

const crWalnutOnWarmIvory = getContrastRatio(palette.walnutBrown, palette.warmIvory);
console.log(`    • Walnut Brown (#35271F) on Warm Ivory (#F1EBDD): ${crWalnutOnWarmIvory.toFixed(2)}:1`);
assert(
  crWalnutOnWarmIvory >= 7.0,
  `Walnut Brown on Warm Ivory meets WCAG AAA (>= 7.0:1) with ${crWalnutOnWarmIvory.toFixed(2)}:1`,
  `Ratio: ${crWalnutOnWarmIvory}`
);

const crWalnutOnIvoryCard = getContrastRatio(palette.walnutBrown, palette.warmIvoryCard);
console.log(`    • Walnut Brown (#35271F) on Ivory Card (#FAF7F0): ${crWalnutOnIvoryCard.toFixed(2)}:1`);
assert(
  crWalnutOnIvoryCard >= 7.0,
  `Walnut Brown on Ivory Card meets WCAG AAA (>= 7.0:1) with ${crWalnutOnIvoryCard.toFixed(2)}:1`,
  `Ratio: ${crWalnutOnIvoryCard}`
);

const crAntiqueBronzeOnDeepEvergreen = getContrastRatio(palette.antiqueBronze, palette.deepEvergreen);
console.log(`    • Antique Bronze (#B49A64) on Deep Evergreen (#071B14): ${crAntiqueBronzeOnDeepEvergreen.toFixed(2)}:1`);
assert(
  crAntiqueBronzeOnDeepEvergreen >= 4.5,
  `Antique Bronze on Deep Evergreen meets WCAG AA (>= 4.5:1) with ${crAntiqueBronzeOnDeepEvergreen.toFixed(2)}:1`,
  `Ratio: ${crAntiqueBronzeOnDeepEvergreen}`
);

const crWarmIvoryOnDeepEvergreen = getContrastRatio(palette.warmIvory, palette.deepEvergreen);
console.log(`    • Warm Ivory (#F1EBDD) on Deep Evergreen (#071B14): ${crWarmIvoryOnDeepEvergreen.toFixed(2)}:1`);
assert(
  crWarmIvoryOnDeepEvergreen >= 7.0,
  `Warm Ivory on Deep Evergreen meets WCAG AAA (>= 7.0:1) with ${crWarmIvoryOnDeepEvergreen.toFixed(2)}:1`,
  `Ratio: ${crWarmIvoryOnDeepEvergreen}`
);

const crForestGreenOnWarmIvory = getContrastRatio(palette.forestGreen, palette.warmIvory);
console.log(`    • Forest Green (#183529) on Warm Ivory (#F1EBDD): ${crForestGreenOnWarmIvory.toFixed(2)}:1`);
assert(
  crForestGreenOnWarmIvory >= 7.0,
  `Forest Green on Warm Ivory meets WCAG AAA (>= 7.0:1) with ${crForestGreenOnWarmIvory.toFixed(2)}:1`,
  `Ratio: ${crForestGreenOnWarmIvory}`
);

// -----------------------------------------------------------------------------
// Vector 2: Source Code Adversarial Text-on-Ivory Audit
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 2: Source Code Adversarial Text-on-Ivory Audit');

const v8ComponentDir = path.resolve('src/v8/components');
assert(fs.existsSync(v8ComponentDir), 'src/v8/components directory exists');

function getAllFiles(dir, exts = ['.ts', '.tsx']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(file))) {
      results.push(fullPath);
    }
  }
  return results;
}

const componentFiles = getAllFiles(v8ComponentDir);
console.log(`    Scanning ${componentFiles.length} V8 component files for illegal text color combinations...`);

let illegalBronzeUsage = [];

for (const file of componentFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative('.', file);

  // Check for suspicious patterns where Antique Bronze is used as text on light ivory backgrounds
  // E.g. bg-[#F1EBDD] ... text-[#B49A64] or bg-[#FAF7F0] ... text-[#B49A64]
  const lines = content.split('\n');
  lines.forEach((line, lineNum) => {
    // If a line has text-[#B49A64] or text-bronze, check if it's placed on ivory
    if (line.includes('text-[#B49A64]') || line.includes('text-bronze')) {
      if (line.includes('bg-[#F1EBDD]') || line.includes('bg-[#FAF7F0]') || line.includes('bg-warmivory')) {
        illegalBronzeUsage.push({ file: relPath, line: lineNum + 1, content: line.trim() });
      }
    }
  });
}

assert(
  illegalBronzeUsage.length === 0,
  `Zero instances of Antique Bronze (#B49A64) used as text on Warm Ivory in V8 components (${illegalBronzeUsage.length} found)`,
  illegalBronzeUsage.map((u) => `${u.file}:${u.line} -> ${u.content}`).join('\n')
);

// -----------------------------------------------------------------------------
// Vector 3: Fluid Clamp Equation Fuzzing & Monotonicity Verification
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 3: Fluid Clamp Equation Fuzzing (320px to 2560px @ 1px steps)');

// Evaluator for clamp(minRem, preferredRem + coeffVw, maxRem)
function evaluateRemVwClamp(minRem, preferredRem, coeffVw, maxRem, viewportWidthPx) {
  const minPx = minRem * 16;
  const maxPx = maxRem * 16;
  const preferredPx = preferredRem * 16 + (coeffVw / 100) * viewportWidthPx;
  return Math.min(Math.max(preferredPx, minPx), maxPx);
}

// Evaluator for clamp(minRem, coeffVw, maxRem) (e.g. clamp(2.1rem, 7vw, 3.1rem))
function evaluatePureVwClamp(minRem, coeffVw, maxRem, viewportWidthPx) {
  const minPx = minRem * 16;
  const maxPx = maxRem * 16;
  const preferredPx = (coeffVw / 100) * viewportWidthPx;
  return Math.min(Math.max(preferredPx, minPx), maxPx);
}

const tailwindClamps = [
  { name: 'fluid-h1', minRem: 1.875, preferredRem: 1.35, coeffVw: 2.5, maxRem: 3.75 },
  { name: 'fluid-h2', minRem: 1.75, preferredRem: 1.35, coeffVw: 2.0, maxRem: 2.75 },
  { name: 'fluid-h3', minRem: 1.375, preferredRem: 1.15, coeffVw: 1.1, maxRem: 1.875 },
  { name: 'fluid-h4', minRem: 1.25, preferredRem: 1.125, coeffVw: 0.55, maxRem: 1.5 },
  { name: 'fluid-body', minRem: 0.9375, preferredRem: 0.875, coeffVw: 0.3, maxRem: 1.0625 },
  { name: 'fluid-meta', minRem: 0.6875, preferredRem: 0.65, coeffVw: 0.2, maxRem: 0.75 },
];

const indexCssClamps = [
  { name: '.font-editorial-h1', minRem: 2.1, coeffVw: 7.0, maxRem: 3.1 },
  { name: '.font-editorial-hero-sub', minRem: 1.35, coeffVw: 5.0, maxRem: 2.1 },
  { name: '.font-editorial-h2', minRem: 1.75, coeffVw: 5.0, maxRem: 2.75 },
  { name: '.font-editorial-h3', minRem: 1.25, coeffVw: 3.5, maxRem: 1.75 },
  { name: '.font-editorial-body', minRem: 1.0, coeffVw: 3.5, maxRem: 1.125 },
  { name: '.font-editorial-meta', minRem: 0.6875, preferredRem: 0.65, coeffVw: 0.2, maxRem: 0.75 },
];

const VIEWPORT_MIN = 320;
const VIEWPORT_MAX = 2560;
const STEP = 1;
const TOTAL_WIDTHS = (VIEWPORT_MAX - VIEWPORT_MIN) / STEP + 1; // 2241 discrete widths

console.log(`    Fuzzing ${tailwindClamps.length} Tailwind clamps over ${TOTAL_WIDTHS} discrete viewports...`);

for (const clampDef of tailwindClamps) {
  let isMonotonic = true;
  let nonMonotonicDetails = null;
  let hasNaNOrInf = false;
  let hasNegative = false;
  let previousVal = -Infinity;

  for (let w = VIEWPORT_MIN; w <= VIEWPORT_MAX; w += STEP) {
    const val = evaluateRemVwClamp(
      clampDef.minRem,
      clampDef.preferredRem,
      clampDef.coeffVw,
      clampDef.maxRem,
      w
    );

    if (isNaN(val) || !isFinite(val)) {
      hasNaNOrInf = true;
    }
    if (val <= 0) {
      hasNegative = true;
    }
    if (val < previousVal - 1e-9) {
      isMonotonic = false;
      nonMonotonicDetails = `At ${w}px, val (${val.toFixed(4)}) < prev at ${w - STEP}px (${previousVal.toFixed(4)})`;
      break;
    }
    previousVal = val;
  }

  assert(isMonotonic, `Tailwind '${clampDef.name}' clamp is strictly monotonic non-decreasing across [320px, 2560px]`, nonMonotonicDetails);
  assert(!hasNaNOrInf, `Tailwind '${clampDef.name}' clamp has zero NaN or infinite outputs`);
  assert(!hasNegative, `Tailwind '${clampDef.name}' clamp has strictly positive font sizes`);

  const val320 = evaluateRemVwClamp(clampDef.minRem, clampDef.preferredRem, clampDef.coeffVw, clampDef.maxRem, 320);
  const val2560 = evaluateRemVwClamp(clampDef.minRem, clampDef.preferredRem, clampDef.coeffVw, clampDef.maxRem, 2560);
  assert(
    val320 >= clampDef.minRem * 16 && val320 <= clampDef.maxRem * 16,
    `Tailwind '${clampDef.name}' at 320px (${val320.toFixed(2)}px) is within [${clampDef.minRem * 16}px, ${clampDef.maxRem * 16}px]`
  );
  assert(
    val2560 >= clampDef.minRem * 16 && val2560 <= clampDef.maxRem * 16,
    `Tailwind '${clampDef.name}' at 2560px (${val2560.toFixed(2)}px) is within [${clampDef.minRem * 16}px, ${clampDef.maxRem * 16}px]`
  );
}

console.log(`    Fuzzing ${indexCssClamps.length} CSS utility clamps over ${TOTAL_WIDTHS} discrete viewports...`);

for (const clampDef of indexCssClamps) {
  let isMonotonic = true;
  let nonMonotonicDetails = null;
  let hasNaNOrInf = false;
  let previousVal = -Infinity;

  for (let w = VIEWPORT_MIN; w <= VIEWPORT_MAX; w += STEP) {
    const val = clampDef.preferredRem !== undefined
      ? evaluateRemVwClamp(clampDef.minRem, clampDef.preferredRem, clampDef.coeffVw, clampDef.maxRem, w)
      : evaluatePureVwClamp(clampDef.minRem, clampDef.coeffVw, clampDef.maxRem, w);

    if (isNaN(val) || !isFinite(val)) {
      hasNaNOrInf = true;
    }
    if (val < previousVal - 1e-9) {
      isMonotonic = false;
      nonMonotonicDetails = `At ${w}px, val (${val.toFixed(4)}) < prev at ${w - STEP}px (${previousVal.toFixed(4)})`;
      break;
    }
    previousVal = val;
  }

  assert(isMonotonic, `CSS '${clampDef.name}' clamp is strictly monotonic non-decreasing across [320px, 2560px]`, nonMonotonicDetails);
  assert(!hasNaNOrInf, `CSS '${clampDef.name}' clamp has zero NaN or infinite outputs`);
}

// -----------------------------------------------------------------------------
// Vector 4: Legacy Token Regression Defense
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 4: Legacy Token Regression Defense');

const tailwindConfig = fs.readFileSync(path.resolve('tailwind.config.js'), 'utf8');

const requiredLegacyBrandKeys = [
  { key: 'evergreen', expected: '#071B14' },
  { key: 'deepergreen', expected: '#04100C' },
  { key: 'forestgreen', expected: '#183529' },
  { key: 'botanicalgreen', expected: '#294B39' },
  { key: 'bronze', expected: '#B49A64' },
  { key: 'bronzehover', expected: '#9E844E' },
  { key: 'bronzedark', expected: '#7E5E1E' },
  { key: 'warmivory', expected: '#F1EBDD' },
  { key: 'ivorycard', expected: '#FAF7F0' },
  { key: 'walnut', expected: '#35271F' },
  { key: 'softsage', expected: '#AAB4A0' },
  { key: 'mutedborder', expected: '#D8D0BE' },
  { key: 'cream', expected: '#F5EAD8' },
  { key: 'ivory', expected: '#F8EFDF' },
  { key: 'softbeige', expected: '#EFE0C7' },
  { key: 'warmwhite', expected: '#FFF9EF' },
  { key: 'purewhite', expected: '#FFFFFF' },
  { key: 'champagne', expected: '#E8D5B5' },
  { key: 'sage', expected: '#DDE8D9' },
  { key: 'forest', expected: '#153F32' },
  { key: 'elegant', expected: '#1B4D3E' },
  { key: 'deep', expected: '#102D25' },
  { key: 'chambers', expected: '#102D25' },
  { key: 'darkgreen', expected: '#102D25' },
  { key: 'vibrantforest', expected: '#1B4D3E' },
  { key: 'gold', expected: '#C3A66B' },
  { key: 'brightgold', expected: '#D4AF37' },
  { key: 'softgold', expected: '#E8CD96' },
  { key: 'goldhover', expected: '#DAB876' },
  { key: 'charcoal', expected: '#302B24' },
  { key: 'secondary', expected: '#525954' },
  { key: 'muted', expected: '#68706A' },
  { key: 'border', expected: '#E8D5B5' },
  { key: 'surface', expected: '#FFF9EF' },
  { key: 'pale', expected: '#FFF9EF' },
  { key: 'canonicalivory', expected: '#F5F1E8' },
  { key: 'canonicalcharcoal', expected: '#252B27' },
  { key: 'canonicalsecondary', expected: '#747A73' },
  { key: 'canonicalborder', expected: '#E5E1D8' },
  { key: 'canonicalwhite', expected: '#FFFFFF' },
  { key: 'primary', expected: '#153F32' },
  { key: 'interactive', expected: '#153F32' },
  { key: 'hover', expected: '#102D25' },
  { key: 'warm', expected: '#F8EFDF' },
  { key: 'carviforest', expected: '#0F3E2E' },
  { key: 'carvideep', expected: '#0A2F24' },
  { key: 'carvichampagne', expected: '#C5A059' },
  { key: 'bronzegold', expected: '#7E5E1E' },
  { key: 'ivorylight', expected: '#FFFDF7' },
  { key: 'ivoryfoundation', expected: '#FFFCF5' },
  { key: 'champagnewarm', expected: '#FFF6E8' },
  { key: 'champagneborder', expected: '#E6C98F' },
  { key: 'champagnegold', expected: '#C9A66B' },
  { key: 'botanical', expected: '#356B50' },
  { key: 'botanicaldeep', expected: '#183D30' },
];

for (const { key, expected } of requiredLegacyBrandKeys) {
  // Regex looks for: key: 'expected' or key: "expected"
  const regex = new RegExp(`\\b${key}:\\s*['"]${expected}['"]`, 'i');
  assert(
    regex.test(tailwindConfig),
    `Legacy brand token 'brand.${key}' exists with expected value '${expected}'`,
    `Expected pattern: ${key}: '${expected}'`
  );
}

// Verify standalone semantic families in theme.colors
const requiredFamilies = ['evergreen', 'bronze', 'walnut', 'warmivory', 'softsage', 'mutedborder', 'carvi', 'botanical', 'champagne', 'ivory', 'editorial', 'forest', 'gold', 'charcoal', 'border'];
for (const fam of requiredFamilies) {
  const famRegex = new RegExp(`\\b${fam}:\\s*\\{`, 'i');
  assert(famRegex.test(tailwindConfig), `Tailwind theme defines top-level color family '${fam}'`);
}

// -----------------------------------------------------------------------------
// Vector 5: R4 Professional Safeguards Audit across V8
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 5: R4 Professional Safeguards Audit across V8 Components');

const crestMonogramPath = path.resolve('src/v8/components/common/CrestMonogram.tsx');
const crestContent = fs.readFileSync(crestMonogramPath, 'utf8');

assert(crestContent.includes('CMA AIR 49 (ICMAI)'), 'CrestMonogram explicitly attributes CMA AIR 49 to ICMAI');
assert(!crestContent.includes('FRN'), 'CrestMonogram excludes unapproved FRNs');
assert(!crestContent.includes('238692'), 'CrestMonogram excludes personal ICAI membership number');
assert(crestContent.includes('KV') && crestContent.includes('KA'), 'CrestMonogram renders neutral Roman initials KV / KA');

const footerPath = path.resolve('src/v8/components/layout/Footer.tsx');
const footerContent = fs.readFileSync(footerPath, 'utf8');
assert(footerContent.includes('ICMAI'), 'Footer explicitly attributes ICMAI for CMA credential');
assert(footerContent.includes('Tirupati'), 'Footer specifies verified chambers city Tirupati');
assert(footerContent.includes('to="/blog"'), 'Footer preserves /blog link continuity');

const contactFormPath = path.resolve('src/v8/components/forms/ContactForm.tsx');
const formContent = fs.readFileSync(contactFormPath, 'utf8');
assert(formContent.includes('website_fax_hp'), 'ContactForm includes invisible honeypot website_fax_hp');
assert(formContent.includes('formLoadedAt'), 'ContactForm implements mount timestamp velocity check');

// -----------------------------------------------------------------------------
// Summary & Exit
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL ADVERSARIAL STRESS ASSERTIONS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('================================================================\n');

if (failCount > 0) {
  console.error('FAILURES SUMMARY:');
  failureDetails.forEach((f, idx) => {
    console.error(`  ${idx + 1}. ${f.message}`);
    if (f.details) console.error(`     ${f.details}`);
  });
  process.exit(1);
} else {
  console.log('ALL ADVERSARIAL CHALLENGES & EMPIRICAL MATHEMATICAL ORACLES PASSED (100%)!');
}
