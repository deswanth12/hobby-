import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface StaggerContextValue {
  isVisible: boolean;
  staggerMs: number;
  initialDelayMs: number;
  isReduced: boolean;
}

export const StaggerContext = createContext<StaggerContextValue>({
  isVisible: true,
  staggerMs: 80,
  initialDelayMs: 0,
  isReduced: false,
});

export const useStagger = () => useContext(StaggerContext);

export interface StaggerContainerProps {
  children: React.ReactNode;
  staggerMs?: number; // default 80ms (within 160-320ms / 450-750ms total sequence)
  initialDelayMs?: number; // default 0ms
  delay?: number; // alias for initialDelayMs
  threshold?: number;
  once?: boolean;
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerMs = 80,
  initialDelayMs = 0,
  delay,
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

  const effectiveInitialDelay = delay !== undefined ? delay : initialDelayMs;
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

  const contextValue: StaggerContextValue = {
    isVisible,
    staggerMs,
    initialDelayMs: effectiveInitialDelay,
    isReduced,
  };

  return (
    <StaggerContext.Provider value={contextValue}>
      <Component
        ref={elementRef}
        className={`v8-stagger-container ${isVisible ? 'v8-stagger-visible' : 'v8-stagger-hidden'} ${className}`.trim()}
        style={style}
      >
        {children}
      </Component>
    </StaggerContext.Provider>
  );
};

export default StaggerContainer;
