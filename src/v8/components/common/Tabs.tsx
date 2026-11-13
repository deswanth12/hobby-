import React, { useState, useRef } from 'react';

export interface TabDefinition {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabDefinition[];
  defaultTabId?: string;
  activeTabId?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: 'pill' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  activeTabId: controlledActiveTabId,
  onChange,
  className = '',
  variant = 'pill',
}) => {
  const [internalActiveId, setInternalActiveId] = useState<string>(
    controlledActiveTabId || defaultTabId || (tabs[0]?.id ?? '')
  );

  const activeId = controlledActiveTabId !== undefined ? controlledActiveTabId : internalActiveId;
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTabId === undefined) {
      setInternalActiveId(tabId);
    }
    onChange?.(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex = -1;
    if (e.key === 'ArrowRight') {
      targetIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      targetIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      targetIndex = 0;
    } else if (e.key === 'End') {
      targetIndex = tabs.length - 1;
    }

    if (targetIndex !== -1) {
      e.preventDefault();
      const targetTab = tabs[targetIndex];
      handleTabClick(targetTab.id);
      tabRefs.current.get(targetTab.id)?.focus();
    }
  };

  const activeTab = tabs.find((t) => t.id === activeId) || tabs[0];

  return (
    <div className={`w-full ${className}`.trim()}>
      {/* Tab Navigation List */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none ${
          variant === 'underline' ? 'border-b border-[#D8D0BE]' : ''
        }`}
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeId;
          const tabId = `tab-trigger-${tab.id}`;
          const panelId = `tab-panel-${tab.id}`;

          let styleClasses = '';
          if (variant === 'pill') {
            styleClasses = isActive
              ? 'bg-[#183529] text-[#F1EBDD] border border-[#B49A64]/40 shadow-sm font-semibold'
              : 'bg-[#FAF7F0] text-[#35271F] border border-[#D8D0BE] hover:border-[#B49A64]/40 hover:bg-[#F1EBDD]';
          } else {
            styleClasses = isActive
              ? 'border-b-2 border-[#B49A64] text-[#183529] font-semibold -mb-[2px]'
              : 'text-[#525954] hover:text-[#183529] border-b-2 border-transparent';
          }

          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm transition-all whitespace-nowrap min-h-[44px] shrink-0 ${styleClasses}`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-[#B49A64] text-[#071B14]' : 'bg-[#183529]/10 text-[#183529]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      {activeTab && (
        <div
          id={`tab-panel-${activeTab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-trigger-${activeTab.id}`}
          tabIndex={0}
          className="pt-4 focus:outline-none"
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
};

export default Tabs;
