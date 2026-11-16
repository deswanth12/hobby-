import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';

export type KnowledgeBankContext = 'general' | 'gst' | 'cfo' | 'rera' | 'audit' | 'income-tax';
export type KnowledgeBankCardVariant = 'dark' | 'forest' | 'light';

export interface KnowledgeBankCardProps {
  variant?: KnowledgeBankCardVariant;
  context?: KnowledgeBankContext;
  title?: string;
  description?: string;
  kicker?: string;
  highlightPills?: string[];
  ctaLabel?: string;
  to?: string;
  className?: string;
}

interface ContextConfig {
  kicker: string;
  title: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
}

const CONTEXT_CONFIGS: Record<KnowledgeBankContext, ContextConfig> = {
  general: {
    kicker: 'AUTHORITATIVE STATUTORY REPOSITORY',
    title: 'Knowledge Bank & Statutory Filing Portals Directory',
    description:
      'Explore Chambers’ complete public repository of 6 mathematical tax & statutory calculators, 6 executive 1-minute compliance briefs, 3 technical monographs, and direct curated links to 11 official government filing portals.',
    highlights: [
      '6 Interactive Calculators',
      '11 Official Government Portals',
      '6 Chambers 1-Minute Shorts',
      '3 Technical Monographs',
    ],
    ctaLabel: 'Explore Full Knowledge Bank & Statutory Directory',
  },
  gst: {
    kicker: 'GSTN & STATUTORY COMPLIANCE DIRECTORY',
    title: 'Explore Official GST Filing Portals & Technical Briefs',
    description:
      'Access curated direct links to the GST Common Portal (GSTN), National E-Way Bill System, and NIC E-Invoice Portal, alongside Chambers’ 1-minute statutory briefs on Section 16(2)(aa) GSTR-2B reconciliation and DRC-01A response guidelines.',
    highlights: [
      'GST Common Portal (GSTN)',
      'National E-Way Bill System',
      'NIC E-Invoice System',
      'Section 16(2)(aa) 2B Reconciliation',
    ],
    ctaLabel: 'Explore Full Knowledge Bank & Statutory Directory',
  },
  cfo: {
    kicker: 'MANAGEMENT GOVERNANCE & STATUTORY DIRECTORY',
    title: 'Access Corporate Filing Portals, CARO Monographs & Financial Engines',
    description:
      'Beyond working capital diagnostics, access our 18-page technical monograph on CARO 2020 clause-by-clause assurance, Section 43B(h) 45-day MSME payment briefs, and official MCA21 V3 corporate filing systems.',
    highlights: [
      'MCA21 V3 Portal',
      'CARO 2020 Monograph',
      'Section 43B(h) MSME Brief',
      'Startup India Portal',
    ],
    ctaLabel: 'Explore Full Knowledge Bank & Statutory Directory',
  },
  rera: {
    kicker: 'AP RERA & REAL ESTATE STATUTORY DIRECTORY',
    title: 'Access AP RERA Portal, Section 269ST Briefs & Escrow Guidelines',
    description:
      'Direct gateway to the official Andhra Pradesh RERA project registration portal, coupled with Chambers guidance on Section 269ST cash ceiling limits and corporate SPV stamp duty calculators.',
    highlights: [
      'AP RERA Official Portal',
      'Section 269ST Cash Compliance',
      'SPV Stamp Duty Estimator',
      'Form 3 Escrow Rules',
    ],
    ctaLabel: 'Explore Full Knowledge Bank & Statutory Directory',
  },
  audit: {
    kicker: 'ASSURANCE STANDARDS & STATUTORY MONOGRAPHS',
    title: 'Access CARO 2020 Assurance Guides & Corporate Reporting Portals',
    description:
      'Review technical monographs on CARO 2020 21 reporting clauses, Section 135 CSR unspent account obligations, and direct links to MCA21 V3 and Income Tax 2.0 portals.',
    highlights: [
      'CARO 2020 Monograph',
      'MCA21 V3 Portal',
      'Tax Audit Screener',
      'Income Tax 2.0 Portal',
    ],
    ctaLabel: 'Explore Full Knowledge Bank & Statutory Directory',
  },
  'income-tax': {
    kicker: 'DIRECT TAX LITIGATION & OFFICIAL PORTALS',
    title: 'Access Income Tax 2.0, TRACES & AIS Reconciliation Resources',
    description:
      'Direct gateways to the Income Tax e-Filing 2.0 portal, TRACES (TDS CPC), and Protean OLTAS challans, paired with Chambers shorts on Form 26AS vs AIS/TIS discrepancies.',
    highlights: [
      'Income Tax e-Filing 2.0',
      'TRACES Portal',
      'Protean OLTAS Tax Portal',
      'AIS/TIS Mismatch Brief',
    ],
    ctaLabel: 'Explore Full Knowledge Bank & Statutory Directory',
  },
};

