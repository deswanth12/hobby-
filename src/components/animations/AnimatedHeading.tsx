import React, { ReactNode } from 'react';

interface AnimatedHeadingProps {
  eyebrow?: ReactNode;
  heading: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headingLevel?: 'h1' | 'h2' | 'h3';
  headingClassName?: string;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  eyebrow,
  heading,
  description,
  align = 'left',
  className = '',
  headingLevel: Tag = 'h2',
  headingClassName = 'font-editorial-h2 text-brand-forest',
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center mx-auto max-w-3xl',
    right: 'text-right ml-auto',
  }[align];

  return (
    <div className={`space-y-3 ${alignClass} ${className}`.trim()}>
      {eyebrow && (
        <div className="scroll-reveal" style={{ transitionDelay: '0ms' }}>
          {typeof eyebrow === 'string' ? (
            <span className="badge-gold-pill">{eyebrow}</span>
          ) : (
            eyebrow
          )}
        </div>
      )}
      <Tag className={`scroll-reveal ${headingClassName}`} style={{ transitionDelay: '100ms' }}>
        {heading}
      </Tag>
      {description && (
        <div className="scroll-reveal font-editorial-body text-brand-muted leading-relaxed" style={{ transitionDelay: '200ms' }}>
          {description}
        </div>
      )}
    </div>
  );
};
