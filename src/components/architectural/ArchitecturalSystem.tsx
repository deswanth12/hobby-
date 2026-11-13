import React from 'react';

/**
 * V6.3 MINIMALIST LUXURY ARCHITECTURAL SYSTEM
 * A unified suite of reusable, restrained architectural details matching the
 * Warm Cream (#FFF9EF), Forest Green (#153F32), and Champagne Gold (#C9A66B) aesthetic.
 */

// A. Precision Dot Matrix
export interface PrecisionDotMatrixProps {
  rows?: number;
  cols?: number;
  variant?: 'gold' | 'sage' | 'forest';
  className?: string;
  spacing?: number;
  dotSize?: number;
  pulse?: boolean;
}

export const PrecisionDotMatrix: React.FC<PrecisionDotMatrixProps> = ({
  rows = 4,
  cols = 6,
  variant = 'gold',
  className = '',
  spacing = 16,
  dotSize = 2.5,
  pulse = true
}) => {
  const colorMap = {
    gold: '#C5A059',
    sage: '#356B50',
    forest: '#0F3E2E'
  };
  const fill = colorMap[variant] || '#C5A059';

  const width = cols * spacing;
  const height = rows * spacing;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`.trim()}
      aria-hidden="true"
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const waveStage = (r + c) % 4;
          return (
            <circle
              key={`${r}-${c}`}
              cx={c * spacing + spacing / 2}
              cy={r * spacing + spacing / 2}
              r={dotSize / 2}
              fill={fill}
              opacity={0.4}
              className={pulse ? `motion-dot-wave-${waveStage + 1}` : undefined}
            />
          );
        })
      )}
    </svg>
  );
};

// B. Architectural Vertical Rule
export interface VerticalRuleProps {
  height?: string | number;
  className?: string;
  gold?: boolean;
  animate?: boolean;
}

export const VerticalRule: React.FC<VerticalRuleProps> = ({
  height = 'h-full',
  className = '',
  gold = true,
  animate = false
}) => {
  const colorClass = gold 
    ? 'bg-gradient-to-b from-transparent via-[#C5A059]/40 to-transparent' 
    : 'bg-gradient-to-b from-transparent via-[#0F3E2E]/25 to-transparent';
  const animClass = animate ? 'motion-line-draw-vertical' : '';

  return (
    <div
      className={`w-[1px] ${typeof height === 'number' ? `h-[${height}px]` : height} ${colorClass} ${animClass} pointer-events-none select-none ${className}`.trim()}
      aria-hidden="true"
    />
  );
};

// C. Subtle L-Shaped Corner Brackets
export interface CornerBracketsProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  inset?: string;
  variant?: 'gold' | 'forest';
  animated?: boolean;
}

export const CornerBrackets: React.FC<CornerBracketsProps> = ({
  size = 14,
  strokeWidth = 1.5,
  className = '',
  inset = 'p-2',
  variant = 'gold',
  animated = false
}) => {
  const borderColor = variant === 'gold' ? 'border-[#C5A059]/60' : 'border-[#0F3E2E]/40';
  const transitionClass = animated ? 'transition-all duration-300 group-hover:scale-110 group-hover:border-[#C5A059]' : '';

  return (
    <div className={`absolute inset-0 pointer-events-none select-none ${inset} ${className}`.trim()} aria-hidden="true">
      <div
        className={`absolute top-2 left-2 border-t border-l ${borderColor} rounded-tl-[2px] ${transitionClass}`}
        style={{ width: size, height: size, borderWidth: strokeWidth }}
      />
      <div
        className={`absolute bottom-2 right-2 border-b border-r ${borderColor} rounded-br-[2px] ${transitionClass}`}
        style={{ width: size, height: size, borderWidth: strokeWidth }}
      />
    </div>
  );
};

// D. Delicate Orbital & Contour Ring
export interface OrbitalRingProps {
  size?: number;
  className?: string;
  dashed?: boolean;
}

export const OrbitalRing: React.FC<OrbitalRingProps> = ({
  size = 180,
  className = '',
  dashed = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`.trim()}
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={(size - 4) / 2}
        stroke="#C9A66B"
        strokeWidth="1"
        strokeOpacity="0.25"
        strokeDasharray={dashed ? '4 6' : undefined}
      />
      <circle
        cx={size / 2 + (size / 2 - 2) * 0.7071}
        cy={size / 2 - (size / 2 - 2) * 0.7071}
        r="2"
        fill="#C9A66B"
        opacity="0.6"
      />
    </svg>
  );
};

// E. Numbered Editorial Marker
export interface EditorialMarkerProps {
  number: string;
  label: string;
  className?: string;
  variant?: 'light' | 'dark';
}

