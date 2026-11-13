import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function runChallenger2StressTest() {
  console.log('================================================================');
  console.log('  CHALLENGER 2: ADVERSARIAL VIEWPORT & LAYOUT STRESS HARNESS    ');
  console.log('================================================================');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-challenger2');
  
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
  }

  const port = 9245;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'http://127.0.0.1:5173'
  ], { stdio: 'ignore' });

  const viewports = [
    { name: '320px (Small Mobile)', w: 320, h: 568, mob: true },
    { name: '390px (Standard Mobile)', w: 390, h: 844, mob: true },
    { name: '768px (Tablet Portrait)', w: 768, h: 1024, mob: false },
    { name: '1024px (Desktop Small/Tablet Land)', w: 1024, h: 768, mob: false },
    { name: '1440px (Standard Desktop)', w: 1440, h: 900, mob: false },
    { name: '1920px (FHD Large Desktop)', w: 1920, h: 1080, mob: false }
  ];

  const routes = [
    '/',
    '/about',
    '/services',
    '/services/audit-assurance',
    '/services/tax-compliance',
    '/contact',
    '/blog'
  ];

  const results = {
    totalChecks: 0,
    passedChecks: 0,
    failedChecks: 0,
    overflowFindings: [],
    svgFindings: [],
    cardShiftFindings: [],
    dotAlignmentFindings: [],
    headlineClippingFindings: []
  };

  try {
    let ws = null;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 300));
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/list`);
        const tabs = await res.json();
        const target = tabs.find(t => t.type === 'page');
        if (target) {
          ws = new WebSocket(target.webSocketDebuggerUrl);
          await new Promise(r => { ws.onopen = r; });
          break;
        }
      } catch (_) {}
    }

    if (!ws) {
      throw new Error('Could not connect to Edge headless via CDP');
    }

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = msgId++;
      const handler = evt => {
        const d = JSON.parse(evt.data);
        if (d.id === id) {
          ws.removeEventListener('message', handler);
          if (d.error) reject(d.error);
          else resolve(d.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    console.log(`Connected to Chrome/Edge DevTools Protocol on port ${port}. Starting stress evaluation...\n`);

    for (const route of routes) {
      console.log(`\n--- Auditing Route: ${route} ---`);
      for (const vp of viewports) {
        results.totalChecks++;
        await send('Emulation.setDeviceMetricsOverride', {
          width: vp.w,
          height: vp.h,
          deviceScaleFactor: 1,
          mobile: vp.mob
        });

        await send('Page.navigate', { url: `http://127.0.0.1:5173${route}` });
        // Allow DOM rendering and initial animation frames to settle
        await new Promise(res => setTimeout(res, 900));

        // Evaluate layout, overflow, SVGs, and text clipping
        const domEval = await send('Runtime.evaluate', {
          expression: `(() => {
            const docEl = document.documentElement;
            const body = document.body;
            const scrollW = Math.max(docEl.scrollWidth, body.scrollWidth);
            const clientW = docEl.clientWidth;
            const hasHorizontalScroll = scrollW > clientW;
            const overflowDiff = scrollW - clientW;

            // Find in-flow elements overflowing client width
            const overflowingElements = [];
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const style = window.getComputedStyle(el);
              if (style.display === 'none' || style.visibility === 'hidden') continue;
              if (style.position === 'fixed') continue; // Fixed overlays do not cause document flow overflow

              const rect = el.getBoundingClientRect();
              // Ignore zero-size or hidden elements
              if (rect.width === 0 || rect.height === 0) continue;
              if (rect.right > clientW + 1.5) {
                // Check if element is inside an overflow-hidden ancestor
                let p = el.parentElement;
                let clipped = false;
                while (p && p !== document.body) {
                  const pStyle = window.getComputedStyle(p);
                  if (pStyle.overflowX === 'hidden' || pStyle.overflowX === 'clip' || pStyle.overflow === 'hidden') {
                    clipped = true;
                    break;
                  }
                  p = p.parentElement;
                }
                if (!clipped) {
                  overflowingElements.push({
                    tag: el.tagName.toLowerCase(),
                    className: (el.className || '').toString().slice(0, 60),
                    rectRight: Math.round(rect.right),
                    clientW: clientW,
                    excess: Math.round(rect.right - clientW)
                  });
                }
              }
            }

            // Headline clipping audit
            const headlines = document.querySelectorAll('h1, h2, h3');
            const headlineIssues = [];
            for (const h of headlines) {
              const rect = h.getBoundingClientRect();
              if (rect.width === 0 || rect.height === 0) continue;
              // Check if font size causes text to overflow horizontal bounds
              if (h.scrollWidth > h.clientWidth + 2) {
                headlineIssues.push({
                  tag: h.tagName.toLowerCase(),
                  text: h.textContent.trim().slice(0, 40),
                  scrollW: h.scrollWidth,
                  clientW: h.clientWidth
                });
              }
            }

            // SVG audit
            const svgs = document.querySelectorAll('svg');
            const svgIssues = [];
            for (const svg of svgs) {
              const rect = svg.getBoundingClientRect();
              const hasViewBox = svg.hasAttribute('viewBox');
              const widthAttr = svg.getAttribute('width');
              const isUnconstrained = !hasViewBox && (!widthAttr || parseFloat(widthAttr) > clientW);
              const rectW = Math.round(rect.width);
              if (isUnconstrained || rectW > clientW + 2) {
                svgIssues.push({
                  className: (svg.className || '').toString().slice(0, 40),
                  hasViewBox,
                  widthAttr,
                  renderedWidth: rectW,
                  clientW: clientW
                });
              }
            }

            return {
              scrollW,
              clientW,
              hasHorizontalScroll,
              overflowDiff,
              overflowingElements: overflowingElements.slice(0, 5),
              headlineIssues,
              svgIssues
            };
          })()`,
          returnByValue: true
        });

        const data = domEval.result.value;

        if (!data.hasHorizontalScroll && data.overflowingElements.length === 0) {
          results.passedChecks++;
          console.log(`  [PASS] ${vp.name.padEnd(30)}: clientW=${data.clientW}px, scrollW=${data.scrollW}px (Overflow: 0px)`);
        } else {
          results.failedChecks++;
          const finding = {
            route,
            viewport: vp.name,
            scrollW: data.scrollW,
            clientW: data.clientW,
            overflowDiff: data.overflowDiff,
            elements: data.overflowingElements
          };
          results.overflowFindings.push(finding);
          console.error(`  [FAIL] ${vp.name.padEnd(30)}: OVERFLOW ${data.overflowDiff}px (scrollW: ${data.scrollW} vs clientW: ${data.clientW})`);
          if (data.overflowingElements.length > 0) {
            console.error('         Offending elements:', JSON.stringify(data.overflowingElements));
          }
        }

        if (data.headlineIssues.length > 0) {
          results.headlineClippingFindings.push({
            route,
            viewport: vp.name,
            issues: data.headlineIssues
          });
          console.warn(`  [WARN] Headline clipping issues @ ${vp.name}:`, data.headlineIssues);
        }

        if (data.svgIssues.length > 0) {
          results.svgFindings.push({
            route,
            viewport: vp.name,
            issues: data.svgIssues
          });
          console.warn(`  [WARN] SVG viewBox issues @ ${vp.name}:`, data.svgIssues);
        }
      }
    }

    // Specialized Stress Test: Card micro-interaction border-box resizing & layout shift on Home
    console.log('\n--- Auditing Card Micro-Interactions (`card-border-draw`, `CornerDotMatrix`) ---');
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
    await new Promise(res => setTimeout(res, 1000));

    const cardHoverEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('.card-border-draw');
        const cardResults = [];
        for (const card of cards) {
          const beforeRect = card.getBoundingClientRect();
          const beforeBox = {
            width: card.offsetWidth,
            height: card.offsetHeight,
            rectW: beforeRect.width,
            rectH: beforeRect.height
          };

          // Simulate hover by dispatching mouseenter
          card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          card.classList.add('hover-simulated');

          const afterRect = card.getBoundingClientRect();
          const afterBox = {
            width: card.offsetWidth,
            height: card.offsetHeight,
            rectW: afterRect.width,
            rectH: afterRect.height
          };

          // Check pseudo-element ::after
          const afterStyle = window.getComputedStyle(card, '::after');
          const isAbsolute = afterStyle.position === 'absolute';
          const height = afterStyle.height;

          // Check if CornerDotMatrix is inside
          const dotMatrix = card.querySelector('svg circle[class*="motion-dot-wave"]');
          const hasDotMatrix = !!dotMatrix;

          // Check for headline overlap inside card
          const headline = card.querySelector('h3, h4');
          let textOverlap = false;
          if (headline && dotMatrix) {
            const hRect = headline.getBoundingClientRect();
            const dRect = dotMatrix.ownerSVGElement.getBoundingClientRect();
            textOverlap = !(hRect.right < dRect.left || 
                            hRect.left > dRect.right || 
                            hRect.bottom < dRect.top || 
                            hRect.top > dRect.bottom);
          }

          cardResults.push({
            className: (card.className || '').slice(0, 50),
            deltaWidth: afterBox.width - beforeBox.width,
            deltaHeight: afterBox.height - beforeBox.height,
            isAbsoluteOverlay: isAbsolute,
            afterHeight: height,
            hasDotMatrix,
            textOverlap
          });
        }
        return cardResults;
      })()`,
      returnByValue: true
    });

    const cardFindings = cardHoverEval.result.value;
    let cardResizingBugs = 0;
    let textOverlapBugs = 0;

    console.log(`Inspected ${cardFindings.length} .card-border-draw components:`);
    for (const cf of cardFindings) {
      if (cf.deltaWidth !== 0 || cf.deltaHeight !== 0) {
        cardResizingBugs++;
        console.error(`  [FAIL] Card resized on hover: deltaW=${cf.deltaWidth}, deltaH=${cf.deltaHeight}`);
      }
      if (cf.textOverlap) {
        textOverlapBugs++;
        console.error(`  [FAIL] Text overlaps with CornerDotMatrix inside card: ${cf.className}`);
      }
    }

    if (cardResizingBugs === 0 && textOverlapBugs === 0) {
      console.log('  [PASS] All card hover micro-interactions maintain strict box dimensions (0px shift) and 0 text collisions.');
    } else {
      results.cardShiftFindings.push({ cardResizingBugs, textOverlapBugs });
    }

    // Specialized Stress Test: SectionBoundaryDots alignment and horizontal bounds
    console.log('\n--- Auditing `SectionBoundaryDots` Alignment & Scrollbar Prevention ---');
    const dotsEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const dotDividers = document.querySelectorAll('.SectionBoundaryDots, [class*="SectionBoundaryDots"], div > div > svg circle[class*="motion-dot-wave"]');
        const containers = [];
        // Find SectionBoundaryDots wrappers
        const wrappers = Array.from(document.querySelectorAll('div')).filter(el => {
          return el.className && el.className.includes('SectionBoundaryDots') || 
                 (el.querySelector('svg circle[class*="motion-dot-wave"]') && el.className && el.className.includes('items-center') && el.className.includes('justify-center') && el.querySelector('.motion-line-draw-horizontal'));
        });

        for (const w of wrappers) {
          const rect = w.getBoundingClientRect();
          const docW = document.documentElement.clientWidth;
          const overflows = rect.right > docW + 1 || rect.left < -1;
          const svg = w.querySelector('svg');
          const svgRect = svg ? svg.getBoundingClientRect() : null;
          const isCentered = svgRect ? Math.abs((rect.left + rect.width / 2) - (svgRect.left + svgRect.width / 2)) < 3 : true;

          containers.push({
            className: (w.className || '').slice(0, 60),
            rectW: Math.round(rect.width),
            docW: docW,
            overflows,
            isCentered
          });
        }
        return containers;
      })()`,
      returnByValue: true
    });

    const dotResults = dotsEval.result.value;
    console.log(`Inspected ${dotResults.length} SectionBoundaryDots instances:`);
    let dotBugs = 0;
    for (const dr of dotResults) {
      if (dr.overflows) {
        dotBugs++;
        console.error(`  [FAIL] SectionBoundaryDots overflowed viewport: rectW=${dr.rectW} vs docW=${dr.docW}`);
      }
      if (!dr.isCentered) {
        dotBugs++;
        console.error(`  [FAIL] SectionBoundaryDots SVG not centered within wrapper: ${dr.className}`);
      }
    }
    if (dotBugs === 0) {
      console.log('  [PASS] All SectionBoundaryDots dividers strictly align with container grids and generate 0 scrollbars.');
    } else {
      results.dotAlignmentFindings.push(dotResults);
    }

    console.log('\n================================================================');
    console.log(`STRESS TEST SUMMARY:`);
    console.log(`Total Route-Viewport Permutations: ${results.totalChecks}`);
    console.log(`Passed: ${results.passedChecks}`);
    console.log(`Failed: ${results.failedChecks}`);
    console.log(`Horizontal Overflows: ${results.overflowFindings.length}`);
    console.log(`SVG Issues: ${results.svgFindings.length}`);
    console.log(`Headline Clipping Issues: ${results.headlineClippingFindings.length}`);
    console.log(`Card Resizing/Shift Issues: ${cardResizingBugs}`);
    console.log(`Dot Divider Alignment Issues: ${dotBugs}`);
    console.log('================================================================');

    ws.close();
    edgeProc.kill();

    return results;

  } catch (err) {
    console.error('Error during stress harness execution:', err);
    edgeProc.kill();
    throw err;
  }
}

runChallenger2StressTest().then(res => {
  if (res.failedChecks > 0 || res.overflowFindings.length > 0 || res.svgFindings.length > 0 || res.cardShiftFindings.length > 0) {
    console.log('\nStress harness finished with findings.');
    process.exit(1);
  } else {
    console.log('\nStress harness finished: ALL 100% PASSED.');
    process.exit(0);
  }
}).catch(e => {
  console.error(e);
  process.exit(1);
});
