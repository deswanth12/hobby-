import fs from 'fs';
import path from 'path';

function updateFile(filePath, transforms) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  let content = fs.readFileSync(fullPath, 'utf8').replace(/\r\n/g, '\n');
  let original = content;

  for (const { from, to } of transforms) {
    const normalizedFrom = typeof from === 'string' ? from.replace(/\r\n/g, '\n') : from;
    const normalizedTo = typeof to === 'string' ? to.replace(/\r\n/g, '\n') : to;

    if (typeof normalizedFrom === 'string') {
      if (!content.includes(normalizedFrom)) {
        console.warn(`[WARN] Target not found in ${filePath}:\n${normalizedFrom.slice(0, 100)}...`);
      } else {
        content = content.replace(normalizedFrom, normalizedTo);
      }
    } else if (normalizedFrom instanceof RegExp) {
      if (!normalizedFrom.test(content)) {
        console.warn(`[WARN] Regex target not matched in ${filePath}: ${normalizedFrom}`);
      } else {
        content = content.replace(normalizedFrom, normalizedTo);
      }
    }
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[UPDATED] ${filePath}`);
  } else {
    console.log(`[UNCHANGED] ${filePath}`);
  }
}

console.log('Applying mobile-first UX optimizations across website (with CRLF normalization)...');

// 1. src/index.css
updateFile('src/index.css', [
  {
    from: `.btn-back-to-top {
    position: fixed;
    bottom: 5.5rem;
    right: 1.5rem;
    z-index: 40;
    width: 2.75rem;
    height: 2.75rem;`,
    to: `.btn-back-to-top {
    position: fixed;
    bottom: 4.75rem;
    right: 1.25rem;
    z-index: 40;
    width: 2.75rem;
    height: 2.75rem;
    min-width: 44px;
    min-height: 44px;`
  }
]);

// 2. ContactForm.tsx
updateFile('src/components/ContactForm.tsx', [
  {
    from: `name="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={\`w-full px-3.5 py-2.5 rounded-lg border text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none`,
    to: `name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={\`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none`
  },
  {
    from: `name="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"`,
    to: `name="organization"
                autoComplete="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"`
  },
  {
    from: `type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={\`w-full px-3.5 py-2.5 rounded-lg border text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none`,
    to: `type="tel"
                inputMode="tel"
                autoComplete="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={\`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none`
  },
  {
    from: `type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={\`w-full px-3.5 py-2.5 rounded-lg border text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none`,
    to: `type="email"
                inputMode="email"
                autoComplete="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={\`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none`
  },
  {
    from: `id="serviceCategory"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"`,
    to: `id="serviceCategory"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"`
  },
  {
    from: `id="city"
                name="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"`,
    to: `id="city"
                name="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"`
  },
  {
    from: `id="entityType"
                name="entityType"
                value={formData.entityType}
                onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"`,
    to: `id="entityType"
                name="entityType"
                value={formData.entityType}
                onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"`
  },
  {
    from: `id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"`,
    to: `id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"`
  },
  {
    from: `id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={\`w-full px-3.5 py-2.5 rounded-lg border text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none`,
    to: `id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={\`w-full px-3.5 py-2.5 rounded-lg border text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none`
  }
]);

// 3. Footer.tsx
updateFile('src/components/Footer.tsx', [
  {
    from: `<div className="flex flex-col gap-1">
                  <a href={\`tel:\${FIRM_DATA.contact.primaryPhoneClean}\`} className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors font-medium">
                    {FIRM_DATA.contact.primaryPhone}
                  </a>
                  <a href={\`tel:\${FIRM_DATA.contact.secondaryPhoneClean}\`} className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors text-emerald-200/80">
                    {FIRM_DATA.contact.secondaryPhone}
                  </a>
                </div>`,
    to: `<div className="flex flex-col gap-1">
                  <a href={\`tel:\${FIRM_DATA.contact.primaryPhoneClean}\`} className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors font-medium min-h-[44px] flex items-center py-1">
                    {FIRM_DATA.contact.primaryPhone}
                  </a>
                  <a href={\`tel:\${FIRM_DATA.contact.secondaryPhoneClean}\`} className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors text-emerald-200/80 min-h-[44px] flex items-center py-1">
                    {FIRM_DATA.contact.secondaryPhone}
                  </a>
                </div>`
  },
  {
    from: `<img 
                  src="/brand/ka-seal-medallion.png" 
                  alt="Kavitha &amp; Associates Official Practice Seal" 
                  className="w-full h-full object-contain drop-shadow-sm"
                />`,
    to: `<img 
                  src="/brand/ka-seal-medallion.png" 
                  alt="Kavitha &amp; Associates Official Practice Seal" 
                  width="48"
                  height="48"
                  className="w-full h-full object-contain drop-shadow-sm"
                />`
  }
]);

