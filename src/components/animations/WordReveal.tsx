import React, { useMemo, useState, useEffect } from 'react';
import { useInView } from '../../hooks/useInView';

export interface WordRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  staggerMs?: number;
  durationMs?: number;
  delayMs?: number;
  triggerOnScroll?: boolean;
  highlightWords?: string[];
  highlightClassName?: string;
}

/**
 * WordReveal Component
 * Word-by-word kinetic entrance using overflow-hidden clipping mask.
 * - Smooth upward translate: translateY(110%) -> translateY(0)
 * - Calibrated word stagger: 80-130ms (default 95ms, dynamically reduced on mobile)
 * - Duration: 500-800ms (default 650ms) with cubic-bezier easing
 * - Strictly no trailing margin on the final word, ensuring optical centering in text-center blocks
 * - WCAG Accessible: Screen reader alternative provided via .sr-only
 * - Visual words masked and animated safely with aria-hidden="true"
 */
export const WordReveal: React.FC<WordRevealProps> = ({
  text = '',
  as: Component = 'span',
  className = '',
  staggerMs = 95,
  durationMs = 650,
  delayMs = 0,
  triggerOnScroll = true,
  highlightWords = [],
  highlightClassName = 'text-brand-gold'
}) => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const isVisible = triggerOnScroll ? inView : true;

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile((prev) => (prev !== mobile ? mobile : prev));
    };
    checkMobile();

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const debouncedResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    window.addEventListener('resize', debouncedResize, { passive: true });
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  const effectiveStagger = isMobile ? Math.min(staggerMs, 65) : staggerMs;

  const words = useMemo(() => (text ? text.trim().split(/\s+/).filter(Boolean) : []), [text]);

  const cleanWord = (w: string) => w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const highlightedSet = useMemo(
    () => new Set(highlightWords.map((w) => cleanWord(w))),
    [highlightWords]
  );

  return (
    <Component
      ref={ref as any}
      className={`inline-block ${className}`.trim()}
    >
      {/* Screen-reader accessible alternative */}
      <span className="sr-only">{text}</span>

      {/* Visual animated words */}
      <span aria-hidden="true" className="inline">
        {words.map((word, idx) => {
          const isHighlighted = highlightedSet.has(cleanWord(word));
          const wordDelay = delayMs + idx * effectiveStagger;
          const isLast = idx === words.length - 1;

          return (
            <span
              key={idx}
              className={`inline-block overflow-hidden align-top ${isLast ? '' : 'mr-[0.28em]'} pb-[0.1em]`}
            >
              <span
                className={`inline-block kinetic-word-inner ${isHighlighted ? highlightClassName : ''}`.trim()}
                style={{
                  transitionDuration: `${durationMs}ms`,
                  transitionDelay: `${wordDelay}ms`,
                  transform: isVisible ? 'translateY(0%)' : 'translateY(110%)',
                  opacity: isVisible ? 1 : 0,
                }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </span>
    </Component>
  );
};
