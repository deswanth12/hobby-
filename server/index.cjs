const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleApiRequest } = require('./apiRouter.cjs');

const PORT = process.env.PORT || 5173;
const DIST_DIR = path.join(__dirname, '..', 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  // 1. API Endpoints
  if (req.url && req.url.startsWith('/api/')) {
    return handleApiRequest(req, res);
  }

  // 2. Static File Serving (from dist/)
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain', 'X-Content-Type-Options': 'nosniff' });
    res.end('Bad Request: Malformed URI encoding.');
    return;
  }

  // Null Byte Defense
  if (pathname.includes('\0')) {
    res.writeHead(400, { 'Content-Type': 'text/plain', 'X-Content-Type-Options': 'nosniff' });
    res.end('Bad Request: Null byte prohibited.');
    return;
  }

  // Path Traversal Defense: Normalize and verify destination remains strictly within DIST_DIR
  const normalizedPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.resolve(DIST_DIR, '.' + normalizedPath);
  const resolvedDist = path.resolve(DIST_DIR);

  if (filePath !== resolvedDist && !filePath.startsWith(resolvedDist + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain', 'X-Content-Type-Options': 'nosniff' });
    res.end('Forbidden: Directory traversal request blocked.');
    return;
  }

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  // If file doesn't exist, SPA fallback to /index.html
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain', 'X-Content-Type-Options': 'nosniff' });
    res.end('Not found. Please build the client first with `npm run build`.');
  }
});

server.listen(PORT, () => {
  console.log(`[Kavitha & Associates] Production Server running at http://localhost:${PORT}`);
});
