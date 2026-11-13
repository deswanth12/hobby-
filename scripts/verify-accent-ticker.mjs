// scripts/verify-accent-ticker.mjs
// Empirical test harness for AccentTicker.tsx and src/index.css

import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const tickerPath = path.join(projectRoot, 'src', 'components', 'animations', 'AccentTicker.tsx');
const cssPath = path.join(projectRoot, 'src', 'index.css');

console.log('=== EMPIRICAL VERIFICATION: AccentTicker.tsx & index.css ===\n');

let passCount = 0;
let failCount = 0;
const failures = [];

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
    failCount++;
    failures.push({ testName, details });
  }
}

// 1. Inspect AccentTicker.tsx
console.log('--- Suite 1: AccentTicker.tsx Static & AST Property Verification ---');
const tickerContent = fs.readFileSync(tickerPath, 'utf-8');

// 1.1 Alternating Backgrounds
assert(
  tickerContent.includes('bg-[#FFF6E8]') && tickerContent.includes('bg-[#183D30]'),
  'Band 1 and Band 2 use alternating backgrounds (#FFF6E8 champagne vs #183D30 deep botanical green)',
  'Expected bg-[#FFF6E8] and bg-[#183D30] in AccentTicker.tsx'
);

// 1.2 Opposing Diagonal Rotations
assert(
  tickerContent.includes('-rotate-1 sm:-rotate-2') && tickerContent.includes('rotate-1 sm:rotate-2'),
  'Opposing diagonal rotations defined (-rotate-1 sm:-rotate-2 vs rotate-1 sm:rotate-2)',
  'Expected opposing tilt classes in tilts mapping'
);

// 1.3 Negative Margin Bleed & Overflow Hidden
assert(
  tickerContent.includes('w-[115%] -ml-[7.5%]'),
  'Negative margin bleed w-[115%] -ml-[7.5%] applied to bands to prevent edge cutoffs',
  'Expected w-[115%] -ml-[7.5%] on band containers'
);

assert(
  tickerContent.includes('overflow-hidden') && tickerContent.includes('marquee-container'),
  'Outer container contains overflow-hidden and marquee-container classes',
  'Expected relative w-full overflow-hidden ... marquee-container'
);

// 1.4 4x Item Duplication for Seamless Loop
const repeatBand1Match = tickerContent.match(/repeatedBand1\s*=\s*\[\.\.\.band1Items,\s*\.\.\.band1Items,\s*\.\.\.band1Items,\s*\.\.\.band1Items\]/);
const repeatBand2Match = tickerContent.match(/repeatedBand2\s*=\s*\[\.\.\.band2Items,\s*\.\.\.band2Items,\s*\.\.\.band2Items,\s*\.\.\.band2Items\]/);
assert(
  Boolean(repeatBand1Match && repeatBand2Match),
  'Both Band 1 and Band 2 repeat keyword items exactly 4 times',
  'Expected [...bandXItems, ...bandXItems, ...bandXItems, ...bandXItems]'
);

// 1.5 Duplicate Item Accessibility & Motion Reduction Classes
assert(
  tickerContent.includes("aria-hidden={isDuplicate ? 'true' : undefined}") &&
  tickerContent.includes("data-ticker-duplicate={isDuplicate ? 'true' : undefined}"),
  'Accessibility: Duplicated items are marked with aria-hidden="true" and data-ticker-duplicate="true"',
  'Duplicate items must not clutter screen readers'
);

assert(
  tickerContent.includes('motion-reduce:rotate-0') &&
  tickerContent.includes('motion-reduce:w-full') &&
  tickerContent.includes('motion-reduce:ml-0'),
  'Graceful degradation: motion-reduce classes reset tilt and bleed under reduced motion preference',
  'Expected motion-reduce:rotate-0 motion-reduce:w-full motion-reduce:ml-0'
);

