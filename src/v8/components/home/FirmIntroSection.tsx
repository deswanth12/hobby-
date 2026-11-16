import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Award, Users } from 'lucide-react';
import { useFirmProfile } from '../../adapters/backendAdapter';
import { Button } from '../common/Button';
import { DotGrid, ArchitecturalLines, SectionAccent, DecorativeLayer } from '../decorative';
import { Reveal } from '../animation';

interface AssurancePillar {
  id: string;
  label: string;
  hallmarks: string[];
}

const ASSURANCE_PILLARS: AssurancePillar[] = [
  {
    id: 'partner-oversight',
    label: 'Direct Partner Oversight',
    hallmarks: [
      '100% audits supervised personally by CA Kavitha Vijay',
      'Direct partner review of working papers & reconciliations',
      'Zero delegation of critical opinions to unqualified staff',
    ],
  },
  {
    id: 'dual-credentials',
    label: 'Dual CA + CMA Mastery',
    hallmarks: [
      'Statutory compliance integrated with cost controllership',
      'All-India Rank 49 (ICMAI) analytical cost rigor',
      'Ex-Deloitte Haskins & Sells statutory audit standards',
    ],
  },
  {
    id: 'independence',
    label: 'Zero-Conflict Independence',
    hallmarks: [
      'Strict adherence to ICAI Code of Ethics & Independence',
      'Objective advisory with transparent statutory boundaries',
      'Sole registered practice in Tirupati with pan-India reach',
    ],
  },
];

