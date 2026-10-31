import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function verifyAdminArticleButtons() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-admin-check');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9265;
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
    throw new Error('Could not connect to Edge');
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
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  // 1. Navigate to Secret Portal Login
  const secretPath = '/sec-ca-50e0e5eed471';
  await send('Page.navigate', { url: `http://127.0.0.1:5173${secretPath}/login` });
  await new Promise(r => setTimeout(r, 1200));

  // Fill in login credentials using native value setter for React
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const setNativeValue = (element, value) => {
          const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
          const prototype = Object.getPrototypeOf(element);
          const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
          
          if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
          } else {
            valueSetter.call(element, value);
          }
        };

        const u = document.querySelector('input#username');
        const p = document.querySelector('input#password');
        const submitBtn = document.querySelector('button[type=\"submit\"]');

        if (u) {
          setNativeValue(u, 'kavitha');
          u.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (p) {
          setNativeValue(p, 'TestFixtureEphemeralEnv!2026');
          p.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (submitBtn) {
          submitBtn.click();
        }
      })()
    `
  });

  await new Promise(r => setTimeout(r, 2500));

  // Check elements on the overview page
  const checkRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const links = Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href') }));
        const hasArticlesNav = links.some(l => l.text.includes('Articles & Insights'));
        const hasWriteArticleSidebar = links.some(l => l.text.includes('+ Write New Article'));
        const hasWriteArticleHeader = links.some(l => l.text.includes('+ Write Article'));
        const hasArticlesCard = document.body.innerText.includes('Articles & Insights') && document.body.innerText.includes('Write, edit & publish articles');
        
        return {
          currentUrl: window.location.href,
          hasArticlesNav,
          hasWriteArticleSidebar,
          hasWriteArticleHeader,
          hasArticlesCard,
          matchingLinks: links.filter(l => l.text.toLowerCase().includes('article'))
        };
      })()
    `,
    returnByValue: true
  });

  console.log('--- ADMIN OVERVIEW CHECKS ---');
  console.log(JSON.stringify(checkRes.result.value, null, 2));

  // Capture screenshot of Overview with new buttons
  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.resolve('reports/admin-with-article-buttons.png');
  fs.writeFileSync(outPath, Buffer.from(screenshotRes.data, 'base64'));
  console.log('Saved screenshot to:', outPath);

  // 2. Navigate to Write Article via direct link
  await send('Page.navigate', { url: `http://127.0.0.1:5173${secretPath}/articles?action=new` });
  await new Promise(r => setTimeout(r, 1500));

  const articleEditorCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const h1 = document.querySelector('h1')?.innerText;
        const activeTab = document.querySelector('button.bg-white')?.innerText;
        const hasTextarea = Boolean(document.querySelector('textarea'));
        return {
          currentUrl: window.location.href,
          h1,
          activeTab,
          hasTextarea
        };
      })()
    `,
    returnByValue: true
  });

  console.log('\n--- WRITE ARTICLE EDITOR CHECKS ---');
  console.log(JSON.stringify(articleEditorCheck.result.value, null, 2));

  // Capture screenshot of Article Editor
  const editorScreenshot = await send('Page.captureScreenshot', { format: 'png' });
  const editorOutPath = path.resolve('reports/admin-article-editor.png');
  fs.writeFileSync(editorOutPath, Buffer.from(editorScreenshot.data, 'base64'));
  console.log('Saved editor screenshot to:', editorOutPath);

  ws.close();
  edgeProc.kill();
}

verifyAdminArticleButtons().catch(console.error);
