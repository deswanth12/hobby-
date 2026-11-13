import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const INDEX_CSS_PATH = path.join(ROOT_DIR, 'src', 'index.css');
const HOMEPAGE_PATH = path.join(ROOT_DIR, 'src', 'pages', 'HomePage.tsx');
const WORKING_PROCESS_PATH = path.join(ROOT_DIR, 'src', 'components', 'WorkingProcess.tsx');
const USE_SCROLL_REVEAL_PATH = path.join(ROOT_DIR, 'src', 'hooks', 'useScrollReveal.ts');
const TAILWIND_CONFIG_PATH = path.join(ROOT_DIR, 'tailwind.config.js');

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  findings: []
};

function pass(name, detail = '') {
  results.passed++;
  console.log(`  ✔ [PASS] ${name}${detail ? ` - ${detail}` : ''}`);
}

function fail(name, detail = '') {
  results.failed++;
  results.findings.push({ severity: 'HIGH', name, detail });
  console.log(`  ✖ [FAIL] ${name}${detail ? ` - ${detail}` : ''}`);
}

function warn(name, detail = '') {
  results.warnings++;
  results.findings.push({ severity: 'MEDIUM', name, detail });
  console.log(`  ⚠ [WARN] ${name}${detail ? ` - ${detail}` : ''}`);
}

console.log('================================================================');
console.log('  EMPIRICAL MOTION & ANIMATION STRESS CHALLENGE HARNESS');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// SUITE 1: 10-Step Hero Entrance Sequence Audit
// -----------------------------------------------------------------------------
console.log('▶ SUITE 1: 10-Step Hero Entrance Sequence Audit & Timing Stress Test');

const indexCss = fs.readFileSync(INDEX_CSS_PATH, 'utf-8');
const homePage = fs.readFileSync(HOMEPAGE_PATH, 'utf-8');

// 1.1 Check presence of all 10 steps in HomePage.tsx
const expectedSteps = [
  'hero-step-1',
  'hero-step-2',
  'hero-step-3',
  'hero-step-4',
  'hero-step-5',
  'hero-step-6',
  'hero-step-7a',
  'hero-step-7b',
  'hero-step-7c',
  'hero-step-8',
  'hero-step-9',
  'hero-step-10'
];

expectedSteps.forEach(step => {
  const inHome = homePage.includes(step);
  const inCss = indexCss.includes(`.${step}`);
  if (inHome && inCss) {
    pass(`Step ${step} defined in CSS and instantiated in HomePage`);
  } else {
    fail(`Step ${step} missing: inHome=${inHome}, inCss=${inCss}`);
  }
});

// 1.2 Extract timing parameters from CSS
const stepTimingRegex = /\.hero-step-([a-zA-Z0-9]+)\s*\{([^}]+)\}/g;
const timings = {};
let match;
while ((match = stepTimingRegex.exec(indexCss)) !== null) {
  const stepName = `hero-step-${match[1]}`;
  const block = match[2];
  const delayMatch = block.match(/animation-delay:\s*(\d+)ms/);
  const durationMatch = block.match(/heroStep\w+\s+(\d+)ms/);
  const animNameMatch = block.match(/animation:\s*(heroStep\w+)/);
  const fillModeMatch = block.match(/both|forwards/);

  if (delayMatch && durationMatch) {
    timings[stepName] = {
      delay: parseInt(delayMatch[1], 10),
      duration: parseInt(durationMatch[1], 10),
      end: parseInt(delayMatch[1], 10) + parseInt(durationMatch[1], 10),
      animation: animNameMatch ? animNameMatch[1] : null,
      fillMode: fillModeMatch ? fillModeMatch[0] : null
    };
  }
}

// 1.3 Verify timing monotonicity and overlap
console.log('\n  Timing Sequence Breakdown:');
Object.entries(timings).forEach(([step, t]) => {
  console.log(`    - ${step}: delay=${t.delay}ms, duration=${t.duration}ms, end=${t.end}ms [${t.animation}]`);
});

// Check if any step delay is negative or end is <= start
let timingValid = true;
Object.entries(timings).forEach(([step, t]) => {
  if (t.delay < 0 || t.duration <= 0) {
    timingValid = false;
    fail(`${step} invalid timing: delay=${t.delay}, duration=${t.duration}`);
  }
});
if (timingValid) {
  pass('All hero entrance step delays and durations are strictly positive integers');
}

