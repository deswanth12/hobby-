import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ROOT = path.resolve('.');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profileDir = path.resolve('reports/edge-profile-admin-test2');

if (!fs.existsSync('reports')) fs.mkdirSync('reports');

async function run() {
  console.log('Launching Edge for Admin Verification...');
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=9226',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'http://127.0.0.1:5173/sec-ca-50e0e5eed471/login'
  ], { stdio: 'ignore' });

  let ws;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9226/json/list');
      const tabs = await res.json();
      if (tabs && tabs.length > 0) {
        const target = tabs.find(t => t.type === 'page');
        if (target) {
          ws = new WebSocket(target.webSocketDebuggerUrl);
          await new Promise(res => { ws.onopen = res; });
          break;
        }
      }
    } catch (_) {}
  }

  if (!ws) {
    console.error('Failed to connect to Edge CDP');
    edgeProc.kill();
    process.exit(1);
  }

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
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  console.log('1. Page loaded, performing login...');
  await new Promise(r => setTimeout(r, 1000));

  const loginRes = await send('Runtime.evaluate', {
    expression: `(async () => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'kavitha', password: 'TestFixtureEphemeralEnv!2026' })
      });
      const data = await res.json();
      if (data.success && data.session) {
        sessionStorage.setItem('ka_admin_session_v1', JSON.stringify(data.session));
        return { success: true, session: data.session };
      }
      return { success: false, data };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Login injected:', loginRes.result.value);

  // Navigate to Admin Overview
  console.log('2. Navigating to Admin Overview...');
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/sec-ca-50e0e5eed471' });
  await new Promise(r => setTimeout(r, 1800));

  // Screenshot 1: Overview Dashboard
  const ss1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('reports/admin-overview-with-articles.png', Buffer.from(ss1.data, 'base64'));
  console.log('✔ Captured reports/admin-overview-with-articles.png');

  // Verify elements on page
  const evalCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const text = document.body.innerText;
      return {
        url: location.href,
        title: document.title,
        hasArticlesNav: text.includes('Articles & Insights'),
        hasWriteNewArticleBtn: text.includes('+ Write New Article'),
        hasWriteHeaderBtn: text.includes('+ Write Article'),
        hasPracticeSettings: text.includes('Practice Settings'),
        articleLinksCount: document.querySelectorAll('a[href*="/articles"]').length
      };
    })()`,
    returnByValue: true
  });
  console.log('UI Verification on Overview:', evalCheck.result.value);

  // Screenshot 2: Click/Navigate to Articles & Insights
  console.log('3. Navigating to Articles Management (/articles)...');
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/sec-ca-50e0e5eed471/articles' });
  await new Promise(r => setTimeout(r, 1500));

  const ss2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('reports/admin-articles-manager.png', Buffer.from(ss2.data, 'base64'));
  console.log('✔ Captured reports/admin-articles-manager.png');

  // Screenshot 3: Navigate to Write New Article form
  console.log('4. Navigating to Write New Article (/articles?action=new)...');
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/sec-ca-50e0e5eed471/articles?action=new' });
  await new Promise(r => setTimeout(r, 1500));

  const ss3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('reports/admin-write-new-article.png', Buffer.from(ss3.data, 'base64'));
  console.log('✔ Captured reports/admin-write-new-article.png');

  const evalNewArticle = await send('Runtime.evaluate', {
    expression: `(() => {
      const text = document.body.innerText;
      return {
        url: location.href,
        hasNewArticleForm: text.includes('New Statutory Article') || text.includes('Write New Article'),
        hasMarkdownEditor: text.includes('Write statutory analysis') || document.querySelectorAll('textarea').length > 0,
        hasSaveBtn: text.includes('Save Article') || text.includes('Publish Article') || text.includes('Save')
      };
    })()`,
    returnByValue: true
  });
  console.log('UI Verification on New Article Page:', evalNewArticle.result.value);

  ws.close();
  edgeProc.kill();
  console.log('Verification finished successfully!');
}

run().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
