import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'services', path: '/services' },
  { name: 'audit-assurance', path: '/services/audit-assurance' },
  { name: 'industries', path: '/industries' },
  { name: 'locations', path: '/locations' },
  { name: 'blog', path: '/blog' },
  { name: 'contact', path: '/contact' },
];

async function runDiagnostic() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-diag');
  
  let edgeProc = null;
  try {
    console.log('[CDP] Launching Edge headless on port 9224...');
    edgeProc = spawn(edgePath, [
      '--remote-debugging-port=9224',
      '--remote-allow-origins=*',
      `--user-data-dir=${profileDir}`,
      '--headless=new',
      'http://127.0.0.1:5173'
    ], { stdio: 'ignore' });

    let tabs = null;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 500));
      try {
        const res = await fetch('http://127.0.0.1:9224/json/list');
        tabs = await res.json();
        if (tabs && tabs.length > 0) break;
      } catch (_) {}
    }

    if (!tabs || tabs.length === 0) throw new Error('Edge CDP failed to start');
    const target = tabs.find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = msgId++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');

    const evalInPage = async (expr) => {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails));
      return res.result.value;
    };

    console.log('--- REPRODUCING SCROLL ANIMATION PIPELINE ---');

    for (const page of PAGES) {
      const url = `http://127.0.0.1:5173${page.path}`;
      await send('Page.navigate', { url });
      // Wait 100ms (just after the initial 50ms setTimeout)
      await new Promise(r => setTimeout(r, 120));

      const initialStats = await evalInPage(`
        (() => {
          const sel = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, [data-reveal]';
          const all = Array.from(document.querySelectorAll(sel));
          const revealed = all.filter(el => el.classList.contains('is-revealed'));
          const belowFold = all.filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.top >= window.innerHeight;
          });
          const belowFoldRevealed = belowFold.filter(el => el.classList.contains('is-revealed'));
          return {
            totalElements: all.length,
            revealedCount: revealed.length,
            belowFoldCount: belowFold.length,
            belowFoldRevealedCount: belowFoldRevealed.length,
            classes: all.map(el => el.className)
          };
        })()
      `);

      console.log(`Page: ${page.name} (${page.path})`);
      console.log(`  Total reveal elements: ${initialStats.totalElements}`);
      console.log(`  Revealed at t=120ms: ${initialStats.revealedCount}`);
      console.log(`  Below fold: ${initialStats.belowFoldCount}, of which already revealed: ${initialStats.belowFoldRevealedCount}`);

      // Now wait 3000ms (after the 2800ms safety timer)
      await new Promise(r => setTimeout(r, 3000));
      const afterSafetyStats = await evalInPage(`
        (() => {
          const sel = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, [data-reveal]';
          const all = Array.from(document.querySelectorAll(sel));
          const revealed = all.filter(el => el.classList.contains('is-revealed'));
          return {
            totalElements: all.length,
            revealedCount: revealed.length
          };
        })()
      `);
      console.log(`  After 3000ms (safetyTimer): Total: ${afterSafetyStats.totalElements}, Revealed: ${afterSafetyStats.revealedCount}`);
    }

    ws.close();
  } finally {
    if (edgeProc) edgeProc.kill();
  }
}

runDiagnostic().catch(console.error);
