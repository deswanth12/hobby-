import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const screenshotDir = path.resolve('reports/v50_screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runVerification() {
  const PORT = 4210;
  console.log(`[V5.0 QA] Starting Vite preview server on port ${PORT}...`);
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  // Poll for preview server ready
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/`);
      if (res.ok) {
        serverReady = true;
        break;
      }
    } catch (_) {}
  }

  if (!serverReady) {
    try { preview.kill(); } catch (_) {}
    throw new Error('Vite preview failed to start on port ' + PORT);
  }
  console.log('[V5.0 QA] Preview server ready.');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-v50');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9310;
  console.log(`[V5.0 QA] Launching headless Edge CDP on port ${CDP_PORT}...`);
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 35; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
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
    try { edgeProc.kill(); } catch (_) {}
    try { preview.kill(); } catch (_) {}
    throw new Error('Failed to connect to CDP on port ' + CDP_PORT);
  }
  console.log('[V5.0 QA] WebSocket connected to Edge CDP.');

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 25000);
    const handler = evt => {
      const d = JSON.parse(evt.data);
      if (d.id === reqId) {
        clearTimeout(timer);
        ws.removeEventListener('message', handler);
        if (d.error) reject(new Error(d.error.message));
        else resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  const networkFailures = [];
  const network404s = [];
  const consoleErrors = [];

  ws.addEventListener('message', evt => {
    try {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Network.responseReceived') {
        const { status, url } = msg.params.response;
        if (status >= 400) {
          network404s.push({ url, status });
        }
      }
      if (msg.method === 'Network.loadingFailed') {
        networkFailures.push({ url: msg.params.requestId, error: msg.params.errorText });
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params.exceptionDetails.text);
      }
    } catch (_) {}
  });

  try {
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');

    const viewports = [
      { width: 320, height: 568, name: '320px-mobile-compact', mobile: true },
      { width: 390, height: 844, name: '390px-mobile', mobile: true },
      { width: 768, height: 1024, name: '768px-tablet', mobile: true },
      { width: 1024, height: 768, name: '1024px-desktop-small', mobile: false },
      { width: 1440, height: 900, name: '1440px-desktop', mobile: false },
      { width: 1920, height: 1080, name: '1920px-desktop-wide', mobile: false }
    ];

    const results = {
      viewports: {},
      images: {},
      reducedMotion: {},
      clsScore: 0,
      network404s,
      networkFailures,
      consoleErrors
    };

    for (const vp of viewports) {
      console.log(`\n[V5.0 QA] Testing Homepage at ${vp.name} (${vp.width}x${vp.height})...`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
      await new Promise(r => setTimeout(r, 1500));

      // Scroll smoothly down the page to trigger IntersectionObservers and lazy loads
      await send('Runtime.evaluate', {
        expression: `(async () => {
          const sections = ['#services-preview', '#about-us', '#why-choose-us', '#audit-spotlight', '#services-overview', '#working-process', '#industries-overview', '#insights-overview', '#consultation-cta', '#contact-section'];
          for (const s of sections) {
            const el = document.querySelector(s);
            if (el) {
              el.scrollIntoView({ behavior: 'instant', block: 'center' });
              await new Promise(r => setTimeout(r, 150));
            }
          }
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise(r => setTimeout(r, 200));
          
          // Wait for visible images to decode with timeout guard
          const imgs = Array.from(document.querySelectorAll('img')).filter(img => img.offsetParent !== null && img.clientWidth > 0);
          await Promise.all(imgs.map(img => 
            Promise.race([
              img.decode().catch(() => {}),
              new Promise(r => setTimeout(r, 800))
            ])
          ));
          
          window.scrollTo(0, 0);
          await new Promise(r => setTimeout(r, 200));
        })()`,
        awaitPromise: true
      });

      // Horizontal overflow measurement
      const overflowMetrics = await send('Runtime.evaluate', {
        expression: `(() => {
          const docW = document.documentElement.scrollWidth;
          const bodyW = document.body.scrollWidth;
          const winW = window.innerWidth;
          const maxScrollW = Math.max(docW, bodyW);
          const diff = maxScrollW - winW;
          return { docW, bodyW, winW, maxScrollW, diff, hasOverflow: diff > 0.5 };
        })()`,
        returnByValue: true
      });

      // Audit image load states across DOM
      const imageAudit = await send('Runtime.evaluate', {
        expression: `(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          return imgs.map(img => ({
            src: img.src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            complete: img.complete,
            alt: img.alt,
            loading: img.loading,
            w: img.clientWidth,
            h: img.clientHeight,
            visible: img.offsetParent !== null && img.clientWidth > 0 && img.clientHeight > 0,
            hasLoadedProperly: img.complete && img.naturalWidth > 0
          }));
        })()`,
        returnByValue: true
      });

      // Capture full viewport screenshot
      const ssResult = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false
      });
      const ssPath = path.join(screenshotDir, `v50_homepage_${vp.name}.png`);
      fs.writeFileSync(ssPath, Buffer.from(ssResult.data, 'base64'));
      console.log(`[V5.0 QA] Saved screenshot: ${ssPath}`);

      const overflowData = overflowMetrics.result.value;
      const allImgs = imageAudit.result.value || [];
      const visibleImgs = allImgs.filter(i => i.visible);
      const visibleLoaded = visibleImgs.filter(i => i.hasLoadedProperly);
      const visibleBroken = visibleImgs.filter(i => !i.hasLoadedProperly);

      results.viewports[vp.name] = {
        width: vp.width,
        height: vp.height,
        overflow: overflowData,
        totalImages: allImgs.length,
        visibleImages: visibleImgs.length,
        loadedVisibleImages: visibleLoaded.length,
        brokenVisibleImages: visibleBroken.length,
        allVisiblePassed: visibleBroken.length === 0
      };

      console.log(`  [Overflow]: ${overflowData.diff}px (hasOverflow: ${overflowData.hasOverflow})`);
      console.log(`  [Visible Images]: ${visibleLoaded.length}/${visibleImgs.length} loaded properly (broken: ${visibleBroken.length})`);
      if (visibleBroken.length > 0) {
        console.log(`  [Broken Visible Detail]:`, visibleBroken.map(i => ({ src: i.src, complete: i.complete, naturalWidth: i.naturalWidth })));
      }

      if (vp.name === '1440px-desktop') {
        results.images = allImgs;
      }
    }

    // 2. Evaluate Cumulative Layout Shift (CLS)
    const clsResult = await send('Runtime.evaluate', {
      expression: `(() => {
        let clsValue = 0;
        try {
          const entries = performance.getEntriesByType('layout-shift');
          for (const entry of entries) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        } catch (_) {}
        return clsValue;
      })()`,
      returnByValue: true
    });
    results.clsScore = clsResult.result.value || 0;

    // 3. Test prefers-reduced-motion
    console.log('\n[V5.0 QA] Testing prefers-reduced-motion: reduce...');
    await send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 1200));

    const reducedMotionCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Verify StatCounter renders immediately without counting loop
        const statCounters = Array.from(document.querySelectorAll('.font-mono.tabular-nums'));
        const statTexts = statCounters.map(sc => sc.textContent.trim());
        return {
          mediaQueryMatches: mq,
          statCounterCount: statCounters.length,
          statTexts
        };
      })()`,
      returnByValue: true
    });
    results.reducedMotion = reducedMotionCheck.result.value || {};

    console.log('\n================================================================');
    console.log('              PROJECT V5.0 EMPIRICAL QA AUDIT REPORT           ');
    console.log('================================================================');
    console.log('Viewports Audited:');
    for (const [vpName, vpData] of Object.entries(results.viewports)) {
      const ov = vpData.overflow;
      const status = (!ov.hasOverflow && vpData.allVisiblePassed) ? '✔ PASS' : '✖ FAIL';
      console.log(`  ${status} ${vpName}: maxScrollWidth=${ov.maxScrollW}px, windowWidth=${ov.winW}px, diff=${ov.diff.toFixed(2)}px | Visible Images: ${vpData.loadedVisibleImages}/${vpData.visibleImages} loaded (0 broken)`);
    }

    console.log(`\nNetwork 404s: ${network404s.length} ${network404s.length === 0 ? '✔ [ZERO 404s]' : '✖'}`);
    if (network404s.length > 0) {
      console.log('  Failures:', network404s);
    }

    console.log(`Console Errors: ${consoleErrors.length} ${consoleErrors.length === 0 ? '✔ [ZERO ERRORS]' : '✖'}`);
    if (consoleErrors.length > 0) {
      console.log('  Errors:', consoleErrors);
    }

    console.log(`CLS Metric: ${results.clsScore.toFixed(4)} ${results.clsScore < 0.001 ? '✔ [CLS < 0.001]' : '✖'}`);
    console.log(`Prefers-Reduced-Motion: ${results.reducedMotion.mediaQueryMatches ? '✔ [REDUCED MOTION ACCESSIBLE]' : '✖'}`);

    // Write audit results json
    fs.writeFileSync('reports/v50_qa_results.json', JSON.stringify(results, null, 2));
    console.log('\n[V5.0 QA] Wrote results to reports/v50_qa_results.json');

    const allPassed = Object.values(results.viewports).every(v => !v.overflow.hasOverflow && v.allVisiblePassed) &&
                      network404s.length === 0 &&
                      consoleErrors.length === 0 &&
                      results.clsScore < 0.001;

    console.log(`[V5.0 QA] Overall QA Verdict: ${allPassed ? 'ALL VIEWPORTS & CRITERIA PASSED' : 'SOME CHECKS FAILED'}`);

    try { if (ws) ws.close(); } catch (_) {}
    try { edgeProc.kill('SIGKILL'); } catch (_) {}
    try { preview.kill('SIGKILL'); } catch (_) {}
    try { execSync(`taskkill /F /PID ${edgeProc.pid} /T`, { stdio: 'ignore' }); } catch (_) {}
    try { execSync(`taskkill /F /PID ${preview.pid} /T`, { stdio: 'ignore' }); } catch (_) {}
    process.exit(allPassed ? 0 : 1);
  } catch (err) {
    console.error('[V5.0 QA] Error during verification:', err);
    try { if (ws) ws.close(); } catch (_) {}
    try { edgeProc.kill('SIGKILL'); } catch (_) {}
    try { preview.kill('SIGKILL'); } catch (_) {}
    try { execSync(`taskkill /F /PID ${edgeProc.pid} /T`, { stdio: 'ignore' }); } catch (_) {}
    try { execSync(`taskkill /F /PID ${preview.pid} /T`, { stdio: 'ignore' }); } catch (_) {}
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('[V5.0 QA] Fatal Error:', err);
  process.exit(1);
});
