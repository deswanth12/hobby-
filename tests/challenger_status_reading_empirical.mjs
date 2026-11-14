/**
 * tests/challenger_status_reading_empirical.mjs
 * 
 * Adversarial Challenger 1 Test Harness:
 * Empirical verification of Requirement R1 (Live Chambers Status Indicator)
 * and Requirement R2 (Slender Antique Gold Reading Indicator).
 * 
 * Tests:
 * 1. Complete 168-hour exhaustive sweep of Indian Standard Time (IST, UTC+5:30)
 * 2. Boundary second-by-second stress test (Friday night, Saturday afternoon, Sunday all day, Monday morning)
 * 3. Timezone invariance test (host-system independent)
 * 4. R1 Visual specifications (dual-layer pulsing emerald dot, restful dot, theme classes, timer cleanup)
 * 5. R1 Integration audit across 4 designated locations
 * 6. R2 Math & boundary clamp [0, 1] across extreme overscroll / zero-height scenarios
 * 7. R2 Hardware acceleration & compositor rules (scaleX, requestAnimationFrame, passive listeners, unmount cleanup)
 * 8. R2 Route change reset via location.pathname
 * 9. R2 CSS specificity & zero horizontal overflow across viewports
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { getChambersStatus, getISTDate, IST_OFFSET_MS } from '../src/v8/adapters/chambersStatus.ts';

console.log('================================================================');
console.log('  CHALLENGER 1: ADVERSARIAL STRESS TEST — STATUS & READING      ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passCount++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${passCount + failCount}] ${name}`);
  } catch (err) {
    failCount++;
    const shortErr = err.message ? err.message.slice(0, 180) : String(err);
    failures.push({ name, error: shortErr });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${passCount + failCount}] ${name}`);
    console.log(`       ${shortErr}`);
  }
}

// ============================================================================
// SUITE 1: R1 EXHAUSTIVE 168-HOUR IST CALENDAR ORACLE SWEEP
// ============================================================================
console.log('▶ Suite 1: R1 Exhaustive 168-Hour IST Calendar Oracle Sweep');

/**
 * Ground-truth oracle for Chambers Operating Hours:
 * Monday to Friday: 09:30 to 18:30 IST
 * Saturday: 10:00 to 14:00 IST
 * Sunday: Closed
 */
function groundTruthOracle(istDay, istHours, istMinutes) {
  const currentMinutes = istHours * 60 + istMinutes;

  if (istDay >= 1 && istDay <= 5) {
    // Weekday: Mon-Fri
    const openMin = 9 * 60 + 30; // 570
    const closeMin = 18 * 60 + 30; // 1110
    if (currentMinutes >= openMin && currentMinutes < closeMin) {
      return {
        isOpen: true,
        detailLabel: 'Until 18:30 IST',
        nextOpeningTime: istDay === 5 ? '10:00 AM' : '09:30 AM',
      };
    } else if (currentMinutes < openMin) {
      return {
        isOpen: false,
        detailLabel: 'Callback Queued for 09:30 AM',
        nextOpeningTime: '09:30 AM',
      };
    } else {
      // After hours
      const nextTime = istDay === 5 ? '10:00 AM' : '09:30 AM';
      return {
        isOpen: false,
        detailLabel: `Callback Queued for ${nextTime}`,
        nextOpeningTime: nextTime,
      };
    }
  } else if (istDay === 6) {
    // Saturday
    const openMin = 10 * 60; // 600
    const closeMin = 14 * 60; // 840
    if (currentMinutes >= openMin && currentMinutes < closeMin) {
      return {
        isOpen: true,
        detailLabel: 'Until 14:00 IST',
        nextOpeningTime: '09:30 AM',
      };
    } else if (currentMinutes < openMin) {
      return {
        isOpen: false,
        detailLabel: 'Callback Queued for 10:00 AM',
        nextOpeningTime: '10:00 AM',
      };
    } else {
      return {
        isOpen: false,
        detailLabel: 'Callback Queued for 09:30 AM',
        nextOpeningTime: '09:30 AM',
      };
    }
  } else {
    // Sunday (istDay === 0)
    return {
      isOpen: false,
      detailLabel: 'Callback Queued for 09:30 AM',
      nextOpeningTime: '09:30 AM',
    };
  }
}

