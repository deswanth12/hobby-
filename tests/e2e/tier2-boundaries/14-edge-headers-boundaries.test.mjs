import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 2 - Boundaries: Feature 14 (Edge Headers & Redirect Rules)', () => {
  const headersPath = path.resolve('public/_headers');
  const redirectsPath = path.resolve('public/_redirects');

  it('B14.1: Content Security Policy (CSP) restricts script-src and avoids unsafe-eval', () => {
    if (!fs.existsSync(headersPath)) return;
    const content = fs.readFileSync(headersPath, 'utf8');
    
    if (content.includes('Content-Security-Policy:')) {
      assert.notIncludes(content, "'unsafe-eval'", "CSP should avoid 'unsafe-eval' for robust script security");
    }
  });

  it('B14.2: Strict-Transport-Security (HSTS) specifies max-age >= 31536000 and includeSubDomains', () => {
    if (!fs.existsSync(headersPath)) return;
    const content = fs.readFileSync(headersPath, 'utf8');

    if (content.includes('Strict-Transport-Security:')) {
      assert.match(content, /max-age=(?:31536000|[1-9][0-9]{7,})/, 'HSTS max-age should be at least 1 year');
      assert.includes(content, 'includeSubDomains', 'HSTS should include subdomains');
    }
  });

  it('B14.3: Permissions-Policy restricts camera, microphone, and geolocation features', () => {
    if (!fs.existsSync(headersPath)) return;
    const content = fs.readFileSync(headersPath, 'utf8');

    if (content.includes('Permissions-Policy:')) {
      assert.includes(content, 'camera=()', 'Permissions-Policy should disable camera');
      assert.includes(content, 'microphone=()', 'Permissions-Policy should disable microphone');
    }
  });

  it('B14.4: public/_redirects does not shadow /api/* function routes with SPA catch-all', () => {
    if (!fs.existsSync(redirectsPath)) return;
    const content = fs.readFileSync(redirectsPath, 'utf8');

    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
    const spaLineIdx = lines.findIndex(l => l.startsWith('/*') && l.includes('/index.html'));
    
    // If there is an explicit API rule, it must precede the SPA fallback
    const apiLineIdx = lines.findIndex(l => l.startsWith('/api/'));
    if (apiLineIdx !== -1 && spaLineIdx !== -1) {
      assert.ok(apiLineIdx < spaLineIdx, 'API routing rules must precede wildcard /* SPA fallback');
    }
  });

  it('B14.5: Admin console route (/admin/*) specifies no-store, no-cache, or max-age=0 header', () => {
    if (!fs.existsSync(headersPath)) return;
    const content = fs.readFileSync(headersPath, 'utf8');

    if (content.includes('/admin/*')) {
      assert.match(content, /Cache-Control:.*(?:no-cache|no-store|max-age=0)/i, 'Admin routes should disable caching or enforce must-revalidate with max-age=0');
    }
  });

  it('B14.6: vercel.json and server/index.cjs align with public/_headers CSP and avoid unsafe-eval', () => {
    const vercelPath = path.resolve('vercel.json');
    if (fs.existsSync(vercelPath)) {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      const globalHeaderObj = (vercelConfig.headers || []).find(h => h.source === '/(.*)');
      const cspHeader = (globalHeaderObj?.headers || []).find(h => h.key === 'Content-Security-Policy');
      assert.ok(cspHeader, 'vercel.json defines Content-Security-Policy header');
      assert.notIncludes(cspHeader.value, "'unsafe-eval'", "vercel.json CSP must strictly avoid 'unsafe-eval'");
    }

    const serverPath = path.resolve('server/index.cjs');
    if (fs.existsSync(serverPath)) {
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      assert.includes(serverContent, 'Content-Security-Policy', 'server/index.cjs defines Content-Security-Policy');
      assert.notIncludes(serverContent, "'unsafe-eval'", "server/index.cjs CSP must strictly avoid 'unsafe-eval'");
    }
  });

  it('B14.7: Application source code (src/, functions/, server/) has zero eval(), new Function(), or string-based timers', () => {
    const targetDirs = ['src', 'functions', 'server'];
    const extensions = ['.ts', '.tsx', '.js', '.cjs', '.mjs'];

    function scanDir(dir) {
      const fullDir = path.resolve(dir);
      if (!fs.existsSync(fullDir)) return;
      const entries = fs.readdirSync(fullDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(fullDir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
          const code = fs.readFileSync(fullPath, 'utf8');
          // Strip comments before inspection
          const stripped = code
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '');

          // Check 1: Zero eval()
          assert.doesNotMatch(
            stripped,
            /\beval\s*\(/,
            `Prohibited eval() call detected in application source: ${path.relative(process.cwd(), fullPath)}`
          );

          // Check 2: Zero new Function()
          assert.doesNotMatch(
            stripped,
            /new\s+Function\s*\(/,
            `Prohibited new Function() call detected in application source: ${path.relative(process.cwd(), fullPath)}`
          );

          // Check 3: Zero string-based setTimeout or setInterval
          assert.doesNotMatch(
            stripped,
            /(?:setTimeout|setInterval)\s*\(\s*['"`]/,
            `Prohibited string-evaluated timer detected in application source: ${path.relative(process.cwd(), fullPath)}`
          );
        }
      }
    }

    for (const dir of targetDirs) {
      scanDir(dir);
    }
  });

  it('B14.8: Production distribution dist/ and public/ HTML templates contain zero eval or new Function', () => {
    const scanTargets = ['public', 'dist'];
    const extensions = ['.js', '.mjs', '.cjs', '.html'];

    function scanDir(dir) {
      const fullDir = path.resolve(dir);
      if (!fs.existsSync(fullDir)) return;
      const entries = fs.readdirSync(fullDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(fullDir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
          const code = fs.readFileSync(fullPath, 'utf8');
          // Check: Zero \beval\s*\(
          assert.doesNotMatch(
            code,
            /\beval\s*\(/,
            `Prohibited eval() call detected in public/dist bundle: ${path.relative(process.cwd(), fullPath)}`
          );
          // Check: Zero new Function(
          assert.doesNotMatch(
            code,
            /new\s+Function\s*\(/,
            `Prohibited new Function() call detected in public/dist bundle: ${path.relative(process.cwd(), fullPath)}`
          );
        }
      }
    }

    for (const target of scanTargets) {
      scanDir(target);
    }
  });
});

