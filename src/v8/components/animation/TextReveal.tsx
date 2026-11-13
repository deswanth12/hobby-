import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { MOTION_EASINGS } from './motionTokens';

export type TextRevealMode = 'word' | 'character' | 'line';

export interface TextRevealProps {
  text: string;
  mode?: TextRevealMode; // default 'word'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  staggerMs?: number; // default: 60ms (words), 25ms (chars), 120ms (lines)
  durationMs?: number; // default 600ms (within 450–750ms range)
  duration?: number;
  delayMs?: number; // default 0
  delay?: number;
  triggerOnScroll?: boolean; // default true (set false for Hero LCP)
  threshold?: number;
  once?: boolean;
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
  highlightWords?: string[];
  highlightClassName?: string; // default Antique Bronze
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  mode = 'word',
  as: Component = 'div',
  staggerMs,
  durationMs = 600,
  duration,
  delayMs = 0,
  delay,
  triggerOnScroll = true,
  threshold = 0.1,
  once = true,
  triggerOnce,
  className = '',
  style = {},
  highlightWords = [],
  highlightClassName = 'text-[#B49A64]',
}) => {
  const isReduced = useReducedMotion();
  const elementRef = useRef<HTMLElement | null>(null);

  // If triggerOnScroll is false or reduced motion is active, start visible immediately
  const [isVisible, setIsVisible] = useState<boolean>(() => !triggerOnScroll || isReduced);

  const effectiveDuration = duration !== undefined ? duration : durationMs;
  const effectiveDelay = delay !== undefined ? delay : delayMs;
  const shouldTriggerOnce = triggerOnce !== undefined ? triggerOnce : once;

  const defaultStagger = mode === 'character' ? 25 : mode === 'line' ? 120 : 60;
  const effectiveStagger = staggerMs !== undefined ? staggerMs : defaultStagger;

  useEffect(() => {
    if (isReduced || !triggerOnScroll) {
      setIsVisible(true);
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          if (shouldTriggerOnce) {
            observer.unobserve(node);
          }
        } else if (!shouldTriggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, shouldTriggerOnce, isReduced, triggerOnScroll]);

  // Clean normalized highlight lookup
  const cleanHighlightSet = useMemo(() => {
    return new Set(highlightWords.map((w) => w.trim().toLowerCase()));
  }, [highlightWords]);

  // Split text into tokens based on mode
  const tokens = useMemo(() => {
    if (mode === 'character') {
      return text.split('');
    } else if (mode === 'line') {
      return text.split('\n');
    }
    // Default 'word' mode
    return text.split(' ');
  }, [text, mode]);

  // Under reduced motion, return plain accessible markup without tokenized spans
  if (isReduced) {
    return (
      <Component ref={elementRef as any} className={`v8-text-reveal ${className}`.trim()} style={style}>
        {tokens.map((token, idx) => {
          const isHighlighted = cleanHighlightSet.has(token.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
          return (
            <React.Fragment key={idx}>
              <span className={isHighlighted ? highlightClassName : undefined}>{token}</span>
              {mode === 'word' && idx < tokens.length - 1 ? ' ' : null}
            </React.Fragment>
          );
        })}
      </Component>
    );
  }

  return (
    <Component
      ref={elementRef as any}
      className={`v8-text-reveal ${className}`.trim()}
      style={style}
    >
      {/* Screen-reader accessible single uninterrupted string */}
      <span className="sr-only">{text}</span>

      {/* Visual staggered masked tokens */}
      <span aria-hidden="true" className="inline-block">
        {tokens.map((token, idx) => {
          const isHighlighted = cleanHighlightSet.has(token.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
          const tokenDelay = effectiveDelay + idx * effectiveStagger;

          const innerStyle: React.CSSProperties = {
            display: 'inline-block',
            transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 105%, 0)',
            opacity: isVisible ? 1 : 0,
            transitionProperty: 'transform, opacity',
            transitionDuration: `${effectiveDuration}ms`,
            transitionTimingFunction: MOTION_EASINGS.standard,
            transitionDelay: `${tokenDelay}ms`,
            willChange: isVisible ? 'auto' : 'transform, opacity',
          };

          return (
            <span
              key={idx}
              className="inline-block overflow-hidden align-top"
              style={{ verticalAlign: 'top' }}
            >
              <span
                style={innerStyle}
                className={isHighlighted ? highlightClassName : undefined}
              >
                {token === ' ' ? '\u00A0' : token}
              </span>
              {mode === 'word' && idx < tokens.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          );
        })}
      </span>
    </Component>
  );
};

export default TextReveal;
