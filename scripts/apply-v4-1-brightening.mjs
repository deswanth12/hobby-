import fs from 'fs';
import path from 'path';

const filesToProcess = [
  'src/pages/HomePage.tsx',
  'src/pages/AboutPage.tsx',
  'src/pages/ServicesPage.tsx',
  'src/pages/ContactPage.tsx',
  'src/pages/AuditAssurancePage.tsx',
  'src/pages/CompanyRegistrationPage.tsx',
  'src/pages/GSTServicesPage.tsx',
  'src/pages/IncomeTaxPage.tsx',
  'src/pages/IndustriesPage.tsx',
  'src/pages/LocationsPage.tsx',
  'src/pages/RERAConsultantPage.tsx',
  'src/pages/VirtualCFOPage.tsx',
  'src/pages/BlogPage.tsx',
  'src/components/ContactForm.tsx',
  'src/components/Navbar.tsx',
  'src/components/Footer.tsx',
];

for (const relPath of filesToProcess) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Specific high-level section and hero upgrades
  if (relPath.includes('HomePage.tsx')) {
    content = content.replace(
      'className="bg-[#FFFCF5] pt-6 xs:pt-8 sm:pt-14 lg:pt-16 pb-10 sm:pb-16 lg:pb-16 border-b border-[#EDE2CF] relative overflow-hidden min-h-0 flex items-center"',
      'className="bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF9] to-[#FAF6EE] pt-6 xs:pt-8 sm:pt-14 lg:pt-16 pb-10 sm:pb-16 lg:pb-16 border-b border-[#EAE4D8] relative overflow-hidden min-h-0 flex items-center"'
    );
    content = content.replace(
      '<section className="py-10 sm:py-16 md:py-20 lg:py-28 bg-[#FFFCF5] border-b border-[#EDE2CF] scroll-mt-28" id="audit-spotlight">',
      '<section className="py-10 sm:py-16 md:py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#EAE4D8] scroll-mt-28" id="audit-spotlight">'
    );
    content = content.replace(
      '<section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-[#FFF1D9] border-b border-[#EDE2CF]">',
      '<section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-[#FFF9EE] border-b border-[#EAE4D8]">'
    );
  }

  if (relPath.includes('ContactPage.tsx')) {
    content = content.replace(
      '<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#254B38] text-[#C9A66B] font-editorial-meta text-xs border border-[#C9A66B]/40 shadow-xs mb-4">',
      '<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs mb-4">'
    );
    content = content.replace(
      '<section className="pb-16 sm:pb-20 border-t border-[#EDE2CF] pt-14 bg-[#FAF6EE]">',
      '<section className="pb-16 sm:pb-20 border-t border-[#EAE4D8] pt-14 bg-[#FAF6EE]">'
    );
  }

  if (relPath.includes('ContactForm.tsx')) {
    content = content.replace(
      /border-\[\#EDE2CF\] bg-\[\#FFFCF5\]\/80 hover:bg-white focus:bg-white/g,
      'border-[#EAE4D8] bg-[#FAF6EE]/50 hover:bg-white focus:bg-white focus:border-[#153F32] focus:ring-2 focus:ring-[#153F32]/20'
    );
  }

  if (relPath.includes('Navbar.tsx')) {
    content = content.replace(
      'bg-brand-ivory/95 backdrop-blur-md border-b',
      'bg-white/95 backdrop-blur-md border-b'
    );
  }

  // Consistent systematic replacements across all files
  content = content.replace(/#EDE2CF/g, '#EAE4D8');
  content = content.replace(/#FFFCF5/g, '#FFFDF9');
  content = content.replace(/#356B50/g, '#153F32');
  content = content.replace(/#254B38/g, '#153F32');
  content = content.replace(/#C9A66B/g, '#C3A66B');
  content = content.replace(/#855E1C/g, '#7E5E1E');
  content = content.replace(/#625F55/g, '#525954');
  content = content.replace(/#817B70/g, '#68706A');
  content = content.replace(/#EAF3E9/g, '#EDF7EE');
  content = content.replace(/#FFF1D9/g, '#FFF3DC');
  content = content.replace(/#292B27/g, '#252B27');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${relPath} successfully.`);
}

console.log('Systematic V4.1 color brightening applied successfully!');
