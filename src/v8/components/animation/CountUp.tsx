import React, { useRef, useState, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface CountUpProps {
  value: number;
  start?: number; // default 0
  prefix?: string;
  suffix?: string;
  decimals?: number; // default 0
  durationMs?: number; // default 1200ms (Botanical Ledger counter range: 900–1600ms)
  duration?: number;
  delayMs?: number; // default 0
  delay?: number;
  threshold?: number;
  once?: boolean;
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
  formatNumber?: (val: number) => string;
  as?: React.ElementType;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  start = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationMs = 1200,
  duration,
  delayMs = 0,
  delay,
  threshold = 0.1,
  once = true,
  triggerOnce,
  className = '',
  style = {},
  formatNumber,
  as: Component = 'span',
}) => {
  const isReduced = useReducedMotion();
  const elementRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [displayValue, setDisplayValue] = useState<number>(() => (isReduced ? value : start));
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const effectiveDuration = duration !== undefined ? duration : durationMs;
  const effectiveDelay = delay !== undefined ? delay : delayMs;
  const shouldTriggerOnce = triggerOnce !== undefined ? triggerOnce : once;

  // Reduced motion: immediately render final value
  useEffect(() => {
    if (isReduced) {
      setDisplayValue(value);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
  }, [isReduced, value]);

  // Observer to trigger counting when visible
  useEffect(() => {
    if (isReduced) {
      setDisplayValue(value);
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setHasStarted(true);
          if (shouldTriggerOnce) {
            observer.unobserve(node);
          }
        } else if (!shouldTriggerOnce) {
          setHasStarted(false);
          setDisplayValue(start);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, shouldTriggerOnce, isReduced, start, value]);

  // Animation frame loop
  useEffect(() => {
    if (!hasStarted || isReduced) {
      return;
    }

    let startTime: number | null = null;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / effectiveDuration, 1);

      // easeOutCubic: 1 - (1 - t)^3
      const easeOut = 1 - Math.pow(1 - progressRatio, 3);
      const currentValue = start + (value - start) * easeOut;

      setDisplayValue(currentValue);

      if (progressRatio < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
        rafRef.current = null;
      }
    };

    if (effectiveDelay > 0) {
      timerId = setTimeout(() => {
        rafRef.current = requestAnimationFrame(step);
      }, effectiveDelay);
    } else {
      rafRef.current = requestAnimationFrame(step);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [hasStarted, isReduced, start, value, effectiveDuration, effectiveDelay]);

  // Format value with decimals and custom formatter if provided
  const formattedNumber = (): string => {
    if (formatNumber) {
      return formatNumber(displayValue);
    }
    if (decimals > 0) {
      return displayValue.toFixed(decimals);
    }
    return Math.round(displayValue).toLocaleString('en-IN');
  };

  const finalAnnouncement = `${prefix}${value}${suffix}`;

  return (
    <Component
      ref={elementRef}
      className={`v8-count-up tabular-nums font-mono ${className}`.trim()}
      style={style}
      aria-label={finalAnnouncement}
    >
      <span aria-hidden="true">
        {prefix}
        {formattedNumber()}
        {suffix}
      </span>
    </Component>
  );
};

export default CountUp;