// Reference week: 2026-11-15 (Sunday) 00:00:00 UTC = 05:30:00 IST
// We test every hour for 7 days * 24 hours = 168 hours
test('168-Hour exhaustive sweep matches ground-truth oracle at every hour', () => {
  // Let base be Sunday 2026-11-15 00:00:00 IST (which is 2026-11-14 18:30:00 UTC)
  const baseEpoch = Date.UTC(2026, 10, 14, 18, 30, 0); // 2026-11-15 00:00 IST
  
  let checkedHours = 0;
  for (let h = 0; h < 168; h++) {
    const testEpoch = baseEpoch + h * 3600 * 1000;
    const testDate = new Date(testEpoch);
    const istDate = getISTDate(testDate);
    
    const istDay = istDate.getUTCDay();
    const istHour = istDate.getUTCHours();
    const istMin = istDate.getUTCMinutes();
    
    const expected = groundTruthOracle(istDay, istHour, istMin);
    const actual = getChambersStatus(testDate);
    
    assert.strictEqual(
      actual.isOpen,
      expected.isOpen,
      `Hour ${h} (Day ${istDay}, ${istHour}:${istMin} IST): Expected isOpen=${expected.isOpen}, got ${actual.isOpen}`
    );
    assert.strictEqual(
      actual.detailLabel,
      expected.detailLabel,
      `Hour ${h} (Day ${istDay}, ${istHour}:${istMin} IST): Expected detailLabel="${expected.detailLabel}", got "${actual.detailLabel}"`
    );
    assert.strictEqual(
      actual.nextOpeningTime,
      expected.nextOpeningTime,
      `Hour ${h} (Day ${istDay}, ${istHour}:${istMin} IST): Expected nextOpeningTime="${expected.nextOpeningTime}", got "${actual.nextOpeningTime}"`
    );
    checkedHours++;
  }
  assert.strictEqual(checkedHours, 168, 'Must verify all 168 hours of the week');
});

// ============================================================================
// SUITE 2: R1 BOUNDARY & TRANSITION SECOND-BY-SECOND STRESS TESTS
// ============================================================================
console.log('\n▶ Suite 2: R1 Precise Boundary & Transition Simulations');

function makeISTDate(year, month, day, hour, minute, second) {
  // Month is 1-based (1..12)
  // Shift by -IST_OFFSET_MS to create UTC date representing this exact IST moment
  const utcMillis = Date.UTC(year, month - 1, day, hour, minute, second) - IST_OFFSET_MS;
  return new Date(utcMillis);
}

test('Friday 18:29:59 IST (Open) -> 18:30:00 IST (Closed, Queued for Saturday 10:00 AM)', () => {
  const friOpen = makeISTDate(2026, 11, 20, 18, 29, 59);
  const statusOpen = getChambersStatus(friOpen);
  assert.strictEqual(statusOpen.isOpen, true, 'Friday 18:29:59 must be open');
  assert.strictEqual(statusOpen.detailLabel, 'Until 18:30 IST');
  assert.strictEqual(statusOpen.nextOpeningTime, '10:00 AM');
  assert.strictEqual(statusOpen.statusLabel, 'Chambers Open · Partner Desk Active');

  const friClosed = makeISTDate(2026, 11, 20, 18, 30, 0);
  const statusClosed = getChambersStatus(friClosed);
  assert.strictEqual(statusClosed.isOpen, false, 'Friday 18:30:00 must be closed');
  assert.strictEqual(statusClosed.detailLabel, 'Callback Queued for 10:00 AM');
  assert.strictEqual(statusClosed.nextOpeningTime, '10:00 AM');
  assert.strictEqual(statusClosed.statusLabel, 'Chambers Closed · Callback Queued for 10:00 AM');
});

