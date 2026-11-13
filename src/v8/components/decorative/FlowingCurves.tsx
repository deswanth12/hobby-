import React from 'react';

export interface FlowingCurvesProps {
  variant?: 'bronze' | 'sage' | 'duo';
  direction?: 'horizontal' | 'diagonal' | 'corner';
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const FlowingCurves: React.FC<FlowingCurvesProps> = ({
  variant = 'bronze',
  direction = 'horizontal',
  className = '',
  width = '100%',
  height = 140,
}) => {
  const stroke1 =
    variant === 'bronze'
      ? 'rgba(180, 154, 100, 0.18)'
      : variant === 'sage'
      ? 'rgba(170, 180, 160, 0.18)'
      : 'rgba(180, 154, 100, 0.16)';

  const stroke2 =
    variant === 'duo'
      ? 'rgba(170, 180, 160, 0.14)'
      : variant === 'sage'
      ? 'rgba(170, 180, 160, 0.10)'
      : 'rgba(180, 154, 100, 0.10)';

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ width, height }}
    >
      {direction === 'horizontal' && (
        <svg
          viewBox="0 0 1200 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Primary Sweeping S-Curve */}
          <path
            d="M-50 40 C 250 120, 500 -10, 800 70 C 1000 120, 1150 30, 1250 50"
            stroke={stroke1}
            strokeWidth="1.2"
          />
          {/* Echo Secondary Curve */}
          <path
            d="M-50 70 C 280 145, 520 20, 830 95 C 1020 140, 1170 60, 1250 80"
            stroke={stroke2}
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
        </svg>
      )}

      {direction === 'diagonal' && (
        <svg
          viewBox="0 0 600 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50 C 200 80, 350 250, 600 350"
            stroke={stroke1}
            strokeWidth="1"
          />
          <path
            d="M50 0 C 220 50, 400 220, 600 300"
            stroke={stroke2}
            strokeWidth="0.85"
            strokeDasharray="6 6"
          />
        </svg>
      )}

      {direction === 'corner' && (
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M400 0 C 250 40, 120 140, 50 250 C 15 300, 5 360, 0 400"
            stroke={stroke1}
            strokeWidth="1.1"
          />
          <path
            d="M400 50 C 280 90, 160 180, 95 280 C 65 330, 45 370, 30 400"
            stroke={stroke2}
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
        </svg>
      )}
    </div>
  );
};

export default FlowingCurves;
