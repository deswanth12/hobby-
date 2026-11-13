import React, { useRef, useState, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { MOTION_EASINGS, BOTANICAL_COLORS } from './motionTokens';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'bronze' | 'sage' | 'forest' | 'muted';
export type DividerOrigin = 'left' | 'center' | 'right' | 'top' | 'bottom';

export interface AnimatedDividerProps {
  orientation?: DividerOrientation; // default 'horizontal'
  variant?: DividerVariant; // default 'bronze'
  length?: string | number; // default '100%'
  durationMs?: number; // default 1100ms (Botanical Ledger line-drawing range: 900–1600ms)
  duration?: number;
  delayMs?: number; // default 0
  delay?: number;
  thickness?: number; // px, default 1px
  origin?: DividerOrigin;
  hasEndpointDots?: boolean;
  threshold?: number;
  once?: boolean;
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedDivider: React.FC<AnimatedDividerProps> = ({
  orientation = 'horizontal',
  variant = 'bronze',
  length = '100%',
  durationMs = 1100,
  duration,
  delayMs = 0,
  delay,
  thickness = 1,
  origin,
  hasEndpointDots = false,
  threshold = 0.1,
  once = true,
  triggerOnce,
  className = '',
  style = {},
}) => {
  const isReduced = useReducedMotion();
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(() => isReduced);

  const effectiveDuration = duration !== undefined ? duration : durationMs;
  const effectiveDelay = delay !== undefined ? delay : delayMs;
  const shouldTriggerOnce = triggerOnce !== undefined ? triggerOnce : once;

  const defaultOrigin = orientation === 'horizontal' ? 'left' : 'top';
  const effectiveOrigin = origin || defaultOrigin;

  useEffect(() => {
    if (isReduced) {
      setIsVisible(true);
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          if (shouldTriggerOnce) {
            observer.unobserve(node);
          }
        } else if (!shouldTriggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, shouldTriggerOnce, isReduced]);

  const getColor = (): string => {
    switch (variant) {
      case 'bronze':
        return BOTANICAL_COLORS.bronze;
      case 'sage':
        return BOTANICAL_COLORS.sage;
      case 'forest':
        return BOTANICAL_COLORS.forest;
      case 'muted':
      default:
        return BOTANICAL_COLORS.mutedBorder;
    }
  };

  const color = getColor();

  const getOriginClass = (): string => {
    switch (effectiveOrigin) {
      case 'center':
        return 'origin-center';
      case 'right':
        return 'origin-right';
      case 'bottom':
        return 'origin-bottom';
      case 'top':
        return 'origin-top';
      case 'left':
      default:
        return 'origin-left';
    }
  };

  const isHorizontal = orientation === 'horizontal';

  const lineStyle: React.CSSProperties = isReduced
    ? {
        backgroundColor: color,
        transform: 'none',
        transition: 'none',
        width: isHorizontal ? (typeof length === 'number' ? `${length}px` : length) : `${thickness}px`,
        height: isHorizontal ? `${thickness}px` : (typeof length === 'number' ? `${length}px` : length),
      }
    : {
        backgroundColor: color,
        transform: isVisible
          ? isHorizontal
            ? 'scaleX(1)'
            : 'scaleY(1)'
          : isHorizontal
          ? 'scaleX(0)'
          : 'scaleY(0)',
        transitionProperty: 'transform',
        transitionDuration: `${effectiveDuration}ms`,
        transitionTimingFunction: MOTION_EASINGS.editorial,
        transitionDelay: `${effectiveDelay}ms`,
        willChange: isVisible ? 'auto' : 'transform',
        width: isHorizontal ? (typeof length === 'number' ? `${length}px` : length) : `${thickness}px`,
        height: isHorizontal ? `${thickness}px` : (typeof length === 'number' ? `${length}px` : length),
      };

  return (
    <div
      ref={elementRef}
      role="separator"
      aria-orientation={orientation}
      className={`v8-animated-divider relative inline-flex items-center justify-center ${className}`.trim()}
      style={style}
    >
      {hasEndpointDots && isHorizontal && (
        <span
          className="inline-block rounded-full flex-shrink-0 transition-opacity duration-300"
          style={{
            width: `${thickness + 3}px`,
            height: `${thickness + 3}px`,
            backgroundColor: color,
            opacity: isVisible || isReduced ? 0.8 : 0,
            marginRight: '-1px',
          }}
        />
      )}

      <div
        className={`relative ${getOriginClass()}`}
        style={lineStyle}
      />

      {hasEndpointDots && isHorizontal && (
        <span
          className="inline-block rounded-full flex-shrink-0 transition-opacity duration-300"
          style={{
            width: `${thickness + 3}px`,
            height: `${thickness + 3}px`,
            backgroundColor: color,
            opacity: isVisible || isReduced ? 0.8 : 0,
            marginLeft: '-1px',
          }}
        />
      )}
    </div>
  );
};

export default AnimatedDivider;