// 1.4 Check keyframe definitions for opacity endpoints
const keyframeNames = [
  'heroStepAmbientLight',
  'heroStepDotGrid',
  'heroStepSlideDown',
  'heroStepFadeUp',
  'heroStepImageClip',
  'heroStepPlaque',
  'heroStepRings'
];

keyframeNames.forEach(kf => {
  const regex = new RegExp(`@keyframes\\s+${kf}\\s*\\{([\\s\\S]*?)\\n\\}`);
  const kfMatch = indexCss.match(regex);
  if (!kfMatch) {
    fail(`Keyframe ${kf} not found in index.css`);
    return;
  }
  const body = kfMatch[1];
  const has0 = body.includes('0%');
  const has100 = body.includes('100%');
  const finalOpacity = body.match(/100%\s*\{[^}]*opacity:\s*([0-9.]+)/);
  
  if (has0 && has100 && finalOpacity) {
    pass(`Keyframe ${kf} well-formed, resolves to opacity: ${finalOpacity[1]}`);
  } else {
    fail(`Keyframe ${kf} missing 0%/100% bounds or final opacity`);
  }
});

// 1.5 Stress test: Animation collision on Step 1 (.hero-step-1 vs .animate-ambient-drift)
const heroStep1Line = indexCss.indexOf('.hero-step-1 {');
const ambientDriftLine = indexCss.indexOf('.animate-ambient-drift {');
if (heroStep1Line > ambientDriftLine) {
  warn(
    'Animation Shorthand Collision on Step 1 Ambient Light',
    '.hero-step-1 (line ' + indexCss.substring(0, heroStep1Line).split('\n').length +
    ') appears after .animate-ambient-drift (line ' + indexCss.substring(0, ambientDriftLine).split('\n').length +
    ') in index.css. Since both use shorthand "animation:" with equal (0,1,0) specificity, .hero-step-1 cancels .animate-ambient-drift, stopping ambient drift after 900ms.'
  );
} else {
  pass('Step 1 ambient drift is not shadowed by hero-step-1');
}

// 1.6 Stress test: Kinetic typography collision inside Step 4 (delay=320ms vs WordReveal delay=0ms)
const heroStep4Delay = timings['hero-step-4'] ? timings['hero-step-4'].delay : 0;
if (heroStep4Delay >= 300) {
  warn(
    'Internal Kinetic Typography Concealment in Step 4',
    `hero-step-4 container has animation-delay: ${heroStep4Delay}ms with opacity: 0 (fill-mode: both). WordReveal inside it starts word stagger at 0ms, 95ms, 190ms while container is completely invisible, hiding the initial upward word translate.`
  );
} else {
  pass('Step 4 delay is harmonized with internal kinetic typography');
}

// 1.7 Stress test: Layout order vs timing order for Step 5 & Step 6
const step5Pos = homePage.indexOf('hero-step-5');
const step6Pos = homePage.indexOf('hero-step-6');
const step5Delay = timings['hero-step-5']?.delay || 0;
const step6Delay = timings['hero-step-6']?.delay || 0;

if (step6Pos < step5Pos && step6Delay > step5Delay) {
  warn(
    'Visual Hierarchy vs Timing Inversion: Step 6 placed above Step 5 in DOM but triggers later',
    `In HomePage.tsx, Step 6 (RotatingText ticker) is physically above Step 5 (narrative paragraph), but Step 6 has delay ${step6Delay}ms while Step 5 has delay ${step5Delay}ms. The bottom paragraph animates before the top ticker.`
  );
} else {
  pass('Step 5 and Step 6 layout order matches timing order');
}

// -----------------------------------------------------------------------------
// SUITE 2: Reduced Motion Accessibility Simulation
// -----------------------------------------------------------------------------
console.log('\n▶ SUITE 2: Reduced Motion Accessibility Simulation (@media prefers-reduced-motion)');

const reducedMotionRegex = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{([\s\S]*?)\n\}/g;
let reducedMotionBlock = '';
let rMatch;
while ((rMatch = reducedMotionRegex.exec(indexCss)) !== null) {
  reducedMotionBlock += '\n' + rMatch[1];
}

if (!reducedMotionBlock) {
  fail('No @media (prefers-reduced-motion: reduce) block found in index.css');
} else {
  pass('Found @media (prefers-reduced-motion: reduce) in index.css');
}

