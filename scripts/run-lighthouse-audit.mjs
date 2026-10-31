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

async function runAuditForPreset(port, preset, outputPath) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const args = [
    `http://127.0.0.1:${port}/`,
    '--output=json',
    `--output-path=${outputPath}`,
    `--chrome-path=${edgePath}`,
    '--chrome-flags="--headless=new --no-sandbox --disable-gpu"',
    '--only-categories=performance,accessibility,best-practices,seo',
    `--preset=${preset}`,
    '--quiet'
  ];

  const lhProcess = spawn('npx', ['lighthouse', ...args], { shell: true, stdio: 'inherit' });
  await new Promise((resolve, reject) => {
    lhProcess.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Lighthouse (${preset}) exited with code ${code}`));
    });
  });

  const raw = fs.readFileSync(outputPath, 'utf8');
  const data = JSON.parse(raw);
  return {
    performance: Math.round((data.categories.performance?.score || 0) * 100),
    accessibility: Math.round((data.categories.accessibility?.score || 0) * 100),
    bestPractices: Math.round((data.categories['best-practices']?.score || 0) * 100),
    seo: Math.round((data.categories.seo?.score || 0) * 100),
    metrics: {
      lcp: data.audits['largest-contentful-paint']?.displayValue,
      cls: data.audits['cumulative-layout-shift']?.displayValue,
      tbt: data.audits['total-blocking-time']?.displayValue
    }
  };
}

async function runLighthouse() {
  const distDir = path.resolve('dist');
  const port = 4175;
  const server = await createStaticServer(distDir, port);

  const reportDir = path.resolve('reports/lighthouse');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

  const desktopPath = path.join(reportDir, 'report-desktop.json');
  const mobilePath = path.join(reportDir, 'report-mobile.json');

  try {
    console.log('Running Desktop Lighthouse...');
    const desktopScores = await runAuditForPreset(port, 'desktop', desktopPath);

    console.log('Running Mobile Lighthouse...');
    const mobileScores = await runAuditForPreset(port, 'perf', mobilePath);

    console.log('\n=============================================');
    console.log('ACTUAL MEASURED LIGHTHOUSE AUDIT SCORES:');
    console.log('Desktop:', JSON.stringify(desktopScores, null, 2));
    console.log('Mobile:', JSON.stringify(mobileScores, null, 2));
    console.log('=============================================\n');

    const artifactDir = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\98a52437-4417-4f06-a2da-763017b7aaa0';
    const finalReport = { desktop: desktopScores, mobile: mobileScores };
    fs.writeFileSync(path.join(artifactDir, 'lighthouse_scores.json'), JSON.stringify(finalReport, null, 2), 'utf8');
    fs.writeFileSync(path.join(reportDir, 'summary.json'), JSON.stringify(finalReport, null, 2), 'utf8');
  } finally {
    server.close();
  }
}

runLighthouse().catch((err) => {
  console.error(err);
  process.exit(1);
});
