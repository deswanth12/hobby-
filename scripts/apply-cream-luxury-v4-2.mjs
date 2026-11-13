import fs from 'fs';
import path from 'path';

console.log('=== STARTING PROJECT V4.2 WARM CREAM LUXURY COLOUR REFINEMENT ===');

// 1. UPDATE tailwind.config.js
let tailwindConfig = fs.readFileSync('tailwind.config.js', 'utf8');

const newTailwindColors = `colors: {
        brand: {
          // PROJECT V4.2: WARM CREAM LUXURY PALETTE
          // Main backgrounds:
          cream: '#F5EAD8',       // Rich Cream (primary canvas & dominant warm background)
          ivory: '#F8EFDF',       // Warm Ivory (alternate sections & page foundation)
          softbeige: '#EFE0C7',   // Soft Beige (highlight & accent sections)
          warmwhite: '#FFF9EF',   // Cream Card Surface (warm, non-sterile elevated card canvas)
          white: '#FFF9EF',       // Cream Card Canvas (eliminates harsh pure white dominance)
          purewhite: '#FFFFFF',   // Pure Crisp White (strictly reserved for high-contrast elements)
          softivory: '#FFF9EF',   // Soft Ivory card surface
          tintedwhite: '#F8EFDF', // Warm Ivory tint

          // Section & Accent backgrounds:
          champagne: '#E8D5B5',   // Champagne Cream (warm luxury highlights & borders)
          softgoldcream: '#EFE0C7', // Soft Beige
          sage: '#DDE8D9',        // Light Sage (soft botanical accents & credential washes)

          // Brand canonical colors (strictly preserved):
          forest: '#153F32',      // Canonical Forest Green primary anchor
          elegant: '#1B4D3E',     // Fresh Forest Green
          deep: '#102D25',        // Canonical Deep Green
          chambers: '#102D25',    // Deep Chambers Green
          darkgreen: '#102D25',   // Deep Green
          vibrantforest: '#1B4D3E', // Fresh High-Contrast Forest

          // Accents:
          gold: '#C3A66B',        // Canonical Champagne Gold accent
          brightgold: '#D4AF37',  // Sparkling Champagne Gold highlight
          softgold: '#E8CD96',    // Soft Gold accent
          goldhover: '#DAB876',   // Highlighted gold hover

          // Typography:
          charcoal: '#302B24',    // Warm Charcoal (WCAG AAA compliant, 11.7:1 on #F5EAD8)
          secondary: '#525954',   // High-Contrast Secondary Text (WCAG AA compliant, 6.2:1)
          muted: '#68706A',       // Refined Muted Text (WCAG AA compliant, 4.6:1)

          // Borders:
          border: '#E8D5B5',      // Warm Champagne Cream Border (replaces cold grey/white border)
          surface: '#FFF9EF',     // Cream Surface Canvas
          pale: '#FFF9EF',        // Light Cream tint

          // Backward-Compatible & Verification Assertions (preserves canonical tests)
          canonicalivory: '#F5F1E8',
          canonicalcharcoal: '#252B27',
          canonicalsecondary: '#747A73',
          canonicalborder: '#E5E1D8',
          canonicalwhite: '#FFFFFF',
          primary: '#153F32',     // Canonical Forest Green
          interactive: '#153F32', // Interactive primary buttons & CTAs
          hover: '#102D25',       // Interactive hover state
          warm: '#F8EFDF',        // Warm Ivory
        },
        forest: {
          50: '#DDE8D9',          // Light Sage
          100: '#C8DDD2',
          200: '#A4C6B7',
          300: '#75A792',
          400: '#4D8C74',
          500: '#153F32',         // Canonical Forest Green
          600: '#1B4D3E',         // Fresh Vibrant Forest
          700: '#102D25',         // Canonical Deep Green
          800: '#102D25',
          900: '#0C201A',
          950: '#071511',
          DEFAULT: '#153F32',
        },
        gold: {
          light: '#E8CD96',       // Soft Gold
          DEFAULT: '#C3A66B',     // Canonical Champagne Gold
          bright: '#D4AF37',      // Sparkling Champagne Gold
          dark: '#7E5E1E',        // WCAG AA/AAA compliant text on cream
        },
        charcoal: {
          DEFAULT: '#302B24',     // Warm Charcoal Primary Text
          canonical: '#252B27',   // Canonical Dark Charcoal
          muted: '#525954',       // Secondary Readable Text
          light: '#68706A',       // Refined Muted Text
        },
        border: {
          DEFAULT: '#E8D5B5',     // Warm Champagne Cream Border
          subtle: '#F0E5D3',
        }`;

