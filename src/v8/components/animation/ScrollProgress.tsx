import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface ScrollProgressProps {
  target?: 'window' | React.RefObject<HTMLElement>;
  height?: number; // default 3px
  colorFrom?: string; // default Forest Green #183529
  colorVia?: string; // default Antique Bronze #B49A64
  colorTo?: string; // default Warm Bronze Accent #C8B282
  position?: 'top' | 'bottom';
  zIndex?: number; // default 100
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  target = 'window',
  height = 3,
  colorFrom = '#183529',
  colorVia = '#B49A64',
  colorTo = '#C8B282',
  position = 'top',
  zIndex = 100,
  className = '',
  style = {},
}) => {
  const isReduced = useReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isReduced) {
      if (barRef.current) {
        barRef.current.style.transform = 'scaleX(0)';
      }
      return;
    }

    let ticking = false;

    const updateProgress = () => {
      if (!barRef.current) {
        ticking = false;
        return;
      }

      let progress = 0;

      if (target === 'window') {
        const docElem = document.documentElement;
        const scrollable = docElem.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY || docElem.scrollTop || 0;
        progress = scrollable > 0 ? scrolled / scrollable : 0;
      } else if (target && target.current) {
        const elem = target.current;
        const scrollable = elem.scrollHeight - elem.clientHeight;
        const scrolled = elem.scrollTop;
        progress = scrollable > 0 ? scrolled / scrollable : 0;
      }

      const clamped = Math.min(Math.max(progress, 0), 1);
      barRef.current.style.transform = `scaleX(${clamped})`;
      ticking = false;
      rafRef.current = null;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = window.requestAnimationFrame(updateProgress);
      }
    };

    if (target === 'window') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });
    } else if (target && target.current) {
      target.current.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });
    }

    updateProgress();

    return () => {
      if (target === 'window') {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      } else if (target && target.current) {
        target.current.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      }
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target, isReduced]);

  const positionClass = position === 'bottom' ? 'bottom-0' : 'top-0';

  return (
    <div
      ref={barRef}
      role="progressbar"
      aria-hidden="true"
      aria-label="Reading progress"
      className={`fixed ${positionClass} left-0 right-0 origin-left pointer-events-none transform scale-x-0 transition-transform duration-75 ${className}`.trim()}
      style={{
        height: `${height}px`,
        background: `linear-gradient(to right, ${colorFrom}, ${colorVia}, ${colorTo})`,
        zIndex,
        ...style,
      }}
    />
  );
};

export default ScrollProgress;