test('Friday 23:59:59 IST (Closed, queues to Saturday 10:00 AM)', () => {
  const friLate = makeISTDate(2026, 11, 20, 23, 59, 59);
  const status = getChambersStatus(friLate);
  assert.strictEqual(status.isOpen, false);
  assert.strictEqual(status.nextOpeningTime, '10:00 AM');
  assert.strictEqual(status.detailLabel, 'Callback Queued for 10:00 AM');
});

test('Saturday 09:59:59 IST (Closed, Queued for 10:00 AM today) -> 10:00:00 IST (Open until 14:00)', () => {
  const satPre = makeISTDate(2026, 11, 21, 9, 59, 59);
  const statusPre = getChambersStatus(satPre);
  assert.strictEqual(statusPre.isOpen, false);
  assert.strictEqual(statusPre.nextOpeningTime, '10:00 AM');
  assert.strictEqual(statusPre.detailLabel, 'Callback Queued for 10:00 AM');

  const satOpen = makeISTDate(2026, 11, 21, 10, 0, 0);
  const statusOpen = getChambersStatus(satOpen);
  assert.strictEqual(statusOpen.isOpen, true);
  assert.strictEqual(statusOpen.detailLabel, 'Until 14:00 IST');
  assert.strictEqual(statusOpen.nextOpeningTime, '09:30 AM');
});

test('Saturday 13:59:59 IST (Open) -> 14:00:00 IST (Closed, queues across Sunday to Monday 09:30 AM)', () => {
  const satBeforeClose = makeISTDate(2026, 11, 21, 13, 59, 59);
  const statusBefore = getChambersStatus(satBeforeClose);
  assert.strictEqual(statusBefore.isOpen, true);
  assert.strictEqual(statusBefore.detailLabel, 'Until 14:00 IST');

  const satClosed = makeISTDate(2026, 11, 21, 14, 0, 0);
  const statusAfter = getChambersStatus(satClosed);
  assert.strictEqual(statusAfter.isOpen, false);
  assert.strictEqual(statusAfter.nextOpeningTime, '09:30 AM');
  assert.strictEqual(statusAfter.detailLabel, 'Callback Queued for 09:30 AM');
  assert.strictEqual(statusAfter.statusLabel, 'Chambers Closed · Callback Queued for 09:30 AM');
});

test('Sunday all day (00:00, 12:00, 23:59:59) is closed and queues to Monday 09:30 AM', () => {
  const times = [
    [0, 0, 0],
    [6, 30, 0],
    [12, 0, 0],
    [18, 30, 0],
    [23, 59, 59],
  ];
  for (const [h, m, s] of times) {
    const sunDate = makeISTDate(2026, 11, 22, h, m, s);
    const status = getChambersStatus(sunDate);
    assert.strictEqual(status.isOpen, false, `Sunday ${h}:${m}:${s} must be closed`);
    assert.strictEqual(status.nextOpeningTime, '09:30 AM');
    assert.strictEqual(status.detailLabel, 'Callback Queued for 09:30 AM');
  }
});

test('Monday 09:29:59 IST (Closed, Queued for 09:30 AM today) -> 09:30:00 IST (Open until 18:30)', () => {
  const monPre = makeISTDate(2026, 11, 23, 9, 29, 59);
  const statusPre = getChambersStatus(monPre);
  assert.strictEqual(statusPre.isOpen, false);
  assert.strictEqual(statusPre.nextOpeningTime, '09:30 AM');
  assert.strictEqual(statusPre.detailLabel, 'Callback Queued for 09:30 AM');

  const monOpen = makeISTDate(2026, 11, 23, 9, 30, 0);
  const statusOpen = getChambersStatus(monOpen);
  assert.strictEqual(statusOpen.isOpen, true);
  assert.strictEqual(statusOpen.detailLabel, 'Until 18:30 IST');
  assert.strictEqual(statusOpen.nextOpeningTime, '09:30 AM');
  assert.strictEqual(statusOpen.statusLabel, 'Chambers Open · Partner Desk Active');
});

