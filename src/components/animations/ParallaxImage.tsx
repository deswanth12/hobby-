import React, { useState } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  caption?: string;
  subtitle?: string;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/3]',
  caption,
  subtitle,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`space-y-2.5 ${className}`.trim()}>
      <div className={`image-frame-editorial overflow-hidden relative ${aspectRatio} scroll-reveal-image`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-90'
          }`}
        />
      </div>
      {(caption || subtitle) && (
        <div className="scroll-reveal" style={{ transitionDelay: '150ms' }}>
          {caption && (
            <h4 className="font-editorial-h3 text-base text-brand-forest font-semibold">
              {caption}
            </h4>
          )}
          {subtitle && (
            <p className="font-editorial-body text-xs text-brand-muted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
