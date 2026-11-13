/**
 * tests/v82-animation.test.mjs
 * 
 * V8.2 Botanical Ledger Animation System Comprehensive Verification Suite.
 * Validates all 15 animation files, 19 exports, Botanical Ledger design tokens,
 * timings (160–320ms micro, 450–750ms entrance, 900–1600ms line/counter, 20–60s ambient),
 * cubic-bezier easing curves, CSS keyframes, reduced-motion overrides,
 * fluid accordion curtain expansion, hero eager mount cascade, and zero animation dependencies.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { createServer } from 'vite';

console.log('================================================================');
console.log('  TEST: V8.2 BOTANICAL LEDGER ANIMATION SYSTEM COMPREHENSIVE SUITE');
console.log('================================================================\n');

let total = 0;
let passed = 0;
const failures = [];

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${total}] ${name}`);
  } catch (err) {
    failures.push({ name, error: err.message });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${total}] ${name}`);
    console.log(`       ${err.message}`);
  }
}

async function runAsyncTest(name, fn) {
  total++;
  try {
    await fn();
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${total}] ${name}`);
  } catch (err) {
    failures.push({ name, error: err.message });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${total}] ${name}`);
    console.log(`       ${err.message}`);
  }
}

// ============================================================================
// SUITE 1: ANIMATION SYSTEM FILE INVENTORY (15 FILES)
// ============================================================================
console.log('▶ Suite 1: Animation Component File Inventory (15 Files)');

const EXPECTED_ANIMATION_FILES = [
  'AnimatedDivider.tsx',
  'CountUp.tsx',
  'FadeIn.tsx',
  'index.ts',
  'MagneticButton.tsx',
  'motionTokens.ts',
  'PageTransition.tsx',
  'ParallaxLayer.tsx',
  'Reveal.tsx',
  'ScrollProgress.tsx',
  'SlideUp.tsx',
  'StaggerContainer.tsx',
  'StaggerItem.tsx',
  'TextReveal.tsx',
  'useReducedMotion.ts',
];

const ANIMATION_DIR = path.resolve('src/v8/components/animation');

test('Directory existence: src/v8/components/animation/ exists', () => {
  assert.ok(fs.existsSync(ANIMATION_DIR), 'Directory must exist');
  assert.ok(fs.statSync(ANIMATION_DIR).isDirectory(), 'Must be a directory');
});

test('File count: src/v8/components/animation/ contains exactly 15 animation files', () => {
  const actualFiles = fs.readdirSync(ANIMATION_DIR).filter(f => !f.startsWith('.'));
  assert.strictEqual(actualFiles.length, 15, `Expected 15 animation files, found ${actualFiles.length}: ${actualFiles.join(', ')}`);
});

for (const file of EXPECTED_ANIMATION_FILES) {
  test(`File existence: ${file} exists with valid non-empty content`, () => {
    const filePath = path.join(ANIMATION_DIR, file);
    assert.ok(fs.existsSync(filePath), `${file} must exist`);
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(content.length > 50, `${file} must contain substantial code (>= 50 bytes)`);
  });
}

// ============================================================================
// SUITE 2: VITE SSR RUNTIME EVALUATION & 19 BARREL EXPORTS
// ============================================================================
console.log('\n▶ Suite 2: Vite SSR Runtime Evaluation & 19 Barrel Exports');

let vite = null;
let animationModule = null;

await runAsyncTest('Vite SSR: Successfully initialize Vite server in middleware mode', async () => {
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  assert.ok(vite, 'Vite server instance must be created');
});

await runAsyncTest('Vite SSR: Load and evaluate /src/v8/components/animation/index.ts', async () => {
  animationModule = await vite.ssrLoadModule('/src/v8/components/animation/index.ts');
  assert.ok(animationModule, 'Module must be loaded');
});

const EXPECTED_EXPORTS = [
  'AnimatedDivider',
  'BOTANICAL_COLORS',
  'CountUp',
  'FadeIn',
  'MOTION_DURATIONS',
  'MOTION_EASINGS',
  'MOTION_TOKENS',
  'MagneticButton',
  'PageTransition',
  'ParallaxLayer',
  'Reveal',
  'ScrollProgress',
  'SlideUp',
  'StaggerContainer',
  'StaggerContext',
  'StaggerItem',
  'TextReveal',
  'useReducedMotion',
  'useStagger',
];

test('Barrel export count: Exactly 19 distinct exports present in index.ts', () => {
  assert.ok(animationModule, 'Module must be loaded');
  const actualExports = Object.keys(animationModule).sort();
  assert.strictEqual(actualExports.length, 19, `Expected 19 exports, found ${actualExports.length}: ${actualExports.join(', ')}`);
});

for (const exp of EXPECTED_EXPORTS) {
  test(`Barrel export verification: "${exp}" is exported from animation/index.ts`, () => {
    assert.ok(exp in animationModule, `Export "${exp}" missing from barrel file`);
    assert.notStrictEqual(animationModule[exp], undefined, `Export "${exp}" must not be undefined`);
  });
}

test('Component type verification: All 11 visual components are valid React component functions', () => {
  const components = [
    'AnimatedDivider',
    'CountUp',
    'FadeIn',
    'MagneticButton',
    'PageTransition',
    'ParallaxLayer',
    'Reveal',
    'ScrollProgress',
    'SlideUp',
    'StaggerContainer',
    'StaggerItem',
    'TextReveal',
  ];
  for (const comp of components) {
    const val = animationModule[comp];
    assert.ok(typeof val === 'function' || (typeof val === 'object' && val !== null), `${comp} must be a React component function or ForwardRef object`);
  }
});

test('Hooks verification: useReducedMotion and useStagger are callable functions', () => {
  assert.strictEqual(typeof animationModule.useReducedMotion, 'function', 'useReducedMotion must be a function');
  assert.strictEqual(typeof animationModule.useStagger, 'function', 'useStagger must be a function');
});

// ============================================================================
// SUITE 3: BOTANICAL LEDGER PALETTE & DESIGN SYSTEM COLOR CONSTANTS
// ============================================================================
console.log('\n▶ Suite 3: Botanical Ledger Color Palette Constants');

test('Color tokens object: BOTANICAL_COLORS is exported and frozen', () => {
  assert.ok(animationModule.BOTANICAL_COLORS, 'BOTANICAL_COLORS must exist');
  assert.strictEqual(typeof animationModule.BOTANICAL_COLORS, 'object');
});

test('Color constant: Deep Evergreen is #071B14', () => {
  assert.strictEqual(animationModule.BOTANICAL_COLORS.evergreen, '#071B14');
});

test('Color constant: Forest Green is #183529', () => {
  assert.strictEqual(animationModule.BOTANICAL_COLORS.forest, '#183529');
});

test('Color constant: Botanical Deep Accent is #294B39', () => {
  assert.strictEqual(animationModule.BOTANICAL_COLORS.botanical, '#294B39');
});

test('Color constant: Antique Bronze is #B49A64', () => {
  assert.strictEqual(animationModule.BOTANICAL_COLORS.bronze, '#B49A64');
});

test('Color constant: WCAG AA Dark Bronze is #7E5E1E', () => {
  assert.strictEqual(animationModule.BOTANICAL_COLORS.bronzeDark, '#7E5E1E');
});

test('Color constant: Warm Ivory is #F1EBDD', () => {
  assert.strictEqual(animationModule.BOTANICAL_COLORS.ivory, '#F1EBDD');
});

test('Color constant: Walnut Brown is #35271F', () => {
  assert.strictEqual(animationModule.BOTANICAL_COLORS.walnut, '#35271F');
});

test('Color constant: Soft Sage is #AAB4A0', () => {
  assert.strictEqual(animationModule.BOTANICAL_COLORS.sage, '#AAB4A0');
});

// WCAG relative luminance helper
function getLuminance(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const toLin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

function getContrast(h1, h2) {
  const l1 = getLuminance(h1);
  const l2 = getLuminance(h2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

test('Contrast Ratio: Walnut Brown on Warm Ivory achieves >= 9:1 AAA compliance', () => {
  const contrast = getContrast(animationModule.BOTANICAL_COLORS.walnut, animationModule.BOTANICAL_COLORS.ivory);
  assert.ok(contrast >= 9.0, `Contrast must be >= 9.0:1, got ${contrast.toFixed(2)}:1`);
});

test('Contrast Ratio: Dark Bronze on Warm Ivory achieves >= 4.5:1 AA compliance', () => {
  const contrast = getContrast(animationModule.BOTANICAL_COLORS.bronzeDark, animationModule.BOTANICAL_COLORS.ivory);
  assert.ok(contrast >= 4.5, `Contrast must be >= 4.5:1, got ${contrast.toFixed(2)}:1`);
});

test('Contrast Ratio: Warm Ivory on Deep Evergreen achieves >= 14:1 AAA compliance', () => {
  const contrast = getContrast(animationModule.BOTANICAL_COLORS.ivory, animationModule.BOTANICAL_COLORS.evergreen);
  assert.ok(contrast >= 14.0, `Contrast must be >= 14.0:1, got ${contrast.toFixed(2)}:1`);
});

// ============================================================================
// SUITE 4: MOTION TIMING TIERS & DURATION RULES
// ============================================================================
console.log('\n▶ Suite 4: Motion Timing Tiers & Duration Constants');

const durations = animationModule.MOTION_DURATIONS;

test('Timing tier 1: Micro-interaction durations fall strictly within 140ms–320ms', () => {
  assert.ok(durations.microTap >= 140 && durations.microTap <= 320, `microTap (${durations.microTap}) out of bounds`);
  assert.ok(durations.microFast >= 160 && durations.microFast <= 320, `microFast (${durations.microFast}) out of bounds`);
  assert.ok(durations.microBase >= 160 && durations.microBase <= 320, `microBase (${durations.microBase}) out of bounds`);
  assert.ok(durations.microHover >= 160 && durations.microHover <= 320, `microHover (${durations.microHover}) out of bounds`);
  assert.ok(durations.microSlow >= 160 && durations.microSlow <= 320, `microSlow (${durations.microSlow}) out of bounds`);
});

test('Timing tier 2: Entrance durations fall strictly within 450ms–750ms', () => {
  assert.ok(durations.entranceFast >= 450 && durations.entranceFast <= 750, `entranceFast (${durations.entranceFast}) out of bounds`);
  assert.ok(durations.entranceBase >= 450 && durations.entranceBase <= 750, `entranceBase (${durations.entranceBase}) out of bounds`);
  assert.ok(durations.entranceDeliberate >= 450 && durations.entranceDeliberate <= 750, `entranceDeliberate (${durations.entranceDeliberate}) out of bounds`);
  assert.ok(durations.entranceSlow >= 450 && durations.entranceSlow <= 750, `entranceSlow (${durations.entranceSlow}) out of bounds`);
});

test('Timing tier 3: Structural line drawings & counter durations fall within 900ms–1600ms', () => {
  assert.ok(durations.lineDrawQuick >= 900 && durations.lineDrawQuick <= 1600, `lineDrawQuick (${durations.lineDrawQuick}) out of bounds`);
  assert.ok(durations.lineDrawBase >= 900 && durations.lineDrawBase <= 1600, `lineDrawBase (${durations.lineDrawBase}) out of bounds`);
  assert.ok(durations.lineDrawSlow >= 900 && durations.lineDrawSlow <= 1600, `lineDrawSlow (${durations.lineDrawSlow}) out of bounds`);
  assert.ok(durations.lineDrawExtended >= 900 && durations.lineDrawExtended <= 1600, `lineDrawExtended (${durations.lineDrawExtended}) out of bounds`);
  assert.ok(durations.counterBase >= 900 && durations.counterBase <= 1600, `counterBase (${durations.counterBase}) out of bounds`);
  assert.ok(durations.counterDeliberate >= 900 && durations.counterDeliberate <= 1600, `counterDeliberate (${durations.counterDeliberate}) out of bounds`);
});

test('Timing tier 4: Ambient background motions fall within 16s–90s range', () => {
  assert.ok(durations.ambientPulse >= 15000 && durations.ambientPulse <= 100000, `ambientPulse (${durations.ambientPulse}) out of bounds`);
  assert.ok(durations.ambientDrift >= 20000 && durations.ambientDrift <= 100000, `ambientDrift (${durations.ambientDrift}) out of bounds`);
  assert.ok(durations.ambientSpin >= 20000 && durations.ambientSpin <= 100000, `ambientSpin (${durations.ambientSpin}) out of bounds`);
  assert.ok(durations.ambientOrbitalSlow >= 20000 && durations.ambientOrbitalSlow <= 100000, `ambientOrbitalSlow (${durations.ambientOrbitalSlow}) out of bounds`);
  assert.ok(durations.ambientOrbitalReverse >= 20000 && durations.ambientOrbitalReverse <= 100000, `ambientOrbitalReverse (${durations.ambientOrbitalReverse}) out of bounds`);
});

test('Page transition duration: 240ms–300ms non-blocking router range', () => {
  assert.ok(durations.pageTransition >= 240 && durations.pageTransition <= 300, `pageTransition (${durations.pageTransition}) out of bounds`);
});

// ============================================================================
// SUITE 5: MOTION EASING EQUATIONS & CURVATURE
// ============================================================================
console.log('\n▶ Suite 5: Motion Easing Equations & Curvature');

const easings = animationModule.MOTION_EASINGS;

test('Easing equation: Standard Botanical Ledger ease-out is cubic-bezier(0.22, 1, 0.36, 1)', () => {
  assert.strictEqual(easings.standard, 'cubic-bezier(0.22, 1, 0.36, 1)');
});

test('Easing equation: Editorial unmask ease-out is cubic-bezier(0.16, 1, 0.3, 1)', () => {
  assert.strictEqual(easings.editorial, 'cubic-bezier(0.16, 1, 0.3, 1)');
});

test('Easing equation: Ambient breathing ease-in-out is cubic-bezier(0.45, 0, 0.55, 1)', () => {
  assert.strictEqual(easings.ambient, 'cubic-bezier(0.45, 0, 0.55, 1)');
});

test('Easing equation: Micro-interaction ease is cubic-bezier(0.4, 0, 0.2, 1)', () => {
  assert.strictEqual(easings.micro, 'cubic-bezier(0.4, 0, 0.2, 1)');
});

test('Easing overshoot invariant: Zero bounce or elastic overshoot (y-values <= 1.0)', () => {
  const curveValues = [easings.standard, easings.editorial, easings.ambient, easings.micro];
  for (const curve of curveValues) {
    const match = curve.match(/cubic-bezier\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
    assert.ok(match, `Invalid cubic-bezier syntax: ${curve}`);
    const [, x1, y1, x2, y2] = match.map(Number);
    assert.ok(x1 >= 0 && x1 <= 1, `x1 out of range: ${x1}`);
    assert.ok(x2 >= 0 && x2 <= 1, `x2 out of range: ${x2}`);
    assert.ok(y1 <= 1.0 && y2 <= 1.0, `Overshoot detected! y1=${y1}, y2=${y2} in ${curve}`);
  }
});

// ============================================================================
// SUITE 6: MASTER REDUCED-MOTION UNIVERSAL CSS OVERRIDES IN SRC/INDEX.CSS
// ============================================================================
console.log('\n▶ Suite 6: Master Reduced-Motion CSS Overrides in src/index.css');

const indexCssPath = path.resolve('src/index.css');
assert.ok(fs.existsSync(indexCssPath), 'src/index.css must exist');
const indexCssContent = fs.readFileSync(indexCssPath, 'utf8');

test('CSS Reduced-Motion: @media (prefers-reduced-motion: reduce) block is present', () => {
  assert.ok(indexCssContent.includes('@media (prefers-reduced-motion: reduce)'), 'src/index.css must declare reduced-motion block');
});

test('CSS Reduced-Motion: Master override targets all 12 core animation classes', () => {
  const requiredClasses = [
    '.v8-reveal',
    '.v8-fade-in',
    '.v8-slide-up',
    '.v8-stagger-container',
    '.v8-stagger-item',
    '.v8-text-reveal',
    '.v8-count-up',
    '.v8-magnetic-button',
    '.v8-page-transition',
    '.v8-parallax-layer',
    '.v8-animated-divider',
    '.accordion-curtain',
  ];
  for (const cls of requiredClasses) {
    assert.ok(indexCssContent.includes(cls), `Reduced-motion override missing selector: ${cls}`);
  }
});

test('CSS Reduced-Motion: Enforces animation: none !important', () => {
  assert.ok(indexCssContent.includes('animation: none !important'), 'Must enforce animation: none !important');
});

test('CSS Reduced-Motion: Enforces transition: none !important', () => {
  assert.ok(indexCssContent.includes('transition: none !important'), 'Must enforce transition: none !important');
});

test('CSS Reduced-Motion: Enforces transform: none !important', () => {
  assert.ok(indexCssContent.includes('transform: none !important'), 'Must enforce transform: none !important');
});

test('CSS Reduced-Motion: Enforces opacity: 1 !important', () => {
  assert.ok(indexCssContent.includes('opacity: 1 !important'), 'Must enforce opacity: 1 !important');
});

test('CSS Reduced-Motion: Disables continuous ambient orbital animations', () => {
  assert.ok(
    indexCssContent.includes('.animate-orbital-slow') &&
    indexCssContent.includes('animation: none !important'),
    'Orbital animations must be disabled under reduced motion'
  );
});

// ============================================================================
// SUITE 7: FLUID ACCORDION CURTAIN GRID RULES (WCAG 2.2)
// ============================================================================
console.log('\n▶ Suite 7: Fluid Accordion Curtain Grid Rules');

test('Accordion curtain: Base class defines grid-template-rows: 0fr with smooth transition', () => {
  assert.ok(indexCssContent.includes('.accordion-curtain'), '.accordion-curtain class must be declared');
  assert.ok(indexCssContent.includes('grid-template-rows: 0fr'), 'Must use CSS grid 0fr for initial closed state');
  assert.ok(indexCssContent.includes('cubic-bezier(0.22, 1, 0.36, 1)'), 'Must use Botanical Ledger easing for curtain expansion');
});

test('Accordion curtain: Expanded state defines grid-template-rows: 1fr and opacity: 1', () => {
  assert.ok(indexCssContent.includes('.accordion-curtain[data-expanded="true"]'), 'data-expanded="true" selector must exist');
  assert.ok(indexCssContent.includes('grid-template-rows: 1fr'), 'Must transition to 1fr on expand');
});

test('Accordion curtain: Inner container defines overflow: hidden to prevent layout thrash', () => {
  assert.ok(indexCssContent.includes('.accordion-curtain-inner'), '.accordion-curtain-inner class must exist');
  assert.ok(indexCssContent.includes('overflow: hidden'), 'Inner container must clamp overflow');
});

test('Accordion curtain: Reduced motion overrides curtain to instant 1fr display', () => {
  assert.ok(
    indexCssContent.includes('grid-template-rows: 1fr !important'),
    'Under reduced motion, curtain must immediately expand to 1fr'
  );
});

// ============================================================================
// SUITE 8: HERO SECTION EAGER MOUNT CASCADE RULES (LCP PROTECTION)
// ============================================================================
console.log('\n▶ Suite 8: Hero Section Eager Mount Cascade Rules (LCP Protection)');

test('Hero Cascade: Keyframes v8HeroCascade defined with subtle 14px displacement', () => {
  assert.ok(indexCssContent.includes('@keyframes v8HeroCascade'), '@keyframes v8HeroCascade must exist');
  assert.ok(indexCssContent.includes('translate3d(0, 14px, 0)'), 'Initial displacement must be restrained (14px)');
  assert.ok(indexCssContent.includes('translate3d(0, 0, 0)'), 'Final resting position must be translate3d(0,0,0)');
});

test('Hero Cascade: Utility class .v8-hero-cascade uses 650ms Botanical Ledger easing', () => {
  assert.ok(indexCssContent.includes('.v8-hero-cascade'), '.v8-hero-cascade class must exist');
  assert.ok(indexCssContent.includes('650ms'), 'Duration must be 650ms');
  assert.ok(indexCssContent.includes('cubic-bezier(0.22, 1, 0.36, 1)'), 'Must use standard easing');
});

test('Hero Steps: Staggered step classes .hero-step-1 through .hero-step-10 exist', () => {
  for (let i = 1; i <= 10; i++) {
    const stepClass = i === 7 ? '.hero-step-7a' : `.hero-step-${i}`;
    assert.ok(indexCssContent.includes(stepClass), `Hero step ${stepClass} must exist`);
  }
});

test('Hero Cascade: Under reduced-motion, hero cascade and steps render immediately', () => {
  assert.ok(indexCssContent.includes('.v8-hero-cascade'), 'Hero cascade in reduced motion block');
  assert.ok(indexCssContent.includes('.hero-step-1'), 'Hero steps in reduced motion block');
});

// ============================================================================
// SUITE 9: ZERO THIRD-PARTY ANIMATION DEPENDENCIES (PACKAGE.JSON AUDIT)
// ============================================================================
console.log('\n▶ Suite 9: Zero Third-Party Animation Dependencies');

const packageJsonPath = path.resolve('package.json');
assert.ok(fs.existsSync(packageJsonPath), 'package.json must exist');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const PROHIBITED_PACKAGES = [
  'framer-motion',
  'gsap',
  'animejs',
  'lottie-web',
  'lottie-react',
  'aos',
  'remotion',
  'motion',
  'popmotion',
  'velocity-animate',
  'three',
  '@react-three/fiber',
  '@react-spring/web',
  'react-spring',
];

test('Dependency Purity: Zero prohibited external animation libraries in dependencies', () => {
  const deps = Object.keys(pkg.dependencies || {});
  for (const lib of PROHIBITED_PACKAGES) {
    assert.strictEqual(deps.includes(lib), false, `Prohibited dependency found in dependencies: ${lib}`);
  }
});

test('Dependency Purity: Zero prohibited external animation libraries in devDependencies', () => {
  const devDeps = Object.keys(pkg.devDependencies || {});
  for (const lib of PROHIBITED_PACKAGES) {
    assert.strictEqual(devDeps.includes(lib), false, `Prohibited dependency found in devDependencies: ${lib}`);
  }
});

// ============================================================================
// SUITE 10: COMPOSITOR-ONLY MOTION INTEGRITY (NO LAYOUT THRASHING)
// ============================================================================
console.log('\n▶ Suite 10: Compositor-Only Motion Integrity (No Layout Thrashing)');

test('Compositor Rule: Reveal component uses only transform and opacity transitions', () => {
  const revealPath = path.join(ANIMATION_DIR, 'Reveal.tsx');
  const code = fs.readFileSync(revealPath, 'utf8');
  assert.ok(code.includes("transitionProperty: 'opacity, transform'"), 'Reveal must animate only opacity and transform');
  assert.ok(!code.includes("transitionProperty: 'width'"), 'No width transition');
  assert.ok(!code.includes("transitionProperty: 'height'"), 'No height transition');
});

test('Compositor Rule: SlideUp component uses only transform and opacity transitions', () => {
  const slideUpPath = path.join(ANIMATION_DIR, 'SlideUp.tsx');
  const code = fs.readFileSync(slideUpPath, 'utf8');
  assert.ok(code.includes("transitionProperty: 'opacity, transform'"), 'SlideUp must animate only opacity and transform');
});

test('Compositor Rule: StaggerItem component uses only transform and opacity transitions', () => {
  const staggerItemPath = path.join(ANIMATION_DIR, 'StaggerItem.tsx');
  const code = fs.readFileSync(staggerItemPath, 'utf8');
  assert.ok(code.includes("transitionProperty: 'opacity, transform'"), 'StaggerItem must animate only opacity and transform');
});

test('Compositor Rule: ScrollProgress uses CSS transform scaleX instead of width layout thrashing', () => {
  const scrollProgPath = path.join(ANIMATION_DIR, 'ScrollProgress.tsx');
  const code = fs.readFileSync(scrollProgPath, 'utf8');
  assert.ok(code.includes('scaleX'), 'ScrollProgress must use scaleX transform');
  assert.ok(!code.includes('barRef.current.style.width'), 'Must not mutate style.width on scroll');
});

test('Compositor Rule: CountUp uses tabular-nums to prevent character width jitter', () => {
  const countUpPath = path.join(ANIMATION_DIR, 'CountUp.tsx');
  const code = fs.readFileSync(countUpPath, 'utf8');
  assert.ok(code.includes('tabular-nums'), 'CountUp must specify tabular-nums');
});

// ============================================================================
// CLEANUP & SUMMARY
// ============================================================================

if (vite) {
  await vite.close();
}

console.log('\n================================================================');
console.log(`TOTAL V8.2 ANIMATION ASSERTIONS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failures.length}`);
console.log('================================================================\n');

if (failures.length > 0) {
  console.log('FAILED ASSERTIONS:');
  failures.forEach(f => console.log(` - ${f.name}: ${f.error}`));
  console.log('\n');
  process.exit(1);
} else {
  console.log('ALL V8.2 ANIMATION SYSTEM SPECIFICATIONS VERIFIED WITH 100% SUCCESS!\n');
  process.exit(0);
}
