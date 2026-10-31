import fs from 'fs';
import path from 'path';

// =============================================================================
// 1. UPDATE NAVBAR (src/components/Navbar.tsx)
// =============================================================================
const navbarPath = path.resolve('src/components/Navbar.tsx');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

// Replace header container and top utility bar
const oldHeaderStart = '<header className={`sticky top-0 z-50 bg-brand-ivory/95';
const oldHeaderEnd = '{/* Main Navbar */}';

if (navbarContent.includes(oldHeaderStart) && navbarContent.includes(oldHeaderEnd)) {
  const startIndex = navbarContent.indexOf(oldHeaderStart);
  const endIndex = navbarContent.indexOf(oldHeaderEnd);
  
  const newHeaderReplacement = `<header className={\`sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b transition-all duration-300 \${
      isScrolled ? 'shadow-editorial py-0 border-brand-gold/50' : 'shadow-subtle py-0 border-brand-border/80'
    }\`}>
      {/* Top Utility Bar (Deep Imperial Emerald with Muted Gold Hairline Accent) */}
      <div className="bg-[#0A241D] text-brand-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-brand-gold/25">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-100/90 font-medium tracking-normal">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold shrink-0" aria-hidden="true" />
              <span className="font-editorial-meta text-[11px] tracking-wider uppercase text-emerald-200">Chartered Accountants &amp; Cost Accountants</span>
              <span className="hidden sm:inline text-brand-gold/60">•</span>
              <span className="hidden sm:inline text-brand-gold font-semibold">CA Kavitha Vijay</span>
              <span className="hidden xl:inline text-brand-gold/60">•</span>
              <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>FY 2026-27 Compliances Active</span>
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-emerald-100/90 flex-wrap text-xs">
            <a
              href={\`tel:\${FIRM_DATA.contact.primaryPhoneClean}\`}
              className="flex items-center gap-1.5 text-brand-gold/90 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold py-0.5"
              title="Click to call primary contact line"
            >
              <Phone className="w-3.5 h-3.5 text-brand-gold" aria-hidden="true" />
              <span className="font-semibold">{FIRM_DATA.contact.primaryPhone}</span>
            </a>
            <span className="hidden md:inline text-brand-gold/50">•</span>
            <a
              href={\`mailto:\${FIRM_DATA.contact.email}\`}
              className="hidden md:flex items-center gap-1.5 text-emerald-100/80 hover:text-brand-gold transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold py-0.5"
              title="Click to send email inquiry"
            >
              <Mail className="w-3.5 h-3.5 text-brand-gold" aria-hidden="true" />
              <span>{FIRM_DATA.contact.email}</span>
            </a>
            <span className="hidden lg:inline text-brand-gold/50">•</span>
            <span className="hidden lg:flex items-center gap-1 text-emerald-200/90">
              <MapPin className="w-3.5 h-3.5 text-brand-gold" aria-hidden="true" />
              <span className="font-editorial-meta text-[10px] uppercase tracking-wider">Tirupati &amp; Pan-India</span>
            </span>
          </div>
        </div>
      </div>\n\n      `;
  
  navbarContent = navbarContent.substring(0, startIndex) + newHeaderReplacement + navbarContent.substring(endIndex);
  console.log('✔ Navbar header & top utility bar upgraded.');
} else {
  console.warn('⚠ Could not match header markers in Navbar.tsx');
}

// Update action buttons padding to prevent 1024px overflow
const oldActionStart = '{/* Action Button & Contact Cluster */}';
const oldActionEnd = '{/* Mobile Menu Toggle Button (minimum 44x44px touch target) */}';

