import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export interface AssistantInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const AssistantInput: React.FC<AssistantInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = input.trim();
    if (!clean || isLoading || disabled) return;

    onSendMessage(clean);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-end gap-2 p-2 rounded-xl bg-white border border-[#D8D0BE] focus-within:border-[#B49A64] focus-within:ring-1 focus-within:ring-[#B49A64]/50 shadow-inner">
        <textarea
          ref={textareaRef}
          value={input}
          disabled={isLoading || disabled}
          onChange={(e) => setInput(e.target.value.slice(0, 1000))}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the firm, services, or credentials..."
          rows={1}
          maxLength={1000}
          className="w-full resize-none bg-transparent py-1.5 px-2 text-xs sm:text-sm text-[#35271F] placeholder-[#AAB4A0] outline-none max-h-28 overflow-y-auto leading-relaxed"
          aria-label="Ask the firm assistant a question"
        />

        <div className="flex items-center gap-1.5 shrink-0 pb-1">
          {input.length > 500 && (
            <span className="text-[10px] text-[#7E5E1E] font-mono">
              {input.length}/1000
            </span>
          )}

          <button
            type="submit"
            disabled={!input.trim() || isLoading || disabled}
            className="w-8 h-8 rounded-lg bg-[#071B14] hover:bg-[#183529] disabled:bg-[#FAF7F0] text-[#B49A64] disabled:text-[#D8D0BE] border border-[#B49A64]/40 disabled:border-[#D8D0BE] flex items-center justify-center transition-all disabled:pointer-events-none active:scale-95"
            aria-label="Send Message"
            title="Send message (Enter)"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] text-[#7E5E1E] px-1 pt-1 font-sans">
        <span>Press Enter to send, Shift+Enter for new line</span>
      </div>
    </form>
  );
};

export default AssistantInput;
