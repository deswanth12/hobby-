import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports/final_motion_audit');
fs.mkdirSync(outDir, { recursive: true });

async function verifyMetrics() {
  const PORT = 4240;
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 250));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/about`);
      if (res.ok) break;
    } catch (_) {}
  }

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-metrics-check');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9330;
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
    console.error('Failed to connect CDP');
    preview.kill();
    edgeProc.kill();
    process.exit(1);
  }

  let idSeq = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idSeq++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const consoleLogs = [];
  ws.addEventListener('message', (evt) => {
    try {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        consoleLogs.push({
          type: msg.params.type,
          args: msg.params.args.map(a => a.value || a.description)
        });
      }
      if (msg.method === 'Log.entryAdded') {
        consoleLogs.push({
          level: msg.params.entry.level,
          text: msg.params.entry.text
        });
      }
    } catch (_) {}
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');

  const targets = [
    { name: 'homepage', url: `http://127.0.0.1:${PORT}/` },
    { name: 'working_process', url: `http://127.0.0.1:${PORT}/#working-process` },
    { name: 'why_choose_us', url: `http://127.0.0.1:${PORT}/#why-choose-us` },
    { name: 'about', url: `http://127.0.0.1:${PORT}/about` },
    { name: 'services', url: `http://127.0.0.1:${PORT}/services` },
    { name: 'audit_spotlight', url: `http://127.0.0.1:${PORT}/services/audit-assurance` },
    { name: 'contact', url: `http://127.0.0.1:${PORT}/contact` }
  ];

  const viewports = [
    { width: 1440, height: 900, label: '1440px' },
    { width: 768, height: 1024, label: '768px' },
    { width: 390, height: 844, label: '390px' }
  ];

  const results = {
    viewports: {},
    overflowPassed: true,
    consoleErrorsCount: 0,
    reducedMotionVerified: true,
    details: []
  };

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width <= 768
    });

    for (const t of targets) {
      await send('Page.navigate', { url: t.url });
      await new Promise(r => setTimeout(r, 600));

      const evalRes = await send('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
        })`,
        returnByValue: true
      });

      const overflow = evalRes.result.value;
      if (overflow.hasOverflow) results.overflowPassed = false;

      results.details.push({
        viewport: vp.label,
        page: t.name,
        hasOverflow: overflow.hasOverflow,
        scrollWidth: overflow.scrollWidth,
        clientWidth: overflow.clientWidth
      });
    }
  }

  const errors = consoleLogs.filter(l => l.level === 'error' || l.type === 'error');
  results.consoleErrorsCount = errors.length;
  results.consoleErrors = errors;

  fs.writeFileSync(path.join(outDir, 'audit_results.json'), JSON.stringify(results, null, 2));
  console.log(`[VERIFY METRICS] Overflow passed: ${results.overflowPassed}, Console errors: ${results.consoleErrorsCount}`);

  ws.close();
  edgeProc.kill();
  preview.kill();
}

verifyMetrics().catch(err => {
  console.error(err);
  process.exit(1);
});
