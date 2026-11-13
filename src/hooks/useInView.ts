import { useEffect, useState, useRef, RefObject } from 'react';

export interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * useInView Hook
 * Robust, lightweight IntersectionObserver hook with zero dependencies.
 * - Automatically respects prefers-reduced-motion: reduce
 * - Fallbacks safely when window or IntersectionObserver is unavailable
 * - Triggers immediately during print preview (beforeprint)
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): [RefObject<T>, boolean] {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReducedMotion || typeof IntersectionObserver === 'undefined';
  });

  useEffect(() => {
    if (isInView && triggerOnce) return;
    if (typeof window === 'undefined') return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Check if element is already within active viewport or scrolled past above it
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setIsInView(true);
      if (triggerOnce) return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.bottom <= 0) {
            setIsInView(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    const handlePrint = () => setIsInView(true);
    window.addEventListener('beforeprint', handlePrint);

    return () => {
      observer.disconnect();
      window.removeEventListener('beforeprint', handlePrint);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView];
}
