import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';
import { parseFrontmatter } from '../helpers/config-parser.mjs';

describe('Tier 1 - Feature 4: Duplicate Slug & URL Validation', () => {
  const configPath = path.resolve('public/admin/config.yml');
  const postsDir = path.resolve('content/posts');

  it('4.1: CMS config enforces lowercase alphanumeric hyphen slug pattern', () => {
    assert.ok(fs.existsSync(configPath), 'Expected public/admin/config.yml to exist');
    const raw = fs.readFileSync(configPath, 'utf8');
    assert.includes(raw, 'pattern:', 'Expected regex pattern rule for slug field');
    assert.match(raw, /\^[a-z0-9]+(?:\-[a-z0-9]+)\*\$/, 'Slug pattern must enforce ^[a-z0-9]+(?:-[a-z0-9]+)*$');
  });

  it('4.2: All existing markdown posts have globally unique slugs', () => {
    assert.ok(fs.existsSync(postsDir), 'Expected content/posts to exist');
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    const slugMap = new Map();

    for (const file of files) {
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const { data } = parseFrontmatter(raw);
      const slug = data.slug;

      assert.ok(slug, `Post ${file} is missing slug`);
      assert.ok(!slugMap.has(slug), `Duplicate slug detected: "${slug}" found in both ${slugMap.get(slug)} and ${file}`);
      slugMap.set(slug, file);
    }
  });

  it('4.3: Post slug exactly matches file basename (<slug>.md)', () => {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const { data } = parseFrontmatter(raw);
      const expectedFilename = `${data.slug}.md`;
      assert.strictEqual(file, expectedFilename, `File name ${file} must match frontmatter slug ${data.slug}`);
    }
  });

  it('4.4: Slug uniqueness validation algorithm reliably detects collisions', () => {
    const checkUniqueness = (posts) => {
      const seen = new Set();
      const duplicates = [];
      for (const p of posts) {
        if (seen.has(p.slug)) duplicates.push(p.slug);
        seen.add(p.slug);
      }
      return duplicates;
    };

    const validList = [{ slug: 'tax-guide-1' }, { slug: 'gst-updates' }];
    assert.deepStrictEqual(checkUniqueness(validList), [], 'Valid list must have 0 duplicates');

    const collidingList = [{ slug: 'tax-guide' }, { slug: 'tax-guide' }];
    assert.deepStrictEqual(checkUniqueness(collidingList), ['tax-guide'], 'Colliding list must return duplicate slug');
  });

  it('4.5: Slug maps cleanly to canonical URL format /blog/:slug', () => {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const { data } = parseFrontmatter(raw);
      const canonicalPath = `/blog/${data.slug}`;
      assert.match(canonicalPath, /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/, `Canonical path ${canonicalPath} must be valid`);
    }
  });
});
