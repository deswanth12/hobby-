import React, { useEffect, useState, useRef } from 'react';
import { useInView } from '../../hooks/useInView';

export interface StatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
  decimals?: number;
}

/**
 * StatCounter Component
 * Hardware-timed statistical count-up reveal triggered once upon viewport entrance.
 * - Uses requestAnimationFrame with ease-out cubic deceleration
 * - Strictly zero invented statistics (bound to verified credentials and practice figures)
 * - Accessible: Complete value presented to screen readers via .sr-only
 * - Respects prefers-reduced-motion: Instant value render without incremental counting
 */
export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  durationMs = 1500,
  className = '',
  decimals = 0
}) => {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.1, triggerOnce: true });
  const [displayValue, setDisplayValue] = useState<number>(() => {
    if (typeof window === 'undefined') return value;
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReducedMotion ? value : 0;
  });

  const hasAnimated = useRef(false);

  // Synchronize if prop value changes after mount
  useEffect(() => {
    if (hasAnimated.current) {
      setDisplayValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      hasAnimated.current = true;
      return;
    }

    hasAnimated.current = true;
    const startTime = performance.now();
    const startValue = 0;

    let rafId: number;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease-out cubic: 1 - Math.pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (value - startValue) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    rafId = requestAnimationFrame(updateCounter);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [inView, value, durationMs]);

  const formattedValue =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toString();

  return (
    <span ref={ref} className={`font-mono tabular-nums ${className}`.trim()}>
      <span className="sr-only">
        {prefix}{value}{suffix}
      </span>
      <span aria-hidden="true">
        {prefix}{formattedValue}{suffix}
      </span>
    </span>
  );
};
