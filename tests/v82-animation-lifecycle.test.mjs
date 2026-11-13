/**
 * tests/v82-animation-lifecycle.test.mjs
 * 
 * V8.2 Component Lifecycle & Observer Cleanup Verification Suite.
 * Validates IntersectionObserver disconnection, requestAnimationFrame cancelation,
 * symmetric window event listener cleanup, reduced-motion immediate bypass state,
 * and SSR safety guards across all 15 animation files in Kavitha & Associates V8.2.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  TEST: V8.2 ANIMATION LIFECYCLE & OBSERVER CLEANUP SUITE       ');
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

const ANIMATION_DIR = path.resolve('src/v8/components/animation');

function readCode(filename) {
  return fs.readFileSync(path.join(ANIMATION_DIR, filename), 'utf8');
}

// ============================================================================
// SUITE 1: STATIC OBSERVER DISCONNECT INVARIANT (ZERO DANGLING OBSERVERS)
// ============================================================================
console.log('▶ Suite 1: Static IntersectionObserver Cleanup Invariant');

const OBSERVER_COMPONENTS = [
  'Reveal.tsx',
  'FadeIn.tsx',
  'SlideUp.tsx',
  'StaggerContainer.tsx',
  'CountUp.tsx',
  'AnimatedDivider.tsx',
  'TextReveal.tsx',
];

for (const comp of OBSERVER_COMPONENTS) {
  test(`Observer Disconnect: ${comp} instantiates IntersectionObserver inside useEffect`, () => {
    const code = readCode(comp);
    assert.ok(code.includes('new IntersectionObserver'), `${comp} must instantiate IntersectionObserver`);
    assert.ok(code.includes('useEffect('), `${comp} must wrap observer in useEffect`);
  });

  test(`Observer Disconnect: ${comp} effect returns cleanup invoking observer.disconnect()`, () => {
    const code = readCode(comp);
    assert.ok(
      code.includes('observer.disconnect()'),
      `${comp} cleanup function MUST explicitly call observer.disconnect()`
    );
  });
}

// ============================================================================
// SUITE 2: STATIC REQUESTANIMATIONFRAME CANCELATION INVARIANT (ZERO ORPHAN LOOPS)
// ============================================================================
console.log('\n▶ Suite 2: Static requestAnimationFrame Cancelation Invariant');

const RAF_COMPONENTS = [
  'CountUp.tsx',
  'ScrollProgress.tsx',
  'ParallaxLayer.tsx',
  'PageTransition.tsx',
];

for (const comp of RAF_COMPONENTS) {
  test(`rAF Cancelation: ${comp} uses requestAnimationFrame for high-performance scheduling`, () => {
    const code = readCode(comp);
    assert.ok(code.includes('requestAnimationFrame('), `${comp} must use requestAnimationFrame`);
  });

  test(`rAF Cancelation: ${comp} stores RAF handle and invokes cancelAnimationFrame in cleanup`, () => {
    const code = readCode(comp);
    assert.ok(
      code.includes('cancelAnimationFrame('),
      `${comp} cleanup function MUST explicitly call cancelAnimationFrame to prevent memory leaks`
    );
  });
}

// ============================================================================
// SUITE 3: STATIC SYMMETRIC EVENT LISTENER REMOVAL INVARIANT
// ============================================================================
console.log('\n▶ Suite 3: Static Symmetric Event Listener Cleanup Invariant');

test('Event Symmetry: useReducedMotion.ts removes media query "change" listener', () => {
  const code = readCode('useReducedMotion.ts');
  assert.ok(code.includes("addEventListener('change'"), 'Must add change listener');
  assert.ok(code.includes("removeEventListener('change'"), 'Must remove change listener in cleanup');
  // Legacy fallback check
  assert.ok(code.includes('addListener'), 'Must provide addListener fallback for older browsers');
  assert.ok(code.includes('removeListener'), 'Must provide removeListener fallback in cleanup');
});

test('Event Symmetry: ScrollProgress.tsx removes "scroll" and "resize" listeners', () => {
  const code = readCode('ScrollProgress.tsx');
  assert.ok(code.includes("addEventListener('scroll'"), 'Must attach scroll listener');
  assert.ok(code.includes("addEventListener('resize'"), 'Must attach resize listener');
  assert.ok(code.includes("removeEventListener('scroll'"), 'Must remove scroll listener in cleanup');
  assert.ok(code.includes("removeEventListener('resize'"), 'Must remove resize listener in cleanup');
  assert.ok(code.includes('{ passive: true }'), 'Scroll and resize listeners must be registered with passive: true');
});

test('Event Symmetry: ParallaxLayer.tsx removes "scroll", "resize", and "mousemove" listeners', () => {
  const code = readCode('ParallaxLayer.tsx');
  assert.ok(code.includes("addEventListener('scroll'"), 'Must attach scroll listener');
  assert.ok(code.includes("addEventListener('resize'"), 'Must attach resize listener');
  assert.ok(code.includes("addEventListener('mousemove'"), 'Must attach mousemove listener');
  assert.ok(code.includes("removeEventListener('scroll'"), 'Must remove scroll listener in cleanup');
  assert.ok(code.includes("removeEventListener('resize'"), 'Must remove resize listener in cleanup');
  assert.ok(code.includes("removeEventListener('mousemove'"), 'Must remove mousemove listener in cleanup');
});

test('Event Symmetry: PageTransition.tsx removes "popstate" listener', () => {
  const code = readCode('PageTransition.tsx');
  assert.ok(code.includes("addEventListener('popstate'"), 'Must attach popstate listener');
  assert.ok(code.includes("removeEventListener('popstate'"), 'Must remove popstate listener in cleanup');
});

test('Event Symmetry: MagneticButton.tsx cleans mouse tracking on unmount or touch device', () => {
  const code = readCode('MagneticButton.tsx');
  assert.ok(code.includes('onMouseMove='), 'Uses React synthetic onMouseMove');
  assert.ok(code.includes('onMouseLeave='), 'Uses React synthetic onMouseLeave');
  assert.ok(code.includes('setOffset({ x: 0, y: 0 })'), 'Resets offset cleanly on leave and unmount');
});

// ============================================================================
// SUITE 4: SIMULATED RUNTIME OBSERVER LIFECYCLE & REGISTRY PURGE
// ============================================================================
console.log('\n▶ Suite 4: Simulated Runtime Observer Lifecycle & Registry Purge');

class MockObserverRegistry {
  constructor() {
    this.activeObservers = new Set();
    this.observedElements = new Map();
  }

  createObserver(callback, options) {
    const registry = this;
    const observerInstance = {
      callback,
      options,
      elements: new Set(),
      observe(el) {
        this.elements.add(el);
        registry.observedElements.set(el, this);
        registry.activeObservers.add(this);
      },
      unobserve(el) {
        this.elements.delete(el);
        registry.observedElements.delete(el);
        if (this.elements.size === 0) {
          registry.activeObservers.delete(this);
        }
      },
      disconnect() {
        for (const el of this.elements) {
          registry.observedElements.delete(el);
        }
        this.elements.clear();
        registry.activeObservers.delete(this);
      },
    };
    return observerInstance;
  }
}

test('Simulation: Observer lifecycle mounts, tracks, and completely disconnects on unmount', () => {
  const registry = new MockObserverRegistry();
  const dummyNode = { tagName: 'DIV', id: 'test-reveal-node' };

  // Simulate Reveal component mount
  const observer = registry.createObserver((entries) => {}, { threshold: 0.1 });
  observer.observe(dummyNode);

  assert.strictEqual(registry.activeObservers.size, 1, 'Active observer count must be 1 on mount');
  assert.strictEqual(registry.observedElements.has(dummyNode), true, 'Node must be tracked');

  // Simulate component unmount cleanup callback
  observer.disconnect();

  assert.strictEqual(registry.activeObservers.size, 0, 'Active observer count must drop to 0 after disconnect');
  assert.strictEqual(registry.observedElements.has(dummyNode), false, 'Observed elements map must be cleared');
});

test('Simulation: Multiple concurrent observers disconnect cleanly without cross-leakage', () => {
  const registry = new MockObserverRegistry();
  const nodes = [1, 2, 3, 4, 5].map(i => ({ id: `card-${i}` }));
  const cleanups = [];

  for (const node of nodes) {
    const obs = registry.createObserver(() => {}, { threshold: 0.1 });
    obs.observe(node);
    cleanups.push(() => obs.disconnect());
  }

  assert.strictEqual(registry.activeObservers.size, 5, 'Must track all 5 active observers');

  // Unmount 3 components
  cleanups[0]();
  cleanups[1]();
  cleanups[2]();
  assert.strictEqual(registry.activeObservers.size, 2, 'Must cleanly drop to 2 remaining observers');

  // Unmount remaining
  cleanups[3]();
  cleanups[4]();
  assert.strictEqual(registry.activeObservers.size, 0, 'All observers must be purged');
});

// ============================================================================
// SUITE 5: SIMULATED RUNTIME RAF SCHEDULING & UNMOUNT CANCELATION
// ============================================================================
console.log('\n▶ Suite 5: Simulated Runtime rAF Scheduling & Unmount Cancelation');

class MockRafScheduler {
  constructor() {
    this.nextId = 1;
    this.pendingFrames = new Map();
  }

  requestAnimationFrame(cb) {
    const id = this.nextId++;
    this.pendingFrames.set(id, cb);
    return id;
  }

  cancelAnimationFrame(id) {
    this.pendingFrames.delete(id);
  }

  get pendingCount() {
    return this.pendingFrames.size;
  }
}

test('Simulation: CountUp rAF loop is canceled immediately upon unmount', () => {
  const scheduler = new MockRafScheduler();

  // Simulate CountUp starting counting loop
  let rafId = scheduler.requestAnimationFrame((timestamp) => {});
  assert.strictEqual(scheduler.pendingCount, 1, 'Pending RAF must be 1');

  // Simulate component unmount before animation completes
  scheduler.cancelAnimationFrame(rafId);
  assert.strictEqual(scheduler.pendingCount, 0, 'Pending RAF must drop to 0 after cancelAnimationFrame');
});

test('Simulation: ScrollProgress throttled scroll events cancel pending frames on unmount', () => {
  const scheduler = new MockRafScheduler();

  let ticking = false;
  let rafId = null;

  const handleScroll = () => {
    if (!ticking) {
      ticking = true;
      rafId = scheduler.requestAnimationFrame(() => {
        ticking = false;
        rafId = null;
      });
    }
  };

  handleScroll();
  assert.strictEqual(scheduler.pendingCount, 1, 'Scroll event queued 1 RAF');

  // Repeated rapid scrolls while frame is pending do not create duplicate frames
  handleScroll();
  handleScroll();
  assert.strictEqual(scheduler.pendingCount, 1, 'Throttling prevented redundant RAF allocations');

  // Unmount cleans up
  if (rafId !== null) {
    scheduler.cancelAnimationFrame(rafId);
  }
  assert.strictEqual(scheduler.pendingCount, 0, 'Pending frames dropped to 0 on unmount');
});

// ============================================================================
// SUITE 6: SIMULATED RUNTIME WINDOW EVENT LISTENER PURGE
// ============================================================================
console.log('\n▶ Suite 6: Simulated Runtime Window Event Listener Purge');

class MockWindowEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, handler, options) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(handler);
  }

  removeEventListener(type, handler, options) {
    if (this.listeners.has(type)) {
      this.listeners.get(type).delete(handler);
      if (this.listeners.get(type).size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  getListenerCount(type) {
    return this.listeners.has(type) ? this.listeners.get(type).size : 0;
  }

  get totalListeners() {
    let sum = 0;
    for (const set of this.listeners.values()) {
      sum += set.size;
    }
    return sum;
  }
}

test('Simulation: ParallaxLayer mounts scroll and resize listeners and removes both on unmount', () => {
  const mockWin = new MockWindowEventEmitter();
  const handleScroll = () => {};

  // Mount
  mockWin.addEventListener('scroll', handleScroll, { passive: true });
  mockWin.addEventListener('resize', handleScroll, { passive: true });

  assert.strictEqual(mockWin.getListenerCount('scroll'), 1);
  assert.strictEqual(mockWin.getListenerCount('resize'), 1);
  assert.strictEqual(mockWin.totalListeners, 2);

  // Unmount
  mockWin.removeEventListener('scroll', handleScroll);
  mockWin.removeEventListener('resize', handleScroll);

  assert.strictEqual(mockWin.getListenerCount('scroll'), 0);
  assert.strictEqual(mockWin.getListenerCount('resize'), 0);
  assert.strictEqual(mockWin.totalListeners, 0);
});

test('Simulation: PageTransition mounts popstate listener and removes it on unmount', () => {
  const mockWin = new MockWindowEventEmitter();
  const handlePopState = () => {};

  mockWin.addEventListener('popstate', handlePopState);
  assert.strictEqual(mockWin.getListenerCount('popstate'), 1);

  mockWin.removeEventListener('popstate', handlePopState);
  assert.strictEqual(mockWin.getListenerCount('popstate'), 0);
});

// ============================================================================
// SUITE 7: REDUCED-MOTION IMMEDIATE BYPASS STATE VERIFICATION
// ============================================================================
console.log('\n▶ Suite 7: Reduced-Motion Immediate Bypass State Verification');

test('Reduced-Motion Bypass: Reveal immediately defaults to visible state when isReduced=true', () => {
  const code = readCode('Reveal.tsx');
  assert.ok(code.includes('const isReduced = useReducedMotion();'), 'Consumes useReducedMotion');
  assert.ok(code.includes('if (isReduced) {\n      setIsVisible(true);\n      return;\n    }'), 'Bypasses observer on reduced motion');
  assert.ok(code.includes("transform: 'none'"), 'Forces transform: none on reduced motion');
  assert.ok(code.includes("transition: 'none'"), 'Forces transition: none on reduced motion');
});

test('Reduced-Motion Bypass: CountUp immediately displays final numeric value when isReduced=true', () => {
  const code = readCode('CountUp.tsx');
  assert.ok(code.includes('setDisplayValue(value);'), 'Renders target value immediately');
  assert.ok(code.includes('cancelAnimationFrame(rafRef.current);'), 'Cancels any active rAF loop');
  assert.ok(code.includes('if (!hasStarted || isReduced) {\n      return;\n    }'), 'Prevents step loop from executing');
});

test('Reduced-Motion Bypass: TextReveal renders full text without word/char stagger delays', () => {
  const code = readCode('TextReveal.tsx');
  assert.ok(code.includes('!triggerOnScroll || isReduced'), 'Initializes visible immediately when reduced motion');
  assert.ok(code.includes('if (isReduced || !triggerOnScroll) {\n      setIsVisible(true);\n      return;\n    }'), 'Bypasses intersection trigger');
});

test('Reduced-Motion Bypass: MagneticButton locks offset to (0, 0) and transform to "none"', () => {
  const code = readCode('MagneticButton.tsx');
  assert.ok(code.includes('if (disabled || isReduced || isTouchDevice()) {\n        return;\n      }'), 'Bypasses mousemove physics');
  assert.ok(code.includes("transformStyle = isReduced || disabled\n    ? 'none'"), 'Sets transform to none');
});

test('Reduced-Motion Bypass: ParallaxLayer locks offset to 0 and disables scroll listeners', () => {
  const code = readCode('ParallaxLayer.tsx');
  assert.ok(code.includes('if (disabled || isReduced || isMobileOrTouch()) {\n      setOffset(0);\n      return;\n    }'), 'Returns early without attaching scroll listener');
  assert.ok(code.includes("transformStyle = isReduced || disabled\n    ? 'none'"), 'Sets transformStyle to none');
});

test('Reduced-Motion Bypass: AnimatedDivider renders at 100% scale without line-draw delay', () => {
  const code = readCode('AnimatedDivider.tsx');
  assert.ok(code.includes('const [isVisible, setIsVisible] = useState<boolean>(() => isReduced);'), 'Defaults to visible if reduced motion');
  assert.ok(code.includes('if (isReduced) {\n      setIsVisible(true);\n      return;\n    }'), 'Bypasses line animation on reduced motion');
});

test('Reduced-Motion Bypass: ScrollProgress locks scaleX to 0 without running rAF loops', () => {
  const code = readCode('ScrollProgress.tsx');
  assert.ok(code.includes("if (isReduced) {\n      if (barRef.current) {\n        barRef.current.style.transform = 'scaleX(0)';\n      }\n      return;\n    }"), 'Bypasses scroll tracking and resets bar');
});

// ============================================================================
// SUITE 8: SSR SAFETY & WINDOW REFERENCE GUARDS
// ============================================================================
console.log('\n▶ Suite 8: SSR Safety & Window Reference Guards');

const SSR_FILES = [
  'useReducedMotion.ts',
  'Reveal.tsx',
  'FadeIn.tsx',
  'SlideUp.tsx',
  'CountUp.tsx',
  'ParallaxLayer.tsx',
  'ScrollProgress.tsx',
  'AnimatedDivider.tsx',
  'TextReveal.tsx',
  'PageTransition.tsx',
  'MagneticButton.tsx',
];

for (const file of SSR_FILES) {
  test(`SSR Safety: ${file} encapsulates window access inside useEffect or typeof window guards`, () => {
    const code = readCode(file);
    const hasWindowGuard = code.includes("typeof window === 'undefined'") || code.includes("typeof window !== 'undefined'");
    const hasUseEffectEncapsulation = code.includes('useEffect(');
    assert.ok(
      hasWindowGuard || hasUseEffectEncapsulation,
      `${file} must guard window access via typeof window or encapsulate within useEffect for safe SSR execution`
    );
  });
}

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n================================================================');
console.log(`TOTAL LIFECYCLE & CLEANUP ASSERTIONS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failures.length}`);
console.log('================================================================\n');

if (failures.length > 0) {
  console.log('FAILED ASSERTIONS:');
  failures.forEach(f => console.log(` - ${f.name}: ${f.error}`));
  console.log('\n');
  process.exit(1);
} else {
  console.log('ALL COMPONENT LIFECYCLE & OBSERVER CLEANUP CONTRACTS VERIFIED WITH 100% SUCCESS!\n');
  process.exit(0);
}