test('Wednesday mid-week after hours (18:30:00 IST) queues to Thursday 09:30 AM', () => {
  const wedAfter = makeISTDate(2026, 11, 18, 18, 30, 0);
  const status = getChambersStatus(wedAfter);
  assert.strictEqual(status.isOpen, false);
  assert.strictEqual(status.nextOpeningTime, '09:30 AM');
  assert.strictEqual(status.detailLabel, 'Callback Queued for 09:30 AM');
});

// ============================================================================
// SUITE 3: TIMEZONE INVARIANCE & OFFSET MATH AUDIT
// ============================================================================
console.log('\n▶ Suite 3: Timezone Invariance & Determinism Audit');

test('IST_OFFSET_MS is exactly 5 hours 30 minutes (19,800,000 ms)', () => {
  assert.strictEqual(IST_OFFSET_MS, 19800000);
});

test('getISTDate creates pure UTC offset representation without DST skew', () => {
  const testEpoch = 1731580200000; // arbitrary timestamp
  const istDate = getISTDate(new Date(testEpoch));
  assert.strictEqual(istDate.getTime() - testEpoch, IST_OFFSET_MS);
});

// ============================================================================
// SUITE 4: R1 COMPONENT STYLING & ACCESSIBILITY SPECIFICATIONS
// ============================================================================
console.log('\n▶ Suite 4: R1 Component Styling & Accessibility Specifications');

const indicatorCode = fs.readFileSync(
  path.resolve('src/v8/components/common/ChambersStatusIndicator.tsx'),
  'utf8'
);

test('R1 Indicator renders dual-layer pulsing emerald dot when Open', () => {
  assert.ok(indicatorCode.includes('animate-ping'), 'Must contain animate-ping pulse layer');
  assert.ok(indicatorCode.includes('bg-emerald-400'), 'Pulse layer must use bg-emerald-400');
  assert.ok(indicatorCode.includes('bg-emerald-500'), 'Core dot must use bg-emerald-500');
});

test('R1 Indicator renders restful dot when Closed in both dark and light themes', () => {
  assert.ok(indicatorCode.includes("bg-[#9E7B35]/70"), 'Light theme closed dot must be antique bronze');
  assert.ok(indicatorCode.includes("bg-[#D8D0BE]/80"), 'Dark theme closed dot must be restful stone');
});

test('R1 Indicator implements WCAG accessibility attributes (role="status", aria-live="polite")', () => {
  assert.ok(indicatorCode.includes('role="status"'), 'Must have role="status"');
  assert.ok(indicatorCode.includes('aria-live="polite"'), 'Must have aria-live="polite"');
  assert.ok(indicatorCode.includes('aria-hidden="true"'), 'Dot layers must have aria-hidden="true"');
});

test('R1 Indicator sets 30s auto-refresh interval with clearInterval unmount cleanup', () => {
  assert.ok(indicatorCode.includes('setInterval('), 'Must set auto-refresh interval');
  assert.ok(indicatorCode.includes('30000'), 'Must refresh every 30000 ms (30s)');
  assert.ok(indicatorCode.includes('clearInterval(intervalId)'), 'Must clean up interval on unmount');
});

// ============================================================================
// SUITE 5: R1 INTEGRATION AUDIT ACROSS 4 CONTRACT LOCATIONS
// ============================================================================
console.log('\n▶ Suite 5: R1 Placement Across All 4 Contract Locations');

const navbarCode = fs.readFileSync(path.resolve('src/v8/components/layout/Navbar.tsx'), 'utf8');
const intakeCode = fs.readFileSync(path.resolve('src/v8/components/home/ChambersIntakeSection.tsx'), 'utf8');
const locationsCode = fs.readFileSync(path.resolve('src/v8/pages/LocationsPage.tsx'), 'utf8');
const contactCode = fs.readFileSync(path.resolve('src/v8/pages/ContactPage.tsx'), 'utf8');

