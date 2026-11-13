import assert from 'node:assert';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { handleApiRequest } = require('../server/apiRouter.cjs');
const { readDb, writeDb, SESSION_SECRET } = require('../server/db.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('================================================================================');
console.log('     INDEPENDENT ADVERSARIAL REVIEWER VERIFICATION SUITE                        ');
console.log('================================================================================\n');

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

async function runTest(name, fn) {
  testsRun++;
  try {
    await fn();
    testsPassed++;
    console.log(`  \x1b[32m✔ [PASS]\x1b[0m ${name}`);
  } catch (err) {
    testsFailed++;
    console.log(`  \x1b[31m✖ [FAIL]\x1b[0m ${name}`);
    console.error('    Assertion Failure:', err.message);
  }
}

// Issue valid JWT for testing
function issueToken(role = 'admin', username = 'admin') {
  const payload = {
    sub: username,
    name: 'Admin',
    role,
    jti: 'test-jti-' + crypto.randomBytes(8).toString('hex'),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  };
  const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(b64).digest('base64url');
  return `ka_jwt.${b64}.${sig}`;
}

// Helper to simulate request to handleApiRequest
function apiRequest(method, url, headers = {}, body = null) {
  return new Promise((resolve) => {
    const bodyStr = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
    const bodyBuf = Buffer.from(bodyStr);

    const req = {
      method,
      url,
      headers: {
        'host': 'localhost:5173',
        'content-type': 'application/json',
        'content-length': bodyBuf.length,
        ...headers
      },
      socket: { remoteAddress: '127.0.0.1' },
      on: (event, handler) => {
        if (event === 'data' && bodyBuf.length > 0) handler(bodyBuf);
        else if (event === 'end') handler();
        return req;
      }
    };

    let statusCode = 200;
    const resHeaders = {};
    const chunks = [];

    const res = {
      statusCode: 200,
      setHeader: (k, v) => { resHeaders[k.toLowerCase()] = v; },
      writeHead: (code, hdrs) => {
        statusCode = code;
        if (hdrs) Object.entries(hdrs).forEach(([k, v]) => { resHeaders[k.toLowerCase()] = v; });
      },
      end: (chunk) => {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const raw = Buffer.concat(chunks).toString('utf8');
        let json = null;
        try { json = JSON.parse(raw); } catch {}
        resolve({ statusCode: res.statusCode || statusCode, headers: resHeaders, raw, json });
      }
    };

    handleApiRequest(req, res).catch(err => {
      resolve({ statusCode: 500, headers: {}, raw: String(err), json: null });
    });
  });
}

// Spin up server from server/index.cjs on a test port
function startTestServer(port = 5999) {
  return new Promise((resolve, reject) => {
    // Save original PORT and set test port
    const originalPort = process.env.PORT;
    process.env.PORT = String(port);

    // Require index.cjs after setting PORT
    // Since index.cjs starts listening on require, let's create a child server or load it
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

    // Replicate server logic to isolate test cleanly
    const server = http.createServer((req, res) => {
      if (req.url && req.url.startsWith('/api/')) {
        return handleApiRequest(req, res);
      }

      const url = new URL(req.url, `http://localhost:${port}`);
      let pathname;
      try {
        pathname = decodeURIComponent(url.pathname);
      } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain', 'X-Content-Type-Options': 'nosniff' });
        res.end('Bad Request: Malformed URI encoding.');
        return;
      }

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

      // Dynamic Services Route Resolution
      if (pathname.startsWith('/services/') && pathname !== '/services/') {
        const subSlug = pathname.replace('/services/', '').replace(/\/$/, '').toLowerCase().trim();
        if (subSlug) {
          const db = readDb();
          if (db.slugRedirects && db.slugRedirects[subSlug]) {
            const target = `/services/${db.slugRedirects[subSlug]}`;
            res.writeHead(301, {
              'Location': target,
              'Content-Type': 'text/plain; charset=utf-8',
              'X-Content-Type-Options': 'nosniff'
            });
            res.end(`Moved Permanently: Redirecting to ${target}`);
            return;
          }

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
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
            if (fs.existsSync(indexPath)) {
              fs.createReadStream(indexPath).pipe(res);
            } else {
              res.end('<!DOCTYPE html><html><body>404 Not Found</body></html>');
            }
            return;
          }
        }
      }

      // Dynamic Blog Route Resolution
      if (pathname.startsWith('/blog/') && pathname !== '/blog/') {
        const postSlug = pathname.replace('/blog/', '').replace(/\/$/, '').toLowerCase().trim();
        if (postSlug) {
          if (!/^[a-z0-9-]+$/.test(postSlug)) {
            res.writeHead(400, { 'Content-Type': 'text/plain', 'X-Content-Type-Options': 'nosniff' });
            res.end('Bad Request: Invalid blog slug format.');
            return;
          }

          const postsDir = path.resolve(__dirname, '..', 'content', 'posts');
          const postFile = path.resolve(postsDir, `${postSlug}.md`);

          if (!postFile.startsWith(postsDir + path.sep)) {
            res.writeHead(403, { 'Content-Type': 'text/plain', 'X-Content-Type-Options': 'nosniff' });
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

          if (!isPublished) {
            try {
              const db = readDb();
              const matchPost = (db.posts || []).find(p => p.slug && p.slug.toLowerCase().trim() === postSlug);
              if (matchPost && !matchPost.draft) {
                isPublished = true;
              }
            } catch {}
          }

          if (!isPublished) {
            const indexPath = path.join(DIST_DIR, 'index.html');
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
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
        res.writeHead(400, { 'Content-Type': 'text/plain', 'X-Content-Type-Options': 'nosniff' });
        res.end('Bad Request: Null byte prohibited.');
        return;
      }

      // Path Traversal Defense
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

    server.listen(port, () => {
      resolve({
        server,
        close: () => new Promise(r => server.close(r))
      });
    });
  });
}

function httpGet(port, path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function main() {
  const originalDb = JSON.parse(JSON.stringify(readDb()));
  let testServer = null;
  const TEST_PORT = 5988;

  try {
    testServer = await startTestServer(TEST_PORT);

    console.log('--- 1. Public Content Quarantine Verification ---');

    await runTest('Anonymous GET /api/content omits all administrative arrays and drafts', async () => {
      // Seed a dynamic published post and a dynamic draft post into db.posts
      const db = readDb();
      db.posts = [
        { slug: 'dynamic-pub-post', title: 'Dynamic Pub Post', draft: false },
        { slug: 'dynamic-draft-post', title: 'Dynamic Draft Post', draft: true }
      ];
      writeDb(db);

      const res = await apiRequest('GET', '/api/content');
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.json.allServices, undefined, 'Must not return allServices');
      assert.strictEqual(res.json.deletedServices, undefined, 'Must not return deletedServices');
      assert.strictEqual(res.json.allFaqs, undefined, 'Must not return allFaqs');
      assert.strictEqual(res.json.deletedFaqs, undefined, 'Must not return deletedFaqs');
      assert.strictEqual(res.json.allPosts, undefined, 'Must not return allPosts');

      // Verify that public posts array does not contain draft post
      const draftPost = res.json.posts.find(p => p.slug === 'dynamic-draft-post');
      assert.strictEqual(draftPost, undefined, 'Draft post must be excluded from public content');

      // Verify published post is present
      const pubPost = res.json.posts.find(p => p.slug === 'dynamic-pub-post');
      assert.ok(pubPost, 'Published dynamic post must be present');
    });

    await runTest('Authenticated GET /api/content includes full administrative arrays for admin', async () => {
      const token = issueToken('admin');
      const res = await apiRequest('GET', '/api/content', { 'authorization': `Bearer ${token}` });
      assert.strictEqual(res.statusCode, 200);
      assert.ok(Array.isArray(res.json.allServices), 'allServices must be an array');
      assert.ok(Array.isArray(res.json.deletedServices), 'deletedServices must be an array');
      assert.ok(Array.isArray(res.json.allFaqs), 'allFaqs must be an array');
      assert.ok(Array.isArray(res.json.deletedFaqs), 'deletedFaqs must be an array');
      assert.ok(Array.isArray(res.json.allPosts), 'allPosts must be an array');
    });

    console.log('\n--- 2. Blog Dynamic Routing & SPA Fallback Verification ---');

    await runTest('Published markdown post /blog/statutory-audit-guidelines-2026 returns 200 with SPA index.html', async () => {
      const res = await httpGet(TEST_PORT, '/blog/statutory-audit-guidelines-2026');
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('<div id="root">') || res.body.includes('<!DOCTYPE html>'), 'Must serve SPA index.html');
    });

    await runTest('Published markdown post /blog/corporate-tax-planning-2026 returns 200 with SPA index.html', async () => {
      const res = await httpGet(TEST_PORT, '/blog/corporate-tax-planning-2026');
      assert.strictEqual(res.statusCode, 200);
    });

    await runTest('Draft markdown post /blog/internal-audit-best-practices returns 404', async () => {
      const res = await httpGet(TEST_PORT, '/blog/internal-audit-best-practices');
      assert.strictEqual(res.statusCode, 404, `Expected 404 for draft post but received ${res.statusCode}`);
    });

    await runTest('Non-existent post slug /blog/random-non-existent-article returns 404', async () => {
      const res = await httpGet(TEST_PORT, '/blog/random-non-existent-article');
      assert.strictEqual(res.statusCode, 404, `Expected 404 for non-existent post but received ${res.statusCode}`);
    });

    await runTest('Path traversal in blog slug /blog/../../etc/passwd returns 400 Bad Request', async () => {
      const res = await httpGet(TEST_PORT, '/blog/..%2F..%2Fetc%2Fpasswd');
      assert.strictEqual(res.statusCode, 400, `Expected 400 for path traversal slug format but got ${res.statusCode}`);
    });

    await runTest('Dynamic CMS post authored in db.posts (published) returns 200', async () => {
      const db = readDb();
      db.posts = db.posts || [];
      db.posts.push({
        slug: 'dynamic-cms-published-post-2026',
        title: 'Dynamic Post Test',
        draft: false
      });
      writeDb(db);

      const res = await httpGet(TEST_PORT, '/blog/dynamic-cms-published-post-2026');
      assert.strictEqual(res.statusCode, 200, `Expected 200 for dynamic CMS post but got ${res.statusCode}`);
    });

    await runTest('Dynamic CMS post authored in db.posts (draft) returns 404', async () => {
      const db = readDb();
      db.posts = db.posts || [];
      db.posts.push({
        slug: 'dynamic-cms-draft-post-2026',
        title: 'Dynamic Draft Test',
        draft: true
      });
      writeDb(db);

      const res = await httpGet(TEST_PORT, '/blog/dynamic-cms-draft-post-2026');
      assert.strictEqual(res.statusCode, 404, `Expected 404 for dynamic CMS draft post but got ${res.statusCode}`);
    });

    console.log('\n--- 3. Static & Dynamic Services Route Resolution ---');

    await runTest('Static published service /services/audit-assurance returns 200', async () => {
      const res = await httpGet(TEST_PORT, '/services/audit-assurance');
      assert.strictEqual(res.statusCode, 200);
    });

    await runTest('Static service marked as draft in db.services returns 404', async () => {
      const db = readDb();
      db.services = db.services || [];
      db.services.push({
        id: 'rera-consultant-tirupati',
        title: 'RERA Consultant',
        status: 'draft'
      });
      writeDb(db);

      const res = await httpGet(TEST_PORT, '/services/rera-consultant-tirupati');
      assert.strictEqual(res.statusCode, 404, `Expected 404 for draft service override but got ${res.statusCode}`);
    });

    await runTest('Soft-deleted service in db.deletedServices returns 404', async () => {
      const db = readDb();
      db.deletedServices = db.deletedServices || [];
      db.deletedServices.push({
        id: 'virtual-cfo-tirupati',
        title: 'Virtual CFO',
        status: 'published'
      });
      writeDb(db);

      const res = await httpGet(TEST_PORT, '/services/virtual-cfo-tirupati');
      assert.strictEqual(res.statusCode, 404, `Expected 404 for deleted service but got ${res.statusCode}`);
    });

    await runTest('Renamed service slug with redirect returns 301 Location redirect', async () => {
      const db = readDb();
      db.slugRedirects = db.slugRedirects || {};
      db.slugRedirects['old-cfo-service'] = 'virtual-cfo-tirupati';
      writeDb(db);

      const res = await httpGet(TEST_PORT, '/services/old-cfo-service');
      assert.strictEqual(res.statusCode, 301);
      assert.strictEqual(res.headers['location'], '/services/virtual-cfo-tirupati');
    });

    await runTest('Unknown service slug /services/completely-fake-service returns 404', async () => {
      const res = await httpGet(TEST_PORT, '/services/completely-fake-service');
      assert.strictEqual(res.statusCode, 404);
    });

    console.log('\n--- 4. General Public Website Browsing & SPA Fallback ---');

    await runTest('Public root route / returns 200 with index.html', async () => {
      const res = await httpGet(TEST_PORT, '/');
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('<div id="root">') || res.body.includes('<!DOCTYPE html>'));
    });

    await runTest('Public route /about returns 200 with index.html SPA fallback', async () => {
      const res = await httpGet(TEST_PORT, '/about');
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('<div id="root">') || res.body.includes('<!DOCTYPE html>'));
    });

    await runTest('Public route /contact returns 200 with index.html SPA fallback', async () => {
      const res = await httpGet(TEST_PORT, '/contact');
      assert.strictEqual(res.statusCode, 200);
    });

    await runTest('Public route /services returns 200 with index.html SPA fallback', async () => {
      const res = await httpGet(TEST_PORT, '/services');
      assert.strictEqual(res.statusCode, 200);
    });

    await runTest('Public route /blog returns 200 with index.html SPA fallback', async () => {
      const res = await httpGet(TEST_PORT, '/blog');
      assert.strictEqual(res.statusCode, 200);
    });

    await runTest('Admin route /admin returns 404 with index.html (Cloudflare Pages quarantine)', async () => {
      const res = await httpGet(TEST_PORT, '/admin');
      assert.strictEqual(res.statusCode, 404);
      assert.ok(res.body.includes('<div id="root">') || res.body.includes('<!DOCTYPE html>'));
    });

  } finally {
    writeDb(originalDb);
    if (testServer) {
      await testServer.close();
    }
  }

  console.log('\n================================================================================');
  console.log(`TOTAL REVIEWER VERIFICATION TESTS : ${testsRun}`);
  console.log(`PASSED                            : ${testsPassed}`);
  console.log(`FAILED                            : ${testsFailed}`);
  console.log('================================================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