if (navbarContent.includes(oldActionStart) && navbarContent.includes(oldActionEnd)) {
  const startIndex = navbarContent.indexOf(oldActionStart);
  const endIndex = navbarContent.indexOf(oldActionEnd);
  
  const newActionReplacement = `{/* Action Button & Contact Cluster (Calibrated for strict 0px overflow across all viewports) */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
          <a
            href={FIRM_DATA.contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 border border-emerald-200/80 transition-colors btn-tactile whitespace-nowrap min-h-[42px]"
            title="Chat directly with chambers on WhatsApp"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>WhatsApp Desk</span>
          </a>
          <Link
            to="/contact"
            className="btn-pill-primary py-2 px-3.5 xl:px-5 text-xs font-semibold tracking-wider whitespace-nowrap shadow-sm hover:shadow-editorial min-h-[42px]"
          >
            <span>Schedule Consultation</span>
          </Link>
        </div>\n\n        `;
  
  navbarContent = navbarContent.substring(0, startIndex) + newActionReplacement + navbarContent.substring(endIndex);
  console.log('✔ Navbar action cluster & 1024px breakpoint spacing calibrated.');
} else {
  console.warn('⚠ Could not match action cluster markers in Navbar.tsx');
}

fs.writeFileSync(navbarPath, navbarContent, 'utf8');


// =============================================================================
// 2. UPDATE HOMEPAGE HERO & AUDIT SPOTLIGHT (src/pages/HomePage.tsx)
// =============================================================================
const homePath = path.resolve('src/pages/HomePage.tsx');
let homeContent = fs.readFileSync(homePath, 'utf8');

const heroStartIdx = homeContent.indexOf('SECTION 1: HERO & PRACTICE REGISTRY PLAQUE');
const heroEndIdx = homeContent.indexOf('STAGE 1: CROSSED TYPOGRAPHICAL ACCENT BANDS');

