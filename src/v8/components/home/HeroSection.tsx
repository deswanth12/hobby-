import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useFirmProfile } from '../../adapters/backendAdapter';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { DotGrid, OrbitalSphere, FlowingCurves, ArchitecturalLines, DecorativeLayer } from '../decorative';
import { useReducedMotion } from '../animation/useReducedMotion';

interface HeroMetricCardProps {
  value: number;
  label: string;
  suffix?: string;
  badgePrefix?: string;
  durationMs?: number;
  delayMs?: number;
}

const HeroMetricCard: React.FC<HeroMetricCardProps> = ({
  value,
  label,
  suffix = '',
  badgePrefix,
  durationMs = 1200,
  delayMs = 0,
}) => {
  const isReduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(() => (isReduced ? value : 0));
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const cardRef = React.useRef<HTMLDivElement | null>(null);

  // Trigger when element enters viewport
  useEffect(() => {
    if (isReduced) {
      setDisplayValue(value);
      return;
    }

    const node = cardRef.current;
    if (!node) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isReduced, value]);

  // Execute smooth rolling counter animation
  const runAnimation = React.useCallback((customDuration?: number) => {
    if (isReduced) {
      setDisplayValue(value);
      return;
    }

    const duration = customDuration || durationMs;
    let startTime: number | null = null;
    let rafId: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);
      // easeOutCubic: 1 - (1 - t)^3
      const easeOut = 1 - Math.pow(1 - progressRatio, 3);
      const current = Math.round(value * easeOut);
      setDisplayValue(current);

      if (progressRatio < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, durationMs, isReduced]);

  useEffect(() => {
    if (!hasStarted || isReduced) return;
    const timerId = setTimeout(() => {
      runAnimation();
    }, delayMs);
    return () => clearTimeout(timerId);
  }, [hasStarted, delayMs, runAnimation, isReduced]);

  const handleMouseEnter = () => {
    if (!isReduced) {
      runAnimation(750); // Snappy re-roll on hover
    }
  };

  const formattedNumber = displayValue.toLocaleString('en-IN');
  const fullLabel = badgePrefix ? `${badgePrefix} ${value} ${label}` : `${value}${suffix} ${label}`;

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      className="relative bg-gradient-to-b from-[#0E271F] via-[#0B241C] to-[#061510] border border-[#B49A64]/30 rounded-xl px-1.5 py-2.5 sm:px-2 sm:py-3.5 text-center group hover:border-[#C5A059] hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(180,154,100,0.22)] transition-all duration-300 overflow-hidden cursor-default select-none"
      role="group"
      aria-label={fullLabel}
    >
      {/* Top Metallic Hairline Accent */}
      <div 
        className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#B49A64]/60 to-transparent group-hover:via-[#D4AF37] transition-colors" 
        aria-hidden="true" 
      />

      {/* Subtle Corner Brackets (Quiet Luxury Architectural Accent) */}
      <span 
        className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-[#B49A64]/40 group-hover:border-[#C5A059] group-hover:w-2 group-hover:h-2 transition-all duration-200 pointer-events-none" 
        aria-hidden="true" 
      />
      <span 
        className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-[#B49A64]/40 group-hover:border-[#C5A059] group-hover:w-2 group-hover:h-2 transition-all duration-200 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Animated Numeric Value */}
      <div className="flex items-baseline justify-center font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#F1EBDD] tabular-nums tracking-tight leading-none group-hover:text-white transition-colors">
        {badgePrefix ? (
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[10px] sm:text-xs font-sans font-bold tracking-wider text-[#B49A64] uppercase px-1.5 py-0.5 rounded bg-[#183529] border border-[#B49A64]/40 group-hover:border-[#C5A059] group-hover:text-[#F1EBDD] transition-colors">
              {badgePrefix}
            </span>
            <span className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#F1EBDD]">
              {displayValue}
            </span>
          </div>
        ) : (
          <>
            <span>{formattedNumber}</span>
            {suffix && (
              <span className="font-serif text-lg sm:text-xl font-normal text-[#B49A64] ml-0.5 group-hover:text-[#D4AF37] transition-colors">
                {suffix}
              </span>
            )}
          </>
        )}
      </div>

      {/* Descriptive Kicker Label */}
      <div className="text-[8px] sm:text-[9px] xl:text-[10px] font-sans font-semibold text-[#B49A64] tracking-[0.03em] sm:tracking-[0.04em] xl:tracking-[0.06em] uppercase mt-1.5 group-hover:text-[#F1EBDD] transition-colors leading-tight whitespace-nowrap">
        {label}
      </div>
    </div>
  );
};

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
            <p className="font-editorial-body v8-hero-cascade text-[#D8D0BE] max-w-xl font-normal leading-relaxed text-sm sm:text-base border-l-2 border-[#B49A64]/40 pl-3.5 sm:pl-4" style={{ animationDelay: '240ms' }}>
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
            <div className="v8-hero-cascade grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-4 border-t border-[#B49A64]/20" style={{ animationDelay: '420ms' }}>
              <HeroMetricCard
                value={10}
                suffix="+"
                label="Years Rigor"
                durationMs={1200}
                delayMs={100}
              />
              <HeroMetricCard
                value={1500}
                suffix="+"
                label="Corporate Audits"
                durationMs={1400}
                delayMs={250}
              />
              <HeroMetricCard
                value={49}
                badgePrefix="AIR"
                label="ICMAI Merit"
                durationMs={1100}
                delayMs={400}
              />
              <HeroMetricCard
                value={100}
                suffix="%"
                label="Partner Supervised"
                durationMs={1000}
                delayMs={550}
              />
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
                <div className="absolute top-2 left-2 w-3.5 h-3.5 group-hover:w-5 group-hover:h-5 border-t-2 border-l-2 border-[#B49A64]/60 group-hover:border-[#B49A64] rounded-tl-sm pointer-events-none z-20 transition-all duration-300" aria-hidden="true" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 group-hover:w-5 group-hover:h-5 border-b-2 border-r-2 border-[#B49A64]/60 group-hover:border-[#B49A64] rounded-br-sm pointer-events-none z-20 transition-all duration-300" aria-hidden="true" />

                {/* Primary Consultation Photograph */}
                <div className="relative rounded-xl overflow-hidden border border-[#B49A64]/30 bg-[#071B14] aspect-[16/9] w-full">
                  <img
                    src="/images/ai-generated/hero/hero-consultation.webp"
                    alt="Senior corporate accounting and statutory audit consultation session"
                    width="1376"
                    height="768"
                    loading="eager"
                    {...({ fetchpriority: 'high' } as any)}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
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
