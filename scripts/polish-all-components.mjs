import fs from 'fs';

console.log('--- Starting Hallmark Polish on Components ---');

// 1. Polish FloatingWhatsApp.tsx
{
  const file = 'c:/kavitha ca/src/components/FloatingWhatsApp.tsx';
  let code = fs.readFileSync(file, 'utf8');

  // Replace rapid ping with serene luxury pulse & replace arbitrary colors
  code = code.replace(
    'motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75',
    'motion-safe:animate-[pulse_3s_ease-in-out_infinite] absolute inline-flex h-full w-full rounded-full bg-emerald-400/50'
  );
  code = code.replace(
    'motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80',
    'motion-safe:animate-[pulse_3s_ease-in-out_infinite] absolute inline-flex h-full w-full rounded-full bg-emerald-400/40'
  );
  code = code.replace('bg-[#25D366]', 'bg-emerald-500');
  code = code.replace('shadow-[0_0_8px_#25D366]', 'shadow-sm');

  // Remove excessive blur aura ring
  code = code.replace(
    '<span \r\n          className="absolute -inset-1 rounded-full bg-emerald-400/30 blur-md animate-pulse pointer-events-none" \r\n          aria-hidden="true" \r\n        />',
    ''
  );
  code = code.replace(
    '<span \n          className="absolute -inset-1 rounded-full bg-emerald-400/30 blur-md animate-pulse pointer-events-none" \n          aria-hidden="true" \n        />',
    ''
  );

  // Replace transition-all
  code = code.replace(
    'relative transition-all duration-300',
    'relative transition-[opacity,transform] duration-200'
  );
  code = code.replace(
    'border border-brand-gold/40 transition-all duration-300 ease-spring hover:-translate-y-1',
    'border border-brand-gold/40 transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5'
  );

  // Replace uppercase tracked labels with natural sentence-case
  code = code.replace(
    'font-editorial-meta text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1',
    'text-xs font-semibold text-emerald-900 flex items-center gap-1.5'
  );
  code = code.replace(
    'text-[10px] font-bold uppercase tracking-wider text-emerald-100',
    'text-[10px] font-semibold text-emerald-100'
  );

  // Replace arbitrary gradient
  code = code.replace(
    'bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#0F3E2E] hover:from-emerald-500 hover:to-emerald-700',
    'bg-emerald-700 hover:bg-emerald-800'
  );

  fs.writeFileSync(file, code, 'utf8');
  console.log('✓ Polished FloatingWhatsApp.tsx');
}

// 2. Polish Navbar.tsx
{
  const file = 'c:/kavitha ca/src/components/Navbar.tsx';
  let code = fs.readFileSync(file, 'utf8');

  // Replace transition-all
  code = code.replace(
    'border-b transition-all duration-200',
    'border-b transition-[box-shadow,border-color] duration-200'
  );
  code = code.replace(
    'justify-between transition-all duration-200',
    'justify-between transition-[padding] duration-200'
  );
  code = code.replace(
    'group-hover:shadow-editorial transition-all shrink-0',
    'group-hover:shadow-editorial transition-[border-color,box-shadow] duration-200 shrink-0'
  );
  code = code.replace(
    'transition-all duration-200 btn-tactile whitespace-nowrap min-h-[44px] group',
    'transition-[background-color,border-color,box-shadow] duration-200 btn-tactile whitespace-nowrap min-h-[44px] group'
  );
  code = code.replace(
    'bg-[#0A241D] hover:bg-[#12382C]',
    'bg-brand-chambers hover:bg-brand-deep'
  );
  code = code.replace('bg-[#25D366]', 'bg-emerald-500');
  code = code.replace(
    'transition-all duration-300 ease-in-out border-l border-brand-border',
    'transition-transform duration-300 ease-in-out border-l border-brand-border'
  );

  // Ensure ChevronRight has aria-hidden
  code = code.replace(
    '<ChevronRight className="w-3.5 h-3.5 text-brand-gold transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />',
    '<ChevronRight className="w-3.5 h-3.5 text-brand-gold transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" aria-hidden="true" />'
  );

  fs.writeFileSync(file, code, 'utf8');
  console.log('✓ Polished Navbar.tsx');
}

// 3. Polish ConnectedTimeline.tsx
{
  const file = 'c:/kavitha ca/src/components/ConnectedTimeline.tsx';
  let code = fs.readFileSync(file, 'utf8');

  code = code.replace(/transition-all duration-300/g, 'transition-[transform,background-color,box-shadow] duration-200');
  code = code.replace(/transition-all/g, 'transition-[border-color,box-shadow] duration-200');

  // Replace card-in-card pattern
  code = code.replace('w-full bg-brand-white card-tactile rounded-2xl', 'w-full bg-brand-white rounded-2xl');
  code = code.replace('bg-brand-white card-tactile rounded-xl', 'bg-brand-white rounded-xl');

  // Tracked caps
  code = code.replace(/font-editorial-meta text-\[10px\] font-bold text-gold-dark uppercase tracking-wider/g, 'text-xs font-semibold text-gold-dark');

  fs.writeFileSync(file, code, 'utf8');
  console.log('✓ Polished ConnectedTimeline.tsx');
}

// 4. Polish ContactForm.tsx
{
  const file = 'c:/kavitha ca/src/components/ContactForm.tsx';
  let code = fs.readFileSync(file, 'utf8');

  code = code.replace(
    'bg-white rounded-2xl shadow-card border border-border p-6 sm:p-8 lg:p-10 transition-all',
    'bg-white rounded-2xl shadow-card border border-border p-6 sm:p-8 lg:p-10 transition-[border-color,box-shadow] duration-200'
  );
  code = code.replace('text-xs font-semibold uppercase', 'text-xs font-semibold');
  code = code.replace('shadow-card hover:shadow-card-hover border border-gold/40 group', 'shadow-sm hover:shadow-md border border-gold/40 group');

  fs.writeFileSync(file, code, 'utf8');
  console.log('✓ Polished ContactForm.tsx');
}

// 5. Polish Footer.tsx
{
  const file = 'c:/kavitha ca/src/components/Footer.tsx';
  let code = fs.readFileSync(file, 'utf8');

  code = code.replace(
    /font-editorial-meta text-\[11px\] text-brand-gold font-semibold uppercase tracking-wider/g,
    'text-xs text-brand-gold font-medium'
  );
  code = code.replace(
    /font-editorial-meta text-\[11px\] text-brand-gold uppercase tracking-wider font-semibold block/g,
    'text-xs text-brand-gold font-medium block'
  );
  code = code.replace(/hover:text-brand-gold transition-all/g, 'hover:text-brand-gold transition-colors duration-200');

  fs.writeFileSync(file, code, 'utf8');
  console.log('✓ Polished Footer.tsx');
}

console.log('--- Components Polish Stage Complete ---');
