import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edgePath, ['--remote-debugging-port=9345', '--headless=new', 'about:blank']);

setTimeout(async () => {
  try {
    const tabs = await (await fetch('http://127.0.0.1:9345/json/list')).json();
    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    const send = (m, p = {}) => new Promise(r => {
      const cur = id++;
      ws.onmessage = e => { const d = JSON.parse(e.data); if (d.id === cur) r(d.result); };
      ws.send(JSON.stringify({ id: cur, method: m, params: p }));
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:5174/' });
    await new Promise(r => setTimeout(r, 3000));
    const res = await send('Runtime.evaluate', {
      expression: 'document.querySelector("aside")?.outerHTML',
      returnByValue: true
    });
    console.log('Result:', res.result?.value);
    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    edgeProc.kill();
  }
}, 1000);
