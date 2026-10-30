import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 1 - Feature 14: Security Headers & Edge Rules', () => {
  const headersPath = path.resolve('public/_headers');
  const redirectsPath = path.resolve('public/_redirects');

  it('14.1: public/_headers exists and configures global rules for /*', () => {
    assert.ok(fs.existsSync(headersPath), 'Expected public/_headers to exist');
    const content = fs.readFileSync(headersPath, 'utf8');
    assert.includes(content, '/*', 'Expected rules for /* in _headers');
  });

  it('14.2: Enforces X-Content-Type-Options: nosniff against MIME-type sniffing', () => {
    const content = fs.readFileSync(headersPath, 'utf8');
    assert.match(content, /X-Content-Type-Options:\s*nosniff/i, 'Expected X-Content-Type-Options: nosniff header');
  });

  it('14.3: Enforces X-Frame-Options: SAMEORIGIN or CSP frame-ancestors for CMS preview', () => {
    const content = fs.readFileSync(headersPath, 'utf8');
    const hasFrameOptions = /X-Frame-Options:\s*SAMEORIGIN/i.test(content);
    const hasCspFrameAncestors = /frame-ancestors\s+['"]?self['"]?/i.test(content);
    assert.ok(hasFrameOptions || hasCspFrameAncestors, 'Expected X-Frame-Options: SAMEORIGIN or CSP frame-ancestors self');
  });

  it('14.4: Enforces Referrer-Policy: strict-origin-when-cross-origin', () => {
    const content = fs.readFileSync(headersPath, 'utf8');
    assert.match(content, /Referrer-Policy:\s*strict-origin-when-cross-origin/i, 'Expected Referrer-Policy header');
  });

  it('14.5: public/_redirects configures SPA client fallback /* /index.html 200', () => {
    assert.ok(fs.existsSync(redirectsPath), 'Expected public/_redirects to exist');
    const content = fs.readFileSync(redirectsPath, 'utf8');
    assert.match(content, /\/\*\s+\/index\.html\s+200/, 'Expected SPA fallback /* /index.html 200');
  });
});
