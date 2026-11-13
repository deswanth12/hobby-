import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

export interface AssistantLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AssistantLauncher: React.FC<AssistantLauncherProps> = ({ isOpen, onToggle }) => {
  return (
    <aside
      aria-label="Firm Assistant Launcher"
      className="fixed bottom-18 right-3.5 sm:bottom-22 sm:right-6 md:bottom-24 md:right-8 z-30 flex items-center"
    >
      <button
        type="button"
        onClick={onToggle}
        className="pointer-events-auto group relative flex items-center justify-center gap-2 min-h-[44px] px-3.5 sm:px-4 py-2.5 rounded-full bg-[#071B14] hover:bg-[#183529] text-[#F1EBDD] border border-[#B49A64]/60 shadow-editorial transition-all duration-200 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#B49A64] focus:ring-offset-2 focus:ring-offset-[#F1EBDD]"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close firm assistant" : "Ask about our firm - Open firm assistant"}
      >
        <span className="relative flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-[#B49A64] transition-transform group-hover:scale-110" />
          <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1.5" />
        </span>
        <span className="text-xs font-semibold tracking-wider text-[#F1EBDD] group-hover:text-[#B49A64] transition-colors whitespace-nowrap">
          {isOpen ? 'Close Assistant' : 'Ask about our firm'}
        </span>
      </button>
    </aside>
  );
};

export default AssistantLauncher;
