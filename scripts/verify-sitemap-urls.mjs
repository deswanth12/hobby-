import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const PORT = 4212;

function startServer() {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8'
  };

  const server = http.createServer((req, res) => {
    let cleanPath = req.url.split('?')[0];
    if (cleanPath === '/') cleanPath = '/index.html';
    let filePath = path.join(DIST_DIR, cleanPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

async function main() {
  const server = await startServer();
  const sitemapXml = fs.readFileSync('public/sitemap.xml', 'utf8');

  // Extract <loc>
  const locRegex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = locRegex.exec(sitemapXml)) !== null) {
    urls.push(match[1]);
  }

  console.log(`Extracted ${urls.length} URLs from sitemap.xml:\n`);

  const results = [];
  for (const u of urls) {
    const parsed = new URL(u);
    const localUrl = `http://127.0.0.1:${PORT}${parsed.pathname}`;
    
    try {
      const res = await fetch(localUrl);
      const html = await res.text();
      const hasCanonical = html.includes('rel="canonical"');
      const hasRobots = html.includes('name="robots" content="index, follow"');
      
      results.push({
        url: u,
        status: res.status,
        ok: res.status === 200,
        hasCanonical,
        hasRobots
      });
      console.log(`[${res.status}] ${u} (canonical=${hasCanonical}, robots=${hasRobots})`);
    } catch (e) {
      results.push({ url: u, status: 0, error: e.message, ok: false });
      console.log(`[ERR] ${u}: ${e.message}`);
    }
  }

  await new Promise(resolve => server.close(resolve));

  const allOk = results.every(r => r.ok && r.hasCanonical && r.hasRobots);
  console.log(`\nSitemap Verification: ${results.length} URLs tested. All 200 OK + Canonical + Robots: ${allOk}`);
  fs.writeFileSync('reports/sitemap-verification-results.json', JSON.stringify({ total: results.length, allOk, results }, null, 2));

  if (!allOk) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
