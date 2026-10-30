import React, { useEffect, useRef } from 'react';

/**
 * ScrollProgress Component
 * Renders an accessible, ultra-thin gold & forest progress bar at top-0.
 * Powered by CSS scroll-driven animations on modern Chromium/Edge/Safari engines,
 * with passive JS scroll listener fallback for complete cross-browser support.
 */
export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if browser already supports native animation-timeline: scroll()
    const supportsScrollTimeline =
      typeof CSS !== 'undefined' &&
      CSS.supports &&
      (CSS.supports('animation-timeline: scroll()') || CSS.supports('animation-timeline', 'scroll()'));

    if (supportsScrollTimeline) {
      return;
    }

    // Passive scroll listener fallback
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (barRef.current) {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
            barRef.current.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
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
