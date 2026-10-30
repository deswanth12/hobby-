import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';
import { parseFrontmatter } from '../helpers/config-parser.mjs';

describe('Tier 1 - Feature 3: Blog Post Management Schema', () => {
  const configPath = path.resolve('public/admin/config.yml');
  const postsDir = path.resolve('content/posts');

  it('3.1: public/admin/config.yml declares posts collection with folder content/posts', () => {
    assert.ok(fs.existsSync(configPath), 'Expected public/admin/config.yml to exist');
    const raw = fs.readFileSync(configPath, 'utf8');
    assert.match(raw, /name:\s*["']?posts["']?/, 'Config must declare posts collection');
    assert.match(raw, /folder:\s*["']?content\/posts["']?/, 'Posts collection folder must be content/posts');
  });

  it('3.2: Posts collection defines all mandatory fields: title, slug, draft, date, author, excerpt, body', () => {
    const raw = fs.readFileSync(configPath, 'utf8');
    const requiredFields = ['title', 'slug', 'draft', 'date', 'author', 'excerpt', 'body'];
    for (const field of requiredFields) {
      assert.match(raw, new RegExp(`name:\\s*["']?${field}["']?`), `Posts schema must define ${field} field`);
    }
  });

  it('3.3: Posts collection defines metadata fields: authorRole, coverImage, coverImageAlt, tags, seo', () => {
    const raw = fs.readFileSync(configPath, 'utf8');
    const metaFields = ['authorRole', 'coverImage', 'coverImageAlt', 'tags', 'seo'];
    for (const field of metaFields) {
      assert.match(raw, new RegExp(`name:\\s*["']?${field}["']?`), `Posts schema must define ${field} field`);
    }
  });

  it('3.4: Posts collection specifies yaml-frontmatter format and md extension', () => {
    const raw = fs.readFileSync(configPath, 'utf8');
    assert.match(raw, /format:\s*["']?yaml-frontmatter["']?/, 'Posts format must be yaml-frontmatter');
    assert.match(raw, /extension:\s*["']?md["']?/, 'Posts extension must be md');
  });

  it('3.5: Seed blog posts in content/posts/ conform to schema interface contract', () => {
    assert.ok(fs.existsSync(postsDir), 'Expected content/posts directory to exist');
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    assert.ok(files.length > 0, 'Expected at least one seed blog post in content/posts/');

    for (const file of files) {
      const fullPath = path.join(postsDir, file);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = parseFrontmatter(raw);

      assert.ok(data.title, `Post ${file} must have a title`);
      assert.ok(data.slug, `Post ${file} must have a slug`);
      assert.strictEqual(typeof data.draft, 'boolean', `Post ${file} draft must be boolean`);
      assert.ok(data.date, `Post ${file} must have a date`);
      assert.ok(data.author, `Post ${file} must have an author`);
      assert.ok(data.excerpt, `Post ${file} must have an excerpt`);
      assert.ok(content && content.trim().length > 0, `Post ${file} must have non-empty markdown body`);
    }
  });
});
