import React from 'react';

export type BadgeVariant = 'kicker' | 'statutory' | 'gold' | 'forest' | 'sage' | 'neutral';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'kicker',
  children,
  icon,
  pulse = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    kicker:
      'bg-[#071B14] text-[#B49A64] border border-[#B49A64]/40 font-serif uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold px-3 py-1',
    statutory:
      'bg-[#183529] text-[#F1EBDD] border border-[#B49A64]/30 font-mono text-[11px] font-semibold px-2.5 py-0.5',
    gold:
      'bg-[#B49A64]/15 text-[#7E5E1E] border border-[#B49A64]/40 font-sans text-xs font-semibold px-2.5 py-0.5',
    forest:
      'bg-[#183529]/15 text-[#183529] border border-[#183529]/25 font-sans text-xs font-semibold px-2.5 py-0.5',
    sage:
      'bg-[#AAB4A0]/20 text-[#35271F] border border-[#AAB4A0]/40 font-sans text-xs font-semibold px-2.5 py-0.5',
    neutral:
      'bg-[#FAF7F0] text-[#35271F] border border-[#D8D0BE] font-sans text-xs font-medium px-2.5 py-0.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full select-none ${variantStyles[variant]} ${className}`.trim()}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