export const FirmIntroSection: React.FC = () => {
  const firmProfile = useFirmProfile();
  const [activePillar, setActivePillar] = useState<string>('partner-oversight');

  const selectedPillar = ASSURANCE_PILLARS.find(p => p.id === activePillar) || ASSURANCE_PILLARS[0];

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
        
        {/* 3-Pillar Institutional Conduit (Bridging Hero Horizon & Firm Intro) */}
        <Reveal delay={40} duration={600}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-14">
            {/* Pillar 01 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-sm hover:border-[#B49A64] hover:shadow-[0_12px_28px_rgba(180,154,100,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-3.5 group relative overflow-hidden">
              <div className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B49A64]/0 to-transparent group-hover:via-[#B49A64] transition-all duration-500" aria-hidden="true" />
              <div className="w-11 h-11 rounded-xl bg-[#183529] border border-[#B49A64]/40 flex items-center justify-center text-[#B49A64] group-hover:bg-[#071B14] group-hover:scale-105 group-hover:rotate-6 group-hover:border-[#C5A059] transition-all duration-300 shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7E5E1E] block">
                  Assurance Rigor
                </span>
                <p className="font-serif text-sm sm:text-base font-bold text-[#35271F] group-hover:text-[#183529] transition-colors leading-tight truncate">
                  Deloitte Big 4 Pedigree
                </p>
                <p className="font-editorial-body text-[11px] text-[#525954] mt-0.5 truncate">
                  Senior statutory audit working paper discipline
                </p>
              </div>
            </div>

            {/* Pillar 02 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-sm hover:border-[#B49A64] hover:shadow-[0_12px_28px_rgba(180,154,100,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-3.5 group relative overflow-hidden">
              <div className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B49A64]/0 to-transparent group-hover:via-[#B49A64] transition-all duration-500" aria-hidden="true" />
              <div className="w-11 h-11 rounded-xl bg-[#183529] border border-[#B49A64]/40 flex items-center justify-center text-[#B49A64] group-hover:bg-[#071B14] group-hover:scale-105 group-hover:rotate-6 group-hover:border-[#C5A059] transition-all duration-300 shrink-0 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7E5E1E] block">
                  Dual Credentials
                </span>
                <p className="font-serif text-sm sm:text-base font-bold text-[#35271F] group-hover:text-[#183529] transition-colors leading-tight truncate">
                  CA + CMA (AIR 49 ICMAI)
                </p>
                <p className="font-editorial-body text-[11px] text-[#525954] mt-0.5 truncate">
                  Tax compliance fused with industrial cost modeling
                </p>
              </div>
            </div>

            {/* Pillar 03 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-sm hover:border-[#B49A64] hover:shadow-[0_12px_28px_rgba(180,154,100,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-3.5 group relative overflow-hidden">
              <div className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B49A64]/0 to-transparent group-hover:via-[#B49A64] transition-all duration-500" aria-hidden="true" />
              <div className="w-11 h-11 rounded-xl bg-[#183529] border border-[#B49A64]/40 flex items-center justify-center text-[#B49A64] group-hover:bg-[#071B14] group-hover:scale-105 group-hover:rotate-6 group-hover:border-[#C5A059] transition-all duration-300 shrink-0 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7E5E1E] block">
                  Direct Supervision
                </span>
                <p className="font-serif text-sm sm:text-base font-bold text-[#35271F] group-hover:text-[#183529] transition-colors leading-tight truncate">
                  100% Partner Lead
                </p>
                <p className="font-editorial-body text-[11px] text-[#525954] mt-0.5 truncate">
                  Zero delegation of critical opinions to juniors
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left 6 Columns: Consultation Photo & Floating Credential Plaque */}
          <div className="lg:col-span-6 relative mb-6 lg:mb-0">
            <Reveal direction="left" delay={60} duration={650}>
              {/* Desktop Vertical Champagne Hairline Divider */}
              <div 
                className="hidden lg:block absolute -right-5 lg:-right-7 top-1/2 -translate-y-1/2 h-3/4 w-[1px] bg-[#B49A64]/30 pointer-events-none" 
                aria-hidden="true" 
              />

              <div className="relative p-2 sm:p-2.5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-[0_16px_40px_rgba(24,53,41,0.12)] group hover:shadow-[0_20px_48px_rgba(180,154,100,0.22)] transition-shadow duration-500 overflow-visible">
                {/* Top Metallic Hairline Accent */}
                <div 
                  className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B49A64]/40 to-transparent group-hover:via-[#B49A64] transition-all duration-500" 
                  aria-hidden="true" 
                />

                {/* Dynamic Corner Brass Accents (Expand on Hover) */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 group-hover:w-5 group-hover:h-5 border-t-2 border-l-2 border-[#B49A64]/50 rounded-tl-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 group-hover:w-5 group-hover:h-5 border-b-2 border-r-2 border-[#B49A64]/50 rounded-br-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />

                {/* Dominant Professional Consultation Photograph */}
                <div className="relative z-10 rounded-xl overflow-hidden border border-[#D8D0BE] aspect-[16/10] bg-[#FAF7F0]">
                  <img
                    src="/images/ai-generated/about/consultation-main.webp"
                    alt="Senior corporate chartered accountant in strategic consultation with enterprise client"
                    width="1376"
                    height="768"
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />

                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#183529] border border-[#B49A64]/40 text-white flex items-center gap-2 text-[11px] font-semibold shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#B49A64] motion-safe:animate-pulse" />
                    <span>Estd. Tirupati Chambers • Pan-India Reach</span>
                  </div>
                </div>

                {/* Floating Partner Credential Plaque */}
                <div className="absolute -bottom-5 right-2 sm:right-6 z-20 bg-gradient-to-b from-[#183529] to-[#0E271F] rounded-2xl p-3.5 sm:p-4 text-white border border-[#B49A64]/60 shadow-[0_16px_36px_rgba(7,27,20,0.45)] max-w-[320px] sm:max-w-md hover:-translate-y-1.5 hover:scale-[1.02] hover:border-[#D4AF37] hover:shadow-[0_20px_48px_rgba(7,27,20,0.6)] transition-all duration-300">
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
                        B.Com, CA, CMA (ICMAI AIR 49) • 10+ Years Experience
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

              {/* Interactive Statutory Assurance Tabs (Elevated Botanical Ledger Feature) */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF7F0] border border-[#D8D0BE] overflow-x-auto select-none">
                  {ASSURANCE_PILLARS.map((pillar) => {
                    const isActive = activePillar === pillar.id;
                    return (
                      <button
                        key={pillar.id}
                        type="button"
                        onClick={() => setActivePillar(pillar.id)}
                        className={`text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap focus:outline-none ${
                          isActive
                            ? 'bg-[#183529] text-[#F1EBDD] shadow-xs'
                            : 'text-[#525954] hover:text-[#183529] hover:bg-[#F1EBDD]/70'
                        }`}
                      >
                        {pillar.label}
                      </button>
                    );
                  })}
                </div>

                {/* Active Pillar Hallmarks with smooth fade transition */}
                <div key={selectedPillar.id} className="mt-3 bg-[#FAF7F0] border border-[#D8D0BE]/80 rounded-xl p-3 sm:p-3.5 animate-fadeIn">
                  <div className="space-y-1.5">
                    {selectedPillar.hallmarks.map((hallmark, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs text-[#35271F]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#183529] shrink-0" />
                        <span className="leading-tight">{hallmark}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Single Clean Call-to-Action to Dedicated About Page */}
              <div className="pt-3">
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
