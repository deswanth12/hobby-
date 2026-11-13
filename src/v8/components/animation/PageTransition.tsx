import React, { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { MOTION_EASINGS } from './motionTokens';

export interface PageTransitionProps {
  children: React.ReactNode;
  durationMs?: number; // default 280ms
  duration?: number;
  locationKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  durationMs = 280,
  duration,
  locationKey,
  className = '',
  style = {},
}) => {
  const isReduced = useReducedMotion();
  const effectiveDuration = duration !== undefined ? duration : durationMs;

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (locationKey) return locationKey;
    if (typeof window !== 'undefined') return window.location.pathname;
    return '/';
  });

  const [isEntered, setIsEntered] = useState<boolean>(true);

  useEffect(() => {
    if (locationKey && locationKey !== currentPath) {
      setCurrentPath(locationKey);
      if (!isReduced) {
        setIsEntered(false);
        const rafId = requestAnimationFrame(() => setIsEntered(true));
        return () => cancelAnimationFrame(rafId);
      }
    }
  }, [locationKey, currentPath, isReduced]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      if (!isReduced) {
        setIsEntered(false);
        const rafId = requestAnimationFrame(() => setIsEntered(true));
        return () => cancelAnimationFrame(rafId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isReduced]);

  useEffect(() => {
    if (isReduced) {
      setIsEntered(true);
      return;
    }

    setIsEntered(false);
    const rafId = requestAnimationFrame(() => {
      setIsEntered(true);
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isReduced]);

  if (isReduced) {
    return (
      <div className={`v8-page-transition ${className}`.trim()} style={style}>
        {children}
      </div>
    );
  }

  const animationStyles: React.CSSProperties = {
    opacity: isEntered ? 1 : 0.94,
    transform: isEntered ? 'translate3d(0, 0, 0)' : 'translate3d(0, 6px, 0)',
    transitionProperty: 'opacity, transform',
    transitionDuration: `${effectiveDuration}ms`,
    transitionTimingFunction: MOTION_EASINGS.standard,
    ...style,
  };

  return (
    <div
      key={currentPath}
      className={`v8-page-transition ${className}`.trim()}
      style={animationStyles}
    >
      {children}
    </div>
  );
};

export default PageTransition;
