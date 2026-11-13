import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useFirmProfile } from '../../adapters/backendAdapter';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { DotGrid, OrbitalSphere, FlowingCurves, ArchitecturalLines, DecorativeLayer } from '../decorative';
import { CountUp } from '../animation/CountUp';

export const HeroSection: React.FC = () => {
  const firmProfile = useFirmProfile();

  const TICKER_ITEMS = [
    'Statutory Audit & Assurance',
    'Direct Tax Litigation & Advisory',
    'GST Compliance & Audit Defense',
    'MCA Corporate Governance & ROC',
    'RERA Certifications & Assurance',
    'Virtual CFO Services',
    'Internal Financial Controls (ICFR)',
    'Transfer Pricing & International Tax',
  ];
  // 4x duplication guarantees mathematically seamless loop with animate-marquee-track
  const repeatedTicker = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <section
      id="hero"
      className="bg-[#071B14] text-[#F1EBDD] pt-10 sm:pt-14 lg:pt-16 pb-8 sm:pb-10 border-b border-[#B49A64]/20 relative overflow-hidden texture-architectural-lines scroll-mt-28"
    >
      <div id="hero-section" className="scroll-mt-28" />

      {/* Editorial Luxury Atmosphere Lighting with Subtle Organic Breathing */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#183529]/60 rounded-full blur-3xl pointer-events-none animate-pulse-slow" aria-hidden="true" />
      <div className="absolute top-1/3 -right-32 w-[420px] h-[420px] bg-[#B49A64]/10 rounded-full blur-[120px] pointer-events-none animate-float-subtle" aria-hidden="true" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#0B241C]/80 rounded-full blur-2xl pointer-events-none animate-pulse-slow" aria-hidden="true" />

      {/* Ambient Decorative System */}
      <DecorativeLayer>
        {/* Subtle Dotted Pattern in Top Corner */}
        <DotGrid
          variant="bronze"
          width={260}
          height={260}
          className="absolute -top-8 -right-8 sm:top-2 sm:right-4 opacity-25"
        />

        {/* Ambient Flowing Curves along bottom horizon */}
        <FlowingCurves
          variant="bronze"
          direction="horizontal"
          height={90}
          className="absolute bottom-0 inset-x-0 opacity-15"
        />
      </DecorativeLayer>

      {/* Precision Dot System Top-Left Anchor */}
      <div className="absolute top-6 left-6 pointer-events-none hidden lg:block opacity-35" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          {[0, 16, 32].map((x) =>
            [0, 16, 32].map((y) => (
              <circle key={`${x}-${y}`} cx={x + 4} cy={y + 4} r="1.5" fill="#B49A64" />
            ))
          )}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Left 7 Columns: Editorial Narrative & Exactly 2 Dual CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Institutional Kicker & Eyebrow Pill */}
            <div className="v8-hero-cascade flex items-center gap-2.5 flex-wrap" style={{ animationDelay: '0ms' }}>
              <Badge variant="kicker">CHARTERED ACCOUNTANTS · TIRUPATI</Badge>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-[#0B241C] border border-[#B49A64]/30 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#B49A64] motion-safe:animate-pulse" />
                <span className="text-[10px] sm:text-xs font-semibold text-[#B49A64] tracking-widest uppercase">
                  INDEPENDENT CHARTERED ACCOUNTANCY PRACTICE • TIRUPATI
                </span>
              </div>
            </div>

            {/* Master Headline: Display Serif */}
            <div className="v8-hero-cascade space-y-1" style={{ animationDelay: '120ms' }}>
              <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif leading-[1.12]">
                <span className="block text-[#F1EBDD]">
                  Clarity in Finance.
                </span>
                <span className="block font-editorial-hero-sub text-[#B49A64] italic mt-1 sm:mt-2 font-medium">
                  Confidence in Every Decision.
                </span>
              </h1>
            </div>

            {/* Authoritative Supporting Copy: Exactly 20 words */}
            <p className="v8-hero-cascade font-editorial-body text-[#D8D0BE] max-w-xl font-normal leading-relaxed text-sm sm:text-base border-l-2 border-[#B49A64]/40 pl-3.5 sm:pl-4" style={{ animationDelay: '240ms' }}>
              Partner-led Chartered Accountancy and statutory counsel in Tirupati, advising growth enterprises and established businesses across India.
            </p>

            {/* Hero Double-Rule Accent */}
            <ArchitecturalLines type="double-rule" variant="bronze" length="100px" className="my-3 opacity-60" />

            {/* Staggered Dual CTA Action Cluster: Exactly 2 CTAs */}
            <div className="v8-hero-cascade flex flex-col sm:flex-row sm:items-center flex-wrap gap-3.5 pt-2" style={{ animationDelay: '360ms' }}>
              <Button
                to="#practice-areas"
                variant="primary-bronze"
                size="md"
                className="w-full sm:w-auto text-xs sm:text-sm font-semibold justify-center py-2.5 px-6 min-h-[46px] whitespace-nowrap shadow-md inline-flex items-center hover:scale-[1.02] active:scale-[0.98] transition-all"
                showArrow
              >
                Explore Practice Areas
              </Button>

              <Button
                to="/contact"
                variant="secondary-outline"
                size="md"
                className="w-full sm:w-auto text-xs sm:text-sm font-semibold justify-center py-2.5 px-6 min-h-[46px] whitespace-nowrap inline-flex items-center hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Contact the Firm
              </Button>
            </div>

            {/* Live Interactive Institutional Metric Strip */}
            <div className="v8-hero-cascade grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3 border-t border-[#B49A64]/20" style={{ animationDelay: '420ms' }}>
              <div className="bg-[#0B241C]/80 border border-[#B49A64]/25 rounded-xl p-2.5 text-center group hover:border-[#B49A64]/70 hover:-translate-y-0.5 transition-all duration-200">
                <div className="font-serif text-lg sm:text-xl font-bold text-[#F1EBDD] flex items-center justify-center">
                  <CountUp value={10} suffix="+" durationMs={1200} />
                </div>
                <div className="text-[10px] text-[#B49A64] font-medium tracking-wide uppercase mt-0.5">Years Rigor</div>
              </div>
              <div className="bg-[#0B241C]/80 border border-[#B49A64]/25 rounded-xl p-2.5 text-center group hover:border-[#B49A64]/70 hover:-translate-y-0.5 transition-all duration-200">
                <div className="font-serif text-lg sm:text-xl font-bold text-[#F1EBDD] flex items-center justify-center">
                  <CountUp value={1500} suffix="+" durationMs={1400} />
                </div>
                <div className="text-[10px] text-[#B49A64] font-medium tracking-wide uppercase mt-0.5">Corporate Audits</div>
              </div>
              <div className="bg-[#0B241C]/80 border border-[#B49A64]/25 rounded-xl p-2.5 text-center group hover:border-[#B49A64]/70 hover:-translate-y-0.5 transition-all duration-200">
                <div className="font-serif text-lg sm:text-xl font-bold text-[#F1EBDD] flex items-center justify-center">
                  <span>AIR 49</span>
                </div>
                <div className="text-[10px] text-[#B49A64] font-medium tracking-wide uppercase mt-0.5">ICMAI Merit</div>
              </div>
              <div className="bg-[#0B241C]/80 border border-[#B49A64]/25 rounded-xl p-2.5 text-center group hover:border-[#B49A64]/70 hover:-translate-y-0.5 transition-all duration-200">
                <div className="font-serif text-lg sm:text-xl font-bold text-[#F1EBDD] flex items-center justify-center">
                  <CountUp value={100} suffix="%" durationMs={1000} />
                </div>
                <div className="text-[10px] text-[#B49A64] font-medium tracking-wide uppercase mt-0.5">Partner Supervised</div>
              </div>
            </div>

            {/* Institutional Credentials Footnote */}
            <div className="v8-hero-cascade pt-1 flex items-center gap-4 text-xs text-[#AAB4A0] flex-wrap" style={{ animationDelay: '480ms' }}>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B49A64]" />
                <span>ICAI &amp; ICMAI Dual Credentials</span>
              </span>
              <span>·</span>
              <span>Direct Partner Oversight</span>
              <span>·</span>
              <span>Chambers: Bairagi Patteda, Tirupati</span>
            </div>

          </div>

          {/* Right 5 Columns: Double-Bezel Photographic Frame & Credential Strip */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Desktop Vertical Grounding Hairline Divider */}
            <div 
              className="hidden lg:block absolute -left-6 lg:-left-8 top-1/2 -translate-y-1/2 h-3/4 w-[1px] bg-[#B49A64]/30 pointer-events-none" 
              aria-hidden="true" 
            />

            {/* Ambient Orbital Sphere Frame Accent with Timeless Rotation */}
            <OrbitalSphere
              size={360}
              variant="bronze"
              className="absolute -top-12 -right-12 lg:-top-14 lg:-right-14 opacity-25 hidden sm:block pointer-events-none z-0 animate-orbital-slow"
            />

            <div className="v8-hero-cascade w-full relative z-10" style={{ animationDelay: '200ms' }}>
              {/* Double-Bezel Architectural Photographic Frame (using rounded-2xl) */}
              <div className="rounded-2xl p-2 sm:p-2.5 bg-[#0B241C] border border-[#B49A64]/30 shadow-2xl relative overflow-hidden group">
                
                {/* Architectural Corner Brass Brackets */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#B49A64]/60 rounded-tl-sm pointer-events-none z-20" aria-hidden="true" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#B49A64]/60 rounded-br-sm pointer-events-none z-20" aria-hidden="true" />

                {/* Primary Consultation Photograph */}
                <div className="relative rounded-xl overflow-hidden border border-[#B49A64]/30 bg-[#071B14] aspect-[16/9] w-full">
                  <img
                    src="/images/ai-generated/hero/hero-consultation.webp"
                    alt="Senior corporate accounting and statutory audit consultation session"
                    width="1376"
                    height="768"
                    loading="eager"
                    {...({ fetchpriority: 'high' } as any)}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                  
                  {/* Top Floating Official Practice Seal Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#071B14] border border-[#B49A64]/40 shadow-sm">
                    <img 
                      src="/brand/ka-seal-medallion.webp" 
                      alt="Kavitha & Associates Official Practice Seal" 
                      width="24"
                      height="24"
                      className="w-6 h-6 object-contain shrink-0"
                    />
                    <span className="font-editorial-meta text-[11px] font-semibold text-[#B49A64] tracking-wide">
                      Estd. Tirupati Chambers
                    </span>
                  </div>
                </div>

                {/* Compact Partner Credential Strip */}
                <div className="mt-2.5 bg-[#071B14]/95 backdrop-blur-xs rounded-xl p-3 text-white border border-[#B49A64]/30 flex items-center justify-between shadow-md hover:-translate-y-0.5 hover:border-[#B49A64] transition-all duration-200 cursor-default">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 motion-safe:animate-pulse shrink-0" />
                    <div className="min-w-0">
                      <p className="font-serif text-sm font-bold text-[#F1EBDD] tracking-wide leading-tight truncate">
                        {firmProfile.partner.name}
                      </p>
                      <p className="text-[11px] text-[#B49A64] truncate mt-0.5 font-medium">
                        Managing Partner · Senior Statutory Auditor
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#0B241C] text-[#B49A64] border border-[#B49A64]/40 shrink-0 ml-3 shadow-xs whitespace-nowrap">
                    AIR 49 (ICMAI)
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Infinite Gliding Statutory Disciplines Ticker (V8.2 Kinetic Horizon) */}
      <div 
        className="w-full mt-8 sm:mt-12 pt-3.5 border-t border-[#B49A64]/20 overflow-hidden relative marquee-container select-none" 
        aria-label="Practice Disciplines Ticker"
      >
        <div className="marquee-mask relative w-full overflow-hidden">
          <div className="animate-marquee-track flex items-center gap-6 py-1 whitespace-nowrap text-[11px] sm:text-xs font-mono tracking-widest text-[#B49A64]/85 uppercase font-semibold">
            {repeatedTicker.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-4 shrink-0 hover:text-[#F1EBDD] transition-colors cursor-default">
                <span>{item}</span>
                <span className="text-[#B49A64]/40 text-[9px]" aria-hidden="true">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
