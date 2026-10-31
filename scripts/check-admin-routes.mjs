import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function check() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-admin-check');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9295;
  const proc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 20; i++) {
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
    proc.kill();
    throw new Error('Edge connection failed');
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

  async function inspect(url) {
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 2500));
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          title: document.title,
          h1: document.querySelector('h1')?.textContent?.trim() || null,
          h2: document.querySelector('h2')?.textContent?.trim() || null,
          bodySnippet: document.body.innerText.replace(/\\s+/g, ' ').slice(0, 150)
        };
      })()`,
      returnByValue: true
    });
    console.log(`URL: ${url}`);
    console.log(`  Title: ${evalRes.result.value.title}`);
    console.log(`  H1: ${evalRes.result.value.h1}`);
    console.log(`  H2: ${evalRes.result.value.h2}`);
    console.log(`  Body: ${evalRes.result.value.bodySnippet}\n`);
  }

  try {
    console.log('--- 1. Testing Localhost (Vite Dev Server) ---');
    await inspect('http://127.0.0.1:5173/sec-ca-8f2a9c1e7d4b6/login');
    await inspect('http://127.0.0.1:5173/admin');

    console.log('--- 2. Testing Production Domain (https://kavithaassociates.com) ---');
    await inspect('https://kavithaassociates.com/sec-ca-8f2a9c1e7d4b6/login');
    await inspect('https://kavithaassociates.com/admin');
  } finally {
    ws.close();
    proc.kill();
  }
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
