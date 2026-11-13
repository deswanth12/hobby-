import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

async function auditPerformance() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), `edge-perf-${Date.now()}`);
  const CDP_PORT = 9244;

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
      if (target && target.webSocketDebuggerUrl) {
        ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        break;
      }
    } catch (_) {}
  }

  if (!ws) {
    try { edgeProc.kill(); } catch (_) {}
    throw new Error('Could not connect to Edge on port ' + CDP_PORT);
  }

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

  await send('Page.enable');
  await send('Performance.enable');

  // Audit Desktop
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 3000));

  // Extract Web Vitals & Performance metrics
  const perfData = await send('Runtime.evaluate', {
    expression: `(async () => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const paints = performance.getEntriesByType('paint') || [];
      const fcp = paints.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
      const fp = paints.find(p => p.name === 'first-paint')?.startTime || 0;

      // Estimate LCP from PerformanceObserver entries or largest image/text
      let lcp = 0;
      let lcpElement = '';
      try {
        const po = performance.getEntriesByType('largest-contentful-paint');
        if (po && po.length > 0) {
          lcp = po[po.length - 1].startTime;
          lcpElement = po[po.length - 1].element ? po[po.length - 1].element.tagName : '';
        }
      } catch (_) {}

      // Measure CLS
      let cls = 0;
      try {
        const layoutShifts = performance.getEntriesByType('layout-shift');
        for (const s of layoutShifts) {
          if (!s.hadRecentInput) cls += s.value;
        }
      } catch (_) {}

      // Measure Long Tasks
      let longTasksCount = 0;
      let totalLongTaskDuration = 0;
      try {
        const longTasks = performance.getEntriesByType('longtask');
        longTasksCount = longTasks.length;
        for (const t of longTasks) totalLongTaskDuration += t.duration;
      } catch (_) {}

      // Measure real scroll FPS over 1 second of scrolling
      let frameCount = 0;
      let lastTime = performance.now();
      const startTime = performance.now();
      let totalJankFrames = 0;

      // Scroll loop
      window.scrollTo({ top: 1200, behavior: 'smooth' });
      await new Promise(r => {
        function checkFrame(now) {
          frameCount++;
          const delta = now - lastTime;
          if (delta > 25) totalJankFrames++; // Frame took > 25ms (< 40fps)
          lastTime = now;
          if (now - startTime < 1000) {
            requestAnimationFrame(checkFrame);
          } else {
            r();
          }
        }
        requestAnimationFrame(checkFrame);
      });

      const actualDuration = (performance.now() - startTime) / 1000;
      const measuredFps = frameCount / actualDuration;

      return {
        ttfb: nav.responseStart - nav.requestStart,
        domInteractive: nav.domInteractive,
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
        loadComplete: nav.loadEventEnd - nav.startTime,
        firstPaint: fp,
        firstContentfulPaint: fcp,
        lcp: lcp || fcp,
        lcpElement,
        cls,
        longTasksCount,
        totalLongTaskDuration,
        measuredFps,
        totalJankFrames,
        frameCount
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  const desktopPerf = perfData.result?.value;
  console.log('\n--- DESKTOP PERFORMANCE (1440px) ---');
  console.log(`  TTFB: ${desktopPerf.ttfb.toFixed(1)} ms`);
  console.log(`  First Contentful Paint (FCP): ${desktopPerf.firstContentfulPaint.toFixed(1)} ms`);
  console.log(`  Largest Contentful Paint (LCP): ${desktopPerf.lcp.toFixed(1)} ms`);
  console.log(`  Cumulative Layout Shift (CLS): ${desktopPerf.cls.toFixed(4)}`);
  console.log(`  Long Tasks: ${desktopPerf.longTasksCount} (Total blocking time: ${desktopPerf.totalLongTaskDuration.toFixed(1)} ms)`);
  console.log(`  Measured Scroll FPS: ${desktopPerf.measuredFps.toFixed(1)} FPS (${desktopPerf.frameCount} frames, ${desktopPerf.totalJankFrames} jank frames > 25ms)`);

  // Audit Mobile 390px
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 2500));

  const mobilePerfData = await send('Runtime.evaluate', {
    expression: `(async () => {
      const paints = performance.getEntriesByType('paint') || [];
      const fcp = paints.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
      let cls = 0;
      try {
        const layoutShifts = performance.getEntriesByType('layout-shift');
        for (const s of layoutShifts) {
          if (!s.hadRecentInput) cls += s.value;
        }
      } catch (_) {}

      let frameCount = 0;
      let lastTime = performance.now();
      const startTime = performance.now();
      let totalJankFrames = 0;

      window.scrollTo({ top: 800, behavior: 'smooth' });
      await new Promise(r => {
        function checkFrame(now) {
          frameCount++;
          const delta = now - lastTime;
          if (delta > 25) totalJankFrames++;
          lastTime = now;
          if (now - startTime < 1000) {
            requestAnimationFrame(checkFrame);
          } else {
            r();
          }
        }
        requestAnimationFrame(checkFrame);
      });
      const measuredFps = frameCount / ((performance.now() - startTime) / 1000);
      return { fcp, cls, measuredFps, totalJankFrames, frameCount };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  const mobilePerf = mobilePerfData.result?.value;
  console.log('\n--- MOBILE PERFORMANCE (390px) ---');
  console.log(`  First Contentful Paint (FCP): ${mobilePerf.fcp.toFixed(1)} ms`);
  console.log(`  Cumulative Layout Shift (CLS): ${mobilePerf.cls.toFixed(4)}`);
  console.log(`  Measured Scroll FPS: ${mobilePerf.measuredFps.toFixed(1)} FPS (${mobilePerf.frameCount} frames, ${mobilePerf.totalJankFrames} jank frames > 25ms)`);

  // Write results to reports/v61_performance_results.json
  const perfReport = { desktop: desktopPerf, mobile: mobilePerf };
  fs.writeFileSync('reports/v61_performance_results.json', JSON.stringify(perfReport, null, 2));

  try { ws.close(); } catch (_) {}
  try { edgeProc.kill(); } catch (_) {}
  try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  console.log('\nPerformance results saved to reports/v61_performance_results.json');
}

auditPerformance().catch(err => {
  console.error('Performance Audit Error:', err);
  process.exit(1);
});
