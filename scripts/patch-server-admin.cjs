const fs = require('fs');
let c = fs.readFileSync('server/index.cjs', 'utf-8');
const target = '  // Null Byte Defense';
const addition = `  // Cloudflare Pages _redirects Quarantine: /admin and /admin/* strictly serve SPA 404
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const indexPath = path.join(DIST_DIR, 'index.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
    if (fs.existsSync(indexPath)) {
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.end('<!DOCTYPE html><html><body>404 Not Found</body></html>');
    }
    return;
  }

  // Null Byte Defense`;
c = c.replace(target, addition);
fs.writeFileSync('server/index.cjs', c, 'utf-8');
console.log('Successfully patched server/index.cjs');
