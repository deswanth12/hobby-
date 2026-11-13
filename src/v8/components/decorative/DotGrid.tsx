import React from 'react';

export interface DotGridProps {
  variant?: 'bronze' | 'sage' | 'forest';
  width?: number | string;
  height?: number | string;
  className?: string;
  spacing?: number;
  dotRadius?: number;
  fade?: boolean;
}

export const DotGrid: React.FC<DotGridProps> = ({
  variant = 'bronze',
  width = 240,
  height = 240,
  className = '',
  spacing = 20,
  dotRadius = 1.25,
  fade = true,
}) => {
  const dotColor =
    variant === 'bronze'
      ? '#B49A64'
      : variant === 'sage'
      ? '#AAB4A0'
      : '#183529';

  const patternId = `dot-grid-${variant}-${spacing}-${dotRadius}`;

  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      style={{
        width,
        height,
        ...(fade
          ? {
              WebkitMaskImage:
                'radial-gradient(circle at center, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 75%)',
              maskImage:
                'radial-gradient(circle at center, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 75%)',
            }
          : {}),
      }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-20 transition-opacity duration-500"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={spacing / 2} cy={spacing / 2} r={dotRadius} fill={dotColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};

export default DotGrid;
