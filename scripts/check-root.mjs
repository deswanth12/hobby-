import { spawn } from 'child_process';
import os from 'os';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profileDir = path.join(os.tmpdir(), 'edge-profile-tmp-' + Date.now());
const edgeProc = spawn(edgePath, ['--remote-debugging-port=9350', '--headless=new', `--user-data-dir=${profileDir}`, 'about:blank']);

setTimeout(async () => {
  try {
    const tabs = await (await fetch('http://127.0.0.1:9350/json/list')).json();
    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    const send = (m, p = {}) => new Promise(r => {
      const cur = id++;
      ws.onmessage = e => { const d = JSON.parse(e.data); if (d.id === cur) r(d.result); };
      ws.send(JSON.stringify({ id: cur, method: m, params: p }));
    });

    await send('Page.enable');
    await send('DOM.enable');
    await send('Page.navigate', { url: 'http://127.0.0.1:5174/' });
    await new Promise(r => setTimeout(r, 2500));
    const title = await send('Runtime.evaluate', {
      expression: 'document.title',
      returnByValue: true
    });
    const rootHtml = await send('Runtime.evaluate', {
      expression: 'document.getElementById("root")?.children.length',
      returnByValue: true
    });
    const aside = await send('Runtime.evaluate', {
      expression: 'document.querySelector("aside")?.outerHTML?.slice(0, 300)',
      returnByValue: true
    });
    console.log('Title:', title.result?.value);
    console.log('Root children count:', rootHtml.result?.value);
    console.log('Aside snippet:', aside.result?.value);
    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    edgeProc.kill();
  }
}, 1000);
