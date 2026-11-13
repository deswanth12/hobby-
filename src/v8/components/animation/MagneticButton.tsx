import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { MOTION_EASINGS } from './motionTokens';

export interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number; // default 0.25 (pull factor, clamped to max ±8px)
  radius?: number; // attraction radius px, default 80px
  maxDisplacement?: number; // px, default 8px
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  onClick?: React.MouseEventHandler;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.25,
  radius = 80,
  maxDisplacement = 8,
  disabled = false,
  className = '',
  style = {},
  as: Component = 'div',
  onClick,
  ...restProps
}) => {
  const isReduced = useReducedMotion();
  const elementRef = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Check if touch device / mobile
  const isTouchDevice = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(hover: none)').matches ||
      window.innerWidth < 1024
    );
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (disabled || isReduced || isTouchDevice()) {
        return;
      }

      const node = elementRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < radius) {
        // Clamp to max displacement
        const rawX = deltaX * strength;
        const rawY = deltaY * strength;
        const clampedX = Math.max(-maxDisplacement, Math.min(maxDisplacement, rawX));
        const clampedY = Math.max(-maxDisplacement, Math.min(maxDisplacement, rawY));

        setOffset({ x: clampedX, y: clampedY });
        setIsHovered(true);
      } else {
        setOffset({ x: 0, y: 0 });
        setIsHovered(false);
      }
    },
    [disabled, isReduced, isTouchDevice, radius, strength, maxDisplacement]
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  // Cleanup on unmount or when preference/disabled changes
  useEffect(() => {
    if (disabled || isReduced) {
      setOffset({ x: 0, y: 0 });
      setIsHovered(false);
    }
  }, [disabled, isReduced]);

  const transformStyle = isReduced || disabled
    ? 'none'
    : `translate3d(${offset.x}px, ${offset.y}px, 0)`;

  const transitionStyle = isHovered
    ? `transform 180ms ${MOTION_EASINGS.standard}`
    : `transform 260ms ${MOTION_EASINGS.standard}`;

  return (
    <Component
      ref={elementRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`v8-magnetic-button inline-block ${className}`.trim()}
      style={{
        transform: transformStyle,
        transition: transitionStyle,
        willChange: isHovered ? 'transform' : 'auto',
        ...style,
      }}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export default MagneticButton;
