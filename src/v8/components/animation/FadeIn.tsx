import React, { useRef, useState, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { MOTION_EASINGS } from './motionTokens';

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number; // ms
  duration?: number; // ms (Botanical Ledger default: 550ms)
  threshold?: number;
  once?: boolean;
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 550,
  threshold = 0.1,
  once = true,
  triggerOnce,
  className = '',
  style = {},
  as: Component = 'div',
}) => {
  const isReduced = useReducedMotion();
  const elementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(() => isReduced);

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
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, shouldTriggerOnce, isReduced]);

  const animationStyles: React.CSSProperties = isReduced
    ? {
        opacity: 1,
        transition: 'none',
        ...style,
      }
    : {
        opacity: isVisible ? 1 : 0,
        transitionProperty: 'opacity',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: MOTION_EASINGS.standard,
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity',
        ...style,
      };

  return (
    <Component
      ref={elementRef}
      className={`v8-fade-in ${isVisible ? 'v8-fade-in-visible' : 'v8-fade-in-hidden'} ${className}`.trim()}
      style={animationStyles}
    >
      {children}
    </Component>
  );
};

export default FadeIn;
