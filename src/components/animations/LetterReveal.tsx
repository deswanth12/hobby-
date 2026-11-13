import React, { useMemo, useState, useEffect } from 'react';
import { useInView } from '../../hooks/useInView';

export interface LetterRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  staggerMs?: number;
  durationMs?: number;
  blur?: boolean;
  delayMs?: number;
  triggerOnScroll?: boolean;
}

/**
 * LetterReveal Component
 * Sequential character entrance with slight upward translation and blur-to-focus.
 * - WCAG Accessible: Screen readers read the full static text string via .sr-only
 * - Visual characters are marked aria-hidden="true"
 * - Word boundary preservation: Characters are grouped by words with whitespace-nowrap to avoid mid-word wrapping
 * - Standard space delimiters between words allow natural typographic line wraps without trailing non-breaking spaces
 * - Mobile responsive: Dynamically scales down character stagger on viewports < 768px per Requirement 10
 * - Hardware accelerated CSS transitions with cubic-bezier easing
 */
export const LetterReveal: React.FC<LetterRevealProps> = ({
  text = '',
  as: Component = 'span',
  className = '',
  staggerMs = 32,
  durationMs = 450,
  blur = true,
  delayMs = 0,
  triggerOnScroll = true
}) => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const isVisible = triggerOnScroll ? inView : true;

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile((prev) => (prev !== mobile ? mobile : prev));
    };
    checkMobile();

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const debouncedResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    window.addEventListener('resize', debouncedResize, { passive: true });
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  const effectiveStagger = isMobile ? Math.min(staggerMs, 22) : staggerMs;

  // Split text into words to preserve grammatical wrap boundaries
  const words = useMemo(() => (text ? text.trim().split(/\s+/) : []), [text]);

  // Compute character offset per word in advance without render-phase mutations
  const wordOffsets = useMemo(() => {
    let offset = 0;
    return words.map((w) => {
      const current = offset;
      offset += w.length + 1; // account for space delimiter
      return current;
    });
  }, [words]);

  return (
    <Component
      ref={ref as any}
      className={`inline-block ${className}`.trim()}
    >
      {/* Screen-reader accessible alternative */}
      <span className="sr-only">{text}</span>

      {/* Visual animated characters */}
      <span aria-hidden="true" className="inline">
        {words.map((word, wordIdx) => {
          const wordOffset = wordOffsets[wordIdx] || 0;

          return (
            <React.Fragment key={wordIdx}>
              <span className="inline-block whitespace-nowrap">
                {word.split('').map((char, charIdx) => {
                  const globalIdx = wordOffset + charIdx;
                  const charDelay = delayMs + globalIdx * effectiveStagger;

                  return (
                    <span
                      key={charIdx}
                      className="inline-block kinetic-letter"
                      style={{
                        transitionDuration: `${durationMs}ms`,
                        transitionDelay: `${charDelay}ms`,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                        filter: blur ? (isVisible ? 'blur(0px)' : 'blur(4px)') : 'none',
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
              {wordIdx < words.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </span>
    </Component>
  );
};
