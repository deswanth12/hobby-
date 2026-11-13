import { spawn } from 'child_process';
import os from 'os';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profileDir = path.join(os.tmpdir(), 'edge-profile-contact-test-' + Date.now());
const edgeProc = spawn(edgePath, ['--remote-debugging-port=9355', '--headless=new', `--user-data-dir=${profileDir}`, 'about:blank']);

setTimeout(async () => {
  try {
    const tabs = await (await fetch('http://127.0.0.1:9355/json/list')).json();
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
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:5174/' });
    console.log('[Test] Navigated. Waiting 2.2s for prompt entrance at hero...');
    await new Promise(r => setTimeout(r, 2200));

    // 1. Check Hero State
    const heroState = await send('Runtime.evaluate', {
      expression: `(() => {
        const bubble = document.querySelector('aside[aria-label="Direct WhatsApp Consultation"] div[role="status"]');
        if (!bubble) return null;
        const style = window.getComputedStyle(bubble);
        return {
          opacity: style.opacity,
          visibility: style.visibility,
          pointerEvents: style.pointerEvents,
          text: bubble.innerText.slice(0, 40)
        };
      })()`,
      returnByValue: true
    });
    console.log('1. At Hero (Desktop 1440px):', heroState.result?.value);

    // 2. Scroll to Contact Section
    console.log('[Test] Scrolling into #contact-section...');
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#contact-section').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 800));

    const contactState = await send('Runtime.evaluate', {
      expression: `(() => {
        const bubble = document.querySelector('aside[aria-label="Direct WhatsApp Consultation"] div[role="status"]');
        if (!bubble) return null;
        const style = window.getComputedStyle(bubble);
        const waBtn = document.querySelector('aside[aria-label="Direct WhatsApp Consultation"] a');
        const submitBtn = document.querySelector('form button[type="submit"]');
        const waRect = waBtn ? waBtn.getBoundingClientRect() : null;
        const subRect = submitBtn ? submitBtn.getBoundingClientRect() : null;
        let overlapsSubmit = false;
        if (waRect && subRect) {
          overlapsSubmit = !(waRect.right < subRect.left || 
                             waRect.left > subRect.right || 
                             waRect.bottom < subRect.top || 
                             waRect.top > subRect.bottom);
        }
        return {
          opacity: style.opacity,
          visibility: style.visibility,
          pointerEvents: style.pointerEvents,
          height: style.height,
          isSuppressed: style.visibility === 'hidden' && style.opacity === '0',
          overlapsSubmit
        };
      })()`,
      returnByValue: true
    });
    console.log('2. At Contact Section (Should be hidden & not overlapping):', contactState.result?.value);

    // 3. Scroll back to Hero
    console.log('[Test] Scrolling back to Top (leaving contact section)...');
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 0, behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 800));

    const restoredState = await send('Runtime.evaluate', {
      expression: `(() => {
        const bubble = document.querySelector('aside[aria-label="Direct WhatsApp Consultation"] div[role="status"]');
        if (!bubble) return null;
        const style = window.getComputedStyle(bubble);
        return {
          opacity: style.opacity,
          visibility: style.visibility,
          isRestored: style.visibility === 'visible' && style.opacity === '1'
        };
      })()`,
      returnByValue: true
    });
    console.log('3. Back at Top (Should be restored):', restoredState.result?.value);

    // 4. Test Mobile 390px at Contact Section
    console.log('[Test] Testing Mobile (390px) at Contact Section...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#contact-section').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 800));

    const mobileContactState = await send('Runtime.evaluate', {
      expression: `(() => {
        const bubble = document.querySelector('aside[aria-label="Direct WhatsApp Consultation"] div[role="status"]');
        const bubbleStyle = bubble ? window.getComputedStyle(bubble) : null;
        const bubbleHidden = !bubble || bubbleStyle.display === 'none' || bubbleStyle.visibility === 'hidden';

        const waBtn = document.querySelector('aside[aria-label="Direct WhatsApp Consultation"] a');
        const submitBtn = document.querySelector('form button[type="submit"]');
        const inputs = Array.from(document.querySelectorAll('form input, form select, form textarea'));

        const waRect = waBtn.getBoundingClientRect();
        const overlapsControls = inputs.some(inp => {
          const r = inp.getBoundingClientRect();
          return !(waRect.right < r.left || waRect.left > r.right || waRect.bottom < r.top || waRect.top > r.bottom);
        });

        const subRect = submitBtn.getBoundingClientRect();
        const overlapsSubmit = !(waRect.right < subRect.left || waRect.left > subRect.right || waRect.bottom < subRect.top || waRect.top > subRect.bottom);

        return {
          bubbleHidden,
          overlapsControls,
          overlapsSubmit
        };
      })()`,
      returnByValue: true
    });
    console.log('4. Mobile Contact Section (390px):', mobileContactState.result?.value);

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    edgeProc.kill();
  }
}, 1000);