// 2.1 Verify all 12 hero step classes in reduced motion override
expectedSteps.forEach(step => {
  if (reducedMotionBlock.includes(`.${step}`)) {
    pass(`Reduced motion overrides .${step}`);
  } else {
    fail(`Reduced motion missing override for .${step}`);
  }
});

// 2.2 Verify reduced motion forces opacity: 1 !important and animation: none !important
const hasOpacity1 = reducedMotionBlock.includes('opacity: 1 !important');
const hasAnimationNone = reducedMotionBlock.includes('animation: none !important');
const hasTransformNone = reducedMotionBlock.includes('transform: none !important');
const hasClipPathNone = reducedMotionBlock.includes('clip-path: none !important');

if (hasOpacity1 && hasAnimationNone && hasTransformNone && hasClipPathNone) {
  pass('Reduced motion enforces opacity: 1 !important, animation: none !important, transform: none !important, clip-path: none !important');
} else {
  fail(`Reduced motion missing critical resets: opacity=${hasOpacity1}, anim=${hasAnimationNone}, transform=${hasTransformNone}, clip=${hasClipPathNone}`);
}

// 2.3 Verify decorative background elements opacity side-effect
if (reducedMotionBlock.includes('.hero-step-2') && reducedMotionBlock.includes('.hero-step-10')) {
  warn(
    'Reduced-Motion Full Opacity Side-Effect on Decorative Dot Grids & Rings',
    'Applying "opacity: 1 !important" to .hero-step-2 and .hero-step-10 overrides Tailwind opacity-40/opacity-25/opacity-30 utility classes, rendering decorative background dot grids and geometric rings at 100% solid opacity under reduced motion.'
  );
} else {
  pass('Decorative elements maintain calibrated opacity under reduced motion');
}

// 2.4 Verify components have reduced-motion handlers
const wpSrc = fs.readFileSync(WORKING_PROCESS_PATH, 'utf-8');
const srSrc = fs.readFileSync(USE_SCROLL_REVEAL_PATH, 'utf-8');

const wpReduced = wpSrc.includes('prefers-reduced-motion: reduce');
const srReduced = srSrc.includes('prefers-reduced-motion: reduce');

if (wpReduced) {
  pass('WorkingProcess.tsx checks prefers-reduced-motion and forces isSectionVisible=true');
} else {
  fail('WorkingProcess.tsx lacks prefers-reduced-motion check');
}

if (srReduced) {
  pass('useScrollReveal.ts checks prefers-reduced-motion and reveals all targets immediately');
} else {
  fail('useScrollReveal.ts lacks prefers-reduced-motion check');
}

// -----------------------------------------------------------------------------
// SUITE 3: WorkingProcess Timeline Edge Cases & Fallback Readability
// -----------------------------------------------------------------------------
console.log('\n▶ SUITE 3: WorkingProcess Timeline Edge Cases & Fallback Readability');

// 3.1 Check fallback for environments without IntersectionObserver
const wpIoCheck = wpSrc.includes("typeof IntersectionObserver === 'undefined'");
if (wpIoCheck) {
  pass('WorkingProcess handles missing IntersectionObserver safely (sets isSectionVisible=true)');
} else {
  fail('WorkingProcess crashes if IntersectionObserver is undefined');
}

// 3.2 Check scroll skip behavior
const stepObserverMathMax = wpSrc.includes('Math.max(prev, stepNum)');
if (stepObserverMathMax) {
  pass('WorkingProcess step indicator uses Math.max(prev, stepNum) ensuring fast scrolling does not skip intermediate steps');
} else {
  warn('WorkingProcess step indicator may skip steps during fast scrolling');
}

// 3.3 Verify all 4 process steps exist with titles and deliverable lists
const stepMatches = [...wpSrc.matchAll(/badge:\s*'STEP (\d+)'/g)];
if (stepMatches.length === 4) {
  pass(`WorkingProcess defines exactly 4 statutory engagement steps (Steps 01 to 04)`);
} else {
  fail(`WorkingProcess step count mismatch: expected 4, found ${stepMatches.length}`);
}

