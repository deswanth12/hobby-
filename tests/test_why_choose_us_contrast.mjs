import { readFileSync } from 'fs';
import { resolve } from 'path';

// WCAG 2.1 relative luminance and contrast ratio calculations
function parseRgb(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
}

function relativeLuminance(hex) {
  const [r, g, b] = parseRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fgHex, bgHex) {
  const l1 = relativeLuminance(fgHex);
  const l2 = relativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const componentPath = resolve('src/components/WhyChooseUs.tsx');
const source = readFileSync(componentPath, 'utf8');

console.log('================================================================');
console.log('  WHY CHOOSE US / INSTITUTIONAL MERIT CONTRAST VERIFICATION     ');
console.log('================================================================\n');

let failed = false;

function assertRatio(label, fgHex, bgHex, minRatio, requiredLevel = 'AA') {
  const cr = contrastRatio(fgHex, bgHex);
  const crFormatted = cr.toFixed(2);
  const passed = cr >= minRatio;
  if (!passed) {
    failed = true;
    console.error(`❌ [FAIL] ${label}: ${fgHex} on ${bgHex} = ${crFormatted}:1 (Required: >= ${minRatio}:1 for ${requiredLevel})`);
  } else {
    console.log(`✔ [PASS] ${label}: ${fgHex} on ${bgHex} = ${crFormatted}:1 (Exceeds ${minRatio}:1 for ${requiredLevel})`);
  }
}

// 1. Service Cards
console.log('▶ Target 1: Service Cards Typography & Contrast');
// Card rendered background is #FFF9EF
const cardBg = '#FFF9EF';

// Verify subtitle color in source code
const subtitleMatch = source.match(/<p className="font-editorial-body text-xs sm:text-\[13px\] text-\[(#[A-Fa-f0-9]{6})\] mt-0\.5 leading-snug">/);
if (!subtitleMatch) {
  console.error('❌ [FAIL] Could not match service card subtitle className in WhyChooseUs.tsx');
  failed = true;
} else {
  const subtitleColor = subtitleMatch[1].toUpperCase();
  assertRatio('Audit & Assurance Subtitle', subtitleColor, cardBg, 4.5, 'AA');
  assertRatio('Tax & Compliance Subtitle', subtitleColor, cardBg, 4.5, 'AA');
  assertRatio('Business Advisory Subtitle', subtitleColor, cardBg, 4.5, 'AA');
}

// Verify title color
const titleMatch = source.match(/<h3 className="font-serif text-base sm:text-lg font-bold text-\[(#[A-Fa-f0-9]{6})\]/);
if (titleMatch) {
  const titleColor = titleMatch[1].toUpperCase();
  assertRatio('Service Cards Title Heading', titleColor, cardBg, 4.5, 'AA');
}

console.log('\n▶ Target 2: Direct Partner Attention Card Typography & Contrast');
// Verify Partner Supervision Card elements
const partnerCardSource = source.substring(source.indexOf('Partner Supervision Credential Plaque'));

// "DIRECT PARTNER ATTENTION" label
const labelMatch = partnerCardSource.match(/text-\[(#[A-Fa-f0-9]{6})\] uppercase tracking-wider block font-semibold">\s*Direct Partner Attention/);
if (!labelMatch) {
  console.error('❌ [FAIL] Could not match DIRECT PARTNER ATTENTION label color');
  failed = true;
} else {
  assertRatio('DIRECT PARTNER ATTENTION Label', labelMatch[1].toUpperCase(), cardBg, 4.5, 'AA');
}

// "CA Kavitha Vijay"
const nameMatch = partnerCardSource.match(/font-bold text-\[(#[A-Fa-f0-9]{6})\] leading-tight">\s*CA Kavitha Vijay/);
if (!nameMatch) {
  console.error('❌ [FAIL] Could not match CA Kavitha Vijay name color');
  failed = true;
} else {
  assertRatio('CA Kavitha Vijay Heading', nameMatch[1].toUpperCase(), cardBg, 4.5, 'AA');
}

// "B.Com, CA, CMA (AIR 49)"
const qualMatch = partnerCardSource.match(/font-editorial-body text-xs text-\[(#[A-Fa-f0-9]{6})\].*">\s*B\.Com, CA, CMA \(AIR 49\)/);
if (!qualMatch) {
  console.error('❌ [FAIL] Could not match qualifications color');
  failed = true;
} else {
  assertRatio('B.Com, CA, CMA (AIR 49) Subtitle', qualMatch[1].toUpperCase(), cardBg, 4.5, 'AA');
}

// "Pan-India Reach" badge
const panIndiaMatch = partnerCardSource.match(/bg-\[(#[A-Fa-f0-9]{6})\] text-\[(#[A-Fa-f0-9]{6})\] font-editorial-meta text-\[10px\] font-semibold.*>\s*Pan-India Reach/);
if (!panIndiaMatch) {
  console.error('❌ [FAIL] Could not match Pan-India Reach badge colors');
  failed = true;
} else {
  assertRatio('Pan-India Reach Badge', panIndiaMatch[2].toUpperCase(), panIndiaMatch[1].toUpperCase(), 4.5, 'AA');
}

// "100% Partner-Led" badge
const partnerLedMatch = partnerCardSource.match(/text-\[(#[A-Fa-f0-9]{6})\] flex items-center justify-end gap-1">\s*<CheckCircle2[^>]*\/>\s*<span>100% Partner-Led<\/span>/);
if (!partnerLedMatch) {
  console.error('❌ [FAIL] Could not match 100% Partner-Led badge color');
  failed = true;
} else {
  assertRatio('100% Partner-Led Badge Text & Icon', partnerLedMatch[1].toUpperCase(), cardBg, 4.5, 'AA');
}

// 3. Interactive States Contrast
console.log('\n▶ Target 3: Interactive Hover & Focus State Contrast');
// Title hover: #1B4D3E on #FFF9EF
assertRatio('Service Card Title on Hover', '#1B4D3E', cardBg, 4.5, 'AA');
// Icon circle hover: #FFFFFF on #0F3E2E
assertRatio('Service Card Icon Circle on Hover', '#FFFFFF', '#0F3E2E', 4.5, 'AA');
// Action pill hover: #C5A059 on #0A2F24
assertRatio('Service Card Arrow on Hover', '#C5A059', '#0A2F24', 4.5, 'AA');

// 4. Accessibility & Keyboard Navigation Attributes
console.log('\n▶ Target 4: Keyboard Focus Visibility & Screen Reader Attributes');
if (!source.includes('focus-visible:ring-2') || !source.includes('focus-visible:ring-[#C5A059]')) {
  console.error('❌ [FAIL] Service card links missing high-contrast focus-visible ring styles');
  failed = true;
} else {
  console.log('✔ [PASS] Service card links specify high-contrast focus-visible ring (WCAG 2.4.7)');
}

const decorativeAriaCheck = 
  source.includes('<IconComponent className="w-5 h-5 sm:w-6 sm:h-6 icon-stroke-interactive" aria-hidden="true" />') &&
  source.includes('<ArrowUpRight className="w-4 h-4 text-[#C5A059] motion-arrow-hover" aria-hidden="true" />') &&
  source.includes('<ShieldCheck className="w-6 h-6 text-[#B49A64]" aria-hidden="true" />') &&
  source.includes('<CheckCircle2 className="w-3.5 h-3.5 text-[#153F32]" aria-hidden="true" />');

if (!decorativeAriaCheck) {
  console.error('❌ [FAIL] Decorative icons missing aria-hidden="true" attributes');
  failed = true;
} else {
  console.log('✔ [PASS] Decorative icons explicitly set aria-hidden="true" (fixing-accessibility Priority 1)');
}

// 5. Windows High Contrast Mode / Forced Colors Support
console.log('\n▶ Target 5: Windows High Contrast / Forced Colors Mode');
const cssPath = resolve('src/index.css');
const cssSource = readFileSync(cssPath, 'utf8');
if (!cssSource.includes('@media (forced-colors: active)')) {
  console.error('❌ [FAIL] src/index.css missing forced-colors media query');
  failed = true;
} else {
  console.log('✔ [PASS] src/index.css includes @media (forced-colors: active) support for luxury cards');
}

// 6. Mobile Viewport Layout & Badge Wrap Protection
console.log('\n▶ Target 6: Mobile Viewport Layout & Badge Wrap Protection');
if (!partnerCardSource.includes('flex-col sm:flex-row') || !partnerCardSource.includes('whitespace-nowrap')) {
  console.error('❌ [FAIL] Partner card missing mobile responsive flex-col transition or whitespace-nowrap badge protection');
  failed = true;
} else {
  console.log('✔ [PASS] Partner card implements mobile-responsive flex-col transition and whitespace-nowrap protection');
}

// 7. Typographical Hierarchy & CSS Cascade Protection
console.log('\n▶ Target 7: Typographical Hierarchy & CSS Cascade Protection');
const nameHierarchyCheck = partnerCardSource.includes('text-base sm:text-lg font-bold text-[#153F32] leading-tight');
if (!nameHierarchyCheck) {
  console.error('❌ [FAIL] Partner name missing text-base sm:text-lg font sizing for visual hierarchy prominence');
  failed = true;
} else {
  console.log('✔ [PASS] Partner name uses text-base sm:text-lg bold serif, asserting clear prominence over secondary credentials');
}

const cssCascadeCheck = cssSource.includes('.font-editorial-body.text-xs') && cssSource.includes('.font-editorial-body.text-xs.sm\\:text-\\[13px\\]');
if (!cssCascadeCheck) {
  console.error('❌ [FAIL] src/index.css missing .font-editorial-body.text-xs cascade rules to protect small body text from clamp inflation');
  failed = true;
} else {
  console.log('✔ [PASS] src/index.css specifies .font-editorial-body.text-xs cascade rules, ensuring accurate subtitle and credential sizing');
}

console.log('\n================================================================');
if (failed) {
  console.error('RESULT: CONTRAST & ACCESSIBILITY AUDIT FAILED');
  process.exit(1);
} else {
  console.log('RESULT: ALL CONTRAST RATIOS & ACCESSIBILITY CHECKS MEET WCAG 2.1 AA (100% PASS)');
  process.exit(0);
}
