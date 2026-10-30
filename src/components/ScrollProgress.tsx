import React, { useEffect, useRef } from 'react';

/**
 * ScrollProgress Component
 * Renders an accessible, ultra-thin gold & forest progress bar at top-0.
 * Powered by high-performance requestAnimationFrame scroll tracking with
 * native CSS scroll-timeline enhancement where supported.
 */
export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

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
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      id="scroll-progress-bar"
      ref={barRef}
      role="progressbar"
      aria-hidden="true"
      aria-label="Reading progress"
    />
  );
};
