import React from 'react';

export interface ArchitecturalFrameProps {
  children: React.ReactNode;
  variant?: 'evergreen' | 'ivory';
  showBrackets?: boolean;
  className?: string;
  innerClassName?: string;
  role?: string;
  'aria-label'?: string;
}

export const ArchitecturalFrame: React.FC<ArchitecturalFrameProps> = ({
  children,
  variant = 'evergreen',
  showBrackets = true,
  className = '',
  innerClassName = '',
  role,
  'aria-label': ariaLabel,
}) => {
  const outerClass =
    variant === 'evergreen'
      ? 'double-bezel-evergreen bg-[#071B14] border border-[#B49A64]/35'
      : 'double-bezel-ivory bg-[#FAF7F0] border border-[#D8D0BE]';

  const innerClass =
    variant === 'evergreen'
      ? 'double-bezel-evergreen-inner bg-[#071B14] border border-[#B49A64]/20'
      : 'double-bezel-ivory-inner bg-[#FAF7F0] border border-[#B49A64]/18';

  return (
    <div
      className={`relative select-none ${outerClass} ${className}`.trim()}
      role={role}
      aria-label={ariaLabel}
    >
      {showBrackets && (
        <>
          <div className="corner-bracket corner-bracket-tl" aria-hidden="true" />
          <div className="corner-bracket corner-bracket-tr" aria-hidden="true" />
          <div className="corner-bracket corner-bracket-bl" aria-hidden="true" />
          <div className="corner-bracket corner-bracket-br" aria-hidden="true" />
        </>
      )}
      <div className={`relative overflow-hidden w-full h-full p-6 sm:p-8 lg:p-9 ${innerClass} ${innerClassName}`.trim()}>
        {children}
      </div>
    </div>
  );
};

export default ArchitecturalFrame;