export const KnowledgeBankCard: React.FC<KnowledgeBankCardProps> = ({
  variant = 'dark',
  context = 'general',
  title,
  description,
  kicker,
  highlightPills,
  ctaLabel,
  to = '/knowledge-bank',
  className = '',
}) => {
  const config = CONTEXT_CONFIGS[context];
  const finalKicker = kicker || config.kicker;
  const finalTitle = title || config.title;
  const finalDesc = description || config.description;
  const finalHighlights = highlightPills || config.highlights;
  const finalCta = ctaLabel || config.ctaLabel;

  const containerClasses = {
    dark: 'bg-[#071B14] border-[#B49A64]/35 text-[#F1EBDD] shadow-xl',
    forest: 'bg-[#183529] border-[#B49A64]/40 text-[#F1EBDD] shadow-xl',
    light: 'bg-[#FAF7F0] border-[#D8D0BE] text-[#183529] shadow-sm',
  }[variant];

  const chipClasses = {
    dark: 'bg-[#183529]/80 text-[#B49A64] border-[#B49A64]/30',
    forest: 'bg-[#071B14]/80 text-[#B49A64] border-[#B49A64]/30',
    light: 'bg-[#FFFFFF] text-[#7E5E1E] border-[#D8D0BE]',
  }[variant];

  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${containerClasses} ${className}`}
    >
      {/* Subtle architectural radial lighting accent */}
      <div 
        className="absolute -right-16 -top-16 w-64 h-64 bg-[#B49A64]/10 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Heading, Description & Highlights */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={variant === 'light' ? 'gold' : 'kicker'}>
              {finalKicker}
            </Badge>
            <span className={`text-[11px] font-mono flex items-center gap-1 ${
              variant === 'light' ? 'text-[#525954]' : 'text-[#AAB4A0]'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Chambers Knowledge Repository</span>
            </span>
          </div>

          <h3 className={`font-serif text-xl sm:text-2xl font-bold tracking-tight ${
            variant === 'light' ? 'text-[#183529]' : 'text-[#F1EBDD]'
          }`}>
            {finalTitle}
          </h3>

          <p className={`text-xs sm:text-sm leading-relaxed ${
            variant === 'light' ? 'text-[#525954]' : 'text-[#F1EBDD]/85'
          }`}>
            {finalDesc}
          </p>

          {/* Highlights Row */}
          <div className="flex flex-wrap gap-2 pt-1">
            {finalHighlights.map((pill, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-medium border ${chipClasses}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64]" />
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: High-Touch Call to Action */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3 shrink-0 pt-2 lg:pt-0">
          <Button
            to={to}
            variant="primary"
            size="md"
            dualArrow
            className="w-full sm:w-auto min-h-[44px] whitespace-nowrap"
          >
            {finalCta}
          </Button>

          <span className={`text-[11px] font-sans ${
            variant === 'light' ? 'text-[#7E5E1E]' : 'text-[#AAB4A0]'
          }`}>
            Public statutory resource • No client login required
          </span>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBankCard;
