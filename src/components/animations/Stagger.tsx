import React, { ReactNode } from 'react';

interface StaggerProps {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component className={`scroll-stagger ${className}`.trim()}>
      {children}
    </Component>
  );
};
