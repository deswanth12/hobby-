import React from 'react';

export interface CurvedPathRevealProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: 'arc' | 'wave' | 'corner';
}

/**
 * CurvedPathReveal
 * SVG decorative curved paths animated with stroke-dasharray and stroke-dashoffset.
 * Provides a continuous, slow path-reveal breathing animation.
 */
export const CurvedPathReveal: React.FC<CurvedPathRevealProps> = ({
  className = '',
  width = '100%',
  height = '100%',
  variant = 'arc',
}) => {
  if (variant === 'corner') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        <path
          d="M 10,190 Q 20,40 190,10"
          stroke="#C5A059"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          className="motion-path-reveal-loop"
        />
        <path
          d="M 30,190 Q 40,60 190,30"
          stroke="#0F3E2E"
          strokeWidth="1"
          strokeDasharray="6 6"
          fill="none"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
    );
  }

  if (variant === 'wave') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 400 120"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        <path
          d="M 0,60 C 100,10 150,110 250,60 C 320,20 370,80 400,60"
          stroke="#C5A059"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          className="motion-path-reveal-loop"
        />
        <path
          d="M 0,75 C 90,25 160,115 260,75 C 330,35 380,85 400,75"
          stroke="#0F3E2E"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 8"
          opacity="0.25"
        />
      </svg>
    );
  }

  // Default: 'arc'
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 180"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <path
        d="M 20,160 Q 150,10 280,160"
        stroke="#C5A059"
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="round"
        className="motion-path-reveal-loop"
      />
      <path
        d="M 40,160 Q 150,35 260,160"
        stroke="#0F3E2E"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="5 5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
};