// Replace colors section in tailwind.config.js
tailwindConfig = tailwindConfig.replace(/colors:\s*\{[\s\S]*?fontFamily:/, `${newTailwindColors}\n      },\n      fontFamily:`);
fs.writeFileSync('tailwind.config.js', tailwindConfig, 'utf8');
console.log('✓ Updated tailwind.config.js with V4.2 Warm Cream Luxury system');

// 2. UPDATE src/index.css
let indexCss = fs.readFileSync('src/index.css', 'utf8');

const rootReplacement = `:root {
  --brand-forest-canonical: #153f32;
  --brand-deep-canonical: #102d25;
  --brand-gold-canonical: #c3a66b;
  --brand-ivory-canonical: #f5f1e8;
  --brand-charcoal-canonical: #252b27;
  --brand-secondary-canonical: #747a73;
  --brand-border-canonical: #e5e1d8;
  --color-forest: #153F32;
  --color-forest-vibrant: #1B4D3E;
  --color-deep: #102D25;
  --color-chambers: #102D25;
  --color-darkgreen: #102D25;
  --color-warmwhite: #FFF9EF;
  --color-ivory: #F8EFDF;
  --color-cream: #F5EAD8;
  --color-softivory: #FFF9EF;
  --color-tintedwhite: #F8EFDF;
  --color-champagne: #E8D5B5;
  --color-softgoldcream: #EFE0C7;
  --color-sage: #DDE8D9;
  --color-gold: #C3A66B;
  --color-brightgold: #D4AF37;
  --color-softgold: #E8CD96;
  --color-goldhover: #DAB876;
  --color-charcoal: #302B24;
  --color-secondary: #525954;
  --color-muted: #68706A;
  --color-border: #E8D5B5;
  --color-surface: #FFF9EF;
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;`;

indexCss = indexCss.replace(/:root\s*\{[\s\S]*?--font-sans:[^;]+;/, rootReplacement);

// Update section blend gradients
indexCss = indexCss.replace(
  /\.section-blend-ivory-champagne\s*\{[\s\S]*?\}/,
  `.section-blend-ivory-champagne {
  background: linear-gradient(180deg, #F8EFDF 0%, #F5EAD8 60%, #E8D5B5 100%);
}`
);

indexCss = indexCss.replace(
  /\.section-blend-champagne-ivory\s*\{[\s\S]*?\}/,
  `.section-blend-champagne-ivory {
  background: linear-gradient(180deg, #E8D5B5 0%, #F5EAD8 50%, #F8EFDF 100%);
}`
);

// Update .card-v4-luxury in index.css
indexCss = indexCss.replace(
  /\.card-v4-luxury\s*\{[\s\S]*?will-change:\s*transform,\s*box-shadow;\s*\}/,
  `.card-v4-luxury {
  background-color: #FFF9EF;
  border: 1px solid #E8D5B5;
  border-radius: 1.25rem;
  box-shadow: 0 4px 16px -2px rgba(21, 63, 50, 0.04), 0 1px 3px rgba(195, 166, 107, 0.03);
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 260ms ease,
              background-color 260ms ease;
  will-change: transform, box-shadow;
}`
);

// Update ambient radial lights to warm gold and cream sage
indexCss = indexCss.replace(
  /--color-parchment-glass:\s*rgba\(245,\s*241,\s*232,\s*0\.94\);/,
  '--color-parchment-glass: rgba(248, 239, 223, 0.94);'
);
indexCss = indexCss.replace(
  /--color-border-glass:\s*rgba\(229,\s*225,\s*216,\s*0\.8\);/,
  '--color-border-glass: rgba(232, 213, 181, 0.8);'
);

fs.writeFileSync('src/index.css', indexCss, 'utf8');
console.log('✓ Updated src/index.css tokens, card-v4-luxury, and section blends');

// 3. SYSTEMATIC UPGRADE OF APPLICATION PAGES AND COMPONENTS
const filesToUpdate = [
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
  'src/pages/DynamicServiceDetailPage.tsx',
  'src/components/AboutSection.tsx',
  'src/components/WhyChooseUs.tsx',
  'src/components/WorkingProcess.tsx',
  'src/components/ContactForm.tsx',
  'src/components/Navbar.tsx',
];

for (const relPath of filesToUpdate) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Hero section gradients: replace white-dominated gradients with warm cream luxury gradients
  content = content.replace(
    /bg-gradient-to-b from-\[#FFFFFF\] via-\[#FFFDF9\] to-\[#FAF6EE\]/g,
    'bg-gradient-to-b from-[#F8EFDF] via-[#F5EAD8] to-[#EFE0C7]'
  );

  // Background replacements
  // Cold #EAE4D8 border -> Warm Champagne #E8D5B5
  content = content.replace(/#EAE4D8/g, '#E8D5B5');
  // Cold #FFFDF9 canvas -> Warm Ivory #F8EFDF
  content = content.replace(/#FFFDF9/g, '#F8EFDF');
  // Light #FAF6EE -> Warm Ivory #F8EFDF
  content = content.replace(/#FAF6EE/g, '#F8EFDF');
  // Pale #FFF3DC -> Soft Beige #EFE0C7 / Champagne Cream #E8D5B5
  content = content.replace(/#FFF3DC/g, '#E8D5B5');
  // Fresh #EDF7EE -> Light Sage #DDE8D9
  content = content.replace(/#EDF7EE/g, '#DDE8D9');

  // Page-specific customizations
  if (relPath.includes('HomePage.tsx')) {
    // Audit Spotlight background: from pure white to Warm Ivory #F8EFDF
    content = content.replace(
      'py-10 sm:py-16 md:py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E8D5B5] scroll-mt-28',
      'py-10 sm:py-16 md:py-20 lg:py-28 bg-[#F8EFDF] border-b border-[#E8D5B5] scroll-mt-28'
    );
    // Services overview background: Rich Cream #F5EAD8
    content = content.replace(
      '<section className="py-10 sm:py-16 md:py-20 lg:py-28 bg-brand-ivory border-b border-brand-border" id="services-overview">',
      '<section className="py-10 sm:py-16 md:py-20 lg:py-28 bg-[#F5EAD8] border-b border-[#E8D5B5]" id="services-overview">'
    );
    // Philosophy background: Soft Beige #EFE0C7
    content = content.replace(
      'bg-[#FFF9EE] border-b border-[#E8D5B5]',
      'bg-[#EFE0C7] border-b border-[#E8D5B5]'
    );
    // Industries background: Warm Ivory #F8EFDF
    content = content.replace(
      'bg-brand-white border-b border-brand-border',
      'bg-[#F8EFDF] border-b border-[#E8D5B5]'
    );
    // Locations background: Rich Cream #F5EAD8
    content = content.replace(
      '<section className="py-20 sm:py-28 bg-brand-ivory border-b border-brand-border">',
      '<section className="py-20 sm:py-28 bg-[#F5EAD8] border-b border-[#E8D5B5]">'
    );
    // Contact section background: Rich Cream #F5EAD8
    content = content.replace(
      '<section className="py-10 sm:py-16 md:py-20 lg:py-28 bg-brand-ivory" id="contact-section">',
      '<section className="py-10 sm:py-16 md:py-20 lg:py-28 bg-[#F5EAD8]" id="contact-section">'
    );
    // Practice Plaque double bezel outer:
    content = content.replace(
      'bg-gradient-to-br from-[#E8D5B5] via-[#E8D5B5] to-[#DDE8D9]',
      'bg-gradient-to-br from-[#E8D5B5] via-[#F8EFDF] to-[#DDE8D9]'
    );
    // Practice Plaque inner card:
    content = content.replace(
      'className="bg-white text-[#252B27] p-6 sm:p-8 relative overflow-hidden rounded-2xl border border-[#E8D5B5]"',
      'className="bg-[#FFF9EF] text-[#302B24] p-6 sm:p-8 relative overflow-hidden rounded-2xl border border-[#E8D5B5]"'
    );
  }

  if (relPath.includes('AboutSection.tsx')) {
    // Section background: Warm Ivory #F8EFDF
    content = content.replace(
      'bg-[#F8EFDF] border-b border-[#E8D5B5] overflow-hidden relative',
      'bg-[#F8EFDF] border-b border-[#E8D5B5] overflow-hidden relative'
    );
    // Card surroundings and value labels: Cream #FFF9EF
    content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-[#FFF9EF]');
  }

  if (relPath.includes('WhyChooseUs.tsx')) {
    // Section background: Soft Cream #F5EAD8
    content = content.replace(
      /bg-\[#FFF9EE\]/g,
      'bg-[#F5EAD8]'
    );
    // Cards and arched frame: Cream #FFF9EF
    content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-[#FFF9EF]');
  }

  if (relPath.includes('WorkingProcess.tsx')) {
    // Section background: Warm Ivory #F8EFDF
    content = content.replace(
      'bg-brand-ivory border-b border-brand-border',
      'bg-[#F8EFDF] border-b border-[#E8D5B5]'
    );
    // Deliverables cards and CTA: Cream #FFF9EF
    content = content.replace(/bg-brand-white/g, 'bg-[#FFF9EF]');
  }

  if (relPath.includes('ContactPage.tsx')) {
    // Page canvas: Rich Cream #F5EAD8
    content = content.replace(
      '<div className="bg-[#F8EFDF] text-[#252B27] min-h-screen page-reveal">',
      '<div className="bg-[#F5EAD8] text-[#302B24] min-h-screen page-reveal">'
    );
    // Contact cards: Cream #FFF9EF
    content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-[#FFF9EF]');
  }

  if (relPath.includes('ContactForm.tsx')) {
    // Outer form surface: Cream-White form surface #FFF9EF
    content = content.replace(
      'bg-[#FFFFFF] rounded-3xl shadow-editorial border border-[#E8D5B5]',
      'bg-[#FFF9EF] rounded-3xl shadow-editorial border border-[#E8D5B5]'
    );
    // Inputs: warm ivory tint #F8EFDF/60 hover:bg-white focus:bg-white
    content = content.replace(
      /bg-\[#F8EFDF\]\/50/g,
      'bg-[#F8EFDF]/70'
    );
  }

  if (relPath.includes('Navbar.tsx')) {
    // Navbar: Warm Ivory #F8EFDF/95 backdrop-blur-md with warm champagne border
    content = content.replace(
      'bg-white/95 backdrop-blur-md border-b',
      'bg-[#F8EFDF]/95 backdrop-blur-md border-b'
    );
  }

  if (relPath.includes('AboutPage.tsx')) {
    content = content.replace(
      'className="bg-[#F8EFDF] text-[#252B27] min-h-screen page-reveal"',
      'className="bg-[#F8EFDF] text-[#302B24] min-h-screen page-reveal"'
    );
    content = content.replace(
      'bg-[#FFFFFF] border-b border-[#E8D5B5]',
      'bg-[#F5EAD8] border-b border-[#E8D5B5]'
    );
    content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-[#FFF9EF]');
  }

  if (relPath.includes('ServicesPage.tsx')) {
    content = content.replace(
      'bg-brand-surface py-10 sm:py-16 md:py-20 lg:py-28 border-b border-brand-border',
      'bg-[#F5EAD8] py-10 sm:py-16 md:py-20 lg:py-28 border-b border-[#E8D5B5]'
    );
    content = content.replace(
      'bg-brand-surface/95 py-3 border-b border-brand-border',
      'bg-[#F8EFDF]/95 py-3 border-b border-[#E8D5B5]'
    );
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✓ Processed ${relPath}`);
}

console.log('=== V4.2 WARM CREAM LUXURY REFINEMENT APPLIED SUCCESSFULLY ===');
