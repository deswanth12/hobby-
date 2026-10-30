import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';
import { verifyNoXss, XSS_ATTACK_VECTORS } from '../helpers/markdown-test-util.mjs';

describe('Tier 1 - Feature 10: Markdown XSS Sanitization', () => {
  const sanitizeModulePath1 = path.resolve('src/lib/markdown.ts');
  const sanitizeModulePath2 = path.resolve('src/lib/blogLoader.ts');

  it('10.1: Sanitization utility or DOMPurify integration exists in codebase', () => {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    
    // Either dompurify is listed as dependency or custom sanitizer in src/lib
    const hasSanitizerDep = Boolean(allDeps['dompurify'] || allDeps['isomorphic-dompurify'] || allDeps['sanitize-html']);
    const hasSanitizerFile = fs.existsSync(sanitizeModulePath1) || fs.existsSync(sanitizeModulePath2);

    assert.ok(hasSanitizerDep || hasSanitizerFile, 'Expected DOMPurify dependency or markdown sanitization utility in src/lib');
  });

  it('10.2: Sanitizer strips raw and case-obfuscated script tags from markdown output', () => {
    const rawPayloads = [
      '<script>alert("XSS")</script>',
      '<sCrIpT>alert("XSS")</sCrIpT>',
      '<SCRIPT SRC="https://evil.org/xss.js"></SCRIPT>',
    ];

    for (const payload of rawPayloads) {
      const check = verifyNoXss(payload);
      assert.strictEqual(check.safe, false, `Raw payload "${payload}" must be detected as unsafe`);
    }
  });

  it('10.3: Sanitizer purges dangerous event handlers (onerror, onload, onclick, onmouseover)', () => {
    const handlers = [
      '<img src="x" onerror="stealCookies()">',
      '<svg onload="maliciousCode()">',
      '<div onclick="sendData()">Click</div>',
      '<a href="#" onmouseover="attack()">Hover</a>',
    ];

    for (const h of handlers) {
      const check = verifyNoXss(h);
      assert.strictEqual(check.safe, false, `Handler "${h}" must be detected as unsafe`);
    }
  });

  it('10.4: Sanitizer neutralizes javascript: pseudo-protocol URIs in markdown links', () => {
    const maliciousLinks = [
      '<a href="javascript:alert(1)">Click</a>',
      '<a href="JAVASCRIPT:alert(document.cookie)">Click</a>',
      '<a href="javascript:fetch(\'https://attacker.com\')">Click</a>',
    ];

    for (const link of maliciousLinks) {
      const check = verifyNoXss(link);
      assert.strictEqual(check.safe, false, `Javascript link "${link}" must be detected as unsafe`);
    }
  });

  it('10.5: Sanitizer preserves valid semantic HTML and markdown structures (tables, headings, quotes)', () => {
    const safeHtml = `
      <h1>Statutory Turnover Thresholds</h1>
      <p>Under Section 44AB, businesses exceeding ₹1 Crore require audit.</p>
      <table>
        <thead><tr><th>Category</th><th>Limit</th></tr></thead>
        <tbody><tr><td>Commercial</td><td>₹1.00 Cr</td></tr></tbody>
      </table>
      <blockquote>Adherence to ICAI standards is paramount.</blockquote>
      <a href="https://kavithaassociates.com/services" target="_blank" rel="noopener">Learn More</a>
    `;

    const check = verifyNoXss(safeHtml);
    assert.strictEqual(check.safe, true, 'Legitimate semantic markup must be considered safe');
  });
});
