import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface DualArrowButtonProps {
  children: ReactNode;
  href?: string;
  to?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'outline';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  title?: string;
  external?: boolean;
}

export const DualArrowButton: React.FC<DualArrowButtonProps> = ({
  children,
  href,
  to,
  onClick,
  className = '',
  variant = 'primary',
  type = 'button',
  disabled,
  title,
  external,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'btn-pill-secondary text-brand-forest hover:bg-brand-surface border-brand-border';
      case 'dark':
        return 'btn-pill-primary bg-brand-deep text-white border-brand-gold/60 hover:bg-brand-forest';
      case 'outline':
        return 'inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full border border-brand-gold/60 text-brand-forest hover:bg-brand-gold/10 font-semibold text-xs tracking-wider uppercase transition-all duration-300';
      case 'primary':
      default:
        return 'btn-pill-primary bg-brand-forest text-white border-brand-gold/40 hover:bg-brand-deep shadow-card hover:shadow-card-hover';
    }
  };

  const badgeContent = (
    <span className="dual-arrow-badge" aria-hidden="true">
      <ArrowRight className="arrow-primary w-3.5 h-3.5" />
      <ArrowRight className="arrow-secondary w-3.5 h-3.5" />
    </span>
  );

  const combinedClass = `group inline-flex items-center justify-between sm:justify-center gap-3 min-h-[44px] cursor-pointer ${getVariantStyles()} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={combinedClass} title={title}>
        <span>{children}</span>
        {badgeContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={combinedClass}
        title={title}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        <span>{children}</span>
        {badgeContent}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClass}
      title={title}
    >
      <span>{children}</span>
      {badgeContent}
    </button>
  );
};
