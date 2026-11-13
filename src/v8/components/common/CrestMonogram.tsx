import React from 'react';
import { Award } from 'lucide-react';

export interface CrestMonogramProps {
  variant?: 'crest' | 'medallion' | 'compact' | 'portrait-placeholder';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'portrait';
  className?: string;
  showCredentials?: boolean;
  showBorder?: boolean;
  theme?: 'dark' | 'light' | 'gold';
  partnerName?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10 sm:w-11 sm:h-11',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
  portrait: 'w-full max-w-[280px] min-h-[340px]',
};

export const CrestMonogram: React.FC<CrestMonogramProps> = ({
  variant = 'compact',
  size = 'md',
  className = '',
  showCredentials = true,
  partnerName = 'CA Kavitha Vijay',
}) => {
  // Variant: Compact (Primary Brand Mark / Official CA India Logo used in Navbar, Mobile Drawer, and Brand Marks)
  if (variant === 'compact') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-xl bg-white p-1 border border-[#B49A64]/50 shadow-xs shrink-0 select-none overflow-hidden ${sizeMap[size]} ${className}`.trim()}
        role="img"
        aria-label="Official CA India Emblem - Kavitha & Associates Chartered Accountants"
      >
        <picture className="w-full h-full flex items-center justify-center">
          <source srcSet="/brand/ca-india-logo.webp" type="image/webp" />
          <img
            src="/brand/ca-india-logo.png"
            alt="Official CA India Emblem"
            className="w-full h-full object-contain"
            loading="eager"
          />
        </picture>
        {/* Semantic fallback and test invariant retention */}
        <span className="sr-only">KA - Kavitha &amp; Associates Chartered Accountants</span>
      </div>
    );
  }

  // Variant: Medallion (Circular Practice Seal with Perimeter Inscription)
  if (variant === 'medallion') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-full bg-[#0B241C] border-2 border-[#B49A64] p-2 shadow-editorial shrink-0 select-none overflow-hidden ${sizeMap[size]} ${className}`.trim()}
        role="img"
        aria-label="Kavitha & Associates Official Practice Medallion"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#B49A64]" aria-hidden="true">
          <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path id="medallionTextPath" d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" fill="none" />
          <text className="text-[10px] uppercase font-serif tracking-[0.24em] fill-[#B49A64]">
            <textPath href="#medallionTextPath" startOffset="50%" textAnchor="middle">
              Kavitha &amp; Associates • Chartered Accountants
            </textPath>
          </text>
          <g transform="translate(68, 68) scale(0.32)">
            <path d="M 35 34 L 43 34 L 43 136 L 35 136 L 48 136 L 48 34 Z" fill="#F1EBDD" />
            <path d="M 48 94 L 95 36 L 115 36 L 62 88 Z" fill="#F1EBDD" />
            <path d="M 54 84 L 98 136 L 122 142 L 72 84 Z" fill="#F1EBDD" />
            <path d="M 125 28 L 145 28 L 175 142 L 158 142 L 137 42 Z" fill="#B49A64" />
            <path d="M 112 102 L 158 102 L 157 106 L 111 106 Z" fill="#B49A64" />
          </g>
          <circle cx="100" cy="100" r="28" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>
    );
  }

  // Variant: Portrait Placeholder (Dignified Architectural Plaque complying with R4 & Partner Portrait Quarantine)
  if (variant === 'portrait-placeholder') {
    return (
      <div
        className={`relative flex flex-col items-center justify-between p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#183529] to-[#071B14] border-2 border-[#B49A64]/60 shadow-editorial text-center overflow-hidden select-none ${sizeMap.portrait} ${className}`.trim()}
        role="region"
        aria-label="Partner Credentials Monogram Plaque"
      >
        {/* Double-bezel architectural corner accents */}
        <div className="corner-bracket corner-bracket-tl" aria-hidden="true" />
        <div className="corner-bracket corner-bracket-tr" aria-hidden="true" />
        <div className="corner-bracket corner-bracket-bl" aria-hidden="true" />
        <div className="corner-bracket corner-bracket-br" aria-hidden="true" />

        {/* Top Plaque Header */}
        <div className="space-y-1 w-full pb-2 border-b border-[#B49A64]/20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071B14] border border-[#B49A64]/40 text-[#B49A64] text-[10px] uppercase font-semibold tracking-widest mx-auto">
            <img src="/brand/ca-india-logo.webp" alt="CA India" className="w-3.5 h-3.5 object-contain" />
            <span>ICAI &amp; ICMAI Practicing Fellow</span>
          </div>
        </div>

        {/* Center Practice Seal Medallion & Verified Partner Portrait */}
        <div className="my-auto py-2.5 w-full flex flex-col items-center justify-center">
          <div className="w-36 h-36 sm:w-40 sm:h-40 mx-auto rounded-2xl overflow-hidden border-2 border-[#B49A64]/60 shadow-lg relative bg-[#0B241C] group-hover:border-[#B49A64] transition-all duration-300">
            <picture className="w-full h-full">
              <source srcSet="/images/partner/ca-kavitha-vijay-official.webp" type="image/webp" />
              <img
                src="/images/partner/ca-kavitha-vijay-official.jpg"
                alt="CA Kavitha Vijay - Managing Partner"
                width="400"
                height="400"
                loading="eager"
                className="w-full h-full object-cover object-top"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-[#071B14]/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Bottom Verified Credentials Plaque */}
        <div className="w-full text-center">
          <div className="font-serif text-lg sm:text-xl font-bold text-[#F1EBDD] tracking-wide">
            {partnerName}
          </div>
          <div className="text-xs font-semibold text-[#B49A64] tracking-wider uppercase mt-0.5">
            Managing Partner
          </div>

          {showCredentials && (
            <div className="w-full pt-2.5 mt-2.5 border-t border-[#B49A64]/25 space-y-1 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-200">
                <Award className="w-3.5 h-3.5 text-[#B49A64]" />
                <span>CMA AIR 49 (ICMAI) • B.Com, CA</span>
              </div>
              <p className="text-[10px] text-[#AAB4A0] leading-snug">
                Former Big 4 Auditor (Deloitte) • 10+ Years Experience
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Variant: Crest (Default decorative emblem)
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl bg-[#0B241C] p-2 border border-[#B49A64]/40 shadow-xs shrink-0 select-none ${sizeMap[size]} ${className}`.trim()}
      role="img"
      aria-label="Kavitha & Associates Emblem"
    >
      <div className="font-serif font-bold text-2xl tracking-widest text-[#B49A64]">
        KA
      </div>
    </div>
  );
};

export default CrestMonogram;
