import React from 'react';
import { SourceCitation, CitationItem } from './SourceCitation';
import { ShieldCheck, User, MessageSquare, Phone } from 'lucide-react';

export interface AssistantHandoffInfo {
  available: boolean;
  label: string;
  whatsappUrl?: string;
  phoneUrl?: string;
  phoneDisplay?: string;
}

export interface AssistantMessageProps {
  role: 'user' | 'assistant';
  content: string;
  citations?: CitationItem[];
  timestamp?: string;
  onNavigate?: () => void;
  handoff?: AssistantHandoffInfo;
  onHandoffClick?: () => void;
  onPhoneClick?: () => void;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  role,
  content,
  citations = [],
  timestamp,
  onNavigate,
  handoff,
  onHandoffClick,
  onPhoneClick
}) => {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-2.5 my-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#071B14] border border-[#B49A64]/50 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#B49A64]" />
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
        isUser
          ? 'bg-[#183529] text-[#F1EBDD] rounded-tr-xs border border-[#B49A64]/30'
          : 'bg-white text-[#35271F] rounded-tl-xs border border-[#D8D0BE]'
      }`}>
        {/* Message Content */}
        <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed">
          {content}
        </div>

        {/* Citations (Assistant Only) */}
        {!isUser && citations.length > 0 && (
          <SourceCitation citations={citations} onNavigate={onNavigate} />
        )}

        {/* Human Handoff Consultation Desk (Assistant Only) */}
        {!isUser && handoff && handoff.available && (
          <div className="mt-3 pt-2.5 border-t border-[#D8D0BE]/60 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-semibold text-[#7E5E1E] uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B49A64]" />
                <span>Chambers Consultation:</span>
              </span>
              <span className="text-[9px] text-[#AAB4A0] font-normal lowercase tracking-normal">
                ICAI ethics compliant
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* WhatsApp Action Button / Link */}
              {handoff.whatsappUrl ? (
                <a
                  href={handoff.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onHandoffClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-[#071B14] hover:bg-[#183529] text-[#B49A64] hover:text-[#F1EBDD] text-xs font-medium border border-[#B49A64]/40 hover:border-[#B49A64] transition-all shadow-2xs active:scale-95"
                  title="Connect via Encrypted WhatsApp Consultation"
                  aria-label={handoff.label || 'WhatsApp Consultation'}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{handoff.label || 'WhatsApp Chambers'}</span>
                </a>
              ) : onHandoffClick ? (
                <button
                  type="button"
                  onClick={onHandoffClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-[#071B14] hover:bg-[#183529] text-[#B49A64] hover:text-[#F1EBDD] text-xs font-medium border border-[#B49A64]/40 hover:border-[#B49A64] transition-all shadow-2xs active:scale-95"
                  title="Connect via Encrypted WhatsApp Consultation"
                  aria-label={handoff.label || 'WhatsApp Consultation'}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{handoff.label || 'WhatsApp Chambers'}</span>
                </button>
              ) : null}

              {/* Phone Action Button / Link */}
              {handoff.phoneUrl ? (
                <a
                  href={handoff.phoneUrl}
                  onClick={onPhoneClick}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-lg bg-white hover:bg-[#FAF7F0] text-[#183529] hover:text-[#071B14] text-xs font-medium border border-[#B49A64]/40 hover:border-[#183529] transition-all shadow-2xs active:scale-95"
                  title={`Call Chambers Desk at ${handoff.phoneDisplay || '+91 96263 50900'}`}
                  aria-label={`Call Chambers Desk at ${handoff.phoneDisplay || '+91 96263 50900'}`}
                >
                  <Phone className="w-3.5 h-3.5 text-[#7E5E1E] shrink-0" />
                  <span>Call: {handoff.phoneDisplay || '+91 96263 50900'}</span>
                </a>
              ) : onPhoneClick ? (
                <button
                  type="button"
                  onClick={onPhoneClick}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-lg bg-white hover:bg-[#FAF7F0] text-[#183529] hover:text-[#071B14] text-xs font-medium border border-[#B49A64]/40 hover:border-[#183529] transition-all shadow-2xs active:scale-95"
                  title={`Call Chambers Desk at ${handoff.phoneDisplay || '+91 96263 50900'}`}
                  aria-label={`Call Chambers Desk at ${handoff.phoneDisplay || '+91 96263 50900'}`}
                >
                  <Phone className="w-3.5 h-3.5 text-[#7E5E1E] shrink-0" />
                  <span>Call: {handoff.phoneDisplay || '+91 96263 50900'}</span>
                </button>
              ) : null}
            </div>
          </div>
        )}

        {/* Timestamp */}
        {timestamp && (
          <div className={`text-[10px] mt-1.5 font-sans ${isUser ? 'text-[#AAB4A0] text-right' : 'text-[#7E5E1E]'}`}>
            {timestamp}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-[#B49A64] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <User className="w-4 h-4 text-[#071B14]" />
        </div>
      )}
    </div>
  );
};

export default AssistantMessage;
