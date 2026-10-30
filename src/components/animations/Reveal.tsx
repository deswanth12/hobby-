import React, { ReactNode } from 'react';

export type RevealVariant = 'up' | 'left' | 'right' | 'scale' | 'image';

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'up',
  delay,
  className = '',
  as: Component = 'div',
}) => {
  const variantClass = {
    up: 'scroll-reveal',
    left: 'scroll-reveal-left',
    right: 'scroll-reveal-right',
    scale: 'scroll-reveal-scale',
    image: 'scroll-reveal-image',
  }[variant];

  const style = delay !== undefined ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Component
      className={`${variantClass} ${className}`.trim()}
      style={style}
      data-reveal={variant}
    >
      {children}
    </Component>
  );
};
