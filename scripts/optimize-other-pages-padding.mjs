import fs from 'fs';

const pages = [
  'src/pages/AboutPage.tsx',
  'src/pages/ServicesPage.tsx',
  'src/pages/AuditAssurancePage.tsx',
  'src/pages/IndustriesPage.tsx',
  'src/pages/LocationsPage.tsx',
  'src/pages/BlogPage.tsx',
  'src/pages/ContactPage.tsx',
  'src/pages/NotFoundPage.tsx'
];

for (const p of pages) {
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
  let original = content;

  // Replace excessive mobile padding in sections
  content = content.replace(/className="([^"]*)\bpy-20 sm:py-24\b([^"]*)"/g, 'className="$1py-10 sm:py-16 md:py-20 lg:py-24$2"');
  content = content.replace(/className="([^"]*)\bpy-20 sm:py-28\b([^"]*)"/g, 'className="$1py-10 sm:py-16 md:py-20 lg:py-28$2"');
  content = content.replace(/className="([^"]*)\bpy-20\b([^"]*)"/g, (match, p1, p2) => {
    // If it doesn't already have sm:py- or md:py-
    if (p2.includes('sm:py') || p1.includes('sm:py')) return match;
    return `className="${p1}py-10 sm:py-16 md:py-20${p2}"`;
  });

  if (content !== original) {
    fs.writeFileSync(p, content, 'utf8');
    console.log(`[PADDED-OPTIMIZED] ${p}`);
  }
}
