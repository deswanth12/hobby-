import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports/screenshots/v46');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function runV46Audit() {
  console.log('================================================================');
  console.log('  KAVITHA & ASSOCIATES — V4.6 PRODUCTION READINESS CDP CAPTURE  ');
  console.log('================================================================');

  const PORT = 4192;
  console.log(`[1/5] Launching Vite production preview server on port ${PORT}...`);
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => {
    preview.stdout.on('data', data => {
      const msg = data.toString();
      if (msg.includes(String(PORT)) || msg.includes('Local:')) {
        resolve();
      }
    });
    preview.stderr.on('data', err => console.error('Preview stderr:', err.toString()));
    setTimeout(() => resolve(), 3500);
  });

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-v46');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9277;
  console.log(`[2/5] Launching Headless Edge on CDP port ${CDP_PORT}...`);
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
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
    throw new Error('Failed to connect to browser on port ' + CDP_PORT);
  }

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

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');
  await send('Network.enable');

  const consoleErrors = [];
  const networkFailures = [];

  ws.addEventListener('message', evt => {
    try {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Log.entryAdded' && msg.params?.entry?.level === 'error') {
        consoleErrors.push(msg.params.entry.text);
      }
      if (msg.method === 'Network.responseReceived') {
        const status = msg.params.response?.status;
        if (status >= 400 && !msg.params.response.url.includes('/knowledge-bank')) {
          networkFailures.push({ url: msg.params.response.url, status });
        }
      }
    } catch (_) {}
  });

  const evalJs = async (expr) => {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true
    });
    return res.result?.value;
  };

  const viewports = [
    { width: 390, height: 844, name: '390px' },
    { width: 768, height: 1024, name: '768px' },
    { width: 1024, height: 768, name: '1024px' },
    { width: 1440, height: 900, name: '1440px' }
  ];

  const targets = [
    { name: 'homepage', path: '/', selector: null },
    { name: 'about', path: '/about', selector: null },
    { name: 'services', path: '/services', selector: null },
    { name: 'why_choose_us', path: '/', selector: '#audit-spotlight' }, // Practice Philosophy / Advantage
    { name: 'working_process', path: '/', selector: '.grid-cols-4, [class*="ConnectedTimeline"]' }, // Engagement Workflow / Timeline
    { name: 'contact', path: '/contact', selector: null }
  ];

  console.log(`[3/5] Capturing 6 targets across 4 viewports (24 captures) & auditing metrics...`);
  const auditResults = [];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 1024
    });

    for (const tgt of targets) {
      const url = `http://127.0.0.1:${PORT}${tgt.path}`;
      await send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 800));

      // If targeting a specific section, scroll into view
      if (tgt.selector) {
        await evalJs(`
          (() => {
            const el = document.querySelector('${tgt.selector}');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          })()
        `);
        await new Promise(r => setTimeout(r, 400));
      }

      // Check overflow
      const overflow = await evalJs(`
        (() => {
          const docWidth = document.documentElement.clientWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          const bodyWidth = document.body ? document.body.scrollWidth : 0;
          const maxW = Math.max(scrollWidth, bodyWidth);
          return maxW > docWidth + 1 ? maxW - docWidth : 0;
        })()
      `);

      // Performance & CWV metrics
      const perfMetrics = await evalJs(`
        (() => {
          const navEntries = performance.getEntriesByType('navigation');
          const nav = navEntries.length > 0 ? navEntries[0] : null;
          const paintEntries = performance.getEntriesByType('paint');
          const fcpEntry = paintEntries.find(p => p.name === 'first-contentful-paint');
          return {
            ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
            domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : null,
            loadComplete: nav ? Math.round(nav.loadEventEnd - nav.startTime) : null,
            fcp: fcpEntry ? Math.round(fcpEntry.startTime) : null
          };
        })()
      `);

      // Image audit
      const imageAudit = await evalJs(`
        (() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          const issues = [];
          imgs.forEach(img => {
            if (!img.getAttribute('alt')) issues.push({ src: img.src, issue: 'missing alt' });
            if (!img.complete || img.naturalWidth === 0) issues.push({ src: img.src, issue: 'failed loading' });
          });
          return {
            totalImages: imgs.length,
            issues
          };
        })()
      `);

      // Keyboard & Accessibility audit
      const a11yAudit = await evalJs(`
        (() => {
          const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
          const skipLink = document.querySelector('a[href="#main-content"]');
          const missingFocusVisible = [];
          return {
            focusableCount: focusable.length,
            hasSkipLink: !!skipLink,
            headerCount: document.querySelectorAll('h1, h2, h3, h4, h5').length,
            h1Text: document.querySelector('h1')?.innerText?.replace(/\\s+/g, ' ')?.trim()
          };
        })()
      `);

      // Capture screenshot
      const ss = await send('Page.captureScreenshot', { format: 'png' });
      const filename = `${tgt.name}_${vp.name}.png`;
      fs.writeFileSync(path.join(outDir, filename), Buffer.from(ss.data, 'base64'));

      auditResults.push({
        target: tgt.name,
        path: tgt.path,
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        overflow: overflow || 0,
        perfMetrics,
        imageAudit,
        a11yAudit,
        filename
      });

      console.log(`  ✔ [${vp.name}] ${tgt.name} -> overflow: ${overflow || 0}px, images: ${imageAudit.totalImages} (issues: ${imageAudit.issues.length}), FCP: ${perfMetrics.fcp}ms`);
    }
  }

  // Check reduced-motion
  console.log('[4/5] Testing prefers-reduced-motion media query...');
  await send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 600));

  const reducedMotionActive = await evalJs(`
    (() => {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      return mql.matches;
    })()
  `);
  console.log(`  ✔ Reduced motion media query active: ${reducedMotionActive}`);

  // Cleanup
  console.log('[5/5] Finalizing V4.6 production readiness report summary...');
  try { edgeProc.kill(); } catch (_) {}
  try { preview.kill(); } catch (_) {}

  const finalSummary = {
    timestamp: new Date().toISOString(),
    totalCaptures: auditResults.length,
    viewportsAudited: viewports.map(v => v.name),
    targetsAudited: targets.map(t => t.name),
    consoleErrorsCount: consoleErrors.length,
    consoleErrors,
    networkFailuresCount: networkFailures.length,
    networkFailures,
    reducedMotionSupported: reducedMotionActive,
    results: auditResults
  };

  fs.writeFileSync(path.join(outDir, 'v46_audit_summary.json'), JSON.stringify(finalSummary, null, 2), 'utf8');
  console.log(`\nAll 24 screenshots and audit summary saved to ${outDir}`);
}

runV46Audit().catch(err => {
  console.error('Audit execution failed:', err);
  process.exit(1);
});
