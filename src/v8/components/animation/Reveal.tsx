import React, { useRef, useState, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { MOTION_EASINGS } from './motionTokens';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' | 'none';

export interface RevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number; // ms
  duration?: number; // ms (Botanical Ledger default: 650ms)
  distance?: number; // px offset
  threshold?: number; // IntersectionObserver threshold (0 to 1)
  once?: boolean; // alias for triggerOnce
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 650,
  distance = 24,
  threshold = 0.1,
  once = true,
  triggerOnce,
  className = '',
  style = {},
  as: Component = 'div',
}) => {
  const isReduced = useReducedMotion();
  const elementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    // If reduced motion is preferred or SSR, default to visible
    return isReduced;
  });

  const shouldTriggerOnce = triggerOnce !== undefined ? triggerOnce : once;

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
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, shouldTriggerOnce, isReduced]);

  // Compute transform based on direction
  const getInitialTransform = (): string => {
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'scale':
        return 'scale3d(0.96, 0.96, 1)';
      case 'fade':
      case 'none':
      default:
        return 'none';
    }
  };

  const animationStyles: React.CSSProperties = isReduced
    ? {
        opacity: 1,
        transform: 'none',
        transition: 'none',
        ...style,
      }
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : getInitialTransform(),
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: MOTION_EASINGS.standard,
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
        ...style,
      };

  return (
    <Component
      ref={elementRef}
      className={`v8-reveal ${isVisible ? 'v8-reveal-visible' : 'v8-reveal-hidden'} ${className}`.trim()}
      style={animationStyles}
    >
      {children}
    </Component>
  );
};

export default Reveal;
