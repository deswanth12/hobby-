import { useState, useEffect, useCallback } from 'react';

/**
 * useMouseParallax Hook
 * High-performance, lightweight desktop-only parallax interaction.
 * - Restrained displacement (max ±12px) for gentle depth.
 * - rAF-throttled to 60fps compositor-friendly execution.
 * - Automatically completely disabled on mobile/tablet (< 1024px) or if prefers-reduced-motion is active.
 */
export function useMouseParallax(maxOffset: number = 10) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Strict accessibility & mobile check: disable on mobile & reduced-motion
    const isDesktop = window.innerWidth >= 1024;
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isDesktop || prefersReducedMotion) {
      return;
    }

    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      // Calculate normalized position from center (-1 to 1)
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      targetX = normX * maxOffset;
      targetY = normY * maxOffset;

      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      // Smooth linear interpolation (damping factor 0.08)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      setOffset({
        x: Math.round(currentX * 100) / 100,
        y: Math.round(currentY * 100) / 100,
      });

      // Continue animating until settled
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [maxOffset]);

  const getStyle = useCallback(
    (factor: number = 1) => ({
      transform: `translate3d(${offset.x * factor}px, ${offset.y * factor}px, 0)`,
      willChange: 'transform',
    }),
    [offset]
  );

  return { offset, getStyle };
}
