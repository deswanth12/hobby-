import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useScrollReveal Hook
 * Observes elements with .scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale,
 * or [data-reveal] attribute using an IntersectionObserver.
 * Dynamically toggles the .is-revealed class when elements enter the viewport.
 * Automatically re-initializes on route changes.
 */
export function useScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    // If IntersectionObserver is unavailable or user prefers reduced motion, reveal everything immediately
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion) {
      document
        .querySelectorAll(
          '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, [data-reveal]'
        )
        .forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Unobserve after revealing to maintain high FPS
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08,
      }
    );

    // Give DOM a frame to settle after route mount
    const timer = setTimeout(() => {
      const targets = document.querySelectorAll(
        '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, [data-reveal]'
      );
      targets.forEach((target) => {
        // If element is already in initial viewport, reveal it immediately
        const rect = target.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          target.classList.add('is-revealed');
        } else {
          observer.observe(target);
        }
      });
    }, 60);

    // Failsafe timer: after 1200ms reveal any remaining unrevealed elements
    const failsafeTimer = setTimeout(() => {
      document
        .querySelectorAll(
          '.scroll-reveal:not(.is-revealed), .scroll-reveal-left:not(.is-revealed), .scroll-reveal-right:not(.is-revealed), .scroll-reveal-scale:not(.is-revealed), [data-reveal]:not(.is-revealed)'
        )
        .forEach((el) => el.classList.add('is-revealed'));
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafeTimer);
      observer.disconnect();
    };
  }, [pathname]);
}
