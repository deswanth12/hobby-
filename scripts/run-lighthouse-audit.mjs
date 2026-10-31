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
      console.log(`Lighthouse target server running at http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

async function runLighthouse() {
  const distDir = path.resolve('dist');
  const port = 4175;
  const server = await createStaticServer(distDir, port);

  const reportDir = path.resolve('reports/lighthouse');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, 'report.json');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  console.log('Spawning Lighthouse CLI...');
  const lhArgs = [
    `http://127.0.0.1:${port}/`,
    '--output=json',
    `--output-path=${reportPath}`,
    `--chrome-path=${edgePath}`,
    '--chrome-flags="--headless=new --no-sandbox --disable-gpu"',
    '--only-categories=performance,accessibility,best-practices,seo',
    '--preset=desktop',
    '--quiet'
  ];

  const lhProcess = spawn('npx', ['lighthouse', ...lhArgs], { shell: true, stdio: 'inherit' });

  await new Promise((resolve, reject) => {
    lhProcess.on('exit', (code) => {
      server.close();
      if (code === 0) resolve();
      else reject(new Error(`Lighthouse exited with code ${code}`));
    });
  });

  if (fs.existsSync(reportPath)) {
    const raw = fs.readFileSync(reportPath, 'utf8');
    const data = JSON.parse(raw);
    const scores = {
      performance: Math.round((data.categories.performance?.score || 0) * 100),
      accessibility: Math.round((data.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((data.categories['best-practices']?.score || 0) * 100),
      seo: Math.round((data.categories.seo?.score || 0) * 100)
    };
    console.log('\n=============================================');
    console.log('ACTUAL MEASURED LIGHTHOUSE AUDIT SCORES:');
    console.log(JSON.stringify(scores, null, 2));
    console.log('=============================================\n');

    const artifactDir = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\915eb0d1-0751-489f-a770-da815fa3ba6c';
    fs.writeFileSync(path.join(artifactDir, 'lighthouse_scores.json'), JSON.stringify(scores, null, 2), 'utf8');
  } else {
    throw new Error('Report file not generated.');
  }
}

runLighthouse().catch(err => {
  console.error(err);
  process.exit(1);
});
