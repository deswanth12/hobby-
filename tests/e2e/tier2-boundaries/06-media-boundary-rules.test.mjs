import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 2 - Boundaries: Feature 6 (Media Upload Rules)', () => {
  const MAX_BYTES = 2097152; // 2MB
  const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

  const validateUpload = (file) => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return { valid: false, error: 'Disallowed file format' };
    }
    if (file.size <= 0) {
      return { valid: false, error: 'Zero-byte empty file' };
    }
    if (file.size > MAX_BYTES) {
      return { valid: false, error: 'File exceeds 2MB limit' };
    }
    if (ext === '.svg' && file.content && (file.content.includes('<script') || file.content.includes('onload='))) {
      return { valid: false, error: 'Malicious SVG payload detected' };
    }
    return { valid: true };
  };

  it('B6.1: File size > 2MB (2097153 bytes) is rejected by media validator', () => {
    const result = validateUpload({ name: 'banner.webp', size: 2097153 });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, 'File exceeds 2MB limit');
  });

  it('B6.2: File size exactly 2MB (2097152 bytes) is accepted', () => {
    const result = validateUpload({ name: 'banner.webp', size: 2097152 });
    assert.strictEqual(result.valid, true);
  });

  it('B6.3: Zero-byte empty file upload is rejected', () => {
    const result = validateUpload({ name: 'empty.png', size: 0 });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, 'Zero-byte empty file');
  });

  it('B6.4: Forbidden executable and script extensions are rejected', () => {
    const dangerousFiles = ['malware.exe', 'script.js', 'shell.sh', 'backdoor.php', 'exploit.py'];
    for (const name of dangerousFiles) {
      const result = validateUpload({ name, size: 5000 });
      assert.strictEqual(result.valid, false);
      assert.strictEqual(result.error, 'Disallowed file format');
    }
  });

  it('B6.5: Malformed SVG containing script tags or event handlers is blocked', () => {
    const maliciousSvg = {
      name: 'vector.svg',
      size: 1500,
      content: '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
    };
    const result = validateUpload(maliciousSvg);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, 'Malicious SVG payload detected');
  });
});
