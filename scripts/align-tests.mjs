import fs from 'fs';

// 1. FloatingWhatsApp.tsx
const fwaPath = 'c:/kavitha ca/src/components/FloatingWhatsApp.tsx';
let fwa = fs.readFileSync(fwaPath, 'utf8');
if (!fwa.includes('motion-safe:animate-ping')) {
  fwa = fwa.replace(
    'motion-safe:animate-[pulse_3s_ease-in-out_infinite]',
    'motion-safe:animate-ping'
  );
  fs.writeFileSync(fwaPath, fwa, 'utf8');
}

// 2. Footer.tsx
const footPath = 'c:/kavitha ca/src/components/Footer.tsx';
let foot = fs.readFileSync(footPath, 'utf8');
foot = foot.replace(/Bairagi Patteda, Tirupati\s+517501, AP/g, 'Bairagi Patteda, Tirupati – 517501, AP');
fs.writeFileSync(footPath, foot, 'utf8');

console.log('✓ Aligned assertions in FloatingWhatsApp and Footer');
