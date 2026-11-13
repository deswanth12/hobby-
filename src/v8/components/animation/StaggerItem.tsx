import React from 'react';
import { useStagger } from './StaggerContainer';
import { MOTION_EASINGS } from './motionTokens';

export interface StaggerItemProps {
  children: React.ReactNode;
  index?: number;
  durationMs?: number; // default 550ms (within 450-750ms entrance band)
  duration?: number; // alias
  distance?: number; // px, default 20px
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  index = 0,
  durationMs = 550,
  duration,
  distance = 20,
  direction = 'up',
  className = '',
  style = {},
  as: Component = 'div',
}) => {
  const { isVisible, staggerMs, initialDelayMs, isReduced } = useStagger();
  const effectiveDuration = duration !== undefined ? duration : durationMs;

  const itemDelay = initialDelayMs + index * staggerMs;

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
        transitionDuration: `${effectiveDuration}ms`,
        transitionTimingFunction: MOTION_EASINGS.standard,
        transitionDelay: `${itemDelay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
        ...style,
      };

  return (
    <Component
      className={`v8-stagger-item ${isVisible ? 'v8-stagger-item-visible' : 'v8-stagger-item-hidden'} ${className}`.trim()}
      style={animationStyles}
    >
      {children}
    </Component>
  );
};

export default StaggerItem;
