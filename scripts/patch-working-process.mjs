import fs from 'fs';

let content = fs.readFileSync('src/components/WorkingProcess.tsx', 'utf8');

// 1. Padding
content = content.replace(
  'className={`py-16 sm:py-20 md:py-24 lg:py-32 bg-[#F8EFDF] border-b border-[#E8D5B5] relative overflow-hidden texture-linen ${className}`.trim()}',
  'className={`py-12 sm:py-16 lg:py-20 bg-[#F8EFDF] border-b border-[#E8D5B5] relative overflow-hidden texture-linen ${className}`.trim()}'
);

// 2. Remove oversized ambient circles, replace with restrained radial lighting
const oldCircles = `      {/* Background Architectural Watermark / Ambient Texture */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 bg-radial from-brand-gold/10 to-transparent rounded-full pointer-events-none -mr-20 -mt-20"
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-radial from-brand-forest/10 to-transparent rounded-full pointer-events-none -ml-20 -mb-20"
        aria-hidden="true"
      />`;

const newAmbient = `      {/* Restrained Architectural Ambient Lighting */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(195,166,107,0.08)_0%,transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />`;

// Handle CRLF or LF
if (content.includes('w-96 h-96 bg-radial from-brand-gold/10')) {
  content = content.replace(
    /<div \s*className="absolute top-0 right-0 w-96 h-96 bg-radial[\s\S]*?aria-hidden="true"\s*\/>\s*<div \s*className="absolute bottom-0 left-0 w-96 h-96 bg-radial[\s\S]*?aria-hidden="true"\s*\/>/,
    newAmbient.trim()
  );
}

// 3. Spacing in header and desktop timeline
content = content.replace(
  'mb-16 sm:mb-20 lg:mb-24 scroll-reveal relative',
  'mb-12 sm:mb-14 lg:mb-16 scroll-reveal relative'
);

content = content.replace(
  'className="space-y-24 relative z-10"',
  'className="space-y-14 lg:space-y-18 relative z-10"'
);

fs.writeFileSync('src/components/WorkingProcess.tsx', content, 'utf8');
console.log('Successfully updated WorkingProcess.tsx');
