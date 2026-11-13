import React from 'react';

export interface DecorativeLayerProps {
  children: React.ReactNode;
  className?: string;
  fadeTop?: boolean;
  fadeBottom?: boolean;
}

export const DecorativeLayer: React.FC<DecorativeLayerProps> = ({
  children,
  className = '',
  fadeTop = false,
  fadeBottom = false,
}) => {
  return (
    <div
      className={`pointer-events-none select-none absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {fadeTop && (
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#F1EBDD] to-transparent z-10 pointer-events-none" />
      )}
      {children}
      {fadeBottom && (
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#F1EBDD] to-transparent z-10 pointer-events-none" />
      )}
    </div>
  );
};

export default DecorativeLayer;
