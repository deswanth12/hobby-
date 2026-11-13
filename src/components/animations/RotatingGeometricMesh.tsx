import React from 'react';

export interface RotatingGeometricMeshProps {
  size?: number;
  className?: string;
  organic?: boolean;
}

/**
 * RotatingGeometricMesh
 * Multi-ring circular dotted mesh and orbital geometry with gentle scale breathing.
 * Inspired by CARVI's architectural circular dotted motifs.
 * Features ultra-smooth 36s-44s linear dual rotation.
 */
export const RotatingGeometricMesh: React.FC<RotatingGeometricMeshProps> = ({
  size = 280,
  className = '',
  organic = true,
}) => {
  const center = size / 2;
  const outerR = size * 0.44;
  const midR = size * 0.32;
  const innerR = size * 0.20;

  // Generate outer ring dots (24 dots)
  const outerDots = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 360) / 24;
    const rad = (angle * Math.PI) / 180;
    const cx = center + outerR * Math.cos(rad);
    const cy = center + outerR * Math.sin(rad);
    const fill = i % 2 === 0 ? '#153F32' : '#D4AF37';
    return <circle key={`out-${i}`} cx={cx} cy={cy} r={i % 4 === 0 ? 3 : 2} fill={fill} opacity={0.75} />;
  });

  // Generate middle ring dots (16 dots)
  const midDots = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i * 360) / 16;
    const rad = (angle * Math.PI) / 180;
    const cx = center + midR * Math.cos(rad);
    const cy = center + midR * Math.sin(rad);
    const fill = i % 2 === 0 ? '#D4AF37' : '#1B4D3E';
    return <circle key={`mid-${i}`} cx={cx} cy={cy} r={2} fill={fill} opacity={0.7} />;
  });

  // Generate inner ring dots (8 dots)
  const innerDots = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * 360) / 8;
    const rad = (angle * Math.PI) / 180;
    const cx = center + innerR * Math.cos(rad);
    const cy = center + innerR * Math.sin(rad);
    return <circle key={`in-${i}`} cx={cx} cy={cy} r={2.5} fill="#D4AF37" opacity={0.85} />;
  });

  const spinClass = organic ? 'motion-spin-mesh-organic' : 'motion-spin-mesh';

  return (
    <div
      className={`relative pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Clockwise Outer & Middle Orbital Ring */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        className={`absolute inset-0 ${spinClass}`}
      >
        {/* Outer dashed guide circle */}
        <circle
          cx={center}
          cy={center}
          r={outerR}
          stroke="#C3A66B"
          strokeWidth="1"
          strokeDasharray="4 8"
          opacity="0.3"
        />

        {/* Middle dashed guide circle */}
        <circle
          cx={center}
          cy={center}
          r={midR}
          stroke="#153F32"
          strokeWidth="1"
          strokeDasharray="6 6"
          opacity="0.25"
        />

        {outerDots}
        {midDots}
      </svg>

      {/* Counter-Clockwise Inner Orbital Ring & Radiant Cross */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        className="absolute inset-0 motion-spin-mesh-reverse"
      >
        {/* Inner solid guide circle */}
        <circle
          cx={center}
          cy={center}
          r={innerR}
          stroke="#C3A66B"
          strokeWidth="1"
          strokeDasharray="3 5"
          opacity="0.35"
        />

        {innerDots}

        {/* Delicate Center Diamond Monogram Accent */}
        <rect
          x={center - 4}
          y={center - 4}
          width="8"
          height="8"
          transform={`rotate(45 ${center} ${center})`}
          fill="#153F32"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};