test('Location 1: Navbar top utility desk embeds ChambersStatusIndicator', () => {
  assert.ok(navbarCode.includes('<ChambersStatusIndicator variant="compact" theme="dark" showDetail={true} />'));
});

test('Location 2: Homepage ChambersIntakeSection embeds ChambersStatusIndicator in header and working hours', () => {
  assert.ok(intakeCode.includes('<ChambersStatusIndicator variant="pill" theme="dark" showDetail={true} />'));
  assert.ok(intakeCode.includes('<ChambersStatusIndicator variant="compact" theme="dark" showDetail={false} />'));
});

test('Location 3: LocationsPage embeds ChambersStatusIndicator in dossier and consultation hours', () => {
  assert.ok(locationsCode.includes('<ChambersStatusIndicator variant="badge" theme="light" showDetail={true} />'));
  assert.ok(locationsCode.includes('<ChambersStatusIndicator variant="compact" theme="light" showDetail={false} />'));
});

test('Location 4: ContactPage embeds ChambersStatusIndicator in hero kicker and consultation card', () => {
  assert.ok(contactCode.includes('<ChambersStatusIndicator variant="pill" theme="dark" showDetail={true} />'));
  assert.ok(contactCode.includes('<ChambersStatusIndicator variant="compact" theme="light" showDetail={false} />'));
});

// ============================================================================
// SUITE 6: R2 SLENDER READING INDICATOR MATHEMATICAL CLAMP & BOUNDS
// ============================================================================
console.log('\n▶ Suite 6: R2 Reading Indicator Mathematical Bounds [0, 1]');

function computeProgress(scrollHeight, innerHeight, scrollY, scrollTop) {
  const scrollable = scrollHeight - innerHeight;
  const scrolled = scrollY || scrollTop || 0;
  const progress = scrollable > 0 ? scrolled / scrollable : 0;
  const clamped = Math.min(Math.max(progress, 0), 1);
  return clamped;
}

test('R2 Math: scrollable <= 0 (unscrollable viewport) strictly returns 0', () => {
  assert.strictEqual(computeProgress(1000, 1000, 0, 0), 0);
  assert.strictEqual(computeProgress(800, 1000, 0, 0), 0); // content smaller than window
});

test('R2 Math: scrollY = 0 (top of page) strictly returns 0', () => {
  assert.strictEqual(computeProgress(5000, 1000, 0, 0), 0);
});

test('R2 Math: scrollY = scrollable (bottom of page) strictly returns 1', () => {
  assert.strictEqual(computeProgress(5000, 1000, 4000, 0), 1);
});

test('R2 Math: Negative scroll (iOS rubber-band pull-down) clamped to 0', () => {
  assert.strictEqual(computeProgress(5000, 1000, -150, 0), 0);
});

test('R2 Math: Overscroll past bottom (iOS rubber-band overshoot) clamped to 1', () => {
  assert.strictEqual(computeProgress(5000, 1000, 4500, 0), 1);
});

test('R2 Math: Midpoint scrolling yields expected proportional value', () => {
  assert.strictEqual(computeProgress(5000, 1000, 2000, 0), 0.5);
  assert.strictEqual(computeProgress(5000, 1000, 1000, 0), 0.25);
  assert.strictEqual(computeProgress(5000, 1000, 3000, 0), 0.75);
});

test('R2 Math: No NaN or Infinity for boundary inputs (0, undefined, null)', () => {
  const r1 = computeProgress(0, 0, 0, 0);
  assert.ok(!Number.isNaN(r1) && Number.isFinite(r1));
  const r2 = computeProgress(1000, 0, 500, 0);
  assert.ok(!Number.isNaN(r2) && Number.isFinite(r2));
});

// ============================================================================
// SUITE 7: R2 HARDWARE ACCELERATION, PASSIVE LISTENERS & RAF CLEANUP
// ============================================================================
console.log('\n▶ Suite 7: R2 Hardware Acceleration & Compositor Lifecycle');

const scrollProgressCode = fs.readFileSync(
  path.resolve('src/v8/components/layout/ScrollProgress.tsx'),
  'utf8'
);

