import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export type ButtonVariant =
  | 'primary-bronze'
  | 'secondary-outline'
  | 'subtle-ghost'
  | 'icon-circle'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'dark';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showArrow?: boolean;
  dualArrow?: boolean;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary-bronze',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  showArrow = false,
  dualArrow = false,
  to,
  href,
  target,
  rel,
  className = '',
  children,
  disabled,
  ...rest
}) => {
  // Base classes with tactile physics and WCAG minimum 44px hit area
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-full btn-tactile transition-all duration-200 select-none group min-h-[44px]';

  // Size specifications
  const sizeClasses = {
    sm: 'text-xs px-4 py-2 gap-1.5 min-h-[44px]',
    md: 'text-xs sm:text-sm px-6 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-sm sm:text-base px-8 py-3.5 gap-2.5 min-h-[50px]',
  }[size];

  // Variant specifications
  const variantClasses: Record<ButtonVariant, string> = {
    'primary-bronze':
      'bg-[#B49A64] hover:bg-[#9E844E] active:bg-[#8D733F] text-[#071B14] font-semibold shadow-md hover:shadow-lg border border-[#B49A64]',
    primary:
      'bg-[#B49A64] hover:bg-[#9E844E] active:bg-[#8D733F] text-[#071B14] font-semibold shadow-md hover:shadow-lg border border-[#B49A64]',
    'secondary-outline':
      'bg-transparent hover:bg-[#183529]/40 active:bg-[#183529]/70 text-[#F1EBDD] border border-[#B49A64]/40 hover:border-[#B49A64]',
    secondary:
      'bg-[#183529] hover:bg-[#294B39] text-[#F1EBDD] border border-[#B49A64]/30 shadow-sm',
    outline:
      'bg-transparent hover:bg-[#B49A64]/10 active:bg-[#B49A64]/20 text-[#7E5E1E] border border-[#B49A64]',
    'subtle-ghost':
      'bg-transparent hover:bg-[#183529]/15 text-[#35271F] hover:text-[#071B14]',
    ghost:
      'bg-transparent hover:bg-[#183529]/15 text-[#35271F] hover:text-[#071B14]',
    dark:
      'bg-[#071B14] hover:bg-[#183529] text-[#F1EBDD] border border-[#B49A64]/40 shadow-sm',
    'icon-circle':
      'w-11 h-11 p-0 rounded-full bg-[#183529] hover:bg-[#294B39] text-[#B49A64] border border-[#B49A64]/40 shrink-0',
  };

  const disabledClasses = disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`.trim();

  const content = (
    <>
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      {!isLoading && (dualArrow || showArrow) && (
        <span className="dual-arrow-badge ml-1" aria-hidden="true">
          <ArrowUpRight className="w-3.5 h-3.5 arrow-primary" />
          <ArrowUpRight className="w-3.5 h-3.5 arrow-secondary" />
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} aria-busy={isLoading}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={combinedClasses} aria-busy={isLoading}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={rest.type || 'button'}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={combinedClasses}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;