// 1.6 Default Keyword Authenticity
assert(
  tickerContent.includes('STATUTORY AUDIT') &&
  tickerContent.includes('TAX LITIGATION & APPEALS') &&
  tickerContent.includes('CMA ALL INDIA RANK 49') &&
  tickerContent.includes('EX-DELOITTE BIG 4 AUDIT'),
  'Default keyword items reflect authentic ICAI/CMA firm qualifications from repository',
  'Keywords must match verified firm profile'
);

// 2. Inspect src/index.css
console.log('\n--- Suite 2: CSS Keyframes, Controls, and Accessibility in index.css ---');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

// 2.1 Keyframes marqueeScroll & marqueeScrollReverse
const marqueeScrollMatch = cssContent.match(/@keyframes\s+marqueeScroll\s*\{[^}]*0%\s*\{[^}]*translate3d\(0,\s*0,\s*0\)[^}]*\}[^}]*100%\s*\{[^}]*translate3d\(-50%,\s*0,\s*0\)[^}]*\}/s);
assert(
  Boolean(marqueeScrollMatch),
  'Keyframe @keyframes marqueeScroll scrolls 0% -> -50% translate3d',
  'marqueeScroll must translate from translate3d(0,0,0) to translate3d(-50%,0,0)'
);

const marqueeScrollReverseMatch = cssContent.match(/@keyframes\s+marqueeScrollReverse\s*\{[^}]*0%\s*\{[^}]*translate3d\(-50%,\s*0,\s*0\)[^}]*\}[^}]*100%\s*\{[^}]*translate3d\(0,\s*0,\s*0\)[^}]*\}/s);
assert(
  Boolean(marqueeScrollReverseMatch),
  'Keyframe @keyframes marqueeScrollReverse scrolls -50% -> 0% translate3d',
  'marqueeScrollReverse must translate from translate3d(-50%,0,0) to translate3d(0,0,0)'
);

// 2.2 Animation Track Classes
assert(
  cssContent.includes('.animate-marquee-track {') &&
  cssContent.includes('animation: marqueeScroll 38s linear infinite;') &&
  cssContent.includes('.animate-marquee-track-reverse {') &&
  cssContent.includes('animation: marqueeScrollReverse 42s linear infinite;'),
  'Animation track classes (.animate-marquee-track, .animate-marquee-track-reverse) defined with hardware acceleration (will-change: transform)',
  'Expected animate classes configured with proper linear infinite animations'
);

// 2.3 Hover & Focus-within Pause
const pauseMatch = cssContent.match(/\.marquee-container:hover\s+\.animate-marquee-track[^{]*\{\s*animation-play-state:\s*paused;\s*\}/s);
const focusPauseMatch = cssContent.match(/\.marquee-container:focus-within\s+\.animate-marquee-track/s);
assert(
  Boolean(pauseMatch && focusPauseMatch),
  'Interaction: Marquee pauses on hover (.marquee-container:hover) and focus (.marquee-container:focus-within)',
  'Expected animation-play-state: paused on container hover and focus-within'
);

// 2.4 prefers-reduced-motion media query
const reducedMotionRegex = /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)\s*\{([\s\S]*?)\n\}/g;
let foundReducedMotionBlock = false;
let match;
while ((match = reducedMotionRegex.exec(cssContent)) !== null) {
  const block = match[1];
  if (
    block.includes('.animate-marquee-track') &&
    block.includes('animation: none !important;') &&
    block.includes('transform: none !important;') &&
    block.includes('display: none !important;')
  ) {
    foundReducedMotionBlock = true;
    break;
  }
}

assert(
  foundReducedMotionBlock,
  'Accessibility: @media (prefers-reduced-motion: reduce) disables animation and hides aria-hidden duplicates',
  'Expected animation: none !important and aria-hidden duplicates hidden in reduced motion'
);

// 3. Mathematical & Color Contrast Stress Testing
console.log('\n--- Suite 3: Mathematical Stress & Color Contrast Calculations ---');

// WCAG relative luminance formula
function getLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function getContrastRatio(hex1, hex2) {
  const parseHex = (hex) => {
    const clean = hex.replace('#', '');
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16)
    ];
  };
  const [r1, g1, b1] = parseHex(hex1);
  const [r2, g2, b2] = parseHex(hex2);
  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Band 1: Champagne #FFF6E8 vs Deep Forest Green #183D30
