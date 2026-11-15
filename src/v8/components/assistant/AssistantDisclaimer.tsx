import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const AssistantDisclaimer: React.FC = () => {
  return (
    <div className="p-2.5 rounded-lg bg-[#FAF7F0] border border-[#D8D0BE] text-[10px] leading-tight text-[#7E5E1E] flex items-start gap-2">
      <ShieldAlert className="w-3.5 h-3.5 text-[#B49A64] shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold block text-[#35271F]">ICAI Ethics &amp; Professional Notice:</span>
        Automated firm information assistant operating in strict compliance with the ICAI Code of Ethics (no solicitation or self-laudatory claims). Please do not submit confidential financial documents, PAN, or personal identification numbers. For formal statutory engagement, please contact our chambers directly.
      </div>
    </div>
  );
};

export default AssistantDisclaimer;
