import React from 'react';

export interface AnimatedDotPatternProps {
  rows?: number;
  cols?: number;
  dotSize?: number;
  gap?: number;
  className?: string;
  variant?: 'mixed' | 'forest' | 'gold' | 'champagne' | 'sage';
  staggerMode?: 'wave' | 'pulse';
}

/**
 * AnimatedDotPattern
 * Premium decorative SVG dot pattern with staggered wave motion or gentle pulse.
 * Inspired by architectural graphics in CARVI reference.
 */
export const AnimatedDotPattern: React.FC<AnimatedDotPatternProps> = ({
  rows = 5,
  cols = 6,
  dotSize = 2,
  gap = 14,
  className = '',
  variant = 'mixed',
  staggerMode = 'wave',
}) => {
  const width = cols * gap;
  const height = rows * gap;

  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const x = c * gap + gap / 2;
      const y = r * gap + gap / 2;

      let color = '#C5A059'; // Canonical CARVI Champagne gold default
      if (variant === 'forest') {
        color = '#0F3E2E';
      } else if (variant === 'sage') {
        color = '#356B50';
      } else if (variant === 'champagne' || variant === 'gold') {
        color = '#C5A059';
      } else if (variant === 'mixed') {
        color = (r + c) % 2 === 0 ? '#0F3E2E' : '#C5A059';
      }

      let animClass = '';
      if (staggerMode === 'wave') {
        // Diagonal wave progression (0 to 3)
        const waveStage = (r + c) % 4;
        animClass = `motion-dot-wave-${waveStage + 1}`;
      } else {
        animClass =
          idx % 3 === 0
            ? 'motion-dot-pulse'
            : idx % 3 === 1
            ? 'motion-dot-pulse-delayed'
            : 'motion-dot-pulse-alt';
      }

      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={x}
          cy={y}
          r={dotSize}
          fill={color}
          className={animClass}
        />
      );
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      {dots}
    </svg>
  );
};
