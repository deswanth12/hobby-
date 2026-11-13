import React, { useState, useEffect, useRef } from 'react';

export interface RotatingTextProps {
  prefix?: string;
  items: string[];
  intervalMs?: number;
  className?: string;
  prefixClassName?: string;
  textClassName?: string;
  ariaLabel?: string;
}

/**
 * RotatingText Component
 * Elegant vertical rotating service text with guaranteed zero layout shift.
 * - CSS Grid cell-sharing sizes the container to the maximum child dimensions
 * - Smooth vertical slide: incoming translateY(100%) -> translateY(0), outgoing translateY(-100%)
 * - Resets non-active/non-prev items immediately without backwards sliding animation
 * - Page Visibility API: Pauses automatically when tab is hidden (document.hidden)
 * - Hover & focus-within pause for uninterrupted reading
 * - Accessible: Static complete text alternative provided for screen readers via .sr-only
 * - Visual container marked aria-hidden="true" to eliminate repetitive screen-reader speech interrupts
 * - Respects prefers-reduced-motion: crossfades in-place without vertical displacement
 */
export const RotatingText: React.FC<RotatingTextProps> = ({
  prefix,
  items,
  intervalMs = 3000,
  className = '',
  prefixClassName = 'text-brand-charcoal/90 font-medium',
  textClassName = 'text-brand-forest font-serif font-bold italic',
  ariaLabel = 'Specialized Practice Services'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Listen to Page Visibility API
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Rotate items
  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, items.length, intervalMs]);

  // Static accessible representation for screen readers
  const accessibleText = prefix ? `${prefix} ${items.join(', ')}` : items.join(', ');

  return (
    <div
      className={`inline-flex flex-wrap items-baseline gap-x-2 select-none ${className}`.trim()}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(document.hidden)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(document.hidden)}
      aria-label={ariaLabel}
    >
      {/* Screen-reader accessible static alternative */}
      <span className="sr-only">{accessibleText}</span>

      {/* Visual prefix */}
      {prefix && (
        <span aria-hidden="true" className={`shrink-0 ${prefixClassName}`.trim()}>
          {prefix}
        </span>
      )}

      {/* Grid container: all items occupy the same grid area so width & height are locked to maximum size */}
      <span
        aria-hidden="true"
        className="inline-grid grid-cols-1 grid-rows-1 overflow-hidden align-baseline relative pb-0.5"
      >
        {items.map((item, idx) => {
          const isActive = idx === currentIndex;
          const isPrev = idx === (currentIndex - 1 + items.length) % items.length;

          let transformStyle = 'translateY(100%)';
          let opacityStyle = 0;

          if (isActive) {
            transformStyle = 'translateY(0%)';
            opacityStyle = 1;
          } else if (isPrev) {
            transformStyle = 'translateY(-100%)';
            opacityStyle = 0;
          }

          if (prefersReducedMotion) {
            transformStyle = 'none';
          }

          // Non-active and non-prev elements reset instantly to staging position without transition
          const hasTransition = isActive || isPrev;

          return (
            <span
              key={idx}
              className={`col-start-1 row-start-1 whitespace-nowrap ${textClassName} ${
                isActive ? 'pointer-events-auto' : 'pointer-events-none'
              }`.trim()}
              style={{
                transform: transformStyle,
                opacity: opacityStyle,
                transition: hasTransition
                  ? 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease-out'
                  : 'none',
              }}
            >
              {item}
            </span>
          );
        })}
      </span>
    </div>
  );
};
