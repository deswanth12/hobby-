import fs from 'fs';
import path from 'path';

function updateFile(filePath, transforms) {
  const fullPath = path.resolve(filePath);
  let content = fs.readFileSync(fullPath, 'utf8').replace(/\r\n/g, '\n');
  let original = content;

  for (const { from, to } of transforms) {
    const nFrom = typeof from === 'string' ? from.replace(/\r\n/g, '\n') : from;
    const nTo = typeof to === 'string' ? to.replace(/\r\n/g, '\n') : to;

    if (typeof nFrom === 'string') {
      if (!content.includes(nFrom)) {
        console.warn(`[WARN] Target not found in ${filePath}:\n${nFrom.slice(0, 100)}...`);
      } else {
        content = content.replace(nFrom, nTo);
      }
    } else if (nFrom instanceof RegExp) {
      content = content.replace(nFrom, nTo);
    }
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[UPDATED] ${filePath}`);
  } else {
    console.log(`[UNCHANGED] ${filePath}`);
  }
}

// 1. tailwind.config.js - charcoal.muted to #4A524D
updateFile('tailwind.config.js', [
  {
    from: `charcoal: {
          DEFAULT: '#252B27',     // Approved Charcoal Body Text
          muted: '#747A73',       // Approved Secondary Text`,
    to: `charcoal: {
          DEFAULT: '#252B27',     // Approved Charcoal Body Text
          muted: '#4A524D',       // Approved Secondary Text (Calibrated for WCAG AA 4.5:1+)`
  }
]);

// 2. StatutoryCalendar.tsx - deadline contrast
updateFile('src/components/StatutoryCalendar.tsx', [
  {
    from: `<span className="font-editorial-meta text-[11px] font-bold text-brand-gold">
                  {ev.deadline}
                </span>`,
    to: `<span className="font-editorial-meta text-[11px] font-bold text-gold-dark">
                  {ev.deadline}
                </span>`
  }
]);

console.log('Contrast fixes applied.');
