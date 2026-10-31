import fs from 'fs';

const file = 'c:/kavitha ca/src/pages/HomePage.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Hero kicker
code = code.replace(
  '<span className="font-editorial-meta text-brand-forest uppercase tracking-kicker">\r\n                  Independent Chartered Accountancy Practice • Tirupati, AP\r\n                </span>',
  '<span className="text-xs font-semibold text-brand-forest">\r\n                  Independent Chartered Accountancy Practice, Tirupati\r\n                </span>'
);
code = code.replace(
  '<span className="font-editorial-meta text-brand-forest uppercase tracking-kicker">\n                  Independent Chartered Accountancy Practice • Tirupati, AP\n                </span>',
  '<span className="text-xs font-semibold text-brand-forest">\n                  Independent Chartered Accountancy Practice, Tirupati\n                </span>'
);

// 2. Trust strip
const oldTrust = `<div className="pt-4 border-t border-brand-border/60 flex flex-wrap items-center gap-3 font-editorial-meta text-brand-muted tracking-widest uppercase">
                <span className="text-brand-forest font-bold">TRUST</span>
                <span className="text-brand-gold">•</span>
                <span className="text-brand-forest font-bold">EXPERTISE</span>
                <span className="text-brand-gold">•</span>
                <span className="text-brand-forest font-bold">YOUR GROWTH PARTNER</span>
                <span className="text-brand-gold hidden sm:inline">•</span>
                <span className="text-emerald-800 hidden sm:inline font-semibold">ESTABLISHED PRACTICE</span>
              </div>`;

const newTrust = `<div className="pt-4 border-t border-brand-border/60 flex flex-wrap items-center gap-3 text-xs text-brand-muted">
                <span className="text-brand-forest font-semibold">Trust</span>
                <span className="text-brand-gold/60" aria-hidden="true">—</span>
                <span className="text-brand-forest font-semibold">Expertise</span>
                <span className="text-brand-gold/60" aria-hidden="true">—</span>
                <span className="text-brand-forest font-semibold">Strategic Counsel</span>
                <span className="text-brand-gold/60 hidden sm:inline" aria-hidden="true">—</span>
                <span className="text-brand-forest hidden sm:inline font-semibold">Established Practice</span>
              </div>`;

code = code.replace(oldTrust.replace(/\n/g, '\r\n'), newTrust.replace(/\n/g, '\r\n'));
code = code.replace(oldTrust, newTrust);

// 3. Senior Partner Card styling & text
code = code.replace(
  'className="font-editorial-meta text-[11px] font-bold uppercase tracking-widest text-brand-gold block"\r\n                          style={{ color: \'#C3A66B\' }}\r\n                        >\r\n                          PRACTICE REGISTER • ESTD. TIRUPATI',
  'className="text-xs font-semibold text-brand-brightgold block">\r\n                          Practice Register — Estd. Tirupati'
);
code = code.replace(
  'className="font-editorial-meta text-[11px] font-bold uppercase tracking-widest text-brand-gold block"\n                          style={{ color: \'#C3A66B\' }}\n                        >\n                          PRACTICE REGISTER • ESTD. TIRUPATI',
  'className="text-xs font-semibold text-brand-brightgold block">\n                          Practice Register — Estd. Tirupati'
);

code = code.replace(
  'className="font-editorial-meta text-[10px] font-bold uppercase tracking-wider text-gold-light bg-brand-deep px-2 py-0.5 rounded border border-brand-gold/20"\r\n                        style={{ color: \'#D8C296\', backgroundColor: \'#102D25\' }}\r\n                      >\r\n                        Senior Partner',
  'className="text-[11px] font-semibold text-brand-brightgold bg-brand-deep px-2.5 py-0.5 rounded border border-brand-gold/30">\r\n                        Senior Partner'
);
code = code.replace(
  'className="font-editorial-meta text-[10px] font-bold uppercase tracking-wider text-gold-light bg-brand-deep px-2 py-0.5 rounded border border-brand-gold/20"\n                        style={{ color: \'#D8C296\', backgroundColor: \'#102D25\' }}\n                      >\n                        Senior Partner',
  'className="text-[11px] font-semibold text-brand-brightgold bg-brand-deep px-2.5 py-0.5 rounded border border-brand-gold/30">\n                        Senior Partner'
);

code = code.replace('ICAI Mem. 252985 • CMA AIR 49', 'ICAI Mem. 252985, CMA AIR 49');

// Replace style={{ color: '#FFFFFF' }} and style={{ backgroundColor: ... }} in Senior Partner Card
code = code.replace(/style=\{\{\s*color:\s*['"]#FFFFFF['"]\s*\}\}/g, '');
code = code.replace(/style=\{\{\s*color:\s*['"]#C3A66B['"]\s*\}\}/g, '');
code = code.replace(/style=\{\{\s*color:\s*['"]#A7F3D0['"]\s*\}\}/g, '');
code = code.replace(/style=\{\{\s*color:\s*['"]#D1FAE5['"]\s*\}\}/g, '');
code = code.replace(/style=\{\{\s*color:\s*['"]#6EE7B7['"]\s*\}\}/g, '');
code = code.replace(/style=\{\{\s*backgroundColor:\s*['"]rgba\(21, 63, 50, 0.95\)['"]\s*\}\}/g, '');
code = code.replace(/style=\{\{\s*backgroundColor:\s*['"]#102D25['"],\s*color:\s*['"]#FFFFFF['"]\s*\}\}/g, '');
code = code.replace(/style=\{\{\s*backgroundColor:\s*['"]#102D25['"],\s*borderColor:\s*['"]rgba\(195, 166, 107, 0.45\)['"],\s*borderWidth:\s*['"]1px['"],\s*borderStyle:\s*['"]solid['"],\s*boxShadow:\s*['"]0 12px 36px -4px rgba\(16, 45, 37, 0.45\)['"]\s*\}\}/g, '');

// 4. Quick nav pills transition-all
code = code.replace(/text-xs font-semibold transition-all shadow-xs btn-tactile/g, 'text-xs font-semibold transition-colors duration-200 shadow-xs btn-tactile');

// 5. Tracked caps in sector marquee & quick nav
code = code.replace(
  'font-editorial-meta text-gold-dark tracking-wider uppercase',
  'text-xs font-medium text-gold-dark'
);
code = code.replace(
  'font-editorial-meta text-xs font-bold text-gold-dark uppercase tracking-wider shrink-0 flex items-center gap-1.5',
  'text-xs font-medium text-gold-dark shrink-0 flex items-center gap-1.5'
);
code = code.replace(
  'font-editorial-meta text-[11px] font-bold uppercase tracking-wider text-gold-dark block',
  'text-xs font-semibold text-gold-dark block'
);
code = code.replace(
  'font-editorial-meta text-[10px] font-bold text-emerald-800 uppercase tracking-wider',
  'text-xs font-semibold text-emerald-800'
);

// 6. Heading spacing (2:1 rule)
code = code.replace(
  '<h2 className="font-editorial-h2 text-brand-forest leading-tight">',
  '<h2 className="font-editorial-h2 text-brand-forest leading-tight mt-6 mb-3">'
);

fs.writeFileSync(file, code, 'utf8');
console.log('✓ Polished HomePage.tsx');