// 4. Navbar.tsx
updateFile('src/components/Navbar.tsx', [
  {
    from: `{/* Top Utility Bar */}
      <div className="bg-brand-deep text-brand-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-brand-forest/40">`,
    to: `{/* Top Utility Bar */}
      <div className="hidden md:block bg-brand-deep text-brand-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-brand-forest/40">`
  },
  {
    from: `<img
              src="/brand/ka-monogram-flat.svg"
              alt="Kavitha &amp; Associates Official Practice Monogram"
              className="w-full h-full object-contain drop-shadow-xs "
            />`,
    to: `<img
              src="/brand/ka-monogram-flat.svg"
              alt="Kavitha &amp; Associates Official Practice Monogram"
              width="44"
              height="44"
              className="w-full h-full object-contain drop-shadow-xs "
            />`
  },
  {
    from: `{/* Restrained Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3.5 2xl:gap-5">`,
    to: `{/* Restrained Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-2 xl:gap-2.5 2xl:gap-4">`
  },
  {
    from: `{/* Action Button & Contact Cluster (Arranged Executive Suite) */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">`,
    to: `{/* Action Button & Contact Cluster (Arranged Executive Suite) */}
        <div className="hidden xl:flex items-center gap-2 xl:gap-2.5 shrink-0">`
  },
  {
    from: `{/* Mobile Menu Toggle Button (minimum 44x44px touch target) */}
        <button
          ref={toggleButtonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-brand-forest hover:bg-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-forest btn-tactile"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6 transition-transform rotate-90" /> : <Menu className="w-6 h-6" />}
        </button>`,
    to: `{/* Mobile Quick Direct Actions & Hamburger Toggle Cluster */}
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
        </div>`
  },
  {
    from: `<div 
            data-testid="mobile-backdrop"
            className={\`fixed inset-0 bg-brand-deep/60 backdrop-blur-sm z-[90] lg:hidden transition-opacity duration-300 \${`,
    to: `<div 
            data-testid="mobile-backdrop"
            className={\`fixed inset-0 bg-brand-deep/60 backdrop-blur-sm z-[90] xl:hidden transition-opacity duration-300 \${`
  },
  {
    from: `className={\`fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm h-full max-h-[100dvh] bg-brand-ivory z-[100] shadow-2xl lg:hidden flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-in-out border-l border-brand-border \${`,
    to: `className={\`fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm h-full max-h-[100dvh] bg-brand-ivory z-[100] shadow-2xl xl:hidden flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-in-out border-l border-brand-border \${`
  }
]);

// 5. HomePage.tsx
updateFile('src/pages/HomePage.tsx', [
  {
    from: `<img 
                          src="/brand/ka-seal-medallion.png" 
                          alt="KA Official Practice Seal" 
                          className="w-full h-full object-contain drop-shadow-md"
                        />`,
    to: `<img 
                          src="/brand/ka-seal-medallion.png" 
                          alt="KA Official Practice Seal" 
                          width="56"
                          height="56"
                          className="w-full h-full object-contain drop-shadow-md"
                        />`
  },
  {
    from: `<h3 
                          className="font-editorial-h3 text-2xl font-bold text-white tracking-wide"
                          
                        >
                          Kavitha & Associates
                        </h3>`,
    to: `<h2 
                          className="font-editorial-h3 text-2xl font-bold text-white tracking-wide"
                          
                        >
                          Kavitha & Associates
                        </h2>`
  },
  {
    from: `<h4 
                      className="font-editorial-h3 text-xl font-bold text-white mt-1"
                      
                    >
                      {FIRM_DATA.partner.name}
                    </h4>`,
    to: `<h3 
                      className="font-editorial-h3 text-xl font-bold text-white mt-1"
                      
                    >
                      {FIRM_DATA.partner.name}
                    </h3>`
  }
]);

console.log('Mobile-first updates complete!');
