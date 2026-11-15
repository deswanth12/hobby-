import React, { useRef, useEffect } from 'react';
import { X, RotateCcw, ShieldCheck } from 'lucide-react';
import { AssistantMessage, AssistantHandoffInfo } from './AssistantMessage';
import { AssistantInput } from './AssistantInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { AssistantDisclaimer } from './AssistantDisclaimer';
import { AssistantTypingIndicator } from './AssistantTypingIndicator';
import { useFirmData } from '../../../context/FirmDataContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: { title: string; url: string }[];
  timestamp: string;
  handoff?: AssistantHandoffInfo;
}

export interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onClearConversation: () => void;
  onNavigateToCitation?: () => void;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({
  isOpen,
  onClose,
  messages,
  isLoading,
  onSendMessage,
  onClearConversation,
  onNavigateToCitation
}) => {
  const { data: FIRM_DATA } = useFirmData();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Trap Escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Kavitha & Associates Firm Assistant"
      className="fixed bottom-20 right-3.5 sm:bottom-24 sm:right-6 md:bottom-28 md:right-8 z-40 w-[calc(100vw-28px)] sm:w-[400px] md:w-[420px] max-h-[82vh] sm:max-h-[640px] flex flex-col bg-[#F1EBDD] rounded-2xl border-2 border-[#B49A64]/60 shadow-2xl overflow-hidden font-sans transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      {/* 1. Header Desk: Deep Evergreen with Antique Bronze */}
      <div className="bg-[#071B14] text-[#F1EBDD] p-3.5 sm:p-4 border-b border-[#B49A64]/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white p-1 border border-[#B49A64]/60 shadow-xs flex items-center justify-center shrink-0">
            <img src="/brand/ca-india-logo.webp" alt="CA India" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#F1EBDD] leading-tight">
              Firm Information Assistant
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-[#B49A64] font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kavitha &amp; Associates • Tirupati Chambers</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClearConversation}
            className="p-1.5 rounded-lg text-[#AAB4A0] hover:text-[#F1EBDD] hover:bg-[#183529] transition-colors"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#AAB4A0] hover:text-[#F1EBDD] hover:bg-[#183529] transition-colors"
            title="Close Assistant"
            aria-label="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Scrollable Conversation Workspace */}
      <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-[#FAF7F0] overscroll-contain">
        {/* Welcome Plaque: Authoritative CA Chambers Standards */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#D8D0BE] text-xs leading-relaxed space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#D8D0BE]/60 pb-2">
            <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-[#071B14]">
              <ShieldCheck className="w-4 h-4 text-[#B49A64]" />
              <span>Kavitha &amp; Associates</span>
            </div>
            <span className="text-[10px] font-mono tracking-wide px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#7E5E1E] border border-[#B49A64]/30 font-semibold">
              Tirupati Chambers
            </span>
          </div>

          <p className="text-[#35271F]">
            Welcome to the firm&apos;s source-grounded information assistant, operating in strict adherence to the <strong className="font-semibold text-[#071B14]">ICAI Code of Ethics</strong>. I can assist you with verified statutory details across our primary practice areas:
          </p>

          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#183529] font-medium py-0.5">
            <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-[#FAF7F0] border border-[#D8D0BE]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] shrink-0" />
              <span>Direct Tax (IT Act 1961)</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-[#FAF7F0] border border-[#D8D0BE]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] shrink-0" />
              <span>GST Compliance &amp; Audit</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-[#FAF7F0] border border-[#D8D0BE]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] shrink-0" />
              <span>Companies Act 2013 &amp; MCA</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-[#FAF7F0] border border-[#D8D0BE]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] shrink-0" />
              <span>Statutory Audit &amp; 44AB</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-[#FAF7F0] border border-[#D8D0BE]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] shrink-0" />
              <span>RERA Form 3 Certifications</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-[#FAF7F0] border border-[#D8D0BE]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] shrink-0" />
              <span>Virtual CFO Advisory</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#D8D0BE]/60 text-[10px] text-[#7E5E1E]">
            <span>Need direct consultation?</span>
            <div className="flex items-center gap-2">
              <a
                href={FIRM_DATA.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
              >
                <span>WhatsApp</span>
              </a>
              <span className="text-[#AAB4A0]">•</span>
              <a
                href={`tel:${FIRM_DATA.contact.primaryPhoneClean || '919626350900'}`}
                className="inline-flex items-center gap-1 font-semibold text-[#183529] hover:text-[#071B14] underline underline-offset-2"
              >
                <span>Call Chambers</span>
              </a>
            </div>
          </div>
        </div>

        {/* Suggested Quick Question Chips */}
        {messages.length <= 1 && (
          <SuggestedQuestions
            onSelectQuestion={onSendMessage}
            disabled={isLoading}
          />
        )}

        {/* Render Chat Messages */}
        {messages.map((msg) => (
          <AssistantMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            citations={msg.citations}
            timestamp={msg.timestamp}
            handoff={msg.handoff}
            onNavigate={onNavigateToCitation}
            onHandoffClick={() => {
              if (!msg.handoff?.whatsappUrl) {
                const url = FIRM_DATA.contact.whatsappLink;
                window.open(url, '_blank', 'noopener,noreferrer');
              }
            }}
            onPhoneClick={() => {
              if (!msg.handoff?.phoneUrl) {
                const phoneHref = `tel:${FIRM_DATA.contact.primaryPhoneClean || '919626350900'}`;
                window.location.href = phoneHref;
              }
            }}
          />
        ))}

        {/* Active Typing Indicator */}
        {isLoading && (
          <div className="py-1">
            <AssistantTypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Console & Legal Disclaimer Desk */}
      <div className="p-3 sm:p-3.5 bg-white border-t border-[#D8D0BE] space-y-2 shrink-0">
        <AssistantInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
        />
        <AssistantDisclaimer />
      </div>
    </div>
  );
};

export default AssistantPanel;
