import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  Receipt, 
  Building2, 
  LineChart, 
  Landmark,
  TrendingUp,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '../common/Button';
import { DotGrid, SectionAccent, ArchitecturalLines, DecorativeLayer } from '../decorative';
import { Reveal, StaggerContainer, StaggerItem } from '../animation';

export interface PracticeDiscipline {
  code: string;
  badge: string;
  title: string;
  description: string;
  link: string;
  icon: React.ElementType;
  anchorId?: string;
}

export const PRACTICE_DISCIPLINES: PracticeDiscipline[] = [
  {
    code: 'PRAC-01',
    badge: 'ICAI Standards on Auditing',
    title: 'Statutory Audit & Assurance',
    description: 'Independent statutory audits, internal financial controls, and corporate governance for private and public limited entities.',
    link: '/services/audit-assurance',
    icon: ShieldCheck,
    anchorId: 'audit-spotlight',
  },
  {
    code: 'PRAC-02',
    badge: 'Income Tax Act & DTAA',
    title: 'Direct Tax Advisory & Litigation',
    description: 'Corporate tax planning, appellate litigation before CIT(A)/ITAT, transfer pricing documentation, and dispute representation.',
    link: '/services/income-tax-consultant-tirupati',
    icon: FileText,
  },
  {
    code: 'PRAC-03',
    badge: 'CGST / SGST / IGST Acts',
    title: 'Indirect Tax & GST Compliance',
    description: 'Comprehensive GST retainership, monthly GSTR-3B/1 reconciliation, Departmental audit defense, and refund processing.',
    link: '/services/gst-consultant-tirupati',
    icon: Receipt,
  },
  {
    code: 'PRAC-04',
    badge: 'Companies Act 2013 & MCA',
    title: 'Corporate Governance & Secretarial',
    description: 'Company secretarial support, MCA statutory compliance, due diligence, entity incorporation, and capital structuring counsel.',
    link: '/services/company-registration-tirupati',
    icon: Building2,
  },
  {
    code: 'PRAC-05',
    badge: 'Real Estate Regulation Act',
    title: 'RERA Advisory & Certifications',
    description: 'Quarterly compliance certifications, project escrow withdrawals, title due diligence, and regulatory reporting for developers.',
    link: '/services/rera-consultant-tirupati',
    icon: Landmark,
  },
  {
    code: 'PRAC-06',
    badge: 'CMA Cost Controllership',
    title: 'Virtual CFO & Controllership',
    description: 'Executive financial leadership, MIS reporting, working capital optimization, and financial controller supervision.',
    link: '/services/virtual-cfo-tirupati',
    icon: LineChart,
  },
  {
    code: 'PRAC-07',
    badge: 'Project Appraisal & Debt',
    title: 'Project Finance & Banking',
    description: 'Detailed project reports (DPR), bank consortium debt syndication, working capital limits, and capital restructuring.',
    link: '/services/project-finance',
    icon: TrendingUp,
  },
  {
    code: 'PRAC-08',
    badge: 'Enterprise Advisory',
    title: 'Strategic Advisory & Succession',
    description: 'Institutional succession planning, comprehensive business valuation, promoter advisory, and cross-border regulatory structuring counsel.',
    link: '/services/strategic-advisory',
    icon: Compass,
  },
];

