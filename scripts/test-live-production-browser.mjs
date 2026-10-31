import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function testLiveBrowser() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-live-audit');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9255;
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=' + port,
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:' + port + '/json/list');
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
  await send('Network.enable');

  const consoleErrors = [];
  const networkFailures = [];

  ws.addEventListener('message', evt => {
    const d = JSON.parse(evt.data);
    if (d.method === 'Runtime.consoleAPICalled' && d.params?.type === 'error') {
      const text = d.params.args.map(a => a.value || a.description || '').join(' ');
      consoleErrors.push(text);
    }
    if (d.method === 'Network.responseReceived') {
      const status = d.params.response.status;
      if (status >= 400) {
        networkFailures.push({ url: d.params.response.url, status });
      }
    }
  });

  const routes = [
    'https://kavithaassociates.com/',
    'https://kavithaassociates.com/about',
    'https://kavithaassociates.com/services',
    'https://kavithaassociates.com/services/audit-assurance',
    'https://kavithaassociates.com/industries',
    'https://kavithaassociates.com/locations',
    'https://kavithaassociates.com/blog',
    'https://kavithaassociates.com/contact'
  ];

  console.log('=== TESTING LIVE PRODUCTION ROUTES IN EDGE ===');
  for (const url of routes) {
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 1500));
    const titleRes = await send('Runtime.evaluate', { expression: 'document.title' });
    const h1Res = await send('Runtime.evaluate', { expression: 'document.querySelector("h1")?.innerText || "No H1"' });
    console.log(url.padEnd(55), '| Title:', (titleRes.result.value || '').slice(0, 35), '| H1:', (h1Res.result.value || '').slice(0, 35));
  }

  console.log('\n--- LIVE AUDIT DIAGNOSTICS ---');
  console.log('Total Console Errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => console.log('  [Console Error]:', e));
  }
  console.log('Total Network Failures (>=400):', networkFailures.length);
  if (networkFailures.length > 0) {
    networkFailures.forEach(n => console.log('  [Network Failure]:', n.status, n.url));
  }

  ws.close();
  edgeProc.kill();
}

testLiveBrowser().catch(console.error);
