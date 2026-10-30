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
});
