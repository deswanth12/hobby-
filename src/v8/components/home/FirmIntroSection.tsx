import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useFirmProfile } from '../../adapters/backendAdapter';
import { Button } from '../common/Button';
import { DotGrid, ArchitecturalLines, SectionAccent, DecorativeLayer } from '../decorative';
import { Reveal } from '../animation';

export const FirmIntroSection: React.FC = () => {
  const firmProfile = useFirmProfile();

  return (
    <section 
      id="the-firm" 
      className="py-12 sm:py-16 lg:py-20 bg-[#F1EBDD] border-b border-[#D8D0BE] overflow-hidden relative texture-warm-ivory scroll-mt-28"
    >
      {/* Anchor Aliases for Deep Linking and Test Continuity */}
      <div id="about-us" className="scroll-mt-28" />
      <div id="about" className="scroll-mt-28" />

      {/* Ambient Decorative System */}
      <DecorativeLayer>
        <DotGrid
          variant="sage"
          width={220}
          height={220}
          className="absolute -bottom-8 -right-8 opacity-20 hidden md:block"
        />
      </DecorativeLayer>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left 6 Columns: Consultation Photo & Floating Credential Plaque */}
          <div className="lg:col-span-6 relative mb-6 lg:mb-0">
            <Reveal direction="left" delay={60} duration={650}>
              {/* Desktop Vertical Champagne Hairline Divider */}
              <div 
                className="hidden lg:block absolute -right-5 lg:-right-7 top-1/2 -translate-y-1/2 h-3/4 w-[1px] bg-[#B49A64]/30 pointer-events-none" 
                aria-hidden="true" 
              />

              <div className="relative p-2 sm:p-2.5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-card group">
                {/* Corner Brass Accents */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#B49A64]/50 rounded-tl-sm pointer-events-none group-hover:border-[#B49A64] transition-colors" aria-hidden="true" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#B49A64]/50 rounded-br-sm pointer-events-none group-hover:border-[#B49A64] transition-colors" aria-hidden="true" />

                {/* Dominant Professional Consultation Photograph */}
                <div className="relative z-10 rounded-xl overflow-hidden border border-[#D8D0BE] aspect-[16/10] bg-[#FAF7F0]">
                  <img
                    src="/images/ai-generated/about/consultation-main.webp"
                    alt="Senior corporate chartered accountant in strategic consultation with enterprise client"
                    width="1376"
                    height="768"
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                  />

                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#183529] border border-[#B49A64]/40 text-white flex items-center gap-2 text-[11px] font-semibold shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#B49A64] motion-safe:animate-pulse" />
                    <span>Estd. Tirupati Chambers • Pan-India Reach</span>
                  </div>
                </div>

                {/* Floating Partner Credential Plaque */}
                <div className="absolute -bottom-5 right-2 sm:right-6 z-20 bg-[#183529] rounded-2xl p-3.5 sm:p-4 text-white border border-[#B49A64]/50 shadow-2xl max-w-[290px] sm:max-w-sm hover:-translate-y-1 hover:border-[#B49A64] transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0B241C] border-2 border-[#B49A64] flex items-center justify-center shadow-md shrink-0">
                      <img 
                        src="/brand/ka-seal-medallion.webp" 
                        alt="Official Practice Credential Seal" 
                        width="48"
                        height="48"
                        className="w-10 h-10 object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-editorial-meta text-[10px] sm:text-[11px] font-semibold text-[#B49A64] uppercase tracking-wider truncate">
                          ICAI Practice Lead
                        </span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#071B14] text-[#B49A64] border border-[#B49A64]/30 shrink-0">
                          AIR 49
                        </span>
                      </div>
                      <p className="font-serif text-sm sm:text-base font-bold text-white tracking-wide leading-tight truncate">
                        {firmProfile.partner.name}
                      </p>
                      <p className="font-editorial-body text-[10px] sm:text-[11px] text-[#AAB4A0] mt-0.5 truncate">
                        {firmProfile.partner.qualifications} (ICMAI AIR 49) • 10+ Years Experience
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#294B39] flex items-center justify-between text-[10px] text-[#F1EBDD]">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#B49A64]" />
                      <span>Direct Partner Oversight</span>
                    </span>
                    <span className="font-editorial-meta uppercase tracking-wider text-[#B49A64]">
                      Pan-India
                    </span>
                  </div>
                </div>

              </div>
            </Reveal>
          </div>

          {/* Right 6 Columns: Editorial Narrative & Single Clean CTA */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <Reveal direction="right" delay={120} duration={650}>
              {/* Numbered Marker & Eyebrow Badge */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#7E5E1E] bg-[#FAF7F0] px-2.5 py-1 rounded-md border border-[#D8D0BE]">
                  01 / THE FIRM
                </span>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] text-[#35271F] font-editorial-meta text-xs border border-[#B49A64]/60 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7E5E1E]" />
                  <span className="tracking-widest uppercase font-semibold text-[#35271F]">ABOUT US</span>
                </div>
                <SectionAccent variant="bronze" className="hidden sm:flex ml-2" />
              </div>

              {/* Heading */}
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl text-[#35271F] font-serif font-bold tracking-tight leading-tight mt-3">
                Professional Expertise. Personal Commitment.
              </h2>

              {/* Thin Architectural Rule */}
              <ArchitecturalLines type="double-rule" variant="bronze" length="80px" className="my-2 opacity-70" />

              {/* Concise Narrative (~64 words) */}
              <p className="font-editorial-body text-sm sm:text-base text-[#35271F] leading-relaxed border-l-2 border-[#B49A64]/40 pl-3.5 sm:pl-4">
                Founded by CA Kavitha Vijay (B.Com, CA, CMA AIR 49 (ICMAI)), Kavitha &amp; Associates is an independent Chartered Accountancy firm in Tirupati, advising growth enterprises and established businesses across India. With senior statutory audit tenure at Deloitte Haskins &amp; Sells and multinational internal audit experience at Ford Motor Company, our practice delivers partner-led assurance, corporate taxation, and financial governance with uncompromising regulatory rigor.
              </p>

              {/* Single Clean Call-to-Action to Dedicated About Page */}
              <div className="pt-4">
                <Button
                  to="/about"
                  variant="dark"
                  size="md"
                  className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-editorial-meta text-xs font-semibold tracking-wider uppercase shadow-sm hover:shadow-md border border-[#B49A64]/50 group"
                >
                  <span>Read Full Practice Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B49A64] group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FirmIntroSection;
