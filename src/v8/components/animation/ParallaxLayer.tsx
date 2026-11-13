import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // default 0.05
  maxOffset?: number; // default 16px (strict fiduciary boundary)
  mode?: 'scroll' | 'mouse'; // default 'scroll'
  direction?: 'vertical' | 'horizontal'; // default 'vertical'
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 0.05,
  maxOffset = 16,
  mode = 'scroll',
  direction = 'vertical',
  disabled = false,
  className = '',
  style = {},
}) => {
  const isReduced = useReducedMotion();
  const elementRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [offset, setOffset] = useState<number>(0);

  const isMobileOrTouch = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return (
      window.innerWidth < 1024 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(hover: none)').matches
    );
  }, []);

  useEffect(() => {
    if (disabled || isReduced || isMobileOrTouch()) {
      setOffset(0);
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    if (mode === 'scroll') {
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          ticking = true;
          rafRef.current = requestAnimationFrame(() => {
            if (!elementRef.current) return;
            const rect = elementRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Compute relative position to center of viewport
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const distanceFromCenter = elementCenter - viewportCenter;

            const rawOffset = distanceFromCenter * speed;
            const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));

            setOffset(clampedOffset);
            ticking = false;
          });
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });
      handleScroll();

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    } else if (mode === 'mouse') {
      let ticking = false;

      const handleMouseMove = (e: MouseEvent) => {
        if (!ticking) {
          ticking = true;
          rafRef.current = requestAnimationFrame(() => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const delta = direction === 'vertical' ? e.clientY - centerY : e.clientX - centerX;

            const rawOffset = delta * speed;
            const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));

            setOffset(clampedOffset);
            ticking = false;
          });
        }
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    }
  }, [disabled, isReduced, isMobileOrTouch, mode, direction, speed, maxOffset]);

  const transformStyle = isReduced || disabled
    ? 'none'
    : direction === 'vertical'
    ? `translate3d(0, ${offset.toFixed(1)}px, 0)`
    : `translate3d(${offset.toFixed(1)}px, 0, 0)`;

  return (
    <div
      ref={elementRef}
      className={`v8-parallax-layer ${className}`.trim()}
      style={{
        transform: transformStyle,
        transition: 'transform 100ms ease-out',
        willChange: isReduced || disabled ? 'auto' : 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxLayer;
