import fs from 'fs';
import path from 'path';

function updateFile(filePath, transforms) {
  const fullPath = path.resolve(filePath);
  let content = fs.readFileSync(fullPath, 'utf8').replace(/\r\n/g, '\n');
  let original = content;

  for (const { from, to } of transforms) {
    const nFrom = typeof from === 'string' ? from.replace(/\r\n/g, '\n') : from;
    const nTo = typeof to === 'string' ? to.replace(/\r\n/g, '\n') : to;

    if (typeof nFrom === 'string') {
      if (!content.includes(nFrom)) {
        console.warn(`[WARN] Target not found in ${filePath}:\n${nFrom.slice(0, 100)}...`);
      } else {
        content = content.replace(nFrom, nTo);
      }
    } else if (nFrom instanceof RegExp) {
      content = content.replace(nFrom, nTo);
    }
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[UPDATED] ${filePath}`);
  } else {
    console.log(`[UNCHANGED] ${filePath}`);
  }
}

// 1. AccentTicker.tsx - Pure 100% width, zero overflow across all 10 viewports
updateFile('src/components/animations/AccentTicker.tsx', [
  {
    from: `<div className="w-full ml-0 rotate-0 sm:w-[110%] sm:-ml-[5%] sm:transform sm:-rotate-1 origin-center shadow-md bg-brand-forest border-y border-brand-gold/40 py-2 sm:py-2.5 overflow-hidden marquee-mask">`,
    to: `<div className="w-full shadow-md bg-brand-forest border-y border-brand-gold/40 py-2 sm:py-2.5 overflow-hidden marquee-mask">`
  },
  {
    from: `<div className="w-full ml-0 rotate-0 sm:w-[110%] sm:-ml-[5%] sm:transform sm:rotate-1 origin-center shadow-lg bg-brand-deep border-y border-brand-gold/30 py-2 sm:py-2.5 mt-2 overflow-hidden marquee-mask">`,
    to: `<div className="w-full shadow-lg bg-brand-deep border-y border-brand-gold/30 py-2 sm:py-2.5 mt-2 overflow-hidden marquee-mask">`
  }
]);

// 2. HomePage.tsx - Add overflow-hidden on double-bezel-dark
updateFile('src/pages/HomePage.tsx', [
  {
    from: `<div \n                className="double-bezel-dark animate-fade-up rounded-3xl p-1.5"`,
    to: `<div \n                className="double-bezel-dark animate-fade-up rounded-3xl p-1.5 overflow-hidden"`
  },
  {
    from: `className="double-bezel-dark animate-fade-up rounded-3xl p-1.5"`,
    to: `className="double-bezel-dark animate-fade-up rounded-3xl p-1.5 overflow-hidden"`
  }
]);

// 3. App.tsx - Ensure PublicLayout has overflow-x-hidden and max-w-full
updateFile('src/App.tsx', [
  {
    from: `<div className="flex flex-col min-h-screen bg-brand-warm selection:bg-brand-pale selection:text-brand-primary relative">`,
    to: `<div className="flex flex-col min-h-screen bg-brand-warm selection:bg-brand-pale selection:text-brand-primary relative overflow-x-hidden w-full max-w-full">`
  }
]);

// 4. Navbar.tsx - Clean single-row mobile header
updateFile('src/components/Navbar.tsx', [
  {
    from: `{/* Mobile Quick Direct Actions & Hamburger Toggle Cluster */}
        <div className="flex items-center gap-1 xl:hidden">
          {/* Quick 1-Tap Direct Call */}
          <a
            href={\`tel:\${FIRM_DATA.contact.primaryPhoneClean}\`}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-brand-forest hover:bg-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-forest btn-tactile"
            aria-label={\`Call \${FIRM_DATA.contact.primaryPhone}\`}
            title={\`Call \${FIRM_DATA.contact.primaryPhone}\`}
          >
            <Phone className="w-4 h-4 text-gold-dark" />
          </a>

          {/* Quick 1-Tap Direct WhatsApp */}
          <a
            href={FIRM_DATA.contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 btn-tactile"
            aria-label="Connect with chambers on WhatsApp"
            title="Chat directly on WhatsApp"
          >
            <WhatsAppNavIcon className="w-4 h-4 text-emerald-700" />
          </a>

          {/* Mobile Menu Toggle Button (minimum 44x44px touch target) */}
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-brand-forest hover:bg-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-forest btn-tactile"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6 transition-transform rotate-90" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>`,
    to: `{/* Mobile Quick Direct Actions & Hamburger Toggle Cluster */}
        <div className="flex items-center gap-1 xl:hidden">
          {/* Quick 1-Tap Direct Call (Tablet only to preserve narrow phone single-line header) */}
          <a
            href={\`tel:\${FIRM_DATA.contact.primaryPhoneClean}\`}
            className="hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center rounded-lg text-brand-forest hover:bg-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-forest btn-tactile"
            aria-label={\`Call \${FIRM_DATA.contact.primaryPhone}\`}
            title={\`Call \${FIRM_DATA.contact.primaryPhone}\`}
          >
            <Phone className="w-4 h-4 text-gold-dark" />
          </a>

          {/* Mobile Menu Toggle Button (minimum 44x44px touch target) */}
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-brand-forest hover:bg-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-forest btn-tactile"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6 transition-transform rotate-90" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>`
  }
]);

console.log('Final polish applied successfully.');
