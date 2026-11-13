import React from 'react';
import { HelpCircle } from 'lucide-react';

export interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

const DEFAULT_SUGGESTIONS = [
  { label: 'Explore Our Services', query: 'What services does Kavitha & Associates offer?' },
  { label: 'About Our Firm', query: 'Tell me about the firm and its history.' },
  { label: 'Professional Background', query: 'What are CA Kavitha Vijay qualifications and credentials?' },
  { label: 'Find Published Insights', query: 'What regulatory and tax articles has the firm published?' },
  { label: 'Chambers Office & Contact', query: 'Where is the firm office located and how do I contact them?' }
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelectQuestion, disabled = false }) => {
  return (
    <div className="py-2 space-y-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7E5E1E] uppercase tracking-wider">
        <HelpCircle className="w-3 h-3 text-[#B49A64]" />
        <span>Suggested Inquiries:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {DEFAULT_SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectQuestion(item.query)}
            className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#183529] text-[#183529] hover:text-[#F1EBDD] border border-[#B49A64]/40 hover:border-[#183529] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-2xs"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
