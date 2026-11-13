import fs from 'fs';

let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

// 1. Refine Section 9 (Professional Insights) padding and spacing
content = content.replace(
  '<section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#F8EFDF] border-b border-[#E8D5B5] relative overflow-hidden texture-warm-plaster" id="insights-overview">',
  '<section className="py-12 sm:py-16 lg:py-20 bg-[#F8EFDF] border-b border-[#E8D5B5] relative overflow-hidden texture-warm-plaster" id="insights-overview">'
);

content = content.replace(
  '<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 scroll-reveal">',
  '<div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6 scroll-reveal">'
);

content = content.replace(
  '<div className="mt-12 text-center scroll-reveal">\r\n            <DualArrowButton\r\n              to="/blog"\r\n              variant="secondary"\r\n              className="inline-flex text-xs sm:text-sm font-semibold justify-center py-2.5 px-6 min-h-[46px]"\r\n            >\r\n              Explore All Technical Publications\r\n            </DualArrowButton>\r\n          </div>',
  `<div className="mt-8 sm:mt-10 text-center scroll-reveal">
            <DualArrowButton
              to="/blog"
              variant="secondary"
              className="inline-flex text-xs sm:text-sm font-semibold justify-center py-2.5 px-6 min-h-[46px]"
            >
              Explore All Technical Publications
            </DualArrowButton>
          </div>`
);

// Fallback for LF line endings if CRLF didn't match
if (!content.includes('mt-8 sm:mt-10 text-center scroll-reveal')) {
  content = content.replace(
    '<div className="mt-12 text-center scroll-reveal">\n            <DualArrowButton\n              to="/blog"\n              variant="secondary"\n              className="inline-flex text-xs sm:text-sm font-semibold justify-center py-2.5 px-6 min-h-[46px]"\n            >\n              Explore All Technical Publications\n            </DualArrowButton>\n          </div>',
    `<div className="mt-8 sm:mt-10 text-center scroll-reveal">
            <DualArrowButton
              to="/blog"
              variant="secondary"
              className="inline-flex text-xs sm:text-sm font-semibold justify-center py-2.5 px-6 min-h-[46px]"
            >
              Explore All Technical Publications
            </DualArrowButton>
          </div>`
  );
}

// 2. Refine Section 10 (Consultation CTA)
const oldSection10Start = '{/* =========================================================================\r\n          SECTION 10: CONSULTATION CTA';
const oldSection10End = '{/* =========================================================================\r\n          SECTION 11: CHAMBERS CONSULTATION';

// Construct the new Section 10 with restrained architectural geometry, champagne structural lines, balanced heading, tightened vertical rhythm
const newSection10 = `{/* =========================================================================
          SECTION 10: CONSULTATION CTA (Pan-India Reach & Direct Chambers Line)
          Canvas: Deep Forest Green #102D25 with Champagne Architectural Geometry
          ========================================================================= */}
      <section 
        className="py-12 sm:py-16 lg:py-18 bg-[#102D25] text-white border-t border-b border-[#C3A66B]/25 relative overflow-hidden" 
        id="consultation-cta"
      >
        {/* Subtle Restrained Radial Lighting (centered luminous ambient, no harsh blobs) */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(195,166,107,0.10)_0%,rgba(16,45,37,0)_75%)] pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 scroll-reveal">
          {/* Architectural Outer Frame with Champagne Hairline Borders & Corner Accents */}
          <div className="relative rounded-2xl sm:rounded-3xl border border-[#C3A66B]/30 bg-[#153F32]/75 backdrop-blur-xs p-6 sm:p-10 lg:p-12 shadow-editorial-lg text-center overflow-hidden">
            
            {/* Architectural 4-Corner Hairline Brackets */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#C3A66B]/60 pointer-events-none" aria-hidden="true" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#C3A66B]/60 pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#C3A66B]/60 pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#C3A66B]/60 pointer-events-none" aria-hidden="true" />

            {/* Architectural Champagne Hairline Horizontal Dividers (Subtle geometry) */}
            <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#C3A66B]/40 to-transparent pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#C3A66B]/40 to-transparent pointer-events-none" aria-hidden="true" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102D25] text-[#C3A66B] font-editorial-meta text-xs border border-[#C3A66B]/40 shadow-xs mb-3.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C3A66B]" />
              <span className="uppercase tracking-wider font-semibold text-[11px] sm:text-xs">PAN-INDIA PRACTICE • DIRECT PARTNER DESK</span>
            </div>

            {/* Master Heading with balanced line wrapping */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-[1.2] max-w-2xl mx-auto tracking-tight [text-wrap:balance]">
              Ready to Discuss Your Financial &amp; Statutory Priorities?
            </h2>

            {/* Description */}
            <p className="font-editorial-body text-xs sm:text-sm md:text-base text-emerald-100/90 max-w-xl mx-auto mt-3 leading-relaxed">
              Direct partner consultation with CA Kavitha Vijay. Seamless digital working papers for clients nationwide and dedicated chambers in Tirupati.
            </p>

            {/* Action Row: 3 Perfectly Aligned Buttons */}
            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 flex-wrap">
              <DualArrowButton
                href="#contact-section"
                variant="primary"
                className="w-full sm:w-auto text-xs sm:text-sm font-semibold justify-center h-12 min-h-[48px] px-6 rounded-full shadow-sm hover:shadow-editorial whitespace-nowrap"
              >
                Request Formal Consultation
              </DualArrowButton>

              <a
                href={\`tel:\${FIRM_DATA.contact.primaryPhoneClean}\`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 min-h-[48px] px-6 rounded-full bg-[#102D25] text-white hover:bg-[#153F32] border border-[#C3A66B]/50 text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-editorial btn-tactile whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-[#C3A66B] shrink-0" />
                <span>Direct Line: {FIRM_DATA.contact.primaryPhone}</span>
              </a>

              <a
                href={FIRM_DATA.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 min-h-[48px] px-6 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-400/40 text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-editorial min-h-[48px] whitespace-nowrap"
              >
                <span>WhatsApp Consultation</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C3A66B] shrink-0" />
              </a>
            </div>

            {/* Trust Indicators Strip with Champagne Border */}
            <div className="mt-6 sm:mt-7 pt-5 border-t border-[#C3A66B]/20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-emerald-200/80">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C3A66B] shrink-0" />
                <span>Strict ICAI Confidentiality</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C3A66B] shrink-0" />
                <span>Direct Partner Sign-Off</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C3A66B] shrink-0" />
                <span>No Automated Call Queues</span>
              </span>
            </div>

          </div>
        </div>
      </section>

      `;

// Regex replace Section 10
const regexSection10 = /\{\/\* =+[\r\n\s]+SECTION 10: CONSULTATION CTA[\s\S]*?(?=\{\/\* =+[\r\n\s]+SECTION 11: CHAMBERS CONSULTATION)/;

if (regexSection10.test(content)) {
  content = content.replace(regexSection10, newSection10);
  console.log('Successfully replaced Section 10');
} else {
  console.error('Failed to match Section 10 regex');
}

// 3. Ensure Section 11 has data-contact-section="true"
content = content.replace(
  '<section className="py-10 sm:py-16 md:py-20 lg:py-28 bg-brand-ivory border-b border-brand-border texture-ivory-paper relative overflow-hidden" id="contact-section">',
  '<section data-contact-section="true" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-ivory border-b border-brand-border texture-ivory-paper relative overflow-hidden" id="contact-section">'
);

fs.writeFileSync('src/pages/HomePage.tsx', content, 'utf8');
console.log('Successfully updated HomePage.tsx');