if (heroStartIdx !== -1 && heroEndIdx !== -1) {
  const actualStart = homeContent.lastIndexOf('{/*', heroStartIdx);
  const actualEnd = homeContent.lastIndexOf('{/*', heroEndIdx);

  const newHeroReplacement = `{/* =========================================================================
          SECTION 1: SERENE AUTHORITY HERO (Calm Architectural Editorial)
          Canvas: Warm Architectural Parchment #FAF7F2 (bg-[#FAF7F2])
          ========================================================================= */}
      <section className="bg-[#FAF7F2] pt-14 sm:pt-20 lg:pt-24 pb-16 sm:pb-24 border-b border-brand-border/70 relative overflow-hidden min-h-[82dvh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left 7 Columns: Serene Editorial Authority */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7 scroll-reveal-left">
              
              {/* Refined Practice Eyebrow Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-brand-gold/40 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                <span className="font-editorial-meta text-brand-forest uppercase tracking-[0.16em] text-[11px] font-bold">
                  Independent Chartered Accountancy Practice • Tirupati, AP
                </span>
              </div>

              {/* Master Display Headline (Monumental Cormorant Garamond Serif) */}
              <div className="space-y-1">
                <h1 className="font-editorial-h1 text-brand-forest text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.08] tracking-[-0.025em]">
                  Statutory Rigor.
                </h1>
                <h1 className="font-editorial-h1 text-brand-gold text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-[-0.025em] italic">
                  Practical Commercial Counsel.
                </h1>
              </div>

              {/* Authoritative Lead Narrative */}
              <p className="font-editorial-body text-brand-charcoal/85 text-base sm:text-lg leading-[1.75] max-w-2xl font-normal">
                Founded by <strong className="text-brand-forest font-semibold">CA Kavitha Vijay (ICAI Mem. 252985 | B.Com, CA, CMA AIR 49)</strong>, an MNC Auditor with 10+ years of Big 4 (Deloitte) and Fortune 50 multinational experience, our practice bridges rigorous statutory assurance with strategic financial governance. We safeguard corporate compliance, navigate complex tax scrutiny, and deliver direct partner-level counsel to enterprises, MSMEs, and institutions across South India.
              </p>

              {/* Architectural Credential Ribbon */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-1 text-xs text-brand-forest font-medium">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-brand-gold shrink-0" />
                  <span className="font-editorial-meta tracking-wider uppercase text-[11px] font-bold">ICAI Mem. 252985</span>
                </div>
                <span className="text-brand-gold/60">•</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
                  <span className="font-editorial-meta tracking-wider uppercase text-[11px] font-bold">CMA All India Rank 49</span>
                </div>
                <span className="text-brand-gold/60 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 hidden sm:flex">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span className="font-editorial-meta tracking-wider uppercase text-[11px] font-bold">Ex-Deloitte Big 4 &amp; Ford</span>
                </div>
              </div>

              {/* Primary Call to Action Cluster with Dual-Arrow Micro-physics */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-2">
                <DualArrowButton
                  href="#contact-section"
                  variant="primary"
                  className="w-full sm:w-auto text-xs sm:text-sm font-semibold shadow-editorial"
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
                  className="w-full sm:w-auto justify-center inline-flex items-center gap-2 text-xs font-semibold text-brand-charcoal hover:text-brand-forest py-2.5 px-3.5 rounded-full hover:bg-brand-surface transition-colors btn-tactile min-h-[44px]"
                  title="Direct telephone line"
                >
                  <Phone className="w-4 h-4 text-gold-dark" />
                  <span>Call {FIRM_DATA.contact.primaryPhone}</span>
                </a>
              </div>

              {/* Trust Creed Strip */}
              <div className="pt-4 border-t border-brand-border/60 flex flex-wrap items-center gap-3 font-editorial-meta text-brand-muted tracking-widest uppercase">
                <span className="text-brand-forest font-bold">TRUST</span>
                <span className="text-brand-gold">•</span>
                <span className="text-brand-forest font-bold">EXPERTISE</span>
                <span className="text-brand-gold">•</span>
                <span className="text-brand-forest font-bold">YOUR GROWTH PARTNER</span>
                <span className="text-brand-gold hidden sm:inline">•</span>
                <span className="text-emerald-800 hidden sm:inline font-semibold">ESTABLISHED PRACTICE</span>
              </div>
            </div>

            {/* Right 5 Columns: Architectural Chambers Showcase (Framed Museum Presentation) */}
            <div className="lg:col-span-5 scroll-reveal-right">
              <div className="rounded-3xl p-2 bg-[#102D25] border border-brand-gold/45 shadow-[0_20px_50px_rgba(16,45,37,0.22)] overflow-hidden">
                
                {/* Photo Frame Container */}
                <div className="relative h-72 sm:h-80 lg:h-[400px] w-full rounded-2xl overflow-hidden bg-brand-deep">
                  <img
                    src={
                      activeChamberPhoto === 'consultation'
                        ? '/brand/chambers/chamber-consultation.jpeg'
                        : '/brand/chambers/chamber-library.jpeg'
                    }
                    alt={
                      activeChamberPhoto === 'consultation'
                        ? 'CA Kavitha Vijay - Principal Consultation Chambers, Tirupati'
                        : 'Corporate Tax and Law Library Archives - Tirupati Chambers'
                    }
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="eager"
                  />
                  
                  {/* Subtle Architectural Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent to-brand-deep/20 pointer-events-none" />

                  {/* Elegant View Switcher in Top Right Corner */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20 z-10">
                    <button
                      type="button"
                      onClick={() => setActiveChamberPhoto('consultation')}
                      className={\`px-3 py-1 rounded-full text-[10px] font-semibold transition-all min-h-[28px] cursor-pointer \${
                        activeChamberPhoto === 'consultation'
                          ? 'bg-brand-gold text-brand-deep shadow-xs font-bold'
                          : 'text-white/80 hover:text-white'
                      }\`}
                      title="View Consultation Chambers"
                    >
                      Chambers
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveChamberPhoto('library')}
                      className={\`px-3 py-1 rounded-full text-[10px] font-semibold transition-all min-h-[28px] cursor-pointer \${
                        activeChamberPhoto === 'library'
                          ? 'bg-brand-gold text-brand-deep shadow-xs font-bold'
                          : 'text-white/80 hover:text-white'
                      }\`}
                      title="View Law Library Archives"
                    >
                      Archives
                    </button>
                  </div>
                </div>

                {/* Engraved Architectural Brass Caption Plaque at Base of Frame */}
                <div className="bg-[#102D25] pt-3.5 pb-2 px-3 sm:px-4 text-white">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="font-editorial-meta text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold block">
                        {activeChamberPhoto === 'consultation' ? 'PRINCIPAL CONSULTATION CHAMBERS' : 'STATUTORY LAW ARCHIVES'}
                      </span>
                      <span className="text-xs font-medium text-emerald-100/90 block mt-0.5">
                        19-12-46, Near Bairagipetteda Arch, Tirupati – 517501, AP
                      </span>
                    </div>
                    <a
                      href={FIRM_DATA.contact.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-forest/90 border border-brand-gold/40 text-[10px] font-bold text-brand-gold hover:text-white hover:border-brand-gold transition-colors shrink-0"
                    >
                      <MapPin className="w-3 h-3 text-brand-gold" />
                      <span>Map Pin</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>\n\n      `;

  homeContent = homeContent.substring(0, actualStart) + newHeroReplacement + homeContent.substring(actualEnd);
  console.log('✔ Hero section & architectural photo frame upgraded.');
} else {
  console.warn('⚠ Could not match hero section markers in HomePage.tsx');
}

