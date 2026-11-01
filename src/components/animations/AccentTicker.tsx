import React from 'react';

interface AccentTickerProps {
  className?: string;
}

export const AccentTicker: React.FC<AccentTickerProps> = ({ className = '' }) => {
  const band1Credos = [
    'STATUTORY AUDIT',
    'TAX LITIGATION & APPEALS',
    'GST RECONCILIATION',
    'MCA & ROC FILINGS',
    'RERA CERTIFICATIONS',
    'INTERNAL FINANCIAL CONTROLS',
    'TRANSFER PRICING',
    'DUE DILIGENCE'
  ];

  const band2Credos = [
    'CHARTERED ACCOUNTANT',
    'CMA ALL INDIA RANK 49',
    'EX-DELOITTE BIG 4 AUDIT',
    'EX-FORD MNC AUDITOR',
    '10+ YEARS EXPERIENCE',
    'DUAL CA + CMA CAPABILITY',
    'TIRUPATI PRINCIPAL CHAMBERS',
    'PAN-SOUTH INDIA COVERAGE'
  ];

  // Exactly 4 copies guarantees that a -50% keyframe translation shifts exactly 2 full sets,
  // making the loop reset 100% mathematically seamless with zero visible snap or skipped items.
  const repeatedBand1 = [...band1Credos, ...band1Credos, ...band1Credos, ...band1Credos];
  const repeatedBand2 = [...band2Credos, ...band2Credos, ...band2Credos, ...band2Credos];

  return (
    <div
      className={`relative w-full overflow-hidden py-6 sm:py-8 select-none ${className}`.trim()}
      aria-label="Verified Practice Credentials and Accents"
    >
      {/* Band 1: Tilted -1deg with Forest Green & Gold */}
      <div className="w-full shadow-md bg-brand-forest border-y border-brand-gold/40 py-2 sm:py-2.5 overflow-hidden marquee-mask">
        <div className="animate-marquee-track flex items-center gap-6 whitespace-nowrap">
          {repeatedBand1.map((item, idx) => (
            <div
              key={`b1-${idx}`}
              className="inline-flex items-center gap-3 shrink-0"
              aria-hidden={idx >= band1Credos.length ? 'true' : undefined}
            >
              <span className="font-editorial-meta text-[10px] sm:text-[11px] font-bold text-brand-gold tracking-[0.2em] uppercase">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/60 shrink-0" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

      {/* Band 2: Tilted +1deg with Deep Green & Muted Gold Accent */}
      <div className="w-full shadow-lg bg-brand-deep border-y border-brand-gold/30 py-2 sm:py-2.5 mt-2 overflow-hidden marquee-mask">
        <div className="animate-marquee-track-reverse flex items-center gap-6 whitespace-nowrap">
          {repeatedBand2.map((item, idx) => (
            <div
              key={`b2-${idx}`}
              className="inline-flex items-center gap-3 shrink-0"
              aria-hidden={idx >= band2Credos.length ? 'true' : undefined}
            >
              <span className="font-editorial-meta text-[10px] sm:text-[11px] font-bold text-emerald-100 tracking-[0.2em] uppercase">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
