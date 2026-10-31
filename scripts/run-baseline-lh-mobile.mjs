import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const distDir = path.resolve('dist');
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

server.listen(4192, '127.0.0.1', () => {
  console.log('Static server started on 4192. Running Lighthouse Mobile...');
  const outPath = path.resolve('reports/lighthouse/initial_mobile.json');
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const cmd = `npx lighthouse http://127.0.0.1:4192/ --output=json --output-path="${outPath}" --chrome-flags="--headless=new --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --throttling-method=simulate --quiet`;

  const proc = spawn(cmd, { shell: true, stdio: 'inherit' });
  proc.on('exit', (code) => {
    server.close();
    console.log('Lighthouse Mobile finished with code:', code);
    if (fs.existsSync(outPath)) {
      const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      const scores = {
        performance: Math.round((data.categories.performance?.score || 0) * 100),
        accessibility: Math.round((data.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((data.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((data.categories.seo?.score || 0) * 100),
        metrics: {
          FCP: data.audits['first-contentful-paint']?.displayValue,
          LCP: data.audits['largest-contentful-paint']?.displayValue,
          TBT: data.audits['total-blocking-time']?.displayValue,
          CLS: data.audits['cumulative-layout-shift']?.displayValue,
          SpeedIndex: data.audits['speed-index']?.displayValue
        }
      };
      console.log('Lighthouse Initial Mobile Scores:', JSON.stringify(scores, null, 2));
    }
  });
});