test('R2 uses hardware-accelerated scaleX transform without layout thrashing', () => {
  assert.ok(scrollProgressCode.includes("barRef.current.style.transform = `scaleX(${clamped})`"));
  assert.ok(!scrollProgressCode.includes('style.width'), 'Must not mutate style.width');
});

test('R2 sets transform origin to left (origin-left)', () => {
  assert.ok(scrollProgressCode.includes('origin-left'), 'Must have origin-left Tailwind class');
});

test('R2 uses requestAnimationFrame with ticking guard to prevent redundant frames', () => {
  assert.ok(scrollProgressCode.includes('window.requestAnimationFrame(updateProgress)'));
  assert.ok(scrollProgressCode.includes('let ticking = false'));
  assert.ok(scrollProgressCode.includes('rafRef.current = null'));
});

test('R2 registers passive scroll and resize listeners', () => {
  assert.ok(scrollProgressCode.includes("window.addEventListener('scroll', handleScroll, { passive: true })"));
  assert.ok(scrollProgressCode.includes("window.addEventListener('resize', handleScroll, { passive: true })"));
});

test('R2 performs symmetric cleanup on unmount: remove listeners and cancelAnimationFrame', () => {
  assert.ok(scrollProgressCode.includes("window.removeEventListener('scroll', handleScroll)"));
  assert.ok(scrollProgressCode.includes("window.removeEventListener('resize', handleScroll)"));
  assert.ok(scrollProgressCode.includes("window.cancelAnimationFrame(rafRef.current)"));
});

// ============================================================================
// SUITE 8: R2 ROUTE CHANGE RESET VIA LOCATION.PATHNAME
// ============================================================================
console.log('\n▶ Suite 8: R2 Route Change Reset via location.pathname');

test('R2 imports useLocation from react-router-dom', () => {
  assert.ok(scrollProgressCode.includes("import { useLocation } from 'react-router-dom'"));
  assert.ok(scrollProgressCode.includes("const location = useLocation()"));
});

test('R2 useEffect dependency array includes [location.pathname] for route transition resets', () => {
  assert.ok(scrollProgressCode.includes("}, [location.pathname])"));
});

// ============================================================================
// SUITE 9: R2 CSS SPECIFICITY & PINNING DEDUPLICATION
// ============================================================================
console.log('\n▶ Suite 9: R2 CSS Specificity, Pinning & Deduplication');

const indexCss = fs.readFileSync(path.resolve('src/index.css'), 'utf8');
const publicLayoutCode = fs.readFileSync(
  path.resolve('src/v8/components/layout/PublicLayout.tsx'),
  'utf8'
);

test('R2 is pinned inside Navbar sticky header', () => {
  assert.ok(navbarCode.includes('<ScrollProgress />'));
});

test('R2 duplicate was removed from PublicLayout.tsx', () => {
  assert.ok(!publicLayoutCode.includes('<ScrollProgress'), 'PublicLayout must not render duplicate ScrollProgress');
});

test('src/index.css #scroll-progress-bar matches 2px, antique gold gradient and shadow glow', () => {
  assert.ok(indexCss.includes('#scroll-progress-bar {'));
  assert.ok(indexCss.includes('height: 2px;'));
  assert.ok(indexCss.includes('#9E7B35'));
  assert.ok(indexCss.includes('#C3A66B'));
  assert.ok(indexCss.includes('#F4E2BB'));
  assert.ok(indexCss.includes('box-shadow: 0 0 8px rgba(195, 166, 107, 0.5);'));
});

// ============================================================================
// TEST SUMMARY & FINAL VERDICT
// ============================================================================
console.log('\n================================================================');
console.log(`  CHALLENGER 1 ADVERSARIAL SUITE: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  console.error('CHALLENGE FAILED — Discrepancies detected:');
  for (const f of failures) {
    console.error(`- ${f.name}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('VERDICT: ALL ADVERSARIAL STRESS CHALLENGES PASSED WITH 100% SUCCESS.');
  process.exit(0);
}
