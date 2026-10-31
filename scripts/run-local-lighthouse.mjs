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
    server.listen(port, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

async function main() {
  const port = 4176;
  const server = await createStaticServer(path.resolve('dist'), port);
  const outPath = path.resolve('reports/lighthouse/local_polished.json');

  const cmd = `npx --yes lighthouse "http://127.0.0.1:${port}" --output=json --output-path="${outPath}" --chrome-flags="--headless=new --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --preset=desktop --quiet`;

  const proc = spawn(cmd, { shell: true, stdio: 'inherit' });
  await new Promise((resolve, reject) => {
    proc.on('exit', (code) => {
      server.close();
      if (code === 0) resolve();
      else reject(new Error('Lighthouse exited with code ' + code));
    });
  });

  if (fs.existsSync(outPath)) {
    const d = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    const scores = {
      performance: Math.round(d.categories.performance.score * 100),
      accessibility: Math.round(d.categories.accessibility.score * 100),
      bestPractices: Math.round(d.categories['best-practices'].score * 100),
      seo: Math.round(d.categories.seo.score * 100)
    };
    console.log('LOCAL POLISHED BUILD LIGHTHOUSE SCORES:');
    console.log(JSON.stringify(scores, null, 2));

    const artifactScoresPath = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\915eb0d1-0751-489f-a770-da815fa3ba6c\\lighthouse_scores.json';
    fs.writeFileSync(artifactScoresPath, JSON.stringify(scores, null, 2), 'utf8');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
