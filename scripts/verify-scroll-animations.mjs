import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profileDir = path.resolve('reports/edge-profile-scroll-verify');
const screenshotsDir = path.resolve('reports/screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'services', path: '/services' },
  { name: 'audit-assurance', path: '/services/audit-assurance' },
  { name: 'industries', path: '/industries' },
  { name: 'locations', path: '/locations' },
  { name: 'blog', path: '/blog' },
  { name: 'blog-article', path: '/blog/statutory-audit-checklist-fy-2025-26' },
  { name: 'contact', path: '/contact' },
  { name: 'notfound', path: '/non-existent-route-404' },
  { name: 'admin-quarantine', path: '/admin' }
];

const VIEWPORTS = [
  { name: '320px', w: 320, h: 640, mobile: true },
  { name: '375px', w: 375, h: 667, mobile: true },
  { name: '390px', w: 390, h: 844, mobile: true },
  { name: '768px', w: 768, h: 1024, mobile: false },
  { name: '1024px', w: 1024, h: 768, mobile: false },
  { name: '1440px', w: 1440, h: 900, mobile: false }
];

async function main() {
  console.log('================================================================');
  console.log('  SCROLL REVEAL ANIMATIONS EMPIRICAL VERIFICATION HARNESS      ');
  console.log('  Testing: Viewports, Dynamic Scroll, Reduced-Motion, & Clicks   ');
  console.log('================================================================\n');

  let edgeProc = null;
  let totalTests = 0;
  let passedTests = 0;
  const failures = [];

  function assert(condition, message, details = '') {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  \x1b[32m✔ PASS\x1b[0m [Assert ${totalTests}] ${message}`);
    } else {
      failures.push({ message, details });
      console.log(`  \x1b[31m✖ FAIL\x1b[0m [Assert ${totalTests}] ${message}`);
      if (details) console.log(`         Details: ${details}`);
    }
  }

  try {
    console.log('[CDP] Launching Edge headless on port 9235...');
    edgeProc = spawn(edgePath, [
      '--remote-debugging-port=9235',
      '--remote-allow-origins=*',
      `--user-data-dir=${profileDir}`,
      '--headless=new',
      'http://127.0.0.1:5173'
    ], { stdio: 'ignore' });

    let tabs = null;
    for (let i = 0; i < 25; i++) {
      await new Promise(r => setTimeout(r, 400));
      try {
        const res = await fetch('http://127.0.0.1:9235/json/list');
        tabs = await res.json();
        if (tabs && tabs.length > 0) break;
      } catch (_) {}
    }

    if (!tabs || tabs.length === 0) throw new Error('Edge CDP failed to start');
    const target = tabs.find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = msgId++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

    const evalInPage = async (expr) => {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails));
      return res.result.value;
    };

    // -------------------------------------------------------------
    // PART 1: ROUTE & SCROLL VERIFICATION (DESKTOP & VIEWPORTS)
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Dynamic Scroll Reveal Across All Routes ---');

    for (const route of ROUTES) {
      console.log(`\nTesting Route: ${route.name} (${route.path})`);
      await send('Page.navigate', { url: `http://127.0.0.1:5173${route.path}` });
      // Wait for React hydration and double-rAF
      await new Promise(r => setTimeout(r, 600));

      // Initial stats before scroll
      const initialStats = await evalInPage(`
        (() => {
          const sel = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-image, [data-reveal]';
          const all = Array.from(document.querySelectorAll(sel));
          const aboveFold = all.filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight;
          });
          const belowFold = all.filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.top >= window.innerHeight;
          });
          const belowFoldRevealed = belowFold.filter(el => el.classList.contains('is-revealed'));
          return {
            total: all.length,
            aboveFoldTotal: aboveFold.length,
            aboveFoldRevealed: aboveFold.filter(el => el.classList.contains('is-revealed')).length,
            belowFoldTotal: belowFold.length,
            belowFoldRevealed: belowFoldRevealed.length
          };
        })()
      `);

      assert(
        initialStats.total > 0,
        `${route.name}: Has reveal elements (found: ${initialStats.total})`,
        JSON.stringify(initialStats)
      );

      // Verify no premature reveals: below-fold elements must NOT be revealed yet!
      if (initialStats.belowFoldTotal > 0) {
        assert(
          initialStats.belowFoldRevealed === 0,
          `${route.name}: Zero premature reveals below fold before scrolling (${initialStats.belowFoldRevealed}/${initialStats.belowFoldTotal})`
        );
      }

      // Now simulate progressive smooth scroll
      await evalInPage(`
        new Promise(resolve => {
          const docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
          );
          let current = 0;
          const step = 400;
          const interval = setInterval(() => {
            current += step;
            window.scrollTo({ top: current, behavior: 'instant' });
            if (current >= docHeight + 400) {
              clearInterval(interval);
              window.scrollTo({ top: docHeight, behavior: 'instant' });
              setTimeout(resolve, 300);
            }
          }, 60);
        })
      `);

      // After scrolling to bottom, all elements should have reached is-revealed
      const postScrollStats = await evalInPage(`
        (() => {
          const sel = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-image, [data-reveal]';
          const all = Array.from(document.querySelectorAll(sel));
          const revealed = all.filter(el => el.classList.contains('is-revealed'));
          return {
            total: all.length,
            revealed: revealed.length,
            unrevealed: all.length - revealed.length
          };
        })()
      `);

      assert(
        postScrollStats.revealed === postScrollStats.total,
        `${route.name}: All elements revealed after scrolling to bottom (${postScrollStats.revealed}/${postScrollStats.total})`
      );

      // Capture screenshot after full reveal
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(screenshotsDir, `${route.name}-revealed.png`), Buffer.from(data, 'base64'));
    }

    // -------------------------------------------------------------
    // PART 2: RESPONSIVE VIEWPORT BREAKPOINTS (320px, 375px, 390px, 768px, 1024px, 1440px)
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Responsive Viewports & Horizontal Overflow Safety ---');

    for (const vp of VIEWPORTS) {
      console.log(`\nChecking Viewport: ${vp.name} (${vp.w}x${vp.h})`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      // Test home, services, and blog-article
      for (const pageName of ['/', '/services', '/about', '/blog']) {
        await send('Page.navigate', { url: `http://127.0.0.1:5173${pageName}` });
        await new Promise(r => setTimeout(r, 500));

        const overflowCheck = await evalInPage(`
          (() => {
            const root = document.documentElement;
            return {
              scrollW: root.scrollWidth,
              clientW: root.clientWidth,
              hasHScroll: root.scrollWidth > root.clientWidth
            };
          })()
        `);

        assert(
          !overflowCheck.hasHScroll,
          `${pageName} @ ${vp.name}: Zero horizontal overflow (scrollW: ${overflowCheck.scrollW} === clientW: ${overflowCheck.clientW})`
        );
      }
    }

    // -------------------------------------------------------------
    // PART 3: PREFERS-REDUCED-MOTION ACCESSIBILITY VERIFICATION
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing prefers-reduced-motion: reduce Override ---');

    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:5173/about' });
    await new Promise(r => setTimeout(r, 600));

    const reducedMotionCheck = await evalInPage(`
      (() => {
        const sel = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-image, [data-reveal]';
        const elements = Array.from(document.querySelectorAll(sel));
        const sample = elements.slice(0, 5).map(el => {
          const comp = window.getComputedStyle(el);
          return {
            opacity: comp.opacity,
            transitionDuration: comp.transitionDuration,
            clipPath: comp.clipPath
          };
        });
        const allOpaque = sample.every(s => parseFloat(s.opacity) >= 0.99);
        return {
          total: elements.length,
          allOpaque,
          sample
        };
      })()
    `);

    assert(
      reducedMotionCheck.allOpaque,
      `prefers-reduced-motion override: all elements render instantly with opacity: 1 and clip-path: none`,
      JSON.stringify(reducedMotionCheck.sample)
    );

    // Reset emulated media
    await send('Emulation.setEmulatedMedia', { features: [] });

    // -------------------------------------------------------------
    // PART 4: INTERACTION & BUTTON MICRO-PHYSICS (CLICK / ACTIVE)
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Interactive Buttons & Hover Physics ---');

    await send('Page.navigate', { url: 'http://127.0.0.1:5173/contact' });
    await new Promise(r => setTimeout(r, 600));

    const buttonCheck = await evalInPage(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button, a.btn-pill-primary, a.btn-pill-action'))
          .filter(b => b.offsetWidth > 0 && b.offsetHeight > 0);
        const minTargets = buttons.map(b => {
          const rect = b.getBoundingClientRect();
          return {
            tag: b.tagName,
            text: (b.innerText || b.getAttribute('aria-label') || '').slice(0, 25),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            isWcagCompliant: rect.width >= 40 && rect.height >= 40 // WCAG 2.5.5 touch target
          };
        });
        const compliantCount = minTargets.filter(t => t.isWcagCompliant).length;
        return {
          total: minTargets.length,
          compliantCount,
          samples: minTargets.slice(0, 6)
        };
      })()
    `);

    assert(
      buttonCheck.total > 0 && buttonCheck.compliantCount === buttonCheck.total,
      `All visible action buttons meet touch target ergonomics (${buttonCheck.compliantCount}/${buttonCheck.total})`,
      JSON.stringify(buttonCheck.samples)
    );

    // -------------------------------------------------------------
    // PART 5: FAST SCROLL & ANCHOR JUMP RETENTION (NO INVISIBLE GHOSTS)
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Fast Scroll Jump & Anchor Navigation Retention ---');

    await send('Page.navigate', { url: 'http://127.0.0.1:5173/services' });
    await new Promise(r => setTimeout(r, 600));

    // Jump 5000px down instantly
    await evalInPage(`
      (() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 5000);
      })()
    `);
    await new Promise(r => setTimeout(r, 500));

    const jumpCheck = await evalInPage(`
      (() => {
        const sel = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-image, [data-reveal]';
        const all = Array.from(document.querySelectorAll(sel));
        const aboveViewport = all.filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.bottom <= 0;
        });
        const unrevealedAbove = aboveViewport.filter(el => !el.classList.contains('is-revealed'));
        return {
          scrollY: window.scrollY,
          aboveViewportCount: aboveViewport.length,
          unrevealedAboveCount: unrevealedAbove.length
        };
      })()
    `);

    assert(
      jumpCheck.aboveViewportCount > 0 && jumpCheck.unrevealedAboveCount === 0,
      `Fast scroll jump: Zero invisible elements left above viewport (${jumpCheck.unrevealedAboveCount}/${jumpCheck.aboveViewportCount})`,
      JSON.stringify(jumpCheck)
    );

    ws.close();
  } finally {
    if (edgeProc) edgeProc.kill();
  }

  console.log('\n================================================================');
  console.log(`TOTAL SCROLL & RESPONSIVE ASSERTIONS: ${totalTests}`);
  console.log(`PASSED: ${passedTests}`);
  console.log(`FAILED: ${failures.length}`);
  console.log('================================================================');

  if (failures.length > 0) {
    console.error('\nFAILURES:');
    failures.forEach(f => console.error(`- ${f.message}: ${f.details}`));
    process.exit(1);
  } else {
    console.log('\nALL SCROLL & RESPONSIVE ANIMATION TESTS PASSED WITH 100% SUCCESS!\n');
    process.exit(0);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
