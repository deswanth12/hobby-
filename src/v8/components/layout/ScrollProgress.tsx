import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Slender Antique Gold Page Reading Indicator (Requirement R2 & R4)
 * Pinned directly underneath the sticky navigation header in Navbar.tsx.
 * 
 * - Slender 2px height
 * - Luxury antique gold gradient: #9E7B35 -> #C3A66B -> #F4E2BB
 * - Ambient gold glow: shadow-[0_0_8px_rgba(195,166,107,0.5)]
 * - Inline style fallbacks to guarantee immunity against CSS specificity overrides
 * - Hardware-accelerated with requestAnimationFrame, scaleX transform, and origin-left
 * - Route change awareness via useLocation() to recalculate / reset on navigation
 * - Passive scroll and resize listeners with symmetric cleanup and cancelAnimationFrame
 * - Uses w-full (100% of header) to guarantee zero horizontal overflow across all viewports
 */
export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      if (barRef.current) {
        const docElem = document.documentElement;
        const scrollable = docElem.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY || docElem.scrollTop || 0;
        const progress = scrollable > 0 ? scrolled / scrollable : 0;
        const clamped = Math.min(Math.max(progress, 0), 1);
        barRef.current.style.transform = `scaleX(${clamped})`;
      }
      ticking = false;
      rafRef.current = null;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = window.requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [location.pathname]);

  return (
    <div
      id="scroll-progress-bar"
      ref={barRef}
      role="progressbar"
      aria-hidden="true"
      aria-label="Reading progress"
      className="w-full h-[2px] bg-gradient-to-r from-[#9E7B35] via-[#C3A66B] to-[#F4E2BB] shadow-[0_0_8px_rgba(195,166,107,0.5)] origin-left pointer-events-none transform scale-x-0 transition-transform duration-75"
      style={{
        height: '2px',
        background: 'linear-gradient(to right, #9E7B35, #C3A66B, #F4E2BB)',
        boxShadow: '0 0 8px rgba(195, 166, 107, 0.5)',
      }}
    />
  );
};

export default ScrollProgress;
