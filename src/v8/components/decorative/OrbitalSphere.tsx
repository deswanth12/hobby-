import React from 'react';

export interface OrbitalSphereProps {
  size?: number;
  variant?: 'bronze' | 'sage' | 'evergreen' | 'mixed';
  animate?: boolean;
  className?: string;
}

export const OrbitalSphere: React.FC<OrbitalSphereProps> = ({
  size = 320,
  variant = 'mixed',
  animate = true,
  className = '',
}) => {
  const primaryStroke =
    variant === 'bronze'
      ? 'rgba(180, 154, 100, 0.22)'
      : variant === 'sage'
      ? 'rgba(170, 180, 160, 0.20)'
      : variant === 'evergreen'
      ? 'rgba(7, 27, 20, 0.15)'
      : 'rgba(180, 154, 100, 0.20)';

  const secondaryStroke =
    variant === 'mixed'
      ? 'rgba(170, 180, 160, 0.16)'
      : variant === 'bronze'
      ? 'rgba(180, 154, 100, 0.14)'
      : 'rgba(24, 53, 41, 0.12)';

  const accentFill =
    variant === 'sage' ? '#AAB4A0' : '#B49A64';

  return (
    <div
      className={`pointer-events-none select-none relative ${className}`}
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Static Base Outer Orbit */}
        <circle
          cx="150"
          cy="150"
          r="138"
          stroke={secondaryStroke}
          strokeWidth="0.8"
          strokeDasharray="4 6"
        />

        {/* Outer Primary Rotating Ring */}
        <g className={animate ? 'animate-orbital-slow origin-center' : ''}>
          <circle
            cx="150"
            cy="150"
            r="120"
            stroke={primaryStroke}
            strokeWidth="1"
          />
          {/* Orbital Accent Dot */}
          <circle cx="270" cy="150" r="2.5" fill={accentFill} opacity="0.75" />
          <circle cx="150" cy="30" r="1.75" fill={accentFill} opacity="0.6" />
        </g>

        {/* Counter-Rotating Elliptical Orbit */}
        <g className={animate ? 'animate-orbital-reverse origin-center' : ''}>
          <ellipse
            cx="150"
            cy="150"
            rx="105"
            ry="65"
            transform="rotate(-25 150 150)"
            stroke={primaryStroke}
            strokeWidth="0.9"
            strokeDasharray="8 4"
          />
          {/* Elliptical Accent Dot */}
          <circle cx="68" cy="115" r="2.25" fill={accentFill} opacity="0.7" />
        </g>

        {/* Secondary Tilted Axis Ellipse */}
        <ellipse
          cx="150"
          cy="150"
          rx="82"
          ry="48"
          transform="rotate(35 150 150)"
          stroke={secondaryStroke}
          strokeWidth="0.85"
        />

        {/* Concentric Inner Core Rings */}
        <circle
          cx="150"
          cy="150"
          r="48"
          stroke={primaryStroke}
          strokeWidth="1"
        />
        <circle
          cx="150"
          cy="150"
          r="26"
          stroke={secondaryStroke}
          strokeWidth="0.75"
          strokeDasharray="2 3"
        />

        {/* Central Core Accent */}
        <circle cx="150" cy="150" r="2.5" fill={accentFill} opacity="0.65" />
      </svg>
    </div>
  );
};

export default OrbitalSphere;