export const EditorialMarker: React.FC<EditorialMarkerProps> = ({
  number,
  label,
  className = '',
  variant = 'light'
}) => {
  const isDark = variant === 'dark';
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-editorial-meta uppercase tracking-widest ${
        isDark
          ? 'bg-[#153F32]/85 text-[#EAF3E9] border border-[#C9A66B]/30'
          : 'bg-[#FFF9EF] text-[#153F32] border border-[#E8D5B5] shadow-xs'
      } ${className}`.trim()}
    >
      <span className="font-mono font-bold text-[#C9A66B]">{number}</span>
      <span className="text-[#C9A66B]/50 font-light">/</span>
      <span className="font-semibold tracking-wider">{label}</span>
    </div>
  );
};

// F. Geometric Symbol Accent
export interface GeometricSymbolProps {
  type?: 'diamond' | 'cross' | 'bullet' | 'rule';
  className?: string;
}

export const GeometricSymbol: React.FC<GeometricSymbolProps> = ({
  type = 'diamond',
  className = ''
}) => {
  if (type === 'diamond') {
    return (
      <span className={`inline-block text-[#C9A66B] text-[8px] transform rotate-45 select-none ${className}`.trim()} aria-hidden="true">
        ◆
      </span>
    );
  }
  if (type === 'cross') {
    return (
      <span className={`inline-block font-mono text-[#C9A66B] text-[10px] select-none ${className}`.trim()} aria-hidden="true">
        +
      </span>
    );
  }
  if (type === 'rule') {
    return (
      <span className={`inline-block w-6 h-[1px] bg-[#C9A66B]/40 align-middle select-none ${className}`.trim()} aria-hidden="true" />
    );
  }
  return (
    <span className={`inline-block w-1.5 h-1.5 rounded-full bg-[#C9A66B] select-none ${className}`.trim()} aria-hidden="true" />
  );
};

// G. Corner Dot Matrix (L-bracket aligned cluster in champagne-gold and sage)
export interface CornerDotMatrixProps {
  rows?: number;
  cols?: number;
  variant?: 'gold' | 'sage' | 'forest' | 'mixed';
  className?: string;
  spacing?: number;
  dotSize?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  animate?: boolean;
}

export const CornerDotMatrix: React.FC<CornerDotMatrixProps> = ({
  rows = 3,
  cols = 3,
  variant = 'gold',
  className = '',
  spacing = 10,
  dotSize = 2,
  position = 'top-left',
  animate = true
}) => {
  const colorMap = {
    gold: '#C5A059',
    sage: '#356B50',
    forest: '#0F3E2E',
    mixed: '#C5A059'
  };

  const width = cols * spacing;
  const height = rows * spacing;

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2'
  };

  return (
    <div className={`absolute ${positionClasses[position]} pointer-events-none select-none z-10 ${className}`.trim()} aria-hidden="true">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((__, c) => {
            const fill = variant === 'mixed'
              ? ((r + c) % 2 === 0 ? '#C5A059' : '#356B50')
              : colorMap[variant];
            const waveStage = (r + c) % 4;
            const animClass = animate ? `motion-dot-wave-${waveStage + 1}` : '';
            return (
              <circle
                key={`${r}-${c}`}
                cx={c * spacing + spacing / 2}
                cy={r * spacing + spacing / 2}
                r={dotSize / 2}
                fill={fill}
                opacity={0.5}
                className={animClass}
              />
            );
          })
        )}
      </svg>
    </div>
  );
};

// H. Section Boundary Dots (Architectural divider with centered precision dot markers)
export interface SectionBoundaryDotsProps {
  variant?: 'gold' | 'forest' | 'sage';
  className?: string;
  dotCount?: number;
  spacing?: number;
  dotSize?: number;
  withLine?: boolean;
}

export const SectionBoundaryDots: React.FC<SectionBoundaryDotsProps> = ({
  variant = 'gold',
  className = '',
  dotCount = 5,
  spacing = 12,
  dotSize = 2.5,
  withLine = true
}) => {
  const colorMap = {
    gold: '#C5A059',
    forest: '#0F3E2E',
    sage: '#356B50'
  };
  const fill = colorMap[variant] || '#C5A059';
  const width = dotCount * spacing;
  const height = 16;

  return (
    <div className={`w-full flex items-center justify-center relative pointer-events-none select-none py-2 ${className}`.trim()} aria-hidden="true">
      {withLine && (
        <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/35 to-transparent motion-line-draw-horizontal" />
      )}
      <div className="relative z-10 px-3 bg-[#F8EFDF]/90 dark:bg-[#102D25]/90 rounded-full flex items-center justify-center">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: dotCount }).map((_, idx) => (
            <circle
              key={idx}
              cx={idx * spacing + spacing / 2}
              cy={height / 2}
              r={dotSize / 2}
              fill={fill}
              opacity={0.65}
              className={`motion-dot-wave-${(idx % 4) + 1}`}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