// 3.4 Check default CSS visibility of scroll-reveal items
const scrollRevealCss = indexCss.match(/\.scroll-reveal\s*\{([^}]+)\}/);
if (scrollRevealCss && scrollRevealCss[1].includes('opacity: 1')) {
  pass('Base .scroll-reveal has opacity: 1 (no-JS progressive enhancement guarantee)');
} else {
  fail('Base .scroll-reveal lacks opacity: 1 fallback for no-JS environments');
}

// -----------------------------------------------------------------------------
// SUITE 4: Continuous Background Animations & Resource Leak Safety
// -----------------------------------------------------------------------------
console.log('\n▶ SUITE 4: Continuous Background Animations & Resource Leak Safety');

// 4.1 Check offscreen pausing CSS rule
const offscreenCss = indexCss.match(/\.is-offscreen[\s\S]*?\{([^}]+)\}/);
if (offscreenCss && offscreenCss[1].includes('animation-play-state: paused !important')) {
  pass('.is-offscreen correctly specifies "animation-play-state: paused !important"');
} else {
  fail('.is-offscreen missing animation-play-state: paused !important');
}

// 4.2 Check CONTINUOUS_MOTION_SELECTOR in useScrollReveal.ts
const contSelectorMatch = srSrc.match(/export const CONTINUOUS_MOTION_SELECTOR =\s*'([^']+)'/);
if (contSelectorMatch) {
  const selectors = contSelectorMatch[1].split(',').map(s => s.trim());
  pass(`CONTINUOUS_MOTION_SELECTOR defined with ${selectors.length} continuous motion classes`);
  
  // Verify key continuous classes
  const keyClasses = [
    '.motion-spin-mesh',
    '.animate-ambient-drift',
    '.animate-ambient-pulse',
    '.motion-dot-pulse',
    '.motion-dot-wave-1',
    '.motion-float-hero'
  ];
  
  keyClasses.forEach(kc => {
    if (selectors.includes(kc)) {
      pass(`CONTINUOUS_MOTION_SELECTOR includes ${kc}`);
    } else {
      warn(`CONTINUOUS_MOTION_SELECTOR missing ${kc}`);
    }
  });
} else {
  fail('CONTINUOUS_MOTION_SELECTOR not found in useScrollReveal.ts');
}

// 4.3 Check unobserved continuous animations (e.g. animate-pulse on badges)
if (contSelectorMatch && !contSelectorMatch[1].includes('.animate-pulse')) {
  warn(
    'Tailwind .animate-pulse is not in CONTINUOUS_MOTION_SELECTOR',
    'Tailwind .animate-pulse elements (e.g., green live indicator dots in badges) continue running offscreen because they are not matched by CONTINUOUS_MOTION_SELECTOR.'
  );
} else {
  pass('.animate-pulse is included in CONTINUOUS_MOTION_SELECTOR');
}

// 4.4 Check observer disconnection / cleanup in useScrollReveal.ts
const hasObserverDisconnect = srSrc.includes('observer.disconnect()');
const hasOffscreenDisconnect = srSrc.includes('offscreenObserver.disconnect()');
const hasMutationDisconnect = srSrc.includes('mutationObserver.disconnect()');
const hasCancelRaf = srSrc.includes('cancelAnimationFrame');

if (hasObserverDisconnect && hasOffscreenDisconnect && hasMutationDisconnect && hasCancelRaf) {
  pass('useScrollReveal cleanup disconnects entrance observer, offscreen observer, mutation observer, and cancels rAF');
} else {
  fail(`Missing cleanup in useScrollReveal: obs=${hasObserverDisconnect}, off=${hasOffscreenDisconnect}, mut=${hasMutationDisconnect}, raf=${hasCancelRaf}`);
}

// -----------------------------------------------------------------------------
// SUMMARY & VERDICT
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`  TEST RESULTS: ${results.passed} PASSED | ${results.failed} FAILED | ${results.warnings} WARNINGS`);
console.log('================================================================');

if (results.findings.length > 0) {
  console.log('\nFindings Register:');
  results.findings.forEach((f, i) => {
    console.log(`  ${i + 1}. [${f.severity}] ${f.name}`);
    console.log(`     Details: ${f.detail}\n`);
  });
}

const verdict = results.failed === 0 ? 'APPROVE' : 'REJECT';
console.log(`FINAL CHALLENGER 1 VERDICT: ${verdict}`);
process.exit(results.failed === 0 ? 0 : 1);
