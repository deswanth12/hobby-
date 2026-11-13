import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  statuteReference?: string;
  badge?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpandedId?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpandedId,
  className = '',
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(defaultExpandedId ? [defaultExpandedId] : [])
  );

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={`space-y-3 ${className}`.trim()}>
      {items.map((item) => {
        const isExpanded = expandedIds.has(item.id);
        const triggerId = `accordion-trigger-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className="rounded-xl border border-[#B49A64]/30 bg-[#FAF7F0] overflow-hidden transition-all duration-200 hover:border-[#B49A64]/60"
          >
            <button
              id={triggerId}
              type="button"
              aria-expanded={isExpanded}
              aria-controls={panelId}
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors min-h-[44px]"
            >
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                    {item.title}
                  </h4>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#183529]/10 text-[#183529] border border-[#183529]/20">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <p className="text-xs text-[#525954]">{item.subtitle}</p>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#B49A64] shrink-0 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180 text-[#183529]' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              data-expanded={isExpanded}
              aria-hidden={!isExpanded}
              className="accordion-curtain"
            >
              <div className="accordion-curtain-inner">
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-[#35271F] leading-relaxed border-t border-[#B49A64]/15">
                  <div className="pt-3">{item.content}</div>
                  {item.statuteReference && (
                    <div className="mt-3 pt-2 border-t border-[#B49A64]/20 text-[11px] font-mono text-[#7E5E1E]">
                      Statutory Framework: {item.statuteReference}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
