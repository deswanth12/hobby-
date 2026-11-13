import React from 'react';
import { SourceCitation, CitationItem } from './SourceCitation';
import { ShieldCheck, User, MessageSquare } from 'lucide-react';

export interface AssistantMessageProps {
  role: 'user' | 'assistant';
  content: string;
  citations?: CitationItem[];
  timestamp?: string;
  onNavigate?: () => void;
  handoff?: {
    available: boolean;
    label: string;
  };
  onHandoffClick?: () => void;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  role,
  content,
  citations = [],
  timestamp,
  onNavigate,
  handoff,
  onHandoffClick
}) => {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-2.5 my-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#071B14] border border-[#B49A64]/50 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4 text-[#B49A64]" />
        </div>
      )}

      <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
        isUser
          ? 'bg-[#183529] text-[#F1EBDD] rounded-tr-xs border border-[#B49A64]/30'
          : 'bg-white text-[#35271F] rounded-tl-xs border border-[#D8D0BE]'
      }`}>
        {/* Message Content */}
        <div className="whitespace-pre-wrap font-sans">
          {content}
        </div>

        {/* Citations (Assistant Only) */}
        {!isUser && citations.length > 0 && (
          <SourceCitation citations={citations} onNavigate={onNavigate} />
        )}

        {/* Human Handoff Action (Assistant Only) */}
        {!isUser && handoff && handoff.available && onHandoffClick && (
          <div className="mt-2.5 pt-2 border-t border-[#D8D0BE]/40 flex justify-end">
            <button
              type="button"
              onClick={onHandoffClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#071B14] hover:bg-[#183529] text-[#B49A64] text-[11px] font-semibold tracking-wider uppercase border border-[#B49A64]/40 hover:border-[#B49A64] transition-all"
            >
              <MessageSquare className="w-3 h-3 text-[#B49A64]" />
              <span>{handoff.label}</span>
            </button>
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
        <div className="w-7 h-7 rounded-full bg-[#B49A64] flex items-center justify-center shrink-0 mt-0.5">
          <User className="w-4 h-4 text-[#071B14]" />
        </div>
      )}
    </div>
  );
};

export default AssistantMessage;
