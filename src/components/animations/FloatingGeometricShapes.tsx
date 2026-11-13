import React from 'react';

export interface FloatingShapeProps {
  type?: 'arch' | 'leaf' | 'ring' | 'cluster';
  size?: number;
  className?: string;
  reverse?: boolean;
}

/**
 * FloatingGeometricShapes
 * Delicate floating architectural SVGs (curved arches, thin outlined rings with pulsing, organic leaf shapes).
 * GPU-accelerated subtle floating translation and micro-rotation.
 */
export const FloatingGeometricShapes: React.FC<FloatingShapeProps> = ({
  type = 'arch',
  size = 80,
  className = '',
  reverse = false,
}) => {
  const animClass = reverse ? 'motion-float-subtle-reverse' : 'motion-float-subtle';

  if (type === 'ring') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none motion-pulse-ring ${className}`}
      >
        <circle cx="50" cy="50" r="46" stroke="#C3A66B" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
        <circle cx="50" cy="50" r="32" stroke="#153F32" strokeWidth="1" opacity="0.3" />
        <circle cx="50" cy="4" r="3" fill="#C3A66B" opacity="0.75" />
        <circle cx="96" cy="50" r="2" fill="#153F32" opacity="0.65" />
      </svg>
    );
  }

  if (type === 'leaf') {
    return (
      <svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 60 80"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${animClass} ${className}`}
      >
        {/* Organic curved petal shape */}
        <path
          d="M30 5 C50 25, 55 55, 30 75 C5 55, 10 25, 30 5 Z"
          fill="#EDF7EE"
          stroke="#C3A66B"
          strokeWidth="1.2"
          opacity="0.5"
        />
        {/* Central delicate spine */}
        <path d="M30 15 Q30 45 30 65" stroke="#153F32" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      </svg>
    );
  }

  if (type === 'cluster') {
    return (
      <svg
        width={size * 1.4}
        height={size}
        viewBox="0 0 140 100"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${animClass} ${className}`}
      >
        {/* Interlocking geometric rings & diamond */}
        <circle cx="45" cy="50" r="35" stroke="#C3A66B" strokeWidth="1.5" opacity="0.3" />
        <circle cx="85" cy="50" r="35" stroke="#153F32" strokeWidth="1.5" opacity="0.25" />
        <rect
          x="61"
          y="46"
          width="8"
          height="8"
          transform="rotate(45 65 50)"
          fill="#C3A66B"
          opacity="0.7"
        />
      </svg>
    );
  }

  // Default: 'arch'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${animClass} ${className}`}
    >
      <path
        d="M10 90 A 40 40 0 0 1 90 90"
        stroke="#C3A66B"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M25 90 A 25 25 0 0 1 75 90"
        stroke="#153F32"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="4 4"
        opacity="0.3"
      />
      <circle cx="50" cy="50" r="3" fill="#C3A66B" opacity="0.8" />
    </svg>
  );
};
