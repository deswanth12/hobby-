import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const phase = process.argv.includes('--phase=after') ? 'after' : 'before';
const outputDir = path.resolve(`reports/screenshots/v45/${phase}`);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function runVisualQA() {
  console.log('================================================================');
  console.log(`  KAVITHA & ASSOCIATES — V4.5 VISUAL QA (${phase.toUpperCase()})`);
  console.log('================================================================');

  const PORT = 4185;
  console.log(`[1/4] Starting Vite preview server on port ${PORT}...`);
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
  const profileDir = path.resolve(`reports/edge-profile-v45-${phase}`);
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9265;
  console.log(`[2/4] Launching Headless Edge on CDP port ${CDP_PORT}...`);
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

  const pages = [
    { path: '/', name: 'homepage' },
    { path: '/services', name: 'services' },
    { path: '/about', name: 'about' },
    { path: '/contact', name: 'contact' },
    { path: '/services/company-registration-tirupati', name: 'company-registration' },
    { path: '/services/gst-consultant-tirupati', name: 'gst-services' },
    { path: '/services/audit-assurance', name: 'audit-assurance' },
    { path: '/locations', name: 'locations' },
    { path: '/knowledge-bank', name: 'knowledge-bank' }
  ];

  console.log(`[3/4] Capturing ${pages.length} pages across 4 viewports...`);
  const auditResults = [];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 1024
    });

    for (const pg of pages) {
      const url = `http://127.0.0.1:${PORT}${pg.path}`;
      await send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 700));

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

      // Verify specific elements and features
      const pageInfo = await evalJs(`
        (() => {
          const header = document.querySelector('header');
          const footer = document.querySelector('footer');
          const h1 = document.querySelector('h1');
          const hasKBRoute = !document.body.innerText.includes('HTTP 404 NOT LOCATED') && window.location.pathname === '/knowledge-bank';
          const hasEntityAdvisor = document.getElementById('statutory-advisor') !== null;
          const hasKnowledgeFAQ = document.getElementById('knowledge-faq') !== null;
          const hasGuaranteedROC = document.body.innerText.includes('Guaranteed ROC Compliance');
          const hasZeroLateFee = document.body.innerText.includes('Zero Late Fee Guarantee');
          const hasCompleteLegalImmunity = document.body.innerText.includes('Complete Legal Immunity & Clean Audit Reports');
          const hasRedactedToken = document.body.innerText.includes('[REDACTED_MEMBERSHIP_NO]');

          return {
            title: document.title,
            hasHeader: !!header,
            hasFooter: !!footer,
            h1Text: h1 ? h1.innerText.replace(/\\s+/g, ' ').trim() : null,
            hasKBRoute,
            hasEntityAdvisor,
            hasKnowledgeFAQ,
            hasGuaranteedROC,
            hasZeroLateFee,
            hasCompleteLegalImmunity,
            hasRedactedToken
          };
        })()
      `);

      // Capture screenshot
      const ss = await send('Page.captureScreenshot', { format: 'png' });
      const filename = `${pg.name}_${vp.name}.png`;
      fs.writeFileSync(path.join(outputDir, filename), Buffer.from(ss.data, 'base64'));

      auditResults.push({
        phase,
        page: pg.name,
        path: pg.path,
        viewport: vp.name,
        width: vp.width,
        overflow: overflow || 0,
        ...pageInfo,
        file: filename
      });

      console.log(`  ✔ [${vp.name}] ${pg.name} -> overflow: ${overflow || 0}px, file: ${filename}`);
    }
  }

  // Cleanup
  console.log('[4/4] Finalizing captures...');
  try { edgeProc.kill(); } catch (_) {}
  try { preview.kill(); } catch (_) {}

  fs.writeFileSync(path.join(outputDir, 'summary.json'), JSON.stringify(auditResults, null, 2), 'utf8');
  console.log(`\nExecution Finished! ${auditResults.length} screenshots saved to ${outputDir}`);
}

runVisualQA().catch(err => {
  console.error('QA Error:', err);
  process.exit(1);
});
