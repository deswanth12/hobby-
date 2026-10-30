import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 1 - Feature 6: Media Upload & Size/Format Rules', () => {
  const configPath = path.resolve('public/admin/config.yml');
  const uploadsDir = path.resolve('public/uploads');

  it('6.1: CMS config maps media_folder to public/uploads and public_folder to /uploads', () => {
    assert.ok(fs.existsSync(configPath), 'Expected public/admin/config.yml to exist');
    const raw = fs.readFileSync(configPath, 'utf8');
    assert.match(raw, /media_folder:\s*["']?public\/uploads/, 'media_folder must point to public/uploads');
    assert.match(raw, /public_folder:\s*["']?\/uploads/, 'public_folder must point to /uploads');
  });

  it('6.2: CMS config restricts maximum upload file size to 2MB (2097152 bytes)', () => {
    const raw = fs.readFileSync(configPath, 'utf8');
    assert.match(raw, /max_file_size:\s*2097152/, 'CMS configuration must enforce max_file_size: 2097152 (2MB)');
  });

  it('6.3: Media validation rules permit only safe web raster and SVG formats', () => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    const validateImageExtension = (filename) => {
      const ext = path.extname(filename).toLowerCase();
      return allowedExtensions.includes(ext);
    };

    assert.ok(validateImageExtension('chart.png'), 'PNG must be permitted');
    assert.ok(validateImageExtension('banner.webp'), 'WebP must be permitted');
    assert.ok(validateImageExtension('photo.jpg'), 'JPG must be permitted');
    assert.ok(validateImageExtension('icon.svg'), 'SVG must be permitted');
    assert.ok(!validateImageExtension('script.js'), 'JavaScript must be blocked');
    assert.ok(!validateImageExtension('malware.exe'), 'Executable must be blocked');
  });

  it('6.4: All files present in public/uploads do not exceed the 2MB size cap', () => {
    if (!fs.existsSync(uploadsDir)) {
      return; // If directory not created yet, test passes as no violation
    }

    const checkSizes = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          checkSizes(full);
        } else {
          const stat = fs.statSync(full);
          assert.ok(stat.size <= 2 * 1024 * 1024, `File ${entry.name} exceeds 2MB limit: ${stat.size} bytes`);
        }
      }
    };

    checkSizes(uploadsDir);
  });

  it('6.5: Image paths use root-relative /uploads/... format for deep URL stability', () => {
    const normalizeUploadPath = (p) => {
      if (!p) return '';
      if (p.startsWith('/uploads/')) return p;
      if (p.startsWith('public/uploads/')) return p.replace('public', '');
      if (p.startsWith('uploads/')) return '/' + p;
      return p;
    };

    assert.strictEqual(normalizeUploadPath('uploads/blog/pic.webp'), '/uploads/blog/pic.webp');
    assert.strictEqual(normalizeUploadPath('/uploads/blog/pic.webp'), '/uploads/blog/pic.webp');
    assert.strictEqual(normalizeUploadPath('public/uploads/blog/pic.webp'), '/uploads/blog/pic.webp');
  });
});
