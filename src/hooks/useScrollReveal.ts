import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const REVEAL_SELECTOR =
  '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-image, [data-reveal]';

/**
 * useScrollReveal Hook
 * Production-grade IntersectionObserver scroll entrance engine for Kavitha & Associates.
 * - Hardware-accelerated transforms & silky 750ms-800ms cubic-bezier transitions.
 * - Calibrated rootMargin: '0px 0px -60px 0px' ensuring elements reveal naturally as they enter.
 * - Above-the-fold content smoothly animates into view on page mount.
 * - Below-the-fold content stays concealed until scrolled into the viewport.
 * - Already-passed content (e.g. on anchor jump or refresh) is immediately revealed.
 * - Passive rAF scroll listener catches fast fling scrolls and guarantees bottom-of-page reveals.
 * - MutationObserver dynamically registers new elements without arbitrary delays.
 * - Accessible: respects prefers-reduced-motion: reduce, keyboard focusin, and beforeprint.
 */
export function useScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reduced motion accessibility fallback: reveal all immediately with no animation
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    // Set of observed elements to prevent duplicate observers
    const observedSet = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Reveal if intersecting OR if the element was scrolled past rapidly (bottom <= 0)
          if (entry.isIntersecting || entry.boundingClientRect.bottom <= 0) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
            observedSet.delete(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.05,
      }
    );

    const observeElement = (el: Element) => {
      if (el.classList.contains('is-revealed') || observedSet.has(el)) {
        return;
      }

      const rect = el.getBoundingClientRect();

      // Case 1: Element is already above the viewport (e.g., anchor jump, page reload, or mid-page scroll)
      if (rect.bottom <= 0) {
        el.classList.add('is-revealed');
        return;
      }

      // Case 2: Element is currently within the active above-the-fold viewport
      const inInitialViewport =
        rect.top < window.innerHeight - 60 && rect.bottom > 0;

      if (inInitialViewport) {
        // Smooth entrance animation for above-the-fold elements upon mount
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.classList.add('is-revealed');
          });
        });
      } else {
        // Below fold: observe so it only animates when user scrolls into view
        observedSet.add(el);
        observer.observe(el);
      }
    };

    const scanAndObserve = () => {
      const targets = document.querySelectorAll(REVEAL_SELECTOR);
      targets.forEach(observeElement);
    };

    // Initial scan after frame
    const initialRaf = requestAnimationFrame(scanAndObserve);

    // MutationObserver to automatically register newly rendered DOM elements across route changes
    const mutationObserver = new MutationObserver(() => {
      scanAndObserve();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Keyboard accessibility: immediately reveal if focused element is inside an unrevealed container
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const revealAncestor = target.closest(REVEAL_SELECTOR);
        if (revealAncestor && !revealAncestor.classList.contains('is-revealed')) {
          revealAncestor.classList.add('is-revealed');
          observer.unobserve(revealAncestor);
          observedSet.delete(revealAncestor);
        }
      }
    };
    document.addEventListener('focusin', handleFocusIn, { passive: true });

    // Scroll listener: catches fast scrolls, anchor jumps, and bottom-of-page reveals
    let scrollTicking = false;
    const handleScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        const scrollBottom = window.innerHeight + window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const isNearBottom = scrollBottom >= docHeight - 120;

        document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
          if (!el.classList.contains('is-revealed')) {
            const rect = el.getBoundingClientRect();
            // If scrolled past or if near the bottom of the page and element has entered
            if (rect.bottom <= 0 || (isNearBottom && rect.top < window.innerHeight)) {
              el.classList.add('is-revealed');
              observer.unobserve(el);
              observedSet.delete(el);
            }
          }
        });
        scrollTicking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Print accessibility fallback: ensure full document is visible when printed
    const handleBeforePrint = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        el.classList.add('is-revealed');
      });
    };
    window.addEventListener('beforeprint', handleBeforePrint);

    return () => {
      cancelAnimationFrame(initialRaf);
      mutationObserver.disconnect();
      document.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeprint', handleBeforePrint);
      observer.disconnect();
    };
  }, [pathname]);
}
