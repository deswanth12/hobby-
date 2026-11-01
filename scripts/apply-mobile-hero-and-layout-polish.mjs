import fs from 'fs';
import path from 'path';

function updateFile(filePath, transforms) {
  let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  let modified = false;

  for (const { target, replacement } of transforms) {
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      modified = true;
    } else {
      console.warn(`[WARN] Target not found in ${filePath}:\n${target.substring(0, 100)}...`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[UPDATED] ${filePath}`);
  } else {
    console.log(`[SKIPPED] No changes needed in ${filePath}`);
  }
}

// 1. Update src/index.css
const indexCssTransforms = [
  {
    target: `  .font-editorial-h1 {
    font-family: var(--font-serif);
    font-size: clamp(1.875rem, 1.35rem + 2.5vw, 3.75rem);
    font-weight: 500;
    line-height: 1.22;
    letter-spacing: 0;
    text-wrap: balance;
  }

  .font-editorial-h2 {
    font-family: var(--font-serif);
    font-size: clamp(1.75rem, 1.35rem + 2vw, 2.75rem);
    font-weight: 500;
    line-height: 1.28;
    letter-spacing: 0;
    text-wrap: balance;
  }

  .font-editorial-h3 {
    font-family: var(--font-serif);
    font-size: clamp(1.375rem, 1.15rem + 1.1vw, 1.875rem);
    font-weight: 600;
    line-height: 1.32;
    letter-spacing: 0;
  }

  .font-editorial-body {
    font-family: var(--font-sans);
    font-size: clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem);
    font-weight: 400;
    line-height: 1.7;
    letter-spacing: 0;
  }`,
    replacement: `  .font-editorial-h1 {
    font-family: var(--font-serif);
    font-size: clamp(2.1rem, 7vw, 3.1rem);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -0.01em;
    text-wrap: balance;
  }

  .font-editorial-hero-sub {
    font-family: var(--font-serif);
    font-size: clamp(1.35rem, 5vw, 2.1rem);
    font-weight: 500;
    line-height: 1.24;
    letter-spacing: 0;
  }

  .font-editorial-h2 {
    font-family: var(--font-serif);
    font-size: clamp(1.75rem, 5vw, 2.75rem);
    font-weight: 500;
    line-height: 1.22;
    letter-spacing: 0;
    text-wrap: balance;
  }

  .font-editorial-h3 {
    font-family: var(--font-serif);
    font-size: clamp(1.25rem, 3.5vw, 1.75rem);
    font-weight: 600;
    line-height: 1.28;
    letter-spacing: 0;
  }

  .font-editorial-body {
    font-family: var(--font-sans);
    font-size: clamp(1rem, 3.5vw, 1.125rem);
    font-weight: 400;
    line-height: 1.68;
    letter-spacing: 0;
  }

  .font-editorial-nav {
    font-family: var(--font-sans);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.01em;
  }`
  },
  {
    target: `  /* Dual-Arrow Button Micro-Physics */
  .dual-arrow-badge {
    position: relative;
    overflow: hidden;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;`,
    replacement: `  /* Dual-Arrow Button Micro-Physics */
  .dual-arrow-badge {
    position: relative;
    overflow: hidden;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;`
  },
  {
    target: `  /* Luxury Primary Pill CTA */
  .btn-pill-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    border-radius: 9999px;
    padding: 0.625rem 0.75rem 0.625rem 1.5rem;
    background-color: var(--color-forest);
    color: var(--color-tintedwhite);
    border: 1px solid var(--color-gold-border);
    font-weight: 600;
    font-size: 0.8125rem;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 16px var(--color-forest-shadow-primary);
    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease, background-color 300ms ease, border-color 300ms ease;
    will-change: transform;
    min-height: 44px;
    cursor: pointer;
  }`,
    replacement: `  /* Luxury Primary Pill CTA */
  .btn-pill-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    border-radius: 9999px;
    padding: 0.5rem 0.75rem 0.5rem 1.25rem;
    background-color: var(--color-forest);
    color: var(--color-tintedwhite);
    border: 1px solid var(--color-gold-border);
    font-weight: 600;
    font-size: 0.8125rem;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 16px var(--color-forest-shadow-primary);
    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease, background-color 300ms ease, border-color 300ms ease;
    will-change: transform;
    min-height: 46px;
    cursor: pointer;
  }`
  },
  {
    target: `  /* Luxury Secondary Pill CTA */
  .btn-pill-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: 9999px;
    padding: 0.625rem 1.375rem;
    background-color: var(--color-tintedwhite);
    color: var(--color-forest);
    border: 1px solid var(--color-border);
    font-weight: 600;
    font-size: 0.8125rem;
    box-shadow: 0 2px 8px var(--color-charcoal-shadow);
    transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 260ms ease, background-color 260ms ease, border-color 260ms ease;
    will-change: transform;
    min-height: 44px;
    cursor: pointer;
  }`,
    replacement: `  /* Luxury Secondary Pill CTA */
  .btn-pill-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: 9999px;
    padding: 0.5rem 1.25rem;
    background-color: var(--color-tintedwhite);
    color: var(--color-forest);
    border: 1px solid var(--color-border);
    font-weight: 600;
    font-size: 0.8125rem;
    box-shadow: 0 2px 8px var(--color-charcoal-shadow);
    transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 260ms ease, background-color 260ms ease, border-color 260ms ease;
    will-change: transform;
    min-height: 46px;
    cursor: pointer;
  }`
  }
];

updateFile('src/index.css', indexCssTransforms);

// 2. Update src/components/Navbar.tsx
const navbarTransforms = [
  {
    target: `        {/* Typographic Brand Mark & Monogram Badge */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-brand-forest rounded-lg p-1 btn-tactile"
        >
          {/* Refined Monogram Badge with Master Vector Emblem */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-brand-forest flex items-center justify-center text-brand-white border border-brand-gold/60 shadow-sm group-hover:border-brand-gold group-hover:shadow-editorial transition-[border-color,box-shadow] duration-200 shrink-0 p-1 relative overflow-hidden">
            <img
              src="/brand/ka-monogram-flat.svg"
              alt="Kavitha &amp; Associates Official Practice Monogram"
              width="44"
              height="44"
              className="w-full h-full object-contain drop-shadow-xs "
            />
            <span className="sr-only font-serif font-bold text-xl tracking-wider text-brand-gold">KA</span>
          </div>
          <div>
            <span className="block font-serif text-xl sm:text-2xl font-bold tracking-normal text-brand-forest leading-snug group-hover:text-brand-deep transition-colors">
              Kavitha & Associates
            </span>
            <span className="block text-xs font-semibold text-gold-dark mt-0.5">
              Chartered Accountants
            </span>
          </div>
        </Link>`,
    replacement: `        {/* Typographic Brand Mark & Monogram Badge */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-2 focus-visible:outline-brand-forest rounded-lg p-0.5 sm:p-1 btn-tactile shrink-0"
        >
          {/* Refined Monogram Badge with Master Vector Emblem */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-brand-forest flex items-center justify-center text-brand-white border border-brand-gold/60 shadow-sm group-hover:border-brand-gold group-hover:shadow-editorial transition-[border-color,box-shadow] duration-200 shrink-0 p-1 relative overflow-hidden">
            <img
              src="/brand/ka-monogram-flat.svg"
              alt="Kavitha &amp; Associates Official Practice Monogram"
              width="40"
              height="40"
              className="w-full h-full object-contain drop-shadow-xs"
            />
            <span className="sr-only font-serif font-bold text-xl tracking-wider text-brand-gold">KA</span>
          </div>
          <div className="min-w-0">
            <span className="block font-serif text-[1.125rem] xs:text-xl sm:text-2xl font-bold tracking-normal text-brand-forest leading-tight group-hover:text-brand-deep transition-colors whitespace-nowrap">
              Kavitha &amp; Associates
            </span>
            <span className="block text-[10px] sm:text-xs font-semibold text-gold-dark mt-0.5 leading-none">
              Chartered Accountants
            </span>
          </div>
        </Link>`
  },
  {
    target: `      <nav
        className={\`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-[padding] duration-200 \${
          isScrolled ? 'py-2.5' : 'py-3.5'
        }\`}
        aria-label="Main Navigation"
      >`,
    replacement: `      <nav
        className={\`max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between transition-[padding] duration-200 \${
          isScrolled ? 'py-2' : 'py-2.5 sm:py-3.5'
        }\`}
        aria-label="Main Navigation"
      >`
  },
  {
    target: `<div className="hidden xl:flex items-center gap-2 xl:gap-2.5 2xl:gap-4">`,
    replacement: `<div className="hidden xl:flex items-center gap-2 xl:gap-2.5 2xl:gap-4 font-editorial-nav">`
  }
];

updateFile('src/components/Navbar.tsx', navbarTransforms);

// 3. Update src/pages/HomePage.tsx hero & section paddings
const homePageTransforms = [
  {
    target: `      <section className="bg-brand-ivory pt-12 sm:pt-16 lg:pt-16 xl:pt-14 pb-14 sm:pb-20 lg:pb-16 xl:pb-14 border-b border-brand-border relative overflow-hidden min-h-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left 7 Columns: Editorial Narrative & Action Cluster */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 scroll-reveal-left">
              
              {/* Institutional Practice Kicker */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-surface border border-brand-border/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-brand-gold motion-safe:animate-pulse" />
                <span className="text-xs font-semibold text-brand-forest">
                  Independent Chartered Accountancy Practice, Tirupati
                </span>
              </div>

              {/* Master Headline (Cormorant Garamond Monumental Serif) */}
              <div className="space-y-1">
                <h1 className="font-editorial-h1 leading-[1.15]">
                <span className="block text-brand-forest">Chartered Accountant in Tirupati</span>
                <span className="block text-gold-dark font-serif italic text-[0.82em] mt-1.5 font-medium">Statutory Rigor & Commercial Tax Counsel</span>
              </h1>
              </div>

              {/* Authoritative Lead Narrative */}
              <p className="font-editorial-body text-brand-charcoal/85 leading-relaxed max-w-2xl font-normal">
                Founded by <strong className="text-brand-forest font-semibold">CA Kavitha Vijay (B.Com, CA, CMA AIR 49)</strong>, an MNC Auditor with 10+ years of Big 4 (Deloitte) and Fortune 50 multinational experience, our practice bridges rigorous statutory assurance with strategic financial governance. We safeguard corporate compliance, navigate complex tax scrutiny, and deliver direct partner-level counsel to enterprises, MSMEs, and institutions across South India.
              </p>

              {/* Primary Call to Action Cluster with Dual-Arrow Micro-physics */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-2">
                <DualArrowButton
                  href="#contact-section"
                  variant="primary"
                  className="w-full sm:w-auto text-xs sm:text-sm font-semibold"
                >
                  Request Consultation
                </DualArrowButton>

                <DualArrowButton
                  to="/services"
                  variant="secondary"
                  className="w-full sm:w-auto text-xs sm:text-sm font-semibold"
                >
                  Explore Practice Disciplines
                </DualArrowButton>

                <a
                  href={\`tel:\${FIRM_DATA.contact.primaryPhoneClean}\`}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest w-full sm:w-auto justify-center inline-flex items-center gap-2 text-xs font-semibold text-brand-charcoal hover:text-brand-forest py-2.5 px-3.5 rounded-full hover:bg-brand-surface transition-colors btn-tactile min-h-[44px]"
                  title="Direct telephone line"
                >
                  <Phone className="w-4 h-4 text-gold-dark" />
                  <span>Call {FIRM_DATA.contact.primaryPhone}</span>
                </a>
              </div>

              {/* Trust Creed Strip */}
              <div className="pt-4 border-t border-brand-border/60 flex flex-wrap items-center gap-3 text-xs text-brand-muted">
                <span className="text-brand-forest font-semibold">Trust</span>
                <span className="text-brand-gold/60" aria-hidden="true">,</span>
                <span className="text-brand-forest font-semibold">Expertise</span>
                <span className="text-brand-gold/60" aria-hidden="true">,</span>
                <span className="text-brand-forest font-semibold">Strategic Counsel</span>
                <span className="text-brand-gold/60 hidden sm:inline" aria-hidden="true">,</span>
                <span className="text-brand-forest hidden sm:inline font-semibold">Established Practice</span>
              </div>
            </div>`,
    replacement: `      <section className="bg-brand-ivory pt-6 xs:pt-8 sm:pt-14 lg:pt-16 pb-10 sm:pb-16 lg:pb-16 border-b border-brand-border relative overflow-hidden min-h-0 flex items-center">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            {/* Left 7 Columns: Editorial Narrative & Action Cluster */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-5 scroll-reveal-left">
              
              {/* Institutional Practice Kicker */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-brand-surface border border-brand-border/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-brand-gold motion-safe:animate-pulse" />
                <span className="text-[11px] sm:text-xs font-semibold text-brand-forest">
                  Independent Chartered Accountancy Practice, Tirupati
                </span>
              </div>

              {/* Master Headline (Cormorant Garamond Monumental Serif) */}
              <div className="space-y-1">
                <h1 className="font-editorial-h1 leading-[1.14]">
                  <span className="block text-brand-forest">Chartered Accountant in Tirupati</span>
                  <span className="block font-editorial-hero-sub text-gold-dark font-serif italic mt-1.5 sm:mt-2 font-medium">
                    Statutory Rigor &amp; Commercial Tax Counsel
                  </span>
                </h1>
              </div>

              {/* Authoritative Lead Narrative */}
              <p className="font-editorial-body text-brand-charcoal/90 max-w-xl font-normal leading-[1.65] sm:leading-[1.7]">
                Founded by <strong className="text-brand-forest font-semibold">CA Kavitha Vijay (B.Com, CA, CMA AIR 49)</strong>, an MNC Auditor with 10+ years of Big 4 (Deloitte) and Fortune 50 multinational experience, our practice bridges rigorous statutory assurance with strategic financial governance. We safeguard corporate compliance, navigate complex tax scrutiny, and deliver direct partner-level counsel to enterprises, MSMEs, and institutions across South India.
              </p>

              {/* Primary Call to Action Cluster with Dual-Arrow Micro-physics */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
                <DualArrowButton
                  href="#contact-section"
                  variant="primary"
                  className="w-full sm:w-auto text-xs sm:text-sm font-semibold justify-center py-2.5 sm:py-2.5 px-5 min-h-[46px]"
                >
                  Request Consultation
                </DualArrowButton>

                <DualArrowButton
                  to="/services"
                  variant="secondary"
                  className="w-full sm:w-auto text-xs sm:text-sm font-semibold justify-center py-2.5 sm:py-2.5 px-5 min-h-[46px]"
                >
                  Explore Practice Disciplines
                </DualArrowButton>

                <a
                  href={\`tel:\${FIRM_DATA.contact.primaryPhoneClean}\`}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest w-full sm:w-auto justify-center inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-charcoal hover:text-brand-forest py-2.5 px-4 rounded-full bg-brand-surface/70 hover:bg-brand-surface border border-brand-border/70 transition-colors btn-tactile min-h-[46px]"
                  title="Direct telephone line"
                >
                  <Phone className="w-4 h-4 text-gold-dark" />
                  <span>Call {FIRM_DATA.contact.primaryPhone}</span>
                </a>
              </div>

              {/* Trust Creed Strip */}
              <div className="pt-3 sm:pt-4 border-t border-brand-border/60 flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1.5 text-xs text-brand-muted">
                <span className="text-brand-forest font-semibold">Trust</span>
                <span className="text-brand-gold font-bold" aria-hidden="true">·</span>
                <span className="text-brand-forest font-semibold">Expertise</span>
                <span className="text-brand-gold font-bold" aria-hidden="true">·</span>
                <span className="text-brand-forest font-semibold">Strategic Counsel</span>
                <span className="text-brand-gold font-bold hidden xs:inline" aria-hidden="true">·</span>
                <span className="text-brand-forest hidden xs:inline font-semibold">Established Practice</span>
              </div>
            </div>`
  },
  {
    target: `className="py-20 sm:py-28 lg:py-32 bg-brand-white border-b border-brand-border scroll-mt-28"`,
    replacement: `className="py-10 sm:py-16 md:py-20 lg:py-28 bg-brand-white border-b border-brand-border scroll-mt-28"`
  },
  {
    target: `className="py-20 sm:py-28 lg:py-32 bg-brand-ivory border-b border-brand-border" id="services-overview"`,
    replacement: `className="py-10 sm:py-16 md:py-20 lg:py-28 bg-brand-ivory border-b border-brand-border" id="services-overview"`
  },
  {
    target: `className="py-20 sm:py-28 bg-brand-surface border-b border-brand-border"`,
    replacement: `className="py-10 sm:py-16 md:py-20 lg:py-24 bg-brand-surface border-b border-brand-border"`
  },
  {
    target: `className="py-20 sm:py-28 bg-brand-ivory border-b border-brand-border"`,
    replacement: `className="py-10 sm:py-16 md:py-20 lg:py-24 bg-brand-ivory border-b border-brand-border"`
  },
  {
    target: `className="py-20 sm:py-28 bg-brand-white border-b border-brand-border"`,
    replacement: `className="py-10 sm:py-16 md:py-20 lg:py-24 bg-brand-white border-b border-brand-border"`
  },
  {
    target: `className="py-20 sm:py-28 lg:py-32 bg-brand-ivory" id="contact-section"`,
    replacement: `className="py-10 sm:py-16 md:py-20 lg:py-28 bg-brand-ivory" id="contact-section"`
  }
];

updateFile('src/pages/HomePage.tsx', homePageTransforms);

// 4. Update src/components/Footer.tsx
const footerTransforms = [
  {
    target: `<footer className="bg-brand-deep text-brand-white border-t-2 border-brand-gold pt-16 pb-10 transition-colors">`,
    replacement: `<footer className="bg-brand-deep text-brand-white border-t-2 border-brand-gold pt-12 sm:pt-16 pb-20 sm:pb-10 transition-colors">`
  }
];

updateFile('src/components/Footer.tsx', footerTransforms);

console.log('Mobile layout & hero polish script completed successfully.');
