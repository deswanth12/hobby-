import React, { useEffect, useRef } from 'react';

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
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#183529] via-[#B49A64] to-[#C8B282] z-[100] origin-left pointer-events-none transform scale-x-0 transition-transform duration-75"
    />
  );
};

export default ScrollProgress;
