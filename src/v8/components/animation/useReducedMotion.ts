import { useState, useEffect } from 'react';

/**
 * useReducedMotion
 * Detects whether the user has enabled the prefers-reduced-motion accessibility preference.
 * SSR-safe, reactive to system preference changes, and properly cleans up media query listeners.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updatePreference = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches);
    };

    // Initial check in case it changed between mount and effect
    setPrefersReducedMotion(mediaQueryList.matches);

    // Modern API with legacy fallback
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', updatePreference);
      return () => {
        mediaQueryList.removeEventListener('change', updatePreference);
      };
    } else if ('addListener' in mediaQueryList) {
      // Legacy Safari / older browsers
      const legacyMql = mediaQueryList as unknown as {
        addListener: (listener: (e: MediaQueryListEvent) => void) => void;
        removeListener: (listener: (e: MediaQueryListEvent) => void) => void;
      };
      legacyMql.addListener(updatePreference as (e: MediaQueryListEvent) => void);
      return () => {
        legacyMql.removeListener(updatePreference as (e: MediaQueryListEvent) => void);
      };
    }
  }, []);

  return prefersReducedMotion;
}

export default useReducedMotion;
