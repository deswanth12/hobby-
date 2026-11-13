import React from 'react';

export interface SectionAccentProps {
  variant?: 'bronze' | 'sage' | 'forest';
  alignment?: 'left' | 'center' | 'right';
  className?: string;
  hasKickerLine?: boolean;
}

export const SectionAccent: React.FC<SectionAccentProps> = ({
  variant = 'bronze',
  alignment = 'left',
  className = '',
  hasKickerLine = true,
}) => {
  const accentColor =
    variant === 'bronze'
      ? '#B49A64'
      : variant === 'sage'
      ? '#AAB4A0'
      : '#183529';

  const alignClasses =
    alignment === 'center'
      ? 'justify-center'
      : alignment === 'right'
      ? 'justify-end'
      : 'justify-start';

  return (
    <div
      className={`flex items-center gap-2 pointer-events-none select-none ${alignClasses} ${className}`}
      aria-hidden="true"
    >
      {/* Delicate Architectural Diamond Accent */}
      <span
        className="w-2 h-2 rotate-45 border border-[#B49A64]/60 bg-[#FAF7F0] shadow-2xs shrink-0"
        style={{ borderColor: accentColor }}
      />

      {hasKickerLine && (
        <span
          className="h-[1px] w-12 bg-gradient-to-r from-[#B49A64]/50 to-transparent"
          style={{
            backgroundImage: `linear-gradient(to right, ${accentColor}80, transparent)`,
          }}
        />
      )}
    </div>
  );
};

export default SectionAccent;
