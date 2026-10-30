import { spawn } from 'child_process';
import path from 'path';

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-debug');
  
  const proc = spawn(edgePath, [
    '--remote-debugging-port=9226',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'http://127.0.0.1:5173'
  ], { stdio: 'ignore' });

  try {
    let tabs = null;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 400));
      try {
        const res = await fetch('http://127.0.0.1:9226/json/list');
        tabs = await res.json();
        if (tabs && tabs.length > 0) break;
      } catch (_) {}
    }

    const target = tabs.find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (m, p = {}) => new Promise((resolve) => {
      const cur = id++;
      const h = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === cur) {
          ws.removeEventListener('message', h);
          resolve(d.result);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: cur, method: m, params: p }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });

    // Wait 1.5 seconds for React to finish rendering
    await new Promise(r => setTimeout(r, 1500));

    const check1 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const sel = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, [data-reveal]';
          const els = Array.from(document.querySelectorAll(sel));
          return els.map(el => ({
            tag: el.tagName,
            className: el.className,
            text: el.innerText.slice(0, 35).replace(/\\s+/g, ' '),
            isRevealed: el.classList.contains('is-revealed'),
            top: Math.round(el.getBoundingClientRect().top)
          }));
        })()
      `,
      returnByValue: true
    });

    console.log(`\nFound ${check1.result.value.length} reveal elements on HomePage at 1.5s:`);
    console.log(check1.result.value.slice(0, 10));

    // Now let's scroll by 800px
    console.log('\nScrolling down by 800px...');
    await send('Runtime.evaluate', {
      expression: `window.scrollBy({ top: 800, behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 300));

    const check2 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const sel = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, [data-reveal]';
          const els = Array.from(document.querySelectorAll(sel));
          return els.map(el => ({
            tag: el.tagName,
            isRevealed: el.classList.contains('is-revealed'),
            top: Math.round(el.getBoundingClientRect().top)
          }));
        })()
      `,
      returnByValue: true
    });

    console.log('\nAfter scrolling 800px:');
    const revealedCount = check2.result.value.filter(e => e.isRevealed).length;
    console.log(`Revealed count: ${revealedCount} / ${check2.result.value.length}`);

    // Wait 3.5s total to see if 2800ms timer revealed everything
    await new Promise(r => setTimeout(r, 2000));
    const check3 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const sel = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, [data-reveal]';
          const els = Array.from(document.querySelectorAll(sel));
          return els.map(el => ({
            tag: el.tagName,
            isRevealed: el.classList.contains('is-revealed')
          }));
        })()
      `,
      returnByValue: true
    });
    const finalRevealed = check3.result.value.filter(e => e.isRevealed).length;
    console.log(`After 3.5s (safety timer): Revealed count: ${finalRevealed} / ${check3.result.value.length}`);

    ws.close();
  } finally {
    proc.kill();
  }
}

main().catch(console.error);
