import fs from 'fs';

const file = 'c:/kavitha ca/src/pages/HomePage.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add ArrowUpRight import if needed
if (!code.includes('ArrowUpRight')) {
  code = code.replace("ArrowRight,", "ArrowRight,\r\n  ArrowUpRight,");
  if (!code.includes('ArrowUpRight')) {
    code = code.replace("ArrowRight,", "ArrowRight,\n  ArrowUpRight,");
  }
}

// 2. Glued arrows in links
code = code.replace('Map Pin →', '<span>Map Pin</span><ArrowUpRight className="w-3.5 h-3.5 ml-1 inline text-brand-gold" aria-hidden="true" />');
code = code.replace('Inquire Audit →', '<span>Inquire Audit</span><ArrowRight className="w-3.5 h-3.5 ml-1 inline text-brand-gold" aria-hidden="true" />');
code = code.replace('View on Map →', '<span>View on Map</span><ArrowUpRight className="w-3.5 h-3.5 ml-1 inline text-brand-gold" aria-hidden="true" />');

// 3. Remove uppercase & tracking-wider on section eyebrows and labels
code = code.replace(/font-editorial-meta text-xs uppercase tracking-wider text-gold-dark block mb-2/g, 'text-xs font-semibold text-gold-dark block mb-2');
code = code.replace(/font-editorial-meta text-xs font-semibold text-gold-dark uppercase tracking-wider block/g, 'text-xs font-semibold text-gold-dark block');
code = code.replace(/font-editorial-meta text-xs font-semibold text-brand-gold uppercase tracking-wider block mb-2.5/g, 'text-xs font-semibold text-brand-gold block mb-2.5');
code = code.replace(/font-editorial-meta font-semibold text-brand-gold block text-\[11px\] uppercase tracking-wider mb-0.5/g, 'text-xs font-semibold text-brand-gold block mb-0.5');
code = code.replace(/font-editorial-meta text-\[10px\] font-bold uppercase tracking-wider text-brand-gold block mb-1/g, 'text-[11px] font-semibold text-brand-gold block mb-1');
code = code.replace(/font-editorial-meta text-\[10px\] font-bold uppercase tracking-wider text-gold-dark block mb-1.5/g, 'text-[11px] font-semibold text-gold-dark block mb-1.5');
code = code.replace(/font-semibold text-gold-dark uppercase text-\[10px\] tracking-wider block mb-1/g, 'text-[11px] font-semibold text-gold-dark block mb-1');
code = code.replace(/font-editorial-meta px-2 py-0.5 rounded bg-brand-pale text-emerald-800 text-\[10px\] font-bold uppercase tracking-wider border border-emerald-200/g, 'text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-pale text-emerald-800 border border-emerald-200');
code = code.replace(/font-editorial-meta text-\[11px\] font-semibold uppercase tracking-wider/g, 'text-[11px] font-semibold');
code = code.replace(/font-editorial-meta text-\[11px\] uppercase tracking-wider text-gold-dark/g, 'text-xs font-semibold text-gold-dark');

// 4. Assurance spotlight badge
code = code.replace(
  'inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-forest text-brand-gold text-xs font-bold uppercase tracking-wider mb-3 shadow-xs',
  'inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-forest text-brand-gold text-xs font-semibold mb-3 shadow-xs'
);
code = code.replace('<span className="font-editorial-meta">Assurance Spotlight</span>', '<span>Assurance Spotlight</span>');

// 5. Hero typography leading at 1280x800
code = code.replace(
  '<h1 className="font-editorial-h1 text-brand-forest">\r\n                  Statutory Rigor.\r\n                </h1>\r\n                <h1 className="font-editorial-h1 text-brand-gold">\r\n                  Practical Commercial Counsel.\r\n                </h1>',
  '<h1 className="font-editorial-h1 text-brand-forest leading-[1.15]">\r\n                  Statutory Rigor.\r\n                </h1>\r\n                <h1 className="font-editorial-h1 text-brand-gold leading-[1.15]">\r\n                  Practical Commercial Counsel.\r\n                </h1>'
);
code = code.replace(
  '<h1 className="font-editorial-h1 text-brand-forest">\n                  Statutory Rigor.\n                </h1>\n                <h1 className="font-editorial-h1 text-brand-gold">\n                  Practical Commercial Counsel.\n                </h1>',
  '<h1 className="font-editorial-h1 text-brand-forest leading-[1.15]">\n                  Statutory Rigor.\n                </h1>\n                <h1 className="font-editorial-h1 text-brand-gold leading-[1.15]">\n                  Practical Commercial Counsel.\n                </h1>'
);

fs.writeFileSync(file, code, 'utf8');
console.log('✓ Cleaned HomePage.tsx Hallmark items');
