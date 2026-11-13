import React from 'react';

export const AssistantTypingIndicator: React.FC = () => {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#183529]/10 border border-[#D8D0BE] text-[#35271F] text-xs font-sans"
      role="status"
      aria-label="Assistant is researching published sources"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] motion-safe:animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] motion-safe:animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] motion-safe:animate-bounce" style={{ animationDelay: '300ms' }} />
      <span className="text-[11px] font-medium text-[#7E5E1E] ml-1">Consulting firm records...</span>
    </div>
  );
};

export default AssistantTypingIndicator;
