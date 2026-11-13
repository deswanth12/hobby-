import React from 'react';
import { useInView } from '../../hooks/useInView';

export interface BlurRevealProps {
  children?: React.ReactNode;
  text?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  blurPx?: number;
  durationMs?: number;
  delayMs?: number;
  triggerOnScroll?: boolean;
}

/**
 * BlurReveal Component
 * Restrained blur-to-focus typography transition with subtle upward entrance.
 * - Starts at 4px subtle blur and 0.25 opacity, resolving cleanly to 0px blur and 1.0 opacity
 * - Bounded filter cost: Restricted to headings and short phrases, never full body copy
 * - Duration: 600-900ms (default 750ms)
 * - Accessible: Respects prefers-reduced-motion: reduce with instant crisp presentation
 */
export const BlurReveal: React.FC<BlurRevealProps> = ({
  children,
  text,
  as: Component = 'div',
  className = '',
  blurPx = 4,
  durationMs = 750,
  delayMs = 0,
  triggerOnScroll = true
}) => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const isVisible = triggerOnScroll ? inView : true;

  const content = text ?? children;

  return (
    <Component
      ref={ref as any}
      className={`kinetic-blur-reveal inline-block ${className}`.trim()}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms`,
        opacity: isVisible ? 1 : 0.25,
        transform: isVisible ? 'translateY(0)' : 'translateY(6px)',
        filter: isVisible ? 'blur(0px)' : `blur(${blurPx}px)`,
      }}
    >
      {content}
    </Component>
  );
};
