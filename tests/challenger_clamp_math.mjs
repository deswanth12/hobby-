import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  CHALLENGER M1: CLAMP FORMULAS MATHEMATICAL VALIDATION HARNESS ');
console.log('================================================================');

const clamps = {
  'font-editorial-h1': {
    minRem: 2.25,
    baseRem: 1.5,
    vwPercent: 3.75,
    maxRem: 4.0,
    css: 'clamp(2.25rem, 1.5rem + 3.75vw, 4rem)'
  },
  'font-editorial-h2': {
    minRem: 1.75,
    baseRem: 1.35,
    vwPercent: 2.0,
    maxRem: 2.75,
    css: 'clamp(1.75rem, 1.35rem + 2vw, 2.75rem)'
  },
  'font-editorial-h3': {
    minRem: 1.375,
    baseRem: 1.15,
    vwPercent: 1.1,
    maxRem: 1.875,
    css: 'clamp(1.375rem, 1.15rem + 1.1vw, 1.875rem)'
  },
  'font-editorial-body': {
    minRem: 0.9375,
    baseRem: 0.875,
    vwPercent: 0.3,
    maxRem: 1.0625,
    css: 'clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)'
  },
  'font-editorial-meta': {
    minRem: 0.6875,
    baseRem: 0.65,
    vwPercent: 0.2,
    maxRem: 0.75,
    css: 'clamp(0.6875rem, 0.65rem + 0.2vw, 0.75rem)'
  }
};

function evaluateClamp(spec, viewportWidth) {
  const minPx = spec.minRem * 16;
  const maxPx = spec.maxRem * 16;
  const preferredPx = (spec.baseRem * 16) + (spec.vwPercent / 100 * viewportWidth);
  return Math.min(Math.max(minPx, preferredPx), maxPx);
}

let passed = 0;
let total = 0;

function assert(condition, message, details = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${total}] ${message}`);
  } else {
    console.log(`\x1b[31m✖ FAIL\x1b[0m [Assert ${total}] ${message}`);
    if (details) console.log(`       Details: ${details}`);
  }
}

// 1. Validate clamp formula bounds & syntax
for (const [name, spec] of Object.entries(clamps)) {
  console.log(`\nTesting ${name}: ${spec.css}`);
  
  assert(spec.minRem < spec.maxRem, `${name}: min (${spec.minRem}rem) < max (${spec.maxRem}rem)`);
  assert(spec.baseRem < spec.minRem, `${name}: base (${spec.baseRem}rem) < min (${spec.minRem}rem) ensures responsive slope starts below min`);
  assert(spec.vwPercent > 0, `${name}: vw slope (${spec.vwPercent}%) is strictly positive`);
  
  const val375 = evaluateClamp(spec, 375);
  const val480 = evaluateClamp(spec, 480);
  const val768 = evaluateClamp(spec, 768);
  const val1024 = evaluateClamp(spec, 1024);
  const val1280 = evaluateClamp(spec, 1280);
  const val1440 = evaluateClamp(spec, 1440);

  console.log(`  Values: 375px: ${val375.toFixed(2)}px | 768px: ${val768.toFixed(2)}px | 1280px: ${val1280.toFixed(2)}px`);

  assert(val375 >= spec.minRem * 16, `${name} @ 375px (${val375.toFixed(2)}px) >= minPx (${spec.minRem * 16}px)`);
  assert(val1280 <= spec.maxRem * 16, `${name} @ 1280px (${val1280.toFixed(2)}px) <= maxPx (${spec.maxRem * 16}px)`);
  assert(val375 < val768, `${name}: val(375px) < val(768px) strictly increasing mobile -> tablet`);
  assert(val768 <= val1280, `${name}: val(768px) <= val(1280px) monotonically increasing tablet -> desktop`);
  assert(val375 < val1280, `${name}: val(375px) < val(1280px) strictly increasing mobile -> desktop`);

  // Continuous monotonicity check across 375px -> 1280px (step 5px)
  let prevVal = evaluateClamp(spec, 375);
  let isMonotonic = true;
  for (let w = 380; w <= 1280; w += 5) {
    const curVal = evaluateClamp(spec, w);
    if (curVal < prevVal) {
      isMonotonic = false;
      break;
    }
    prevVal = curVal;
  }
  assert(isMonotonic, `${name}: Strictly monotonic non-decreasing across continuous range 375px to 1280px`);
}

console.log('\n================================================================');
console.log(`TOTAL CLAMP MATHEMATICAL ASSERTIONS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${total - passed}`);
console.log('================================================================');
