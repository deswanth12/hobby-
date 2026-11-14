import React, { useState, useEffect } from 'react';
import { getChambersStatus, type ChambersStatus } from '../../adapters/chambersStatus';

export interface ChambersStatusIndicatorProps {
  variant?: 'compact' | 'pill' | 'badge';
  theme?: 'dark' | 'light' | 'auto';
  showDetail?: boolean;
  className?: string;
  testDate?: Date;
  id?: string;
}

/**
 * ChambersStatusIndicator
 *
 * Real-time operational indicator reflecting Indian Standard Time (IST, UTC+5:30) operating hours:
 * - Monday to Friday: 09:30 to 18:30 IST
 * - Saturday: 10:00 to 14:00 IST
 * - Sunday: Closed
 *
 * Visual specification:
 * - Dual-layer animated pulsing emerald dot when Open
 * - Restful stone/amber dot when Closed
 * - Botanical Ledger luxury styling in dark and light themes
 * - Live 30s auto-refresh interval with unmount cleanup
 */
export const ChambersStatusIndicator: React.FC<ChambersStatusIndicatorProps> = ({
  variant = 'pill',
  theme = 'dark',
  showDetail = false,
  className = '',
  testDate,
  id,
}) => {
  const [status, setStatus] = useState<ChambersStatus>(() => getChambersStatus(testDate));

  useEffect(() => {
    if (testDate) {
      setStatus(getChambersStatus(testDate));
      return;
    }

    setStatus(getChambersStatus());
    const intervalId = setInterval(() => {
      setStatus(getChambersStatus());
    }, 30000);

    return () => clearInterval(intervalId);
  }, [testDate]);

  const isLight = theme === 'light';

  // Surface and border token styling
  const themeClasses = isLight
    ? 'bg-[#FAF7F0] border border-[#D8D0BE] text-[#071B14]'
    : 'bg-[#0B241C] border border-[#B49A64]/30 text-[#F1EBDD]';

  // Variant token styling
  const variantClasses = {
    compact: 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium leading-none tracking-normal',
    pill: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium leading-none tracking-normal shadow-xs',
    badge: 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase tracking-wider',
  }[variant];

  const detailColor = isLight ? 'text-[#7E5E1E]' : 'text-[#B49A64]';

  return (
    <div
      id={id}
      role="status"
      aria-live="polite"
      title={`${status.statusLabel} (${status.istTimeFormatted})`}
      className={`${variantClasses} ${themeClasses} ${className}`}
      suppressHydrationWarning
    >
      {/* Indicator Dot */}
      {status.isOpen ? (
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      ) : (
        <span
          className={`inline-flex rounded-full h-2 w-2 shrink-0 ${isLight ? 'bg-[#9E7B35]/70' : 'bg-[#D8D0BE]/80'}`}
          aria-hidden="true"
        />
      )}

      {/* Status Label */}
      <span className="font-semibold whitespace-nowrap">
        {status.statusLabel}
      </span>

      {/* Secondary Hours Detail */}
      {showDetail && status.isOpen && (
        <span className={`${detailColor} font-mono text-[11px] opacity-90 whitespace-nowrap`}>
          • {status.detailLabel}
        </span>
      )}
    </div>
  );
};