export const PracticeAreasSection: React.FC = () => {
  return (
    <section 
      id="practice-areas" 
      className="py-12 sm:py-16 lg:py-20 bg-[#F1EBDD] border-b border-[#D8D0BE] relative overflow-hidden texture-warm-ivory scroll-mt-28"
    >
      {/* Anchor Aliases for Deep Linking and Test Continuity */}
      <div id="services-overview" className="scroll-mt-28" />
      <div id="services" className="scroll-mt-28" />
      <div id="services-preview" className="scroll-mt-28" />

      {/* Ambient Decorative Layer */}
      <DecorativeLayer>
        <DotGrid
          variant="bronze"
          width={280}
          height={280}
          className="absolute -top-12 -left-12 opacity-15 hidden lg:block"
        />
      </DecorativeLayer>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <Reveal delay={60} duration={650}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#7E5E1E] bg-[#FAF7F0] px-2.5 py-1 rounded-md border border-[#D8D0BE]">
                  02 / PRACTICE AREAS
                </span>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#B49A64]/60 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#183529]" />
                  <span className="font-editorial-meta text-xs font-semibold uppercase tracking-wider text-[#35271F]">
                    8 STATUTORY DISCIPLINES
                  </span>
                </div>
                <SectionAccent variant="bronze" className="hidden sm:flex ml-1.5" />
              </div>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl text-[#35271F] font-serif font-bold tracking-tight">
                Statutory Assurance &amp; Strategic Governance
              </h2>
            </div>
            <div className="max-w-md">
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                Partner-supervised statutory auditing, taxation, corporate governance, and financial controllership across India.
              </p>

              {/* Practice Areas Double-Rule Accent */}
              <ArchitecturalLines type="double-rule" variant="bronze" length="90px" className="mt-2.5 opacity-60" />
            </div>
          </div>
        </Reveal>

        {/* 8 Core Practice Areas Grid (Responsive 4-column layout) */}
        <StaggerContainer staggerMs={70} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {PRACTICE_DISCIPLINES.map((cat, idx) => {
            const Icon = cat.icon;
            const stepNum = cat.code.replace('PRAC-', '');

            return (
              <StaggerItem key={cat.code} index={idx} distance={18} durationMs={550} className="h-full flex">
                <div
                  id={cat.anchorId}
                  className="w-full bg-[#FAF7F0] hover:bg-[#0A261C] rounded-2xl border border-[#D8D0BE] hover:border-[#B49A64] shadow-card hover:shadow-[0_20px_48px_rgba(7,27,20,0.35)] hover:-translate-y-2.5 transition-all duration-500 relative flex flex-col justify-between group overflow-hidden"
                >
                  {/* Top Metallic Hairline Accent */}
                  <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B49A64]/0 to-transparent group-hover:via-[#B49A64] transition-all duration-500" aria-hidden="true" />

                  {/* Watermark Numeral in Background (Refined Cormorant Serif) */}
                  <div className="absolute right-4 bottom-14 font-serif text-5xl font-bold text-[#B49A64]/10 group-hover:text-[#B49A64]/25 pointer-events-none select-none transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1" aria-hidden="true">
                    {stepNum}
                  </div>

                  {/* Dynamic Corner Brass Brackets (Expand on Hover) */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 group-hover:w-5 group-hover:h-5 border-t-2 border-l-2 border-[#B49A64]/40 rounded-tl-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 group-hover:w-5 group-hover:h-5 border-b-2 border-r-2 border-[#B49A64]/40 rounded-br-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />

                  <div className="p-5 sm:p-6 flex flex-col h-full justify-between relative z-10">
                    <div>
                      {/* Top Meta Line: Discipline Code & Badge */}
                      <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
                        <span className="font-mono text-xs font-bold text-[#7E5E1E] group-hover:text-[#B49A64] tracking-wider transition-colors duration-300">
                          {cat.code}
                        </span>
                        <span className="text-[10px] font-semibold text-[#7E5E1E] bg-[#FFF6E8] group-hover:bg-[#12382A] group-hover:text-[#E8D5B5] group-hover:border-[#B49A64]/40 border border-[#D8D0BE] px-2 py-0.5 rounded-md truncate max-w-[150px] transition-all duration-300">
                          {cat.badge}
                        </span>
                      </div>

                      {/* Icon and Title */}
                      <div className="flex items-start gap-3 mb-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#183529] group-hover:bg-[#B49A64] text-[#B49A64] group-hover:text-[#071B14] flex items-center justify-center shrink-0 border border-[#B49A64]/40 shadow-xs group-hover:scale-110 group-hover:rotate-6 group-hover:border-[#C5A059] group-hover:shadow-[0_0_16px_rgba(180,154,100,0.4)] transition-all duration-300">
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#35271F] group-hover:text-[#F1EBDD] transition-colors duration-300 leading-snug pt-0.5">
                          {cat.title}
                        </h3>
                      </div>

                      {/* Concise Editorial Description (~15–20 words) */}
                      <p className="font-editorial-body text-xs text-[#525954] group-hover:text-[#D8D0BE] transition-colors duration-300 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    {/* Smooth Kinetic Bronze Endpoint Accent */}
                    <div className="h-[2px] w-6 bg-[#B49A64]/40 rounded-full group-hover:w-14 group-hover:bg-[#B49A64] transition-all duration-300 mt-3" />

                    {/* Direct Dedicated Page Link with Circular Antique Gold Medallion */}
                    <div className="mt-3 pt-3 border-t border-[#D8D0BE]/70 group-hover:border-[#B49A64]/30 flex items-center justify-between transition-colors duration-300">
                      <Link
                        to={cat.link}
                        className="min-h-[44px] w-full flex items-center justify-between font-editorial-meta text-xs font-semibold text-[#35271F] group-hover:text-[#F1EBDD] transition-colors duration-300 group/link"
                      >
                        <span className="group-hover/link:translate-x-0.5 transition-transform">Explore Practice Details</span>
                        <div className="w-8 h-8 rounded-full bg-[#183529] group-hover:bg-[#B49A64] border border-[#B49A64]/40 flex items-center justify-center text-[#B49A64] group-hover:text-[#071B14] group-hover:rotate-45 group-hover:scale-110 shadow-xs transition-all duration-300 shrink-0">
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Section Call to Action */}
        <div className="text-center mt-10">
          <Button
            to="/services"
            variant="secondary"
            size="md"
            className="inline-flex text-xs sm:text-sm font-semibold justify-center py-2.5 px-6 min-h-[46px]"
          >
            Explore Complete Practice Directory
          </Button>
        </div>

      </div>
    </section>
  );
};

export default PracticeAreasSection;
