import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import http from 'http';

function createStaticServer(distDir, port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff'
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(distDir, reqPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function verifyBrowserInteractions() {
  const PORT = 4235;
  const distDir = path.resolve('dist');
  const server = await createStaticServer(distDir, PORT);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-browser-interactions');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const cdpPort = 9275;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
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
    server.close();
    try { edgeProc.kill(); } catch (_) {}
    throw new Error('Could not connect to Edge');
  }

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 15000);
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

  // Set iPhone / Android mobile emulation (390x844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 700));

  // 1. Mobile Navigation & Drawer Test
  const navTest = await send('Runtime.evaluate', {
    expression: `(async () => {
      const toggle = document.querySelector('button[aria-label="Toggle navigation menu"]');
      if (!toggle) return { error: 'Toggle not found' };
      toggle.click();
      await new Promise(r => setTimeout(r, 350));
      const drawer = document.querySelector('[role="dialog"][aria-label="Mobile Navigation Drawer"]');
      const bodyLocked = document.body.style.overflow === 'hidden';
      
      // Toggle Services Accordion
      const servicesBtn = drawer ? Array.from(drawer.querySelectorAll('button')).find(b => b.textContent.includes('Services')) : null;
      let servicesExpanded = false;
      if (servicesBtn) {
        servicesBtn.click();
        await new Promise(r => setTimeout(r, 200));
        servicesExpanded = servicesBtn.getAttribute('aria-expanded') === 'true';
      }

      // Close drawer
      const closeBtn = drawer ? drawer.querySelector('button[aria-label="Close navigation menu"]') : null;
      if (closeBtn) closeBtn.click();
      await new Promise(r => setTimeout(r, 350));
      const bodyUnlocked = document.body.style.overflow === '';

      return {
        drawerFound: !!drawer,
        bodyLocked,
        servicesAccordionWorked: servicesExpanded,
        bodyUnlocked
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('1. Navigation Drawer Test:', navTest.result?.value);

  // 2. WhatsApp Floating Button Test
  const waTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const waBtn = document.querySelector('aside a[href*="wa.me"]');
      const tooltip = document.querySelector('aside [role="status"]');
      const tooltipHiddenOnMobile = !tooltip || window.getComputedStyle(tooltip).display === 'none';
      return {
        waBtnFound: !!waBtn,
        waHref: waBtn ? waBtn.href : '',
        btnWidth: waBtn ? waBtn.offsetWidth : 0,
        btnHeight: waBtn ? waBtn.offsetHeight : 0,
        tooltipHiddenOnMobile
      };
    })()`,
    returnByValue: true
  });
  console.log('2. Floating WhatsApp Test:', waTest.result?.value);

  // 3. Footer Test
  const footerTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const footer = document.querySelector('footer');
      const footerStyle = footer ? window.getComputedStyle(footer) : {};
      const telLinks = footer ? Array.from(footer.querySelectorAll('a[href^="tel:"]')).map(a => a.href) : [];
      const mailLinks = footer ? Array.from(footer.querySelectorAll('a[href^="mailto:"]')).map(a => a.href) : [];
      const icaiNotice = footer ? footer.textContent.includes('Institute of Chartered Accountants of India') : false;
      return {
        footerFound: !!footer,
        paddingBottom: footerStyle.paddingBottom,
        telLinks,
        mailLinks,
        icaiNotice
      };
    })()`,
    returnByValue: true
  });
  console.log('3. Footer & Clearance Test:', footerTest.result?.value);

  // 4. Contact Form Test on /contact
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/contact` });
  await new Promise(r => setTimeout(r, 700));

  const formTest = await send('Runtime.evaluate', {
    expression: `(async () => {
      const form = document.querySelector('form');
      if (!form) return { error: 'Form not found' };
      const nameInput = form.querySelector('input#fullName');
      const phoneInput = form.querySelector('input#phone');
      const emailInput = form.querySelector('input#email');
      const submitBtn = form.querySelector('button[type="submit"]');

      return {
        formFound: true,
        nameInputFontSize: nameInput ? window.getComputedStyle(nameInput).fontSize : '',
        phoneInputType: phoneInput ? phoneInput.type : '',
        phoneInputMode: phoneInput ? phoneInput.getAttribute('inputmode') : '',
        emailInputType: emailInput ? emailInput.type : '',
        emailInputMode: emailInput ? emailInput.getAttribute('inputmode') : '',
        submitBtnHeight: submitBtn ? submitBtn.offsetHeight : 0
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('4. Contact Form Usability Test:', formTest.result?.value);

  ws.close();
  server.close();
  try { edgeProc.kill(); } catch (_) {}
}

verifyBrowserInteractions().catch(err => {
  console.error(err);
  process.exit(1);
});
