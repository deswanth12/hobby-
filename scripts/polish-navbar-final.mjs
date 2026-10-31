import fs from 'fs';

const file = 'c:/kavitha ca/src/components/Navbar.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace middle dot with vertical bar in top bar
code = code.replace(/text-brand-gold\/60">.*?<\/span>/g, 'text-brand-gold/60" aria-hidden="true">|</span>');
code = code.replaceAll('•', '|');

// Replace uppercase tracked label on line 196
code = code.replace(
  'font-editorial-meta text-[11px] tracking-wider uppercase font-semibold text-gold-dark',
  'text-xs font-semibold text-gold-dark'
);

// Replace uppercase tracked label on mobile menu
code = code.replace(
  'font-editorial-meta text-[11px] tracking-wider uppercase font-semibold text-gold-dark',
  'text-xs font-semibold text-gold-dark'
);
code = code.replace(
  'font-editorial-meta text-xs tracking-wider uppercase font-semibold text-gold-dark',
  'text-xs font-semibold text-gold-dark'
);
code = code.replace(
  'font-editorial-meta text-[10px] tracking-wider uppercase font-semibold text-gold-dark',
  'text-[11px] font-semibold text-gold-dark'
);
code = code.replace(
  'font-editorial-meta text-[11px] tracking-wider uppercase font-bold text-gold-dark',
  'text-[11px] font-semibold text-gold-dark'
);
code = code.replace(
  'font-editorial-meta text-[10px] uppercase font-bold text-emerald-800',
  'text-[10px] font-semibold text-emerald-800'
);

// Remove image scale on hover (Gate 11)
code = code.replace('transition-transform duration-300 group-hover:scale-105', '');

fs.writeFileSync(file, code, 'utf8');
console.log('Navbar.tsx polished cleanly!');
