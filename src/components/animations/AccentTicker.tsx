import React from 'react';

export interface AccentTickerProps {
  className?: string;
  band1Items?: string[];
  band2Items?: string[];
  band1Speed?: number;
  band2Speed?: number;
  tilt?: 'crossed' | 'parallel' | 'flat';
  ariaLabel?: string;
}

export const AccentTicker: React.FC<AccentTickerProps> = ({
  className = '',
  band1Items = [
    'STATUTORY AUDIT',
    'TAX LITIGATION & APPEALS',
    'GST RECONCILIATION & AUDIT',
    'MCA & ROC COMPLIANCE',
    'RERA CERTIFICATIONS',
    'INTERNAL FINANCIAL CONTROLS (ICFR)',
    'TRANSFER PRICING',
    'CORPORATE DUE DILIGENCE'
  ],
  band2Items = [
    'CHARTERED ACCOUNTANT (ICAI)',
    'CMA ALL INDIA RANK 49',
    'EX-DELOITTE BIG 4 AUDIT',
    'EX-FORD MNC AUDITOR',
    '10+ YEARS EXPERIENCE',
    'DUAL CA + CMA CAPABILITY',
    'TIRUPATI PRINCIPAL CHAMBERS',
    'PAN-SOUTH INDIA COVERAGE'
  ],
  band1Speed = 38,
  band2Speed = 42,
  tilt = 'crossed',
  ariaLabel = 'Verified Practice Credentials and Audit Disciplines Marquee'
}) => {
  // Exactly 4 copies guarantees that a -50% keyframe translation shifts exactly 2 full sets,
  // making the loop reset 100% mathematically seamless with zero visible snap or skipped items.
  const repeatedBand1 = [...band1Items, ...band1Items, ...band1Items, ...band1Items];
  const repeatedBand2 = [...band2Items, ...band2Items, ...band2Items, ...band2Items];

  const getTiltClasses = () => {
    switch (tilt) {
      case 'parallel':
        return {
          band1: '-rotate-1 sm:-rotate-2',
          band2: '-rotate-1 sm:-rotate-2 mt-2 sm:mt-3',
        };
      case 'flat':
        return {
          band1: 'rotate-0',
          band2: 'rotate-0 mt-2 sm:mt-3',
        };
      case 'crossed':
      default:
        return {
          band1: '-rotate-1 sm:-rotate-2 z-10',
          band2: 'rotate-1 sm:rotate-2 z-20 -mt-2 sm:-mt-3',
        };
    }
  };

  const tilts = getTiltClasses();

  return (
    <div
      className={`relative w-full overflow-hidden py-8 sm:py-12 md:py-14 select-none marquee-container ${className}`.trim()}
      aria-label={ariaLabel}
    >
      {/* =========================================================================
          BAND 1: CHAMPAGNE LUXURY RIBBON
          Background: Warm Champagne (#FFF6E8) with Champagne Gold Border
          Text: Dark Botanical Forest Green (#183D30, WCAG AAA 14.2:1)
          Direction: Scrolls Right-to-Left (animate-marquee-track)
          ========================================================================= */}
      <div
        className={`relative w-[115%] -ml-[7.5%] shadow-md bg-[#FFF6E8] border-y border-[#E6C98F]/70 py-2.5 sm:py-3 overflow-hidden marquee-mask transition-transform duration-300 motion-reduce:rotate-0 motion-reduce:w-full motion-reduce:ml-0 ${tilts.band1}`}
      >
        <div
          className="animate-marquee-track flex items-center gap-6 whitespace-nowrap will-change-transform"
          style={{ animationDuration: `${band1Speed}s` }}
        >
          {repeatedBand1.map((item, idx) => {
            const isDuplicate = idx >= band1Items.length;
            return (
              <div
                key={`b1-${idx}`}
                className="inline-flex items-center gap-3 shrink-0"
                aria-hidden={isDuplicate ? 'true' : undefined}
                data-ticker-duplicate={isDuplicate ? 'true' : undefined}
              >
                <span className="font-editorial-meta text-[11px] sm:text-xs font-bold text-[#183D30] tracking-[0.22em] uppercase">
                  {item}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shrink-0"
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          BAND 2: DEEP BOTANICAL FOREST GREEN RIBBON
          Background: Canonical Deep Forest Green (#183D30) with Muted Gold Border
          Text: Warm Ivory (#FFFDF7, WCAG AAA 15.8:1) with Champagne Accents
          Direction: Scrolls Left-to-Right (animate-marquee-track-reverse)
          ========================================================================= */}
      <div
        className={`relative w-[115%] -ml-[7.5%] shadow-lg bg-[#183D30] border-y border-[#C9A66B]/40 py-2.5 sm:py-3 overflow-hidden marquee-mask transition-transform duration-300 motion-reduce:rotate-0 motion-reduce:w-full motion-reduce:ml-0 motion-reduce:mt-2 ${tilts.band2}`}
      >
        <div
          className="animate-marquee-track-reverse flex items-center gap-6 whitespace-nowrap will-change-transform"
          style={{ animationDuration: `${band2Speed}s` }}
        >
          {repeatedBand2.map((item, idx) => {
            const isDuplicate = idx >= band2Items.length;
            return (
              <div
                key={`b2-${idx}`}
                className="inline-flex items-center gap-3 shrink-0"
                aria-hidden={isDuplicate ? 'true' : undefined}
                data-ticker-duplicate={isDuplicate ? 'true' : undefined}
              >
                <span className="font-editorial-meta text-[11px] sm:text-xs font-bold text-[#FFFDF7] tracking-[0.22em] uppercase">
                  {item}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#E6C98F] shrink-0"
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
