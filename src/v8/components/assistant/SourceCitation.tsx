import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, FileText } from 'lucide-react';

export interface CitationItem {
  title: string;
  url: string;
}

export interface SourceCitationProps {
  citations: CitationItem[];
  onNavigate?: () => void;
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ citations, onNavigate }) => {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-2.5 pt-2 border-t border-[#D8D0BE]/60 text-xs">
      <span className="text-[10px] uppercase font-bold tracking-wider text-[#7E5E1E] block mb-1.5 font-sans">
        Verified Sources:
      </span>
      <div className="flex flex-wrap gap-1.5">
        {citations.map((c, idx) => (
          <Link
            key={`${c.url}-${idx}`}
            to={c.url}
            onClick={onNavigate}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF7F0] hover:bg-[#F1EBDD] text-[#183529] hover:text-[#071B14] border border-[#B49A64]/40 hover:border-[#B49A64] text-[11px] font-medium transition-colors shadow-2xs group"
            title={`View official publication: ${c.title}`}
          >
            <FileText className="w-3 h-3 text-[#B49A64] shrink-0" />
            <span className="truncate max-w-[200px]">{c.title}</span>
            <ExternalLink className="w-2.5 h-2.5 text-[#AAB4A0] group-hover:text-[#B49A64] shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SourceCitation;