// Next: Insert Monolithic Practice Registry Section right after SectorMarquee
const marqueeMarker = '<SectorMarquee />';
const marqueeIdx = homeContent.indexOf(marqueeMarker);

if (marqueeIdx !== -1) {
  const marqueeContainerClose = homeContent.indexOf('</div>', marqueeIdx);
  const insertPoint = marqueeContainerClose + '</div>'.length;

  const monolithicRegistrySection = `\n\n      {/* =========================================================================
          MONOLITHIC INSTITUTIONAL PRACTICE REGISTRY (Dark Emerald Showpiece)
          Canvas: Deep Imperial Emerald #0A241D (bg-[#0A241D])
          ========================================================================= */}
      <section className="bg-[#0A241D] text-white py-16 sm:py-20 border-b border-brand-gold/30 relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-brand-gold/5 border border-brand-gold/10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-deep border border-brand-gold/40 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              <span>Official Chambers Register • Estd. Tirupati</span>
            </div>
            <h2 className="font-editorial-h2 text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
              Institutional Pedigree &amp; Practice Registry
            </h2>
            <p className="font-editorial-body text-emerald-100/80 text-sm sm:text-base leading-relaxed">
              Every audit engagement, direct tax representation, and corporate advisory assignment is executed under the direct personal supervision and direct signature of CA Kavitha Vijay.
            </p>
          </div>

          {/* Practice Register Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 5 Cols: Senior Partner Seal Dossier */}
            <div className="lg:col-span-5 bg-brand-deep rounded-2xl p-6 sm:p-8 border border-brand-gold/40 shadow-editorial-lg relative">
              <div className="flex items-center gap-4 pb-6 border-b border-brand-forest">
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                  <img 
                    src="/brand/ka-seal-medallion.png" 
                    alt="KA Official Practice Seal" 
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>
                <div>
                  <span className="font-editorial-meta text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold block">
                    PRACTICE REGISTER • ESTD. TIRUPATI
                  </span>
                  <h3 className="font-editorial-h3 text-2xl font-bold text-white tracking-wide">
                    Kavitha &amp; Associates
                  </h3>
                  <span className="text-xs text-emerald-200/80 font-medium">
                    Chartered Accountants &amp; Cost Accountants
                  </span>
                </div>
              </div>

              {/* Partner Card Inside */}
              <div className="mt-6 p-4 rounded-xl bg-brand-forest/90 border border-brand-gold/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-editorial-meta text-[10px] font-bold uppercase tracking-wider text-gold-light bg-brand-deep px-2 py-0.5 rounded border border-brand-gold/20">
                    Senior Partner
                  </span>
                  <span className="text-[10px] text-emerald-200 font-medium">
                    ICAI Mem. 252985 • CMA AIR 49
                  </span>
                </div>
                <h4 className="font-editorial-h3 text-xl font-bold text-white mt-1">
                  {FIRM_DATA.partner.name}
                </h4>
                <p className="text-xs text-brand-gold font-semibold tracking-wide">
                  {FIRM_DATA.partner.qualifications} (Dual Qualifications)
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-forest flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Practice Chambers Active</span>
                </div>
                <a
                  href={FIRM_DATA.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-gold hover:text-white font-semibold text-xs transition-colors"
                >
                  <span>Direct WhatsApp Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right 7 Cols: 4 Architectural Ledger Pillars */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Pillar 1: Principal Chambers */}
              <div className="bg-brand-deep/80 rounded-2xl p-5 border border-brand-forest hover:border-brand-gold/40 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <MapPin className="w-5 h-5 text-brand-gold" />
                  <a
                    href={FIRM_DATA.contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-brand-gold hover:text-white transition-colors"
                  >
                    Google Map Pin →
                  </a>
                </div>
                <h4 className="text-white font-bold text-sm">Principal Chambers</h4>
                <p className="text-emerald-100/80 text-xs leading-relaxed">
                  19-12-46, Near Bairagipetteda Arch, Tirupati – 517501, Andhra Pradesh, India.
                </p>
              </div>

              {/* Pillar 2: Dual Qualification */}
              <div className="bg-brand-deep/80 rounded-2xl p-5 border border-brand-forest hover:border-brand-gold/40 transition-all space-y-2">
                <ShieldCheck className="w-5 h-5 text-brand-gold" />
                <h4 className="text-white font-bold text-sm">Dual Strategic Advantage</h4>
                <p className="text-emerald-100/80 text-xs leading-relaxed">
                  External Statutory Audit (ICAI) combined with Internal Cost &amp; Management Accounting (ICMAI AIR 49).
                </p>
              </div>

              {/* Pillar 3: Regional Corridors */}
              <div className="bg-brand-deep/80 rounded-2xl p-5 border border-brand-forest hover:border-brand-gold/40 transition-all space-y-2">
                <Compass className="w-5 h-5 text-brand-gold" />
                <h4 className="text-white font-bold text-sm">Regional Practice Corridors</h4>
                <p className="text-emerald-100/80 text-xs leading-relaxed">
                  Active statutory counsel spanning Tirupati, Chennai, Bengaluru, Hyderabad, and Coimbatore.
                </p>
              </div>

              {/* Pillar 4: Direct Accountability */}
              <div className="bg-brand-deep/80 rounded-2xl p-5 border border-brand-forest hover:border-brand-gold/40 transition-all space-y-2">
                <UserCheck className="w-5 h-5 text-brand-gold" />
                <h4 className="text-white font-bold text-sm">Partner Accountability</h4>
                <p className="text-emerald-100/80 text-xs leading-relaxed">
                  Zero junior delegate sign-offs. Every workpaper, audit memorandum, and filing reviewed by CA Kavitha Vijay.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>`;

  homeContent = homeContent.substring(0, insertPoint) + monolithicRegistrySection + homeContent.substring(insertPoint);
  console.log('✔ Monolithic practice registry section inserted below marquee.');
} else {
  console.warn('⚠ Could not match marquee marker in HomePage.tsx');
}

// 3. Update Audit Spotlight background to warm architectural parchment (#FAF7F2)
homeContent = homeContent.replace(
  'className="py-20 sm:py-28 lg:py-32 bg-brand-white border-b border-brand-border scroll-mt-28"',
  'className="py-20 sm:py-28 lg:py-32 bg-[#FAF7F2] border-b border-brand-border/80 scroll-mt-28"'
);

fs.writeFileSync(homePath, homeContent, 'utf8');
console.log('✔ HomePage.tsx successfully transformed.');
