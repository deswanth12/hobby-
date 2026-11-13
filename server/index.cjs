const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleApiRequest } = require('./apiRouter.cjs');
const { readDb } = require('./db.cjs');

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

const CSP_POLICY = "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://raw.githubusercontent.com https://avatars.githubusercontent.com https://*.google.com https://*.googleapis.com https://*.gstatic.com; connect-src 'self' https://api.github.com https://github.com https://*.supabase.co wss://*.supabase.co; frame-src 'self' https://www.google.com https://maps.google.com; frame-ancestors 'self'; worker-src 'self' blob:; child-src 'self' blob:;";

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': CSP_POLICY
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
    res.writeHead(400, {
      'Content-Type': 'text/plain',
      ...SECURITY_HEADERS
    });
    res.end('Bad Request: Malformed URI encoding.');
    return;
  }

  // Cloudflare Pages _redirects Quarantine: /admin and /admin/* strictly serve SPA 404
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const indexPath = path.join(DIST_DIR, 'index.html');
    res.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8',
      ...SECURITY_HEADERS
    });
    if (fs.existsSync(indexPath)) {
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.end('<!DOCTYPE html><html><body>404 Not Found</body></html>');
    }
    return;
  }

  // Dynamic Services Route Resolution (301 Redirects & 404 for Draft/Deleted)
  if (pathname.startsWith('/services/') && pathname !== '/services/') {
    const subSlug = pathname.replace('/services/', '').replace(/\/$/, '').toLowerCase().trim();
    if (subSlug) {
      const db = readDb();
      // 1. Check for renamed slug redirect
      if (db.slugRedirects && db.slugRedirects[subSlug]) {
        const target = `/services/${db.slugRedirects[subSlug]}`;
        res.writeHead(301, {
          'Location': target,
          'Content-Type': 'text/plain; charset=utf-8',
          ...SECURITY_HEADERS
        });
        res.end(`Moved Permanently: Redirecting to ${target}`);
        return;
      }

      // 2. Check Static Services
      const STATIC_SERVICES = [
        'audit-assurance',
        'gst-consultant-tirupati',
        'income-tax-consultant-tirupati',
        'company-registration-tirupati',
        'virtual-cfo-tirupati',
        'rera-consultant-tirupati'
      ];

      const isStatic = STATIC_SERVICES.includes(subSlug);
      const isDeleted = (db.deletedServices || []).some(s => s.id === subSlug);
      const serviceOverride = (db.services || []).find(s => s.id === subSlug);
      const isDraft = serviceOverride?.status === 'draft';

      if (isDeleted || isDraft || (!isStatic && !serviceOverride)) {
        const indexPath = path.join(DIST_DIR, 'index.html');
        res.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8',
          ...SECURITY_HEADERS
        });
        if (fs.existsSync(indexPath)) {
          fs.createReadStream(indexPath).pipe(res);
        } else {
          res.end('<!DOCTYPE html><html><body>404 Not Found</body></html>');
        }
        return;
      }
    }
  }

  // Dynamic Blog Route Resolution (404 for Draft/Missing Articles)
  if (pathname.startsWith('/blog/') && pathname !== '/blog/') {
    const postSlug = pathname.replace('/blog/', '').replace(/\/$/, '').toLowerCase().trim();
    if (postSlug) {
      // 1. Whitelist slug characters to prevent path traversal attempts
      if (!/^[a-z0-9-]+$/.test(postSlug)) {
        res.writeHead(400, {
          'Content-Type': 'text/plain',
          ...SECURITY_HEADERS
        });
        res.end('Bad Request: Invalid blog slug format.');
        return;
      }

      const postsDir = path.resolve(__dirname, '..', 'content', 'posts');
      const postFile = path.resolve(postsDir, `${postSlug}.md`);

      // Verify resolved path stays strictly within content/posts
      if (!postFile.startsWith(postsDir + path.sep)) {
        res.writeHead(403, {
          'Content-Type': 'text/plain',
          ...SECURITY_HEADERS
        });
        res.end('Forbidden: Path traversal request blocked.');
        return;
      }

      let isPublished = false;
      if (fs.existsSync(postFile)) {
        try {
          const raw = fs.readFileSync(postFile, 'utf8');
          const isDraftMatch = /draft:\s*true/i.test(raw);
          isPublished = !isDraftMatch;
        } catch {
          isPublished = false;
        }
      }

      // Also verify dynamic database posts if not present as disk markdown
      if (!isPublished) {
        try {
          const { readDb } = require('./db.cjs');
          const db = readDb();
          const matchPost = (db.posts || []).find(p => p.slug && p.slug.toLowerCase().trim() === postSlug);
          if (matchPost && !matchPost.draft) {
            isPublished = true;
          }
        } catch {
          // ignore
        }
      }

      if (!isPublished) {
        const indexPath = path.join(DIST_DIR, 'index.html');
        res.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8',
          ...SECURITY_HEADERS
        });
        if (fs.existsSync(indexPath)) {
          fs.createReadStream(indexPath).pipe(res);
        } else {
          res.end('<!DOCTYPE html><html><body>404 Not Found</body></html>');
        }
        return;
      }
    }
  }

  // Null Byte Defense
  if (pathname.includes('\0')) {
    res.writeHead(400, {
      'Content-Type': 'text/plain',
      ...SECURITY_HEADERS
    });
    res.end('Bad Request: Null byte prohibited.');
    return;
  }

  // Path Traversal Defense: Normalize and verify destination remains strictly within DIST_DIR
  const normalizedPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.resolve(DIST_DIR, '.' + normalizedPath);
  const resolvedDist = path.resolve(DIST_DIR);

  if (filePath !== resolvedDist && !filePath.startsWith(resolvedDist + path.sep)) {
    res.writeHead(403, {
      'Content-Type': 'text/plain',
      ...SECURITY_HEADERS
    });
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
    let cacheControl = 'public, max-age=0, must-revalidate';
    if (pathname.startsWith('/assets/')) {
      cacheControl = 'public, max-age=31536000, immutable';
    } else if (pathname === '/robots.txt') {
      cacheControl = 'public, max-age=86400, must-revalidate';
    } else if (pathname === '/sitemap.xml') {
      cacheControl = 'public, max-age=3600, must-revalidate';
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
      ...SECURITY_HEADERS
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain',
      ...SECURITY_HEADERS
    });
    res.end('Not found. Please build the client first with `npm run build`.');
  }
});

server.listen(PORT, () => {
  console.log(`[Kavitha & Associates] Production Server running at http://localhost:${PORT}`);
});
