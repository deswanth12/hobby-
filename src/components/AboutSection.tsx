import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { RotatingGeometricMesh, FloatingGeometricShapes, CurvedPathReveal, LetterReveal, WordReveal } from './animations';
import { CornerBrackets, PrecisionDotMatrix, EditorialMarker } from './architectural';
import { FIRM_DATA } from '../data/firmData';

interface AboutSectionProps {
  showReadMore?: boolean;
  headingLevel?: 'h1' | 'h2';
  readMoreHref?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ 
  showReadMore = true,
  headingLevel = 'h2',
  readMoreHref = '/about'
}) => {
  const HeadingTag = headingLevel;

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-[#F1EBDD] border-b border-[#D8D0BE] overflow-hidden relative texture-warm-ivory" id="about-us">
      {/* V4.1 Luminous Ambient Background Lighting */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-ambient-radial-gold pointer-events-none -z-0" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-ambient-radial-sage pointer-events-none -z-0" />

      {/* Subtle CurvedPathReveal corner accent */}
      <div className="absolute -top-6 -left-6 w-36 h-36 pointer-events-none -z-0 opacity-20 hidden md:block">
        <CurvedPathReveal variant="corner" width={140} height={140} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: 3-IMAGE EDITORIAL PHOTOGRAPHY COLLAGE
              Architectural hierarchy: 16:9 primary dominance, dual companion base
              ========================================================================= */}
          <div className="lg:col-span-6 scroll-reveal-left relative mb-6 lg:mb-0">
            {/* Subtle Vertical Champagne Hairline Divider (Desktop) */}
            <div 
              className="hidden lg:block absolute -right-5 lg:-right-7 top-1/2 -translate-y-1/2 h-3/4 w-[1px] bg-gradient-to-b from-transparent via-[#C3A66B]/35 to-transparent pointer-events-none" 
              aria-hidden="true" 
            />
            {/* Outer Architectural Framing Perimeter */}
            <div className="relative p-2 sm:p-2.5 rounded-3xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-card">
              
              {/* Subtle L-shaped architectural corner brackets */}
              <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#B49A64]/50 rounded-tl-sm pointer-events-none" aria-hidden="true" />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#B49A64]/50 rounded-br-sm pointer-events-none" aria-hidden="true" />

              {/* Subtle Decorative Rotating Geometric Mesh behind collage frame */}
              <div className="absolute -top-8 -right-6 pointer-events-none -z-0 opacity-20 hidden sm:block">
                <RotatingGeometricMesh size={240} />
              </div>

              {/* Anchored Animated Dot Grid to perimeter top-right corner */}
              <div className="absolute -top-3 -right-3 pointer-events-none z-0 opacity-25 hidden sm:block">
                <PrecisionDotMatrix rows={4} cols={5} variant="gold" className="opacity-30" />
              </div>

              {/* Anchored Delicate Orbital Ring to perimeter bottom-left corner */}
              <div className="absolute -bottom-4 -left-4 pointer-events-none z-0 opacity-25 hidden md:block">
                <FloatingGeometricShapes type="ring" size={52} />
              </div>

                            {/* Single Dominant Professional Consultation Photograph */}
              <div className="relative z-10">
                <div className="rounded-2xl overflow-hidden shadow-card border border-[#D8D0BE] group bg-[#FAF7F0] card-v4-inner-border relative">
                  <CornerBrackets size={16} strokeWidth={1.5} variant="gold" />
                  <img
                    src="/images/ai-generated/about/consultation-main.webp"
                    alt="Senior corporate chartered accountant in strategic consultation with enterprise client"
                    width="1376"
                    height="768"
                    loading="lazy"
                    className="w-full h-72 sm:h-80 lg:h-96 object-cover object-center image-v4-zoom transition-transform duration-700"
                  />
                  {/* Subtle architectural vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#153F32]/60 via-transparent to-transparent pointer-events-none" />

                  {/* Grounded Chambers Practice Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#183529]/90 backdrop-blur-sm border border-[#B49A64]/40 text-white flex items-center gap-2 text-[11px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] motion-safe:animate-pulse" />
                    <span>Estd. Tirupati Chambers • Pan-India Reach</span>
                  </div>
                </div>
              </div>

              {/* Floating Partner Credential Plaque (Pre-Release Editorial Seal) */}
              <div className="absolute -bottom-4 right-2 sm:-bottom-5 sm:right-6 z-20 bg-[#183529] rounded-2xl p-3.5 sm:p-4 text-white border border-[#B49A64]/50 shadow-2xl backdrop-blur-md max-w-[290px] sm:max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0F3E2E] border-2 border-[#C5A059] flex items-center justify-center shadow-md shadow-[#C5A059]/20 shrink-0">
                    <img 
                      src="/brand/ka-seal-medallion.webp" 
                      alt="ICAI Official Practice Credential Seal" 
                      width="48"
                      height="48"
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0 drop-shadow-md"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-editorial-meta text-[10px] sm:text-[11px] font-semibold text-[#B49A64] uppercase tracking-wider truncate">
                        ICAI Practice Lead
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0D2820] text-[#B49A64] border border-[#B49A64]/30 shrink-0">
                        AIR 49
                      </span>
                    </div>
                    <p className="font-serif text-sm sm:text-base font-bold text-white tracking-wide leading-tight truncate">
                      {FIRM_DATA.partner.name}
                    </p>
                    <p className="font-editorial-body text-[10px] sm:text-[11px] text-[#A3B899] mt-0.5 truncate">
                      {FIRM_DATA.partner.qualifications} • 10+ Years Experience
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#1F5443] flex items-center justify-between text-[10px] text-[#DDE8D9]">
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
          </div>

          {/* =========================================================================
              RIGHT COLUMN: EDITORIAL CONTENT & SINGLE PRACTICE PROFILE CTA
              ========================================================================= */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 scroll-reveal-right">
            
            {/* Numbered Editorial Marker & Eyebrow Badge */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <EditorialMarker number="01" label="ABOUT THE FIRM" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] text-[#35271F] font-editorial-meta text-xs border border-[#B49A64]/60 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] motion-safe:animate-pulse" />
                <LetterReveal text="ABOUT US" as="span" className="tracking-widest uppercase font-semibold text-[#35271F]" />
              </div>
            </div>

            {/* Heading */}
            <HeadingTag className={`${headingLevel === 'h1' ? 'font-editorial-h1' : 'font-editorial-h2'} text-2xl sm:text-3xl lg:text-4xl text-[#35271F] font-serif font-bold tracking-tight leading-tight`}>
              <WordReveal text="Professional Expertise. Personal Commitment." as="span" />
            </HeadingTag>

            {/* Concise Narrative with Architectural Accent Line (~64 words) */}
            <p className="font-editorial-body text-sm sm:text-base text-[#252B27] leading-relaxed border-l-2 border-[#B49A64]/40 pl-3.5 sm:pl-4">
              Founded by CA Kavitha Vijay (B.Com, CA, CMA AIR 49), Kavitha &amp; Associates is an independent Chartered Accountancy firm in Tirupati, advising growth enterprises and established businesses across India. With senior statutory audit tenure at Deloitte Haskins &amp; Sells and multinational internal audit experience at Ford Motor Company, our practice delivers partner-led assurance, corporate taxation, and financial governance with uncompromising regulatory rigor.
            </p>

            {/* Single Clean Call-to-Action to Dedicated About Page */}
            <div className="pt-2">
              {showReadMore && (
                readMoreHref.startsWith('#') ? (
                  <a
                    href={readMoreHref}
                    className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#183529] hover:bg-[#102D25] text-white font-editorial-meta text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm hover:shadow-md border border-[#B49A64]/50 btn-tactile"
                  >
                    <span>Read Full Practice Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B49A64]" />
                  </a>
                ) : (
                  <Link
                    to={readMoreHref}
                    className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#183529] hover:bg-[#102D25] text-white font-editorial-meta text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm hover:shadow-md border border-[#B49A64]/50 btn-tactile"
                  >
                    <span>Read Full Practice Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B49A64]" />
                  </Link>
                )
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
