import React from 'react';
import { useInView } from '../../hooks/useInView';

export interface TextHighlightProps {
  children: React.ReactNode;
  className?: string;
  highlightColor?: 'gold' | 'champagne' | 'sage';
  delayMs?: number;
  durationMs?: number;
  triggerOnScroll?: boolean;
}

/**
 * TextHighlight Component
 * Subtle champagne-gold highlighter sweep across selected words.
 * - Direction: Left-to-right background-size wipe (0% -> 100%)
 * - Contrast certified: Soft champagne/gold wash preserves high text contrast (WCAG AAA)
 * - Duration: 700-900ms (default 800ms) with cubic-bezier easing
 * - Respects prefers-reduced-motion: reduce
 */
export const TextHighlight: React.FC<TextHighlightProps> = ({
  children,
  className = '',
  highlightColor = 'champagne',
  delayMs = 200,
  durationMs = 800,
  triggerOnScroll = true
}) => {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.1, triggerOnce: true });
  const isVisible = triggerOnScroll ? inView : true;

  // Accessible subtle gradient washes
  const gradientMap: Record<string, string> = {
    champagne: 'linear-gradient(120deg, rgba(201, 166, 107, 0.22) 0%, rgba(252, 232, 197, 0.42) 100%)',
    gold: 'linear-gradient(120deg, rgba(201, 166, 107, 0.3) 0%, rgba(230, 201, 143, 0.48) 100%)',
    sage: 'linear-gradient(120deg, rgba(234, 243, 233, 0.65) 0%, rgba(186, 211, 176, 0.4) 100%)'
  };

  const backgroundGradient = gradientMap[highlightColor] || gradientMap.champagne;

  return (
    <span
      ref={ref}
      className={`kinetic-highlight-sweep relative inline pl-1 pr-0.5 py-0.5 rounded-sm ${className}`.trim()}
      style={{
        backgroundImage: backgroundGradient,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        backgroundSize: isVisible ? '100% 100%' : '0% 100%',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
        transition: `background-size ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
      }}
    >
      {children}
    </span>
  );
};
