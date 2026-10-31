import fs from 'fs';

let c = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
c = c.replace(
  'pt-16 sm:pt-24 lg:pt-32 pb-20 sm:pb-28 lg:pb-32 border-b border-brand-border relative overflow-hidden min-h-[85dvh] flex items-center',
  'pt-12 sm:pt-16 lg:pt-16 xl:pt-14 pb-14 sm:pb-20 lg:pb-16 xl:pb-14 border-b border-brand-border relative overflow-hidden min-h-0 flex items-center'
);
c = c.replace(
  'space-y-6 sm:space-y-8 scroll-reveal-left',
  'space-y-4 sm:space-y-5 scroll-reveal-left'
);
fs.writeFileSync('src/pages/HomePage.tsx', c, 'utf8');
console.log('Successfully refined hero spacing for 1280x800 in HomePage.tsx');
