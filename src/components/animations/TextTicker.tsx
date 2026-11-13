import React from 'react';

export interface TextTickerProps {
  items?: string[];
  separator?: string;
  speedSeconds?: number;
  className?: string;
  reverse?: boolean;
  variant?: 'forest' | 'deep' | 'champagne' | 'ivory';
  ariaLabel?: string;
}

/**
 * TextTicker Component
 * Infinite horizontal typography marquee strip with pause-on-hover and seamless looping.
 * - Hardware accelerated translate3d(-50%, 0, 0)
 * - 4x repetition guarantees mathematically zero stutter on loop wrap
 * - Hover & focus-within interactions smoothly freeze motion for reading
 * - Respects prefers-reduced-motion: reduce
 * - Strictly zero horizontal overflow with overflow-hidden & marquee mask
 */
export const TextTicker: React.FC<TextTickerProps> = ({
  items = [
    'AUDIT',
    'TAXATION',
    'GST',
    'COMPLIANCE',
    'BUSINESS ADVISORY',
    'STATUTORY AUDIT',
    'CORPORATE GOVERNANCE',
    'RERA PRACTICE'
  ],
  separator = '✦',
  speedSeconds = 28,
  className = '',
  reverse = false,
  variant = 'forest',
  ariaLabel = 'Statutory Practice Disciplines Ticker'
}) => {
  const repeatedItems = [...items, ...items, ...items, ...items];

  const variantStyles = {
    forest: 'bg-brand-forest text-brand-ivory border-y border-brand-gold/40',
    deep: 'bg-brand-deep text-brand-cream border-y border-brand-gold/30',
    champagne: 'bg-brand-champagne text-brand-forest border-y border-brand-gold/50',
    ivory: 'bg-brand-ivory text-brand-forest border-y border-brand-border'
  };

  const separatorStyles = {
    forest: 'text-brand-gold',
    deep: 'text-brand-gold',
    champagne: 'text-brand-gold',
    ivory: 'text-brand-gold'
  };

  return (
    <div
      className={`relative w-full max-w-full overflow-hidden py-3 sm:py-3.5 select-none kinetic-ticker-container ${variantStyles[variant]} ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <div className="w-full overflow-hidden marquee-mask">
        <div
          className={`flex items-center gap-6 whitespace-nowrap will-change-transform ${
            reverse ? 'kinetic-ticker-track-reverse' : 'kinetic-ticker-track'
          }`}
          style={{
            animationDuration: `${speedSeconds}s`,
          }}
        >
          {repeatedItems.map((item, idx) => {
            const isDuplicate = idx >= items.length;
            return (
              <div
                key={idx}
                className={`inline-flex items-center gap-6 shrink-0 ${
                  isDuplicate ? 'kinetic-ticker-duplicate' : ''
                }`.trim()}
                aria-hidden={isDuplicate ? 'true' : undefined}
                data-ticker-duplicate={isDuplicate ? 'true' : undefined}
              >
                <span className="font-editorial-meta text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase">
                  {item}
                </span>
                <span
                  className={`text-xs ${separatorStyles[variant] || separatorStyles.forest} shrink-0`}
                  aria-hidden="true"
                >
                  {separator}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
