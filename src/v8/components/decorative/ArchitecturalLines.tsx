import React from 'react';

export interface ArchitecturalLinesProps {
  type?: 'horizontal-rule' | 'vertical-axis' | 'double-rule' | 'corner-accents';
  variant?: 'bronze' | 'sage' | 'muted' | 'forest';
  length?: string | number;
  className?: string;
  hasEndpointDot?: boolean;
}

export const ArchitecturalLines: React.FC<ArchitecturalLinesProps> = ({
  type = 'horizontal-rule',
  variant = 'bronze',
  length = '100%',
  className = '',
  hasEndpointDot = true,
}) => {
  const lineColor =
    variant === 'bronze'
      ? 'bg-[#B49A64]/35'
      : variant === 'sage'
      ? 'bg-[#AAB4A0]/30'
      : variant === 'forest'
      ? 'bg-[#183529]/20'
      : 'bg-[#D8D0BE]/60';

  const dotColor =
    variant === 'bronze'
      ? 'bg-[#B49A64]'
      : variant === 'sage'
      ? 'bg-[#AAB4A0]'
      : variant === 'forest'
      ? 'bg-[#183529]'
      : 'bg-[#7E5E1E]';

  if (type === 'horizontal-rule') {
    return (
      <div
        className={`relative flex items-center pointer-events-none select-none ${className}`}
        aria-hidden="true"
        style={{ width: length }}
      >
        {hasEndpointDot && (
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} opacity-75 shrink-0 -mr-0.5`} />
        )}
        <div className={`h-[1px] flex-1 ${lineColor}`} />
        {hasEndpointDot && (
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} opacity-75 shrink-0 -ml-0.5`} />
        )}
      </div>
    );
  }

  if (type === 'double-rule') {
    return (
      <div
        className={`pointer-events-none select-none flex flex-col gap-[3px] ${className}`}
        aria-hidden="true"
        style={{ width: length }}
      >
        <div className={`h-[1px] w-full ${lineColor}`} />
        <div className={`h-[1px] w-3/4 ${lineColor} opacity-60`} />
      </div>
    );
  }

  if (type === 'vertical-axis') {
    return (
      <div
        className={`relative flex flex-col items-center pointer-events-none select-none ${className}`}
        aria-hidden="true"
        style={{ height: length }}
      >
        {hasEndpointDot && (
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} opacity-75 shrink-0 -mb-0.5`} />
        )}
        <div className={`w-[1px] flex-1 ${lineColor}`} />
        {hasEndpointDot && (
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} opacity-75 shrink-0 -mt-0.5`} />
        )}
      </div>
    );
  }

  if (type === 'corner-accents') {
    return (
      <div className={`absolute inset-0 pointer-events-none select-none ${className}`} aria-hidden="true">
        <span className="corner-bracket corner-bracket-tl" />
        <span className="corner-bracket corner-bracket-tr" />
        <span className="corner-bracket corner-bracket-bl" />
        <span className="corner-bracket corner-bracket-br" />
      </div>
    );
  }

  return null;
};

export default ArchitecturalLines;
