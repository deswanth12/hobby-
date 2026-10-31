import fs from 'fs';

const file = 'c:/kavitha ca/src/pages/HomePage.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. replace dash — with subtle pipe |
code = code.replaceAll('—', ',');

// 2. add motion-safe: to animate-pulse
code = code.replace(/animate-pulse/g, 'motion-safe:animate-pulse');

// 3. add focus-visible styles on interactive elements
code = code.replace(/focus:outline-none focus:ring-2/g, 'focus-visible:outline-none focus-visible:ring-2');

// Add focus-visible:ring-2 on primary links
code = code.replace(
  'className="w-full sm:w-auto justify-center inline-flex items-center gap-2',
  'className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest w-full sm:w-auto justify-center inline-flex items-center gap-2'
);

fs.writeFileSync(file, code, 'utf8');
console.log('HomePage.tsx 3 fails fixed!');
