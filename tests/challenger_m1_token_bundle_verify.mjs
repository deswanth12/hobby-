import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  CHALLENGER M1: DESIGN TOKENS & CSS BUNDLE EMPIRICAL HARNESS  ');
console.log('================================================================');

const ROOT = path.resolve('.');
const DIST = path.join(ROOT, 'dist');
const distAssets = path.join(DIST, 'assets');

let passed = 0;
let total = 0;
const findings = [];

function assert(condition, message, details = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${total}] ${message}`);
  } else {
    findings.push({ message, details });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [Assert ${total}] ${message}`);
    if (details) console.log(`       Details: ${details}`);
  }
}

// 1. Verify CSS Bundle in dist/assets
const cssFiles = fs.readdirSync(distAssets).filter(f => f.endsWith('.css'));
assert(cssFiles.length >= 1, `Production CSS bundle exists in dist/assets/ (Found: ${cssFiles.join(', ')})`);

const cssPath = path.join(distAssets, cssFiles[0]);
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert(cssContent.length > 10000, `Production CSS bundle has non-trivial size (${cssContent.length} bytes)`);

// 2. Token Analysis
const tokenSpecs = [
  { name: 'Primary Forest Green', hex: '#153F32', rgb: '21 63 50' },
  { name: 'Deep Rich Green', hex: '#102D25', rgb: '16 45 37' },
  { name: 'Warm Ivory Background', hex: '#F5F1E8', rgb: '245 241 232' },
  { name: 'Muted Refined Gold', hex: '#C3A66B', rgb: '195 166 107' },
  { name: 'Dark Charcoal Body', hex: '#252B27', rgb: '37 43 39' },
  { name: 'Secondary Readable Text', hex: '#747A73', rgb: '116 122 115' },
  { name: 'Hairline Border', hex: '#E5E1D8', rgb: '229 225 216' }
];

console.log('\n--- 2. Checking Approved Tokens in Compiled CSS ---');
for (const token of tokenSpecs) {
  const hexLower = token.hex.toLowerCase();
  const hexRegex = new RegExp(hexLower, 'i');
  const rgbRegex = new RegExp(token.rgb.replace(/\s+/g, '\\s+'));
  
  const hasHex = hexRegex.test(cssContent);
  const hasRgb = rgbRegex.test(cssContent);
  const isPresent = hasHex || hasRgb;

  console.log(`Token: ${token.name} (${token.hex} / rgb(${token.rgb})) -> Hex: ${hasHex}, RGB: ${hasRgb}`);
  assert(isPresent, `Token ${token.name} (${token.hex}) is compiled into stylesheet (Hex: ${hasHex}, RGB: ${hasRgb})`);
}

// 3. Fluid Typography Clamp Analysis
console.log('\n--- 3. Checking Fluid Typography Clamp Definitions ---');
const indexCssPath = path.join(ROOT, 'src', 'index.css');
const indexCssContent = fs.readFileSync(indexCssPath, 'utf8');

const expectedClamps = [
  { class: 'font-editorial-h1', formula: 'clamp(2.25rem, 1.5rem + 3.75vw, 4rem)' },
  { class: 'font-editorial-h2', formula: 'clamp(1.75rem, 1.35rem + 2vw, 2.75rem)' },
  { class: 'font-editorial-h3', formula: 'clamp(1.375rem, 1.15rem + 1.1vw, 1.875rem)' },
  { class: 'font-editorial-body', formula: 'clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)' },
  { class: 'font-editorial-meta', formula: 'clamp(0.6875rem, 0.65rem + 0.2vw, 0.75rem)' }
];

for (const clampItem of expectedClamps) {
  const inIndexCss = indexCssContent.includes(clampItem.class) && indexCssContent.includes(clampItem.formula);
  assert(inIndexCss, `src/index.css defines ${clampItem.class} with exact formula ${clampItem.formula}`);
}

// Check whether clamp classes are purged or in dist
console.log('\n--- 4. Purge Status in dist/assets/ ---');
for (const clampItem of expectedClamps) {
  const inDist = cssContent.includes(clampItem.class);
  console.log(`Class .${clampItem.class} in production dist bundle: ${inDist} (Defined in @layer utilities; tree-shaken until referenced in components)`);
}

console.log('\n================================================================');
console.log(`TOTAL EMPIRICAL TOKEN ASSERTIONS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FINDINGS / FAILURES: ${findings.length}`);
console.log('================================================================');