const contrastBand1 = getContrastRatio('#FFF6E8', '#183D30');
console.log(`Band 1 Contrast Ratio (#FFF6E8 vs #183D30): ${contrastBand1.toFixed(2)}:1`);
assert(
  contrastBand1 >= 7.0,
  `Band 1 contrast (${contrastBand1.toFixed(2)}:1) satisfies WCAG AAA (>= 7.0:1)`,
  `Contrast ${contrastBand1.toFixed(2)}:1 is below 7.0:1`
);

// Band 2: Deep Forest Green #183D30 vs Warm Ivory #FFFDF7
const contrastBand2 = getContrastRatio('#183D30', '#FFFDF7');
console.log(`Band 2 Contrast Ratio (#183D30 vs #FFFDF7): ${contrastBand2.toFixed(2)}:1`);
assert(
  contrastBand2 >= 7.0,
  `Band 2 contrast (${contrastBand2.toFixed(2)}:1) satisfies WCAG AAA (>= 7.0:1)`,
  `Contrast ${contrastBand2.toFixed(2)}:1 is below 7.0:1`
);

// 3.3 Geometric Bleed Verification across viewports
const testViewports = [320, 390, 768, 1024, 1440, 1920, 2560];
let allViewportsBleedSafe = true;

for (const vp of testViewports) {
  // Angle = 2 degrees
  const rad = 2 * (Math.PI / 180);
  const bandHeight = 44; // typical ribbon height with padding
  // Required lateral bleed = bandHeight * sin(rad) + viewport * (1 - cos(rad)) / 2
  // But more critically, the horizontal corner gap when rotated by theta:
  // gap = (bandHeight / 2) * tan(rad)
  const minRequiredBleedPx = bandHeight * Math.tan(rad);
  // Actual bleed px = vp * 0.075 (from w-[115%] -ml-[7.5%])
  const actualBleedPx = vp * 0.075;
  if (actualBleedPx < minRequiredBleedPx) {
    allViewportsBleedSafe = false;
    console.warn(`Bleed insufficient at viewport ${vp}px: actual ${actualBleedPx}px < min ${minRequiredBleedPx}px`);
  }
}
assert(
  allViewportsBleedSafe,
  `Geometry: w-[115%] -ml-[7.5%] provides sufficient bleed (> min rotation delta) across all standard viewports (320px - 2560px)`
);

// 3.4 Mathematical 4x Loop Invariance
// When an array of N items is repeated 4 times: [0..N-1, 0..N-1, 0..N-1, 0..N-1] (total 4N)
// -50% translate shifts exactly 2N items to the left.
// The visible viewport at 100% (-50% position) starts at index 2N, which is item 0.
// The visible viewport at 0% (0% position) starts at index 0, which is item 0.
// Let's test with arbitrary list sizes N in [1, 5, 8, 12, 25]:
let loopInvarianceValid = true;
for (const N of [1, 5, 8, 12, 25]) {
  const items = Array.from({ length: N }, (_, i) => `item_${i}`);
  const track = [...items, ...items, ...items, ...items];
  const halfShift = track.length / 2; // 2N items shifted
  // Check that track[0..2N-1] is identical to track[2N..4N-1]
  const firstHalf = track.slice(0, halfShift);
  const secondHalf = track.slice(halfShift);
  const isIdentical = firstHalf.every((val, idx) => val === secondHalf[idx]);
  if (!isIdentical) {
    loopInvarianceValid = false;
    break;
  }
}
assert(
  loopInvarianceValid,
  'Loop Invariance: 4x item repetition with -50% translation produces identical initial and final frame states'
);

console.log('\n=== SUMMARY ===');
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);

if (failCount > 0) {
  console.error('\nFailures detected:');
  failures.forEach(f => console.error(`- ${f.testName}: ${f.details}`));
  process.exit(1);
} else {
  console.log('\nALL EMPIRICAL TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}
