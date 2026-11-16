import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Zap,
  Globe,
  FileText,
  ShieldCheck,
  ChevronRight,
  Home,
  ExternalLink,
  ArrowRight,
  Clock,
  CheckCircle2,
  Scale,
  Landmark,
  Building2,
  Receipt,
  Calendar,
  Printer,
} from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import { Badge } from '../components/common/Badge';
import {
  TaxRegimeComparator,
  StatutoryAuditScreener,
  StartupStampDutyEstimator,
  GSTLateFeeCalculator,
  VirtualCFOReadinessTool,
  RERAWithdrawalEstimator,
  StatutoryComplianceCalendar,
} from '../components/tools';

type TabKey = 'tools' | 'calendar' | 'shorts' | 'portals' | 'monographs';
type ToolKey = 'tax' | 'audit' | 'gst' | 'cfo' | 'rera' | 'roc';

export const KnowledgeBankPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('tools');
  const [activeTool, setActiveTool] = useState<ToolKey>('tax');

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Knowledge Bank & Statutory Resources', path: '/knowledge-bank' },
  ];

  const chambersShorts = [
    {
      id: 'short-itc-2b',
      title: 'GSTR-2B vs. Books: Zero-Tolerance Input Tax Credit (ITC) Matching',
      statute: 'Section 16(2)(aa) & Rule 36(4), CGST Act, 2017',
      readTime: '1 min read',
      category: 'GST & Indirect Tax',
      summary:
        'Under Section 16(2)(aa), ITC is strictly inadmissible unless reflected in the supplier-uploaded GSTR-2B. Timing delays in vendor filings directly block buyer working capital. Monthly line-by-line reconciliation prior to GSTR-3B submission is legally essential to prevent DRC-01A demand notices.',
      keyTakeaway: 'Never claim provisional ITC exceeding GSTR-2B; maintain strict vendor compliance ledgers.',
    },
    {
      id: 'short-43b-h',
      title: 'Section 43B(h): Why 45-Day MSME Payment Deadlines Cannot Be Waived',
      statute: 'Section 43B(h), Income Tax Act, 1961 read with Section 15 of MSMED Act, 2006',
      readTime: '1 min read',
      category: 'Direct Taxation',
      summary:
        'Section 43B(h) disallows deductions for any sum payable to a micro or small enterprise if unpaid beyond the statutory 15-day limit (or 45 days where agreed in writing). Outstanding liabilities at year-end are added back to taxable business profits, triggering immediate tax and interest.',
      keyTakeaway: 'Agreements stipulating payment terms exceeding 45 days are void ab initio under the MSMED Act.',
    },
    {
      id: 'short-din-kyc',
      title: 'DIN e-KYC (DIR-3 KYC): Critical Deadlines and ₹5,000 Reactivation Penalty',
      statute: 'Rule 12A, Companies (Appointment and Qualification of Directors) Rules, 2014',
      readTime: '1 min read',
      category: 'Corporate Secretarial',
      summary:
        'Every individual holding a Director Identification Number (DIN) as on 31st March must file Form DIR-3 KYC or web-form DIR-3 KYC-WEB on or before 30th September annually. Delayed filing results in immediate DIN deactivation and a mandatory statutory penalty of ₹5,000 per DIN.',
      keyTakeaway: 'Deactivated DINs paralyze company secretarial filings and disqualify board voting resolutions.',
    },
    {
      id: 'short-ais-tis',
      title: 'Form 26AS vs AIS/TIS: Resolving High-Value Transaction Statement Mismatches',
      statute: 'Section 285BB & Rule 114-I, Income Tax Act, 1961',
      readTime: '1 min read',
      category: 'Direct Tax & Scrutiny',
      summary:
        'While Form 26AS tracks tax deducted or collected at source (TDS/TCS), the Annual Information Statement (AIS) and Taxpayer Information Summary (TIS) capture share trades, mutual funds, foreign remittances, and high-value cash transactions. Discrepancies between ITR disclosures and AIS trigger automated computer-assisted scrutiny notices under Section 143(1)(a).',
      keyTakeaway: 'Reconcile AIS/TIS and submit prompt online feedback before filing annual tax returns.',
    },
    {
      id: 'short-269st',
      title: 'Section 269ST: Absolute Ban on Cash Transactions of ₹2 Lakhs or More',
      statute: 'Section 269ST read with Section 271DA, Income Tax Act, 1961',
      readTime: '1 min read',
      category: 'Tax Litigation & Penalties',
      summary:
        'No person shall receive an amount of ₹2,00,000 or more in cash in aggregate from a person in a day, or in respect of a single transaction, or in respect of transactions relating to one event or occasion. Contravention attracts a penalty under Section 271DA strictly equal to 100% of the cash received.',
      keyTakeaway: 'Split invoices on the same day or event do not circumvent the ₹2 Lakh aggregate ceiling.',
    },
    {
      id: 'short-angel-tax',
      title: 'Angel Tax Abolition (Sec 56(2)(viib)): Finance Act Relief for Startup Capital',
      statute: 'Abolition of Section 56(2)(viib), Finance (No. 2) Act, 2024',
      readTime: '1 min read',
      category: 'Startup Governance',
      summary:
        'The contentious "Angel Tax" taxing premium received on unlisted share issues above Fair Market Value (FMV) has been abolished for all classes of investors. Indian startups can now raise growth equity without risk of aggressive valuation scrutiny from assessing officers.',
      keyTakeaway: 'Valuation reports under Rule 11UA remain relevant for FEMA foreign direct investment pricing.',
    },
  ];

  const statutoryPortals = [
    {
      category: 'Direct Tax & Scrutiny',
      icon: <Scale className="w-5 h-5 text-[#B49A64]" />,
      portals: [
        {
          name: 'Income Tax e-Filing 2.0 Portal',
          url: 'https://www.incometax.gov.in',
          desc: 'Official filing portal for ITR forms, AIS/TIS review, faceless assessment responses, and refund status.',
        },
        {
          name: 'TRACES (TDS CPC) Portal',
          url: 'https://www.tdscpc.gov.in',
          desc: 'TDS return processing, Form 16/16A generation, justification reports, and 26AS downloads.',
        },
        {
          name: 'Protean (formerly NSDL) Tax Portal',
          url: 'https://www.protean-tinpan.com',
          desc: 'Online challan payment (OLTAS), PAN/TAN verification, and e-TDS return submission facilities.',
        },
      ],
    },
    {
      category: 'Indirect Tax (GST) & Logistics',
      icon: <Receipt className="w-5 h-5 text-[#B49A64]" />,
      portals: [
        {
          name: 'GST Common Portal (GSTN)',
          url: 'https://www.gst.gov.in',
          desc: 'Central portal for monthly GSTR-1, GSTR-3B, GSTR-9 annual returns, ITC matching, and payments.',
        },
        {
          name: 'National E-Way Bill System',
          url: 'https://ewaybillgst.gov.in',
          desc: 'Consignment generation for goods movement exceeding ₹50,000 threshold across inter/intra-state routes.',
        },
        {
          name: 'GST E-Invoice System (NIC)',
          url: 'https://einvoice1.gst.gov.in',
          desc: 'Invoice Registration Portal (IRP) for B2B Invoice Reference Number (IRN) and signed QR code generation.',
        },
      ],
    },
    {
      category: 'Corporate Law & Governance',
      icon: <Building2 className="w-5 h-5 text-[#B49A64]" />,
      portals: [
        {
          name: 'MCA21 V3 Portal (Ministry of Corporate Affairs)',
          url: 'https://www.mca.gov.in',
          desc: 'SPICe+ company incorporation, director DIN KYC, RoC annual AOC-4/MGT-7 filings, and charge registrations.',
        },
        {
          name: 'Startup India Portal',
          url: 'https://www.startupindia.gov.in',
          desc: 'DPIIT startup recognition, Section 80-IAC tax exemption applications, and public procurement exemptions.',
        },
      ],
    },
    {
      category: 'Real Estate & Social Security',
      icon: <Landmark className="w-5 h-5 text-[#B49A64]" />,
      portals: [
        {
          name: 'AP RERA Official Portal',
          url: 'https://rera.ap.gov.in',
          desc: 'Andhra Pradesh Real Estate Regulatory Authority project registration, quarterly progress, and escrow filings.',
        },
        {
          name: 'EPFO Unified Member / Employer Portal',
          url: 'https://www.epfindia.gov.in',
          desc: 'Provident fund electronic challan-cum-return (ECR) monthly filing, member KYC, and employer compliance.',
        },
        {
          name: 'ESIC Insurance Portal',
          url: 'https://www.esic.gov.in',
          desc: 'Employees State Insurance Corporation registration, monthly contribution payments, and worker benefit cards.',
        },
      ],
    },
  ];

  const monographs = [
    {
      title: 'CARO 2020: Comprehensive Clause-by-Clause Assurance Guide for Corporate Boards',
      statute: 'Companies (Auditor’s Report) Order, 2020',
      category: 'Statutory Audit',
      pages: '18-Page Technical Monograph',
      summary:
        'Exhaustive analysis of the 21 reporting clauses under CARO 2020, focusing on physical inventory verification, title deeds of immovable properties, working capital limit utilization from banks, whistle-blower complaints, and material uncertainty on debt servicing capability.',
    },
    {
      title: 'Section 135 CSR Compliance: Accounting, Unspent CSR Accounts & Penal Implications',
      statute: 'Section 135, Companies Act, 2013 & Companies (CSR Policy) Rules',
      category: 'Corporate Governance',
      pages: '12-Page Technical Monograph',
      summary:
        'Detailed commentary on corporate social responsibility obligations for companies meeting net worth (₹500 Cr), turnover (₹1,000 Cr), or net profit (₹5 Cr) thresholds. Covers mandatory transfer to Unspent CSR Account in scheduled banks within 30 days and ongoing project tracking.',
    },
    {
      title: 'Transfer Pricing Documentation & Form 3CEB: Arm’s Length Principles in Manufacturing',
      statute: 'Sections 92 to 92F, Income Tax Act, 1961',
      category: 'International Taxation',
      pages: '15-Page Technical Monograph',
      summary:
        'Methodological analysis of Transactional Net Margin Method (TNMM) and Comparable Uncontrolled Price (CUP) methods for cross-border component sourcing, royalty payments, and management fee apportionments across industrial clusters like Sri City.',
    },
  ];

  return (
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen page-reveal">
      <SEOHead
        title="Knowledge Bank & Statutory Resources | Kavitha & Associates"
        description="Comprehensive statutory knowledge bank: interactive direct and indirect tax calculators, 1-minute compliance briefs, official government filing portals directory, and technical monographs."
        canonicalPath="/knowledge-bank"
        breadcrumbs={breadcrumbs}
      />

      {/* 1. Header Banner in Deep Evergreen */}
      <section className="bg-[#071B14] text-[#F1EBDD] pt-12 sm:pt-16 pb-12 sm:pb-16 border-b border-[#B49A64]/30 relative overflow-hidden texture-architectural-lines">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#AAB4A0]">
            <Link to="/" className="hover:text-[#F1EBDD] transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#B49A64]/40" />
            <span className="text-[#B49A64] font-medium" aria-current="page">
              Knowledge Bank
            </span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#B49A64] bg-[#0B241C] px-3 py-1 rounded-full border border-[#B49A64]/30 uppercase tracking-widest">
                Authoritative Statutory Repository
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#AAB4A0] bg-[#183529] px-2.5 py-0.5 rounded-full border border-[#B49A64]/20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B49A64]" />
                <span>ICAI &amp; ICMAI Dual Practice Governance</span>
              </span>
            </div>

            <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F1EBDD] leading-tight">
              Statutory Workbench &amp; Regulatory Intelligence
            </h1>

            <p className="font-editorial-body text-sm sm:text-base text-[#D8D0BE] leading-relaxed">
              Equipping Indian business promoters, corporate controllers, and CFOs with production-grade computational tools, executive one-minute compliance briefings, curated government filing portals, and in-depth technical monographs.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="pt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { key: 'tools', label: 'Interactive Calculators', icon: <Calculator className="w-4 h-4" /> },
              { key: 'calendar', label: 'Statutory Compliance Calendar', icon: <Calendar className="w-4 h-4" /> },
              { key: 'shorts', label: '1-Minute Chambers Shorts', icon: <Zap className="w-4 h-4" /> },
              { key: 'portals', label: 'Statutory Portals Directory', icon: <Globe className="w-4 h-4" /> },
              { key: 'monographs', label: 'Technical Monographs', icon: <FileText className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] shrink-0 ${
                  activeTab === tab.key
                    ? 'bg-[#B49A64] text-[#071B14] shadow-md border border-[#C5A059]'
                    : 'bg-[#0B241C] text-[#D8D0BE] hover:text-[#F1EBDD] hover:bg-[#183529] border border-[#B49A64]/20'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Content Canvas */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TAB 1: INTERACTIVE CALCULATORS & SCREENERS */}
        {activeTab === 'tools' && (
          <div className="space-y-8">
            <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#D8D0BE] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#7E5E1E] uppercase tracking-wider block">
                  Interactive Computational Workbench
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#183529]">
                  Select Verified Statutory Engine
                </h3>
                <p className="text-xs text-[#525954] mt-0.5">
                  Client-side mathematical models adhering strictly to enacted Indian direct, indirect, corporate, and real estate statutes.
                </p>
              </div>

              {/* Tool Selector Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'tax', label: 'Tax Regime (115BAC)' },
                  { key: 'audit', label: 'Statutory Audit Screener' },
                  { key: 'gst', label: 'GST Late Fee & Interest' },
                  { key: 'cfo', label: 'Virtual CFO Diagnostic' },
                  { key: 'rera', label: 'AP RERA Escrow' },
                  { key: 'roc', label: 'ROC Stamp Duty' },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTool(t.key as ToolKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[38px] ${
                      activeTool === t.key
                        ? 'bg-[#183529] text-[#F1EBDD] border border-[#B49A64]'
                        : 'bg-white text-[#35271F] border border-[#D8D0BE] hover:border-[#B49A64]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Active Tool */}
            <div className="transition-all duration-300">
              {activeTool === 'tax' && <TaxRegimeComparator />}
              {activeTool === 'audit' && <StatutoryAuditScreener />}
              {activeTool === 'gst' && <GSTLateFeeCalculator />}
              {activeTool === 'cfo' && <VirtualCFOReadinessTool />}
              {activeTool === 'rera' && <RERAWithdrawalEstimator />}
              {activeTool === 'roc' && <StartupStampDutyEstimator />}
            </div>
          </div>
        )}

        {/* TAB 2: STATUTORY COMPLIANCE CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <StatutoryComplianceCalendar />
          </div>
        )}

        {/* TAB 2: 1-MINUTE CHAMBERS SHORTS */}
        {activeTab === 'shorts' && (
          <div className="space-y-6">
            <div className="max-w-2xl space-y-1">
              <Badge variant="statutory">CHAMBERS 1-MINUTE BRIEFS</Badge>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
                Executive Regulatory Takeaways
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954]">
                Crisp statutory clarifications formulated by CA Kavitha Vijay to resolve high-frequency compliance dilemmas in 60 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chambersShorts.map((short) => (
                <div
                  key={short.id}
                  className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#D8D0BE] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#B49A64] hover:shadow-card transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-[#7E5E1E] font-mono">
                      <span>{short.category}</span>
                      <span className="flex items-center gap-1 text-[#AAB4A0]">
                        <Clock className="w-3 h-3 text-[#B49A64]" />
                        <span>{short.readTime}</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529] leading-snug">
                      {short.title}
                    </h3>

                    <div className="text-[10px] font-mono text-[#B49A64] bg-[#FFFFFF] px-2.5 py-1 rounded-md border border-[#D8D0BE] inline-block">
                      {short.statute}
                    </div>

                    <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                      {short.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D8D0BE]/60 space-y-2">
                    <div className="flex items-start gap-1.5 text-xs text-[#183529] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                      <span className="text-[11px] font-serif font-bold">{short.keyTakeaway}</span>
                    </div>

                    <Link
                      to="/contact"
                      className="text-xs text-[#7E5E1E] font-semibold hover:text-[#183529] flex items-center gap-1 pt-1 min-h-[36px]"
                    >
                      <span>Inquire with Chambers →</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CURATED STATUTORY FILING PORTALS DIRECTORY */}
        {activeTab === 'portals' && (
          <div className="space-y-8">
            <div className="max-w-2xl space-y-1">
              <Badge variant="statutory">OFFICIAL GOVERNMENT PORTALS DIRECTORY</Badge>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
                Verified Statutory Filing Corridors
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954]">
                Direct hyperlinks to authentic Central and State government compliance portals for Indian corporate, tax, and labor filings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {statutoryPortals.map((group) => (
                <div
                  key={group.category}
                  className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl border border-[#D8D0BE] shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#D8D0BE]">
                    <div className="w-8 h-8 rounded-lg bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0">
                      {group.icon}
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                      {group.category}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {group.portals.map((portal) => (
                      <a
                        key={portal.name}
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3.5 rounded-xl bg-white border border-[#D8D0BE] hover:border-[#B49A64] hover:shadow-xs transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-xs sm:text-sm text-[#183529] group-hover:text-[#7E5E1E]">
                            {portal.name}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#B49A64] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <p className="text-[11px] text-[#525954] mt-1 leading-snug">
                          {portal.desc}
                        </p>
                        <span className="font-mono text-[10px] text-[#AAB4A0] mt-1.5 block">
                          {portal.url.replace('https://', '')}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TECHNICAL MONOGRAPHS */}
        {activeTab === 'monographs' && (
          <div className="space-y-6">
            <div className="max-w-2xl space-y-1">
              <Badge variant="statutory">IN-DEPTH TECHNICAL PUBLICATIONS</Badge>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
                Technical Practice Monographs
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954]">
                Rigorous legal commentary authored by CA Kavitha Vijay analyzing complex statutory enactments, audit standards, and corporate directives.
              </p>
            </div>

            <div className="space-y-4">
              {monographs.map((m) => (
                <div
                  key={m.title}
                  className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl border border-[#D8D0BE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#B49A64] transition-all"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-[#7E5E1E] bg-white px-2.5 py-0.5 rounded-full border border-[#D8D0BE]">
                        {m.category}
                      </span>
                      <span className="text-[11px] text-[#AAB4A0] font-mono">
                        {m.pages}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#183529]">
                      {m.title}
                    </h3>

                    <div className="text-xs font-mono text-[#B49A64]">
                      {m.statute}
                    </div>

                    <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                      {m.summary}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white hover:bg-[#F1EBDD] text-[#183529] text-xs font-semibold border border-[#D8D0BE] transition-colors min-h-[44px] shadow-xs"
                      title="Print or Save PDF Legal Brief"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#B49A64]" />
                      <span>Print / PDF</span>
                    </button>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#183529] hover:bg-[#071B14] text-[#F1EBDD] text-xs font-semibold border border-[#B49A64]/40 transition-colors min-h-[44px]"
                    >
                      <span>Request Monograph Brief</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B49A64]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Bottom Consultation Callout */}
      <section className="bg-[#FAF7F0] border-t border-[#D8D0BE] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#183529]">
              Require Tailored Statutory or Litigation Guidance?
            </h3>
            <p className="text-xs sm:text-sm text-[#525954]">
              Connect directly with our Tirupati chambers desk to schedule an in-person or virtual consultation.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-[#C5A059] via-[#B49A64] to-[#9E844E] text-[#071B14] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-gold-glow transition-all min-h-[44px] shrink-0"
          >
            <span>Initiate Practice Consultation</span>
            <ArrowRight className="w-4 h-4 text-[#071B14]" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeBankPage;
