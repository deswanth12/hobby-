import fs from 'fs';
import path from 'path';

console.log('--- Deep Hallmark Polish Engine Starting ---');

// 1. First, deeply clean src/index.css so that all colors reference CSS variables
{
  const cssPath = 'c:/kavitha ca/src/index.css';
  let css = fs.readFileSync(cssPath, 'utf8');

  // Replace all remaining hex literals with tokens
  css = css.replace(/#153F32/g, 'var(--color-forest)');
  css = css.replace(/#102D25/g, 'var(--color-deep)');
  css = css.replace(/#0A2F24/g, 'var(--color-chambers)');
  css = css.replace(/#0F3E2E/g, 'var(--color-darkgreen)');
  css = css.replace(/#F5F1E8/g, 'var(--color-ivory)');
  css = css.replace(/#C3A66B/g, 'var(--color-gold)');
  css = css.replace(/#C5A059/g, 'var(--color-brightgold)');
  css = css.replace(/#252B27/g, 'var(--color-charcoal)');
  css = css.replace(/#747A73/g, 'var(--color-muted)');
  css = css.replace(/#E5E1D8/g, 'var(--color-border)');
  css = css.replace(/#EDE8DF/g, 'var(--color-surface)');
  css = css.replace(/#FFFFFF/g, 'var(--color-tintedwhite)');

  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('✓ src/index.css hex literals replaced with tokens');
}

// 2. Scan all .tsx and .ts files in src
function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allTsxFiles = walkDir('c:/kavitha ca/src');
console.log(`Found ${allTsxFiles.length} TypeScript files to polish.`);

let totalReplacements = 0;

for (const filePath of allTsxFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace arbitrary Tailwind hex classes with semantic brand classes
  content = content.replace(/bg-\[#0A2F24\]/g, 'bg-brand-chambers');
  content = content.replace(/text-\[#0A2F24\]/g, 'text-brand-chambers');
  content = content.replace(/border-\[#0A2F24\]/g, 'border-brand-chambers');

  content = content.replace(/bg-\[#0F3E2E\]/g, 'bg-brand-darkgreen');
  content = content.replace(/text-\[#0F3E2E\]/g, 'text-brand-darkgreen');
  content = content.replace(/border-\[#0F3E2E\]/g, 'border-brand-darkgreen');
  content = content.replace(/ring-\[#0F3E2E\]/g, 'ring-brand-darkgreen');

  content = content.replace(/bg-\[#102D25\]/g, 'bg-brand-deep');
  content = content.replace(/text-\[#102D25\]/g, 'text-brand-deep');
  content = content.replace(/border-\[#102D25\]/g, 'border-brand-deep');

  content = content.replace(/bg-\[#153F32\]/g, 'bg-brand-forest');
  content = content.replace(/text-\[#153F32\]/g, 'text-brand-forest');
  content = content.replace(/border-\[#153F32\]/g, 'border-brand-forest');

  content = content.replace(/bg-\[#C5A059\]/g, 'bg-brand-brightgold');
  content = content.replace(/text-\[#C5A059\]/g, 'text-brand-brightgold');
  content = content.replace(/border-\[#C5A059\]/g, 'border-brand-brightgold');

  content = content.replace(/bg-\[#C3A66B\]/g, 'bg-brand-gold');
  content = content.replace(/text-\[#C3A66B\]/g, 'text-brand-gold');
  content = content.replace(/border-\[#C3A66B\]/g, 'border-brand-gold');

  content = content.replace(/bg-\[#F5F1E8\]/g, 'bg-brand-ivory');
  content = content.replace(/text-\[#F5F1E8\]/g, 'text-brand-ivory');
  content = content.replace(/border-\[#F5F1E8\]/g, 'border-brand-ivory');

  content = content.replace(/bg-\[#EDE8DF\]/g, 'bg-brand-surface');
  content = content.replace(/text-\[#EDE8DF\]/g, 'text-brand-surface');
  content = content.replace(/border-\[#EDE8DF\]/g, 'border-brand-surface');

  content = content.replace(/bg-\[#252B27\]/g, 'bg-brand-charcoal');
  content = content.replace(/text-\[#252B27\]/g, 'text-brand-charcoal');

  content = content.replace(/text-\[#747A73\]/g, 'text-brand-muted');

  content = content.replace(/bg-\[#0A241D\]/g, 'bg-brand-chambers');
  content = content.replace(/hover:bg-\[#12382C\]/g, 'hover:bg-brand-deep');
  content = content.replace(/bg-\[#25D366\]/g, 'bg-emerald-500');

  // Replace transition-all on interactive elements
  content = content.replace(/transition-all shadow-xs btn-tactile/g, 'transition-colors duration-200 shadow-xs btn-tactile');
  content = content.replace(/transition-all shadow-sm btn-tactile/g, 'transition-colors duration-200 shadow-sm btn-tactile');
  content = content.replace(/transition-all shadow-md btn-tactile/g, 'transition-colors duration-200 shadow-md btn-tactile');
  content = content.replace(/transition-all shadow-subtle/g, 'transition-colors duration-200 shadow-subtle');
  content = content.replace(/transition-all btn-tactile/g, 'transition-colors duration-200 btn-tactile');

  // Replace tracked caps on small badges
  content = content.replace(/uppercase tracking-wider text-xs/g, 'text-xs font-semibold');
  content = content.replace(/uppercase tracking-wider text-\[10px\]/g, 'text-[10px] font-semibold');
  content = content.replace(/uppercase tracking-widest text-xs/g, 'text-xs font-semibold');
  content = content.replace(/font-editorial-meta uppercase tracking-wider/g, 'text-xs font-semibold');
  content = content.replace(/font-editorial-meta uppercase tracking-widest/g, 'text-xs font-semibold');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalReplacements++;
  }
}

console.log(`✓ Polished ${totalReplacements} files.`);
