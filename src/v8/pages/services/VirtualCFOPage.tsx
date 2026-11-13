import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Coins,
  BarChart3,
  Award,
  ChevronRight,
  Home
} from 'lucide-react';
import { FIRM_DATA } from '../../../data/firmData';
import { SEOHead } from '../../../components/SEOHead';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Accordion, AccordionItem } from '../../components/common/Accordion';

export const VirtualCFOPage: React.FC = () => {
  const firm = FIRM_DATA;

  const cfoStreams = [
    {
      id: 'bank-cma',
      title: 'Bank Loan CMA Reports & Project Financing',
      statute: 'Tandon & Chore Committee Credit Appraisal Norms',
      scope: 'Comprehensive Credit Monitoring Arrangement (CMA) data preparation for MSME working capital limits (Cash Credit / Overdraft) and Term Loans. Projected balance sheets, operating statements, MPBF (Maximum Permissible Bank Finance) calculations, DSCR ratios, and sensitivity analysis.',
      deliverable: 'Multi-Year Detailed CMA Data Pack, Bank Project Report & CA Certification for Loan Sanctions',
      threshold: 'Growing MSMEs, Manufacturers & Contractors Seeking Working Capital from ₹25 Lakhs to ₹50 Crores',
      documents: ['Audited Financial Statements for past 3 years', 'Provisional Financials for current Financial Year', 'Projected Sales and Expense Estimates for next 3-5 years', 'Sanction Letters of Existing Bank Facilities']
    },
    {
      id: 'cost-governance',
      title: 'Cost Accounting, Unit Costing & Margin Control',
      statute: 'ICMAI Cost Accounting Standards (CAS)',
      scope: 'Led by CA Kavitha Vijay (All India Rank 49 in ICMAI). Identification of operational cost leakage, standard costing, variance analysis, bill of materials (BOM) cost verification, product-wise profitability analysis, and break-even modeling.',
      deliverable: 'Executive Cost Audit Report, Margin Leakage Matrix & Departmental Variance Dashboards',
      threshold: 'Manufacturers, Process Industries, Logistics & Multi-Branch Retailers in Tirupati & Sri City',
      documents: ['Raw Material Purchase Ledgers & Consumption Records', 'Direct Labor Payroll and Overhead Allocation Schedules', 'Production Volume Reports and Scrap Loss Registers', 'Standard Selling Price vs Actual Realization Data']
    },
    {
      id: 'cash-flow',
      title: 'Working Capital & Cash Flow Forecasting',
      statute: 'Cash Management & Liquidity Governance Frameworks',
      scope: 'Rolling 13-week cash flow projections, accounts receivable aging analysis, debtor collection cycle optimization, inventory turnover acceleration, and supplier credit negotiation strategies.',
      deliverable: 'Weekly Rolling Cash Flow Model, Debtor Recovery Scorecard & Liquidity Health Matrix',
      threshold: 'Enterprises Experiencing Rapid Growth, Seasonal Cash Dips, or Lengthening Credit Cycles',
      documents: ['Bank Account Statements and CC Limit Utilization Statements', 'Accounts Receivable (Debtors) Aging Ledger', 'Accounts Payable (Creditors) Maturity Schedule', 'Projected Capital Expenditure and Tax Outflows']
    },
    {
      id: 'internal-controls',
      title: 'Internal Financial Controls (IFC) & SOP Design',
      statute: 'Section 134(5)(e), Companies Act, 2013 & ICAI Guidance',
      scope: 'Designing robust internal controls over financial reporting (ICFR), standard operating procedures (SOPs) for procurement, sales billing, payroll, inventory counts, and dual-authorization approval hierarchies to prevent fraud.',
      deliverable: 'Risk Control Matrix (RCM), Process Flowcharts & Formal Internal Control Policy Manual',
      threshold: 'Private Limited Companies, Expanding Multi-Location Firms & Startups Preparing for Audits',
      documents: ['Existing Organizational Chart & Departmental Workflows', 'Approval Matrices and Delegation of Authority Limits', 'Current Accounting Software Access Logs & Chart of Accounts']
    },
    {
      id: 'mis-reporting',
      title: 'Monthly Executive MIS & Board Reporting',
      statute: 'Management Information Systems Framework',
      scope: 'Designing automated monthly financial dashboards presenting EBITDA, gross margins, debtor days, inventory turns, statutory compliance health, and variance against budget for founders and boards.',
      deliverable: 'Monthly C-Suite Financial Performance Pack & Executive Strategy Presentation',
      threshold: 'Founders, Promoters & Management Teams Seeking Clarity Beyond Raw Tally Balances',
      documents: ['Monthly Trial Balance & General Ledgers', 'Sales and Collections Target Data', 'Departmental Operating Expense Breakups', 'Statutory Payment Acknowledgements (GST, TDS, PF)']
    },
    {
      id: 'accounting-restructuring',
      title: 'Accounting System Design & Cloud ERP Setup',
      statute: 'Indian Accounting Standards (Ind AS / AS)',
      scope: 'Restructuring chaotic charts of accounts in Tally Prime, Zoho Books, QuickBooks, or SAP. Establishing proper ledger classifications, automated bank feeds, cost center allocations, and multi-branch consolidation.',
      deliverable: 'Standardized Chart of Accounts, Clean Ledger Hierarchy & ERP Configuration Dossier',
      threshold: 'Businesses Modernizing from Single-Entry or Disorganized Bookkeeping Systems',
      documents: ['Existing Tally / Accounting Software Backup', 'Branch-Wise Transaction Lists', 'Vendor and Customer Master Databases']
    }
  ];

  const cfoFaqItems: AccordionItem[] = [
    {
      id: 'faq-what-is-vcfo',
      title: 'What is a Virtual CFO, and why is it beneficial for growing businesses in Tirupati?',
      statuteReference: 'Management Accounting & Financial Governance Standards',
      content: (
        <p>
          A Virtual CFO (Chief Financial Officer) provides high-level financial leadership, cash flow planning, cost governance, and strategic advisory on an outsourced, fractional basis. Rather than incurring the heavy cost of a full-time executive (₹25L–₹50L+ annually), growing businesses in Tirupati access senior CA and CMA competence tailored to their exact scale, ensuring enterprise-grade controls, bank loan readiness, and margin improvement.
        </p>
      )
    },
    {
      id: 'faq-cma-benefit',
      title: 'How does CA Kavitha Vijay’s dual CA + CMA background benefit my business?',
      statuteReference: 'Chartered Accountant & ICMAI Merit AIR 49',
      content: (
        <p>
          CA Kavitha Vijay holds dual qualifications as a Chartered Accountant (ICAI) and a Cost &amp; Management Accountant (specifically attributed to ICMAI), securing All India Rank 49 in the CMA examination. While traditional CAs focus primarily on post-facto compliance and tax audits, a Cost Accountant provides forward-looking operational cost accounting: analyzing raw material yield, standard costing variances, break-even thresholds, and unit profitability to measurably improve net margins.
        </p>
      )
    },
    {
      id: 'faq-bank-cma-report',
      title: 'What is a CMA Report for bank loans, and why is it required by banks in Andhra Pradesh?',
      statuteReference: 'Reserve Bank of India (RBI) Lending Norms & Tandon Committee Guidelines',
      content: (
        <p>
          A CMA (Credit Monitoring Arrangement) report is a standardized multi-year financial document mandated by banks (such as SBI, Union Bank, and Canara Bank) to evaluate loan applications for Cash Credit (CC) limits, Overdraft (OD), and Term Loans. It analyzes past, current, and projected operating statements, working capital cycles, current ratios, debt-equity proportions, and Debt Service Coverage Ratios (DSCR) to establish the Maximum Permissible Bank Finance (MPBF).
        </p>
      )
    },
    {
      id: 'faq-fractional-scope',
      title: 'How does a Virtual CFO engagement work on a day-to-day basis?',
      statuteReference: 'Retainer Scope & Service Level Agreement (SLA)',
      content: (
        <p>
          We integrate directly with your accounting team. Your in-house accountants handle daily voucher entry while our team reviews reconciliations weekly, closes monthly MIS by the 5th of every month, monitors cash flow runways, structures advance taxes, and participates in monthly board-level strategy reviews with CA Kavitha Vijay.
        </p>
      )
    }
  ];

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Virtual CFO Services in Tirupati', path: '/services/virtual-cfo-tirupati' }
  ];

  return (
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen page-reveal">
      <SEOHead
        title="Virtual CFO Services in Tirupati | CMA | Kavitha & Associates"
        description="Outsourced Virtual CFO services in Tirupati led by CA Kavitha Vijay (CMA AIR 49 ICMAI). Bank CMA data, monthly MIS, cash flow forecasting & unit-cost modeling."
        canonicalPath="/services/virtual-cfo-tirupati"
        breadcrumbs={breadcrumbs}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Virtual CFO & Strategic Financial Governance in Tirupati',
            serviceType: 'Strategic Business Advisory & Virtual CFO',
            provider: {
              '@type': 'AccountingService',
              '@id': 'https://kavithaassociates.com/#organization',
              name: 'Kavitha & Associates',
              url: 'https://kavithaassociates.com/',
              telephone: firm.contact.primaryPhone,
            },
            areaServed: 'Tirupati, Andhra Pradesh, India',
            description: 'Outsourced financial controllership, bank CMA data syndication, unit cost modeling, and executive MIS advisory led by CA Kavitha Vijay (CMA AIR 49 ICMAI).'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: cfoFaqItems.map(f => ({
              '@type': 'Question',
              name: f.title,
              acceptedAnswer: {
                '@type': 'Answer',
                text: typeof f.content === 'string' ? f.content : 'Management accounting guidance based on professional ICMAI standards.'
              }
            }))
          }
        ]}
      />

      {/* 1. Header Banner */}
      <section className="bg-[#071B14] text-[#F1EBDD] py-12 sm:py-16 md:py-20 border-b border-[#B49A64]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#AAB4A0]">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[#F1EBDD] transition-colors min-h-[44px]">
              <Home className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#B49A64]/50" />
            <Link to="/services" className="hover:text-[#F1EBDD] transition-colors min-h-[44px] inline-flex items-center">
              <span>Services</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#B49A64]/50" />
            <span className="text-[#B49A64] font-semibold">Virtual CFO Practice</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge variant="kicker">PRAC-05 / ADVISORY &amp; VIRTUAL CFO</Badge>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#B49A64]">
                <LineChart className="w-4 h-4 text-[#B49A64] shrink-0" />
                <span>Dual CA + CMA AIR 49 (ICMAI) Leadership</span>
              </div>
            </div>

            <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F1EBDD] leading-tight">
              Strategic Financial Governance &amp; Virtual CFO
            </h1>

            <p className="font-editorial-body text-sm sm:text-base text-[#F1EBDD]/80 leading-relaxed">
              Outsourced financial leadership, bank loan CMA data preparation, unit-cost modeling, and executive decision support for expanding enterprises. Supervised directly by CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI).
            </p>
          </div>
        </div>
      </section>

      {/* 2. Dual CA + CMA Competence Strip */}
      <section className="py-10 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1EBDD] text-[#7E5E1E] font-mono text-[10px] font-semibold border border-[#D8D0BE]">
                  Rank Advantage
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                  CMA All India Rank 49 (ICMAI)
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Nationally ranked cost and management accounting competence delivering actionable insights on unit economics and cost optimization.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                <Coins className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1EBDD] text-[#7E5E1E] font-mono text-[10px] font-semibold border border-[#D8D0BE]">
                  Credit Readiness
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                  Bank Loan CMA Reports
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Bank-compliant CMA data packs, DSCR calculations, and project reports designed to secure working capital and term loan approvals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1EBDD] text-[#7E5E1E] font-mono text-[10px] font-semibold border border-[#D8D0BE]">
                  Executive Clarity
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                  Monthly Financial MIS
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Structured C-suite dashboards transforming raw general ledger balances into clear revenue, margin, and working capital indicators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 6 Mandate Pillars */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#F1EBDD] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-2">
            <Badge variant="statutory">PRACTICE SPECTRUM • 6 MANDATE PILLARS</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#183529]">
              Strategic Financial Governance for Growing Businesses
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
              We bridge statutory compliance with commercial profitability, providing leadership across credit syndication, cost reduction, and internal controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cfoStreams.map((stream) => (
              <div 
                key={stream.id} 
                className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#D8D0BE] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-mono text-[11px] text-[#7E5E1E] bg-[#FFFFFF] px-2.5 py-0.5 rounded-full border border-[#D8D0BE]">
                      {stream.statute}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#183529]">
                    {stream.title}
                  </h3>

                  <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                    {stream.scope}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-[#D8D0BE]/70 text-xs">
                    <div>
                      <strong className="text-[#183529] font-semibold">Deliverable: </strong>
                      <span className="text-[#35271F]">{stream.deliverable}</span>
                    </div>
                    <div>
                      <strong className="text-[#7E5E1E] font-semibold">Target Entity: </strong>
                      <span className="text-[#525954]">{stream.threshold}</span>
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] rounded-xl p-3.5 border border-[#D8D0BE]/80 mt-2">
                    <span className="font-mono text-[10px] text-[#183529] font-bold uppercase tracking-wider block mb-1.5">
                      Required Documents &amp; Inputs:
                    </span>
                    <ul className="space-y-1">
                      {stream.documents.map((doc, dIdx) => (
                        <li key={dIdx} className="text-xs text-[#35271F] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D8D0BE] flex items-center justify-between">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#183529] hover:text-[#071B14] min-h-[44px]"
                  >
                    <span>Engage on this mandate</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B49A64]" />
                  </Link>
                  <a
                    href={`tel:${firm.contact.primaryPhoneClean}`}
                    className="text-xs font-semibold text-[#525954] hover:text-[#183529] flex items-center gap-1 min-h-[44px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#B49A64]" />
                    <span>Call Chambers</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Virtual CFO vs Full-Time CFO Economic Comparison Matrix */}
      <section className="py-12 sm:py-16 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl space-y-2">
            <Badge variant="gold">ECONOMIC &amp; COMPETENCE COMPARISON</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
              Virtual CFO vs. Full-Time CFO
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954]">
              Clear comparative analysis demonstrating why growing enterprises choose the fractional advisory model.
            </p>
          </div>

          <div className="overflow-x-auto bg-[#FFFFFF] rounded-2xl border border-[#D8D0BE] shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D8D0BE] bg-[#FAF7F0] text-[#7E5E1E] font-mono">
                  <th className="p-4">Decision Dimension</th>
                  <th className="p-4 text-[#183529]">CA Kavitha &amp; Associates (Virtual CFO)</th>
                  <th className="p-4">Traditional Full-Time In-House CFO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D0BE]/60 text-[#35271F]">
                <tr>
                  <td className="p-4 font-semibold text-[#183529]">Annual Financial Outlay</td>
                  <td className="p-4 font-bold text-emerald-800">₹4–12 Lakhs / year (Predictable Retainer)</td>
                  <td className="p-4 text-[#525954]">₹30–60+ Lakhs / year + Bonus + Benefits</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#183529]">Technical Competence Depth</td>
                  <td className="p-4 font-bold text-[#183529]">Dual CA + CMA AIR 49 (ICMAI) + Big 4 IPO Experience</td>
                  <td className="p-4 text-[#525954]">Single executive generalist qualification</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#183529]">Multi-Statute Firm Support</td>
                  <td className="p-4 font-bold text-[#183529]">Backed by in-house Audit, Direct Tax, GST &amp; ROC teams</td>
                  <td className="p-4 text-[#525954]">Must still hire external CA firms for statutory filings</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#183529]">Commitment &amp; Flexibility</td>
                  <td className="p-4 font-bold text-[#183529]">Month-to-month or annual scalable retainers</td>
                  <td className="p-4 text-[#525954]">Long-term employment liability and severance risk</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. The 3 Retainer Tiers */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F1EBDD] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-2">
            <Badge variant="gold">STRUCTURED ENGAGEMENT TIERS</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
              Virtual CFO Retainership Tiers
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954]">
              Select the governance tier matched to your operating revenue and financial complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#D8D0BE] shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="font-mono text-xs font-bold text-[#7E5E1E] uppercase tracking-wider block">
                  Tier 01
                </span>
                <h3 className="font-serif text-xl font-bold text-[#183529]">
                  Emerging Startup Retainer
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Tailored for funded ventures and early-stage companies requiring clean accounting architecture, monthly budget tracking, and statutory compliance oversight.
                </p>
                <ul className="space-y-2 text-xs text-[#35271F] pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                    <span>Monthly Chart of Accounts Review</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                    <span>Monthly Executive MIS Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                    <span>Quarterly Advance Tax Projections</span>
                  </li>
                </ul>
              </div>
              <Button to="/contact" variant="outline" size="sm" className="w-full">
                Discuss Startup Scope
              </Button>
            </div>

            <div className="bg-[#071B14] text-[#F1EBDD] p-6 sm:p-8 rounded-2xl border border-[#B49A64]/40 shadow-xl space-y-5 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#B49A64] uppercase tracking-wider block">
                    Tier 02 • Recommended
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#183529] text-[#B49A64] border border-[#B49A64]/30">
                    Most Selected
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#F1EBDD]">
                  MSME Growth Retainer
                </h3>
                <p className="font-editorial-body text-xs text-[#F1EBDD]/80 leading-relaxed">
                  Designed for established manufacturing, retail, and trading enterprises with revenues between ₹5 Cr and ₹50 Cr seeking working capital maximization and margin control.
                </p>
                <ul className="space-y-2 text-xs text-[#F1EBDD]/90 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                    <span>Bank CMA Data &amp; Credit Syndication</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                    <span>Weekly 13-Week Cash Flow Models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                    <span>Unit Costing &amp; Margin Leakage Audits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                    <span>GST &amp; TDS Multi-Branch Oversight</span>
                  </li>
                </ul>
              </div>
              <Button to="/contact" variant="primary" size="sm" className="w-full">
                Discuss Growth Retainer
              </Button>
            </div>

            <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#D8D0BE] shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="font-mono text-xs font-bold text-[#7E5E1E] uppercase tracking-wider block">
                  Tier 03
                </span>
                <h3 className="font-serif text-xl font-bold text-[#183529]">
                  Enterprise Governance
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Comprehensive controllership for mid-market corporate groups, real estate developers, and institutions preparing for private equity or major expansions.
                </p>
                <ul className="space-y-2 text-xs text-[#35271F] pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                    <span>Full Board Advisory &amp; Investor Packs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                    <span>Internal Financial Controls (IFC) Setup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                    <span>Multi-Entity Consolidation &amp; M&amp;A Scoping</span>
                  </li>
                </ul>
              </div>
              <Button to="/contact" variant="outline" size="sm" className="w-full">
                Discuss Enterprise Scope
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Virtual CFO Statutory FAQs Accordion */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF7F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="gold">STRATEGIC CLARIFICATIONS</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
              Frequently Asked Questions on Virtual CFO
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954]">
              Management accounting guidance based on professional ICMAI standards.
            </p>
          </div>

          <Accordion items={cfoFaqItems} defaultExpandedId="faq-what-is-vcfo" />
        </div>
      </section>

      {/* 7. Consultation Desk CTA */}
      <section className="py-12 sm:py-16 bg-[#F1EBDD] text-center border-t border-[#D8D0BE]">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <Badge variant="gold">C-SUITE FINANCIAL ADVISORY</Badge>
          <h2 className="font-editorial-h2 text-2xl sm:text-4xl font-serif font-bold text-[#183529]">
            Strengthen Financial Controls &amp; Working Capital
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-xl mx-auto leading-relaxed">
            Partner with CA Kavitha Vijay to prepare bank loan CMA reports, streamline accounting systems, and gain visibility over business margins.
          </p>
          <div className="pt-4 flex justify-center gap-4 flex-wrap">
            <Button to="/contact" variant="primary" size="md" dualArrow>
              Schedule CFO Discovery Meeting
            </Button>
            <Button href={`tel:${firm.contact.primaryPhoneClean}`} variant="outline" size="md" leftIcon={<Phone className="w-4 h-4 text-[#B49A64]" />}>
              Call Senior Partner
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VirtualCFOPage;
