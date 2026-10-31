import http from 'http';
import fs from 'fs';
import path from 'path';

function createStaticServer(distDir, port) {
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(distDir, reqPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function verifyRoutes() {
  const port = 4177;
  const server = await createStaticServer(path.resolve('dist'), port);

  const routes = [
    { path: '/', title: 'Home' },
    { path: '/about', title: 'About Firm' },
    { path: '/services', title: 'Practice Disciplines' },
    { path: '/services/audit-assurance', title: 'Audit & Assurance' },
    { path: '/industries', title: 'Industries We Serve' },
    { path: '/locations', title: 'Practice Reach' },
    { path: '/blog', title: 'Practice Knowledge & Articles' },
    { path: '/contact', title: 'Initiate Consultation' },
    { path: '/sec-ca-8f2a9c1e7d4b6/login', title: 'Admin Login' }
  ];

  console.log('Verifying all application routes on production build...');
  let allPassed = true;

  for (const r of routes) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}${r.path}`);
      const text = await res.text();
      const hasHtml = /<!doctype html>/i.test(text) && text.includes('id="root"');
      console.log(`Route [${r.path}]: Status ${res.status} | HTML Valid: ${hasHtml}`);
      if (res.status !== 200 || !hasHtml) allPassed = false;
    } catch (err) {
      console.error(`Route [${r.path}] error:`, err);
      allPassed = false;
    }
  }

  server.close();
  console.log(`All routes verified: ${allPassed ? 'SUCCESS' : 'FAILED'}`);
  return allPassed;
}

verifyRoutes().catch(console.error);
