import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function runAudit() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-10-breakpoints');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9245;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 250));
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
    try { edgeProc.kill(); } catch (_) {}
    throw new Error('Could not connect to Edge DevTools');
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

  const consoleErrors = [];
  ws.addEventListener('message', evt => {
    const d = JSON.parse(evt.data);
    if (d.method === 'Runtime.consoleAPICalled' && d.params?.type === 'error') {
      const text = d.params.args.map(a => a.value || a.description || '').join(' ');
      consoleErrors.push(text);
    }
  });

  const breakpoints = [
    { width: 320, height: 568, device: 'Small Mobile (320px)' },
    { width: 360, height: 640, device: 'Android Standard (360px)' },
    { width: 375, height: 667, device: 'iPhone SE/8 (375px)' },
    { width: 390, height: 844, device: 'iPhone 12/13/14 (390px)' },
    { width: 414, height: 896, device: 'iPhone Plus/Max (414px)' },
    { width: 768, height: 1024, device: 'Tablet Portrait (768px)' },
    { width: 1024, height: 768, device: 'Tablet Landscape (1024px)' },
    { width: 1280, height: 800, device: 'Small Laptop (1280px)' },
    { width: 1440, height: 900, device: 'Desktop Standard (1440px)' },
    { width: 1920, height: 1080, device: 'Full HD Monitor (1920px)' }
  ];

  const routes = [
    { path: '/', name: 'Homepage' },
    { path: '/about', name: 'About Chambers' },
    { path: '/services', name: 'Services Directory' },
    { path: '/industries', name: 'Industries We Serve' },
    { path: '/locations', name: 'Locations & Jurisdiction' },
    { path: '/blog', name: 'Articles & Tax Insights' },
    { path: '/contact', name: 'Contact & Consultation' }
  ];

  const results = [];

  for (const bp of breakpoints) {
    console.log(`\nTesting Breakpoint: ${bp.device} [${bp.width}x${bp.height}]`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: bp.width,
      height: bp.height,
      deviceScaleFactor: 1,
      mobile: bp.width < 1024
    });

    for (const r of routes) {
      await send('Page.navigate', { url: `http://127.0.0.1:5173${r.path}` });
      await new Promise(res => setTimeout(res, 800));

      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const docWidth = document.documentElement.clientWidth;
            const scrollWidth = document.documentElement.scrollWidth;
            const bodyScrollWidth = document.body ? document.body.scrollWidth : 0;
            const maxScroll = Math.max(scrollWidth, bodyScrollWidth);
            const hasOverflow = maxScroll > docWidth + 1; // 1px threshold for subpixel rounding

            // Find overflowing elements if any
            let offendingTags = [];
            if (hasOverflow) {
              const all = document.querySelectorAll('*');
              for (const el of all) {
                const rect = el.getBoundingClientRect();
                if (rect.right > docWidth + 2) {
                  offendingTags.push((el.tagName || '').toLowerCase() + (el.className ? '.' + el.className.split(' ').slice(0, 2).join('.') : ''));
                  if (offendingTags.length >= 3) break;
                }
              }
            }

            return {
              docWidth,
              maxScroll,
              hasOverflow,
              offendingTags
            };
          })()
        `,
        returnByValue: true
      });

      const data = evalRes.result?.value || {};
      const status = data.hasOverflow ? 'FAIL (Overflow)' : 'PASS';
      results.push({
        bp: bp.width,
        device: bp.device,
        route: r.path,
        status,
        docWidth: data.docWidth,
        maxScroll: data.maxScroll,
        offending: data.offendingTags
      });

      if (data.hasOverflow) {
        console.error(`  ✖ [${r.name}] OVERFLOW: clientWidth=${data.docWidth}, scrollWidth=${data.maxScroll}, culprits: ${(data.offendingTags || []).join(', ')}`);
      } else {
        console.log(`  ✔ [${r.name}] PASS: clientWidth=${data.docWidth}, scrollWidth=${data.maxScroll}`);
      }
    }
  }

  console.log('\n--- SUMMARY ACROSS ALL 10 VIEWPORTS ---');
  const failures = results.filter(r => r.status !== 'PASS');
  console.log(`Total checks: ${results.length}`);
  console.log(`Passed: ${results.length - failures.length}`);
  console.log(`Failed: ${failures.length}`);
  console.log(`Console Errors encountered: ${consoleErrors.length}`);

  try { ws.close(); } catch (_) {}
  try { edgeProc.kill(); } catch (_) {}
}

runAudit().catch(err => {
  console.error('Audit run error:', err);
  process.exit(1);
});
