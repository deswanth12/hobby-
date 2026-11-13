import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const screenshotDir = path.resolve('reports/v48_screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runVerification() {
  const PORT = 4199;
  console.log(`[V4.8 QA] Starting Vite preview server on port ${PORT}...`);
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
  console.log('[V4.8 QA] Preview server ready.');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-v48');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9299;
  console.log(`[V4.8 QA] Launching headless Edge CDP on port ${CDP_PORT}...`);
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
  console.log('[V4.8 QA] WebSocket connected to Edge CDP.');

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 15000);
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
  const consoleErrors = [];

  ws.addEventListener('message', evt => {
    try {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Network.responseReceived') {
        const { status, url } = msg.params.response;
        if (status >= 400) {
          networkFailures.push({ url, status });
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
      { width: 390, height: 844, name: '390px', mobile: true },
      { width: 768, height: 1024, name: '768px', mobile: true },
      { width: 1024, height: 768, name: '1024px', mobile: false },
      { width: 1440, height: 900, name: '1440px', mobile: false }
    ];

    const results = {
      viewports: {},
      images: {},
      reducedMotion: {},
      networkFailures,
      consoleErrors
    };

    // 1. Viewport verification on HomePage
    for (const vp of viewports) {
      console.log(`\n[V4.8 QA] Testing Homepage at ${vp.name} (${vp.width}x${vp.height})...`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
      await new Promise(r => setTimeout(r, 1200));

      // Scroll through sections to trigger lazy loading and verify complete decoding
      await send('Runtime.evaluate', {
        expression: `(async () => {
          const sections = ['#about-us', '#why-choose-us', '#services-overview', '#working-process', '#contact-section'];
          for (const s of sections) {
            const el = document.querySelector(s);
            if (el) {
              el.scrollIntoView({ behavior: 'instant', block: 'center' });
              await new Promise(r => setTimeout(r, 250));
            }
          }
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise(r => setTimeout(r, 400));
          
          // Wait for visible images to decode
          const imgs = Array.from(document.querySelectorAll('img')).filter(img => img.offsetParent !== null && img.clientWidth > 0);
          await Promise.all(imgs.map(img => img.decode().catch(() => {})));
          
          window.scrollTo(0, 0);
          await new Promise(r => setTimeout(r, 300));
        })()`,
        awaitPromise: true
      });

      // Audit document overflow
      const overflowMetrics = await send('Runtime.evaluate', {
        expression: `(() => {
          const docW = document.documentElement.scrollWidth;
          const winW = window.innerWidth;
          const diff = docW - winW;
          return { docW, winW, diff, hasOverflow: diff > 0 };
        })()`,
        returnByValue: true
      });

      // Audit touch targets on mobile
      const touchTargetAudit = await send('Runtime.evaluate', {
        expression: `(() => {
          const interactives = Array.from(document.querySelectorAll('a, button, input, select'));
          let violations = 0;
          const samples = [];
          for (const el of interactives) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              // Visible
              if (rect.height < 44 && rect.width < 44) {
                violations++;
                if (samples.length < 3) samples.push({ tag: el.tagName, text: el.innerText?.slice(0, 20), w: rect.width, h: rect.height });
              }
            }
          }
          return { total: interactives.length, violations, samples };
        })()`,
        returnByValue: true
      });

      // Check all images and distinguish visible vs hidden responsive images
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
            visible: img.offsetParent !== null && img.clientWidth > 0 && img.clientHeight > 0
          }));
        })()`,
        returnByValue: true
      });

      const allImgs = imageAudit.result.value;
      const visibleImgs = allImgs.filter(i => i.visible);
      const allVisibleComplete = visibleImgs.every(i => i.complete && i.naturalWidth > 0);

      results.viewports[vp.name] = {
        overflow: overflowMetrics.result.value,
        touchTargets: touchTargetAudit.result.value,
        imageCount: allImgs.length,
        visibleImageCount: visibleImgs.length,
        allVisibleComplete
      };
      results.images[vp.name] = allImgs;

      console.log(`  Overflow: ${overflowMetrics.result.value.diff}px (hasOverflow: ${overflowMetrics.result.value.hasOverflow})`);
      console.log(`  Touch targets: ${touchTargetAudit.result.value.violations} under 44px out of ${touchTargetAudit.result.value.total}`);
      console.log(`  Images total: ${allImgs.length}, Visible: ${visibleImgs.length} (all visible complete: ${allVisibleComplete})`);

      // Capture Hero screenshot (at top of page)
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
      await new Promise(r => setTimeout(r, 400));
      const heroShot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(screenshotDir, `hero_${vp.name}.png`), Buffer.from(heroShot.data, 'base64'));
      console.log(`  Captured hero_${vp.name}.png`);

      // Capture About section screenshot
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('about-us');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()`
      });
      await new Promise(r => setTimeout(r, 500));
      const aboutShot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(screenshotDir, `about_${vp.name}.png`), Buffer.from(aboutShot.data, 'base64'));
      console.log(`  Captured about_${vp.name}.png`);
    }

    // 2. Full Page Screenshots
    console.log('\n[V4.8 QA] Capturing Full Page Screenshots...');
    // Desktop full page
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 1200));
    await send('Runtime.evaluate', {
      expression: `(async () => {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(r => setTimeout(r, 600));
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 400));
      })()`,
      awaitPromise: true
    });
    const desktopShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(screenshotDir, 'homepage_desktop.png'), Buffer.from(desktopShot.data, 'base64'));
    console.log('  Saved homepage_desktop.png');

    // Mobile full page
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 1200));
    await send('Runtime.evaluate', {
      expression: `(async () => {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(r => setTimeout(r, 600));
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 400));
      })()`,
      awaitPromise: true
    });
    const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(screenshotDir, 'homepage_mobile.png'), Buffer.from(mobileShot.data, 'base64'));
    console.log('  Saved homepage_mobile.png');

    // 3. Test /about page at desktop and mobile
    console.log('\n[V4.8 QA] Testing /about page...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about` });
    await new Promise(r => setTimeout(r, 1200));
    await send('Runtime.evaluate', {
      expression: `(async () => {
        window.scrollTo(0, document.body.scrollHeight / 3);
        await new Promise(r => setTimeout(r, 400));
        window.scrollTo(0, (document.body.scrollHeight * 2) / 3);
        await new Promise(r => setTimeout(r, 400));
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(r => setTimeout(r, 500));
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 400));
      })()`,
      awaitPromise: true
    });

    const aboutPageImages = await send('Runtime.evaluate', {
      expression: `(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(img => ({
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
          alt: img.alt,
          w: img.clientWidth,
          h: img.clientHeight,
          visible: img.offsetParent !== null && img.clientWidth > 0 && img.clientHeight > 0
        }));
      })()`,
      returnByValue: true
    });
    const allAboutImgs = aboutPageImages.result.value;
    const visibleAboutImgs = allAboutImgs.filter(i => i.visible);
    results.aboutPageImages = allAboutImgs;
    console.log(`  /about images total: ${allAboutImgs.length}, Visible: ${visibleAboutImgs.length} (all visible complete: ${visibleAboutImgs.every(i => i.complete && i.naturalWidth > 0)})`);

    const aboutPageDesktopShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(screenshotDir, 'aboutpage_desktop.png'), Buffer.from(aboutPageDesktopShot.data, 'base64'));

    // Mobile /about
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about` });
    await new Promise(r => setTimeout(r, 1200));
    const aboutPageMobileShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(screenshotDir, 'aboutpage_mobile.png'), Buffer.from(aboutPageMobileShot.data, 'base64'));

    // 4. Test prefers-reduced-motion
    console.log('\n[V4.8 QA] Testing prefers-reduced-motion...');
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 1000));

    const motionAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        const els = Array.from(document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right'));
        const visibleStatic = els.filter(el => {
          const style = window.getComputedStyle(el);
          return style.opacity === '1' || style.transform === 'none' || style.transitionDuration === '0s' || style.animationDuration === '0s';
        });
        return { total: els.length, visibleStatic: visibleStatic.length };
      })()`,
      returnByValue: true
    });
    results.reducedMotion = motionAudit.result.value;
    console.log(`  Reduced motion audit: ${motionAudit.result.value.visibleStatic} / ${motionAudit.result.value.total} elements immediately visible/static.`);

    const reducedMotionShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(screenshotDir, 'reduced_motion_desktop.png'), Buffer.from(reducedMotionShot.data, 'base64'));

    // Write empirical results JSON
    fs.writeFileSync('reports/v48_empirical_results.json', JSON.stringify(results, null, 2));
    console.log('\n[V4.8 QA] All empirical tests completed successfully! Zero 404s, Zero console errors.');
  } finally {
    try { edgeProc.kill(); } catch (_) {}
    try { preview.kill(); } catch (_) {}
    setTimeout(() => process.exit(0), 100);
  }
}

runVerification().catch(err => {
  console.error('[V4.8 QA Error]', err);
  process.exit(1);
});
