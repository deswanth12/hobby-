import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Building2, 
  ChevronDown,
  Award,
  MapPin,
  Coins,
  BarChart3
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const VirtualCFOPage: React.FC = () => {
  const { data } = useFirmData();
  const firm = data || FIRM_DATA;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
      scope: 'Led by CA Kavitha Vijay (All India Rank 49 in CMA Intermediate). Identification of operational cost leakage, standard costing, variance analysis, bill of materials (BOM) cost verification, product-wise profitability analysis, and break-even modeling.',
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

  const cfoFaqs = [
    {
      q: 'What is a Virtual CFO, and why is it beneficial for growing businesses in Tirupati?',
      a: 'A Virtual CFO (Chief Financial Officer) provides high-level financial leadership, cash flow planning, cost governance, and strategic advisory on an outsourced, fractional basis. Rather than incurring the heavy cost of a full-time executive (₹25L–₹50L+ annually), growing businesses in Tirupati access senior CA and CMA competence tailored to their exact scale, ensuring enterprise-grade controls, bank loan readiness, and margin improvement.',
      ref: 'Management Accounting & Financial Governance Standards'
    },
    {
      q: 'How does CA Kavitha Vijay’s dual CA + CMA background benefit my business?',
      a: 'CA Kavitha Vijay holds dual qualifications as a Chartered Accountant (ICAI) and a Cost & Management Accountant (ICMAI), securing All India Rank 49 in the CMA Intermediate examination. While traditional CAs focus primarily on post-facto compliance and tax audits, a Cost Accountant provides forward-looking operational cost accounting: analyzing raw material yield, standard costing variances, break-even thresholds, and unit profitability to measurably improve net margins.',
      ref: 'Chartered Accountant & ICMAI Merit AIR 49'
    },
    {
      q: 'What is a CMA Report for bank loans, and why is it required by banks in Andhra Pradesh?',
      a: 'A CMA (Credit Monitoring Arrangement) report is a standardized multi-year financial document mandated by banks (such as SBI, Union Bank, and Canara Bank) to evaluate loan applications for Cash Credit (CC) limits, Overdraft (OD), and Term Loans. It analyzes past, current, and projected operating statements, working capital cycles, current ratios, debt-equity proportions, and Debt Service Coverage Ratios (DSCR) to establish the Maximum Permissible Bank Finance (MPBF).',
      ref: 'Reserve Bank of India (RBI) Lending Norms & Tandon Committee Guidelines'
    },
    {
      q: 'Can CA Kavitha & Associates assist in restructuring disorganized accounting ledgers?',
      a: 'Yes. Disorganized bookkeeping is the primary cause of GST mismatches, delayed tax filings, and rejected loan applications. We review your existing Tally or ERP chart of accounts, eliminate duplicate ledgers, properly segregate revenue and capital expenses, configure statutory GST and TDS tax rates, and train your in-house staff on daily voucher verification.',
      ref: 'ICAI Accounting Standards (AS) & General Ledger Governance'
    }
  ];

  return (
    <div className="bg-brand-ivory page-reveal text-brand-charcoal min-h-screen">
      <SEOHead
        title="Virtual CFO Services in Tirupati | CMA | Kavitha & Associates"
        description="Strategic Virtual CFO services in Tirupati. CA Kavitha & Associates provides bank loan CMA data, cost governance, cash flow forecasting & accounting advisory."
        canonicalPath="/services/virtual-cfo-tirupati"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Virtual CFO Services in Tirupati', path: '/services/virtual-cfo-tirupati' }
        ]}
        jsonLd={[
          {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Virtual CFO & Strategic Financial Advisory in Tirupati',
          serviceType: 'Outsourced CFO and Cost Management Advisory',
          provider: {
            '@type': 'AccountingService',
            '@id': 'https://kavithaassociates.com/#organization',
            name: 'Kavitha & Associates',
            url: 'https://kavithaassociates.com/',
            telephone: '+919626350900',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda',
              addressLocality: 'Tirupati',
              addressRegion: 'Andhra Pradesh',
              postalCode: '517501',
              addressCountry: 'IN'
            }
          },
          areaServed: 'Tirupati, Andhra Pradesh, India',
          description: 'Strategic outsourced CFO leadership, bank loan CMA reports, and cost governance led by CA Kavitha Vijay (B.Com, CA, CMA AIR 49).'
        },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: cfoFaqs.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.a
              }
            }))
          }
        ]}
      />

      {/* =========================================================================
          1. HEADER BANNER
          ========================================================================= */}
      <section className="bg-brand-deep text-white py-20 sm:py-24 lg:py-28 border-b border-brand-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-forest text-brand-gold font-editorial-meta mb-4 border border-brand-gold/40 shadow-inner">
              <LineChart className="w-4 h-4 text-brand-gold shrink-0" />
              <span>CFO &amp; Cost Advisory • Dual CA + CMA Competence</span>
            </div>
            <h1 className="font-editorial-h1 text-white">
              Virtual CFO Services in Tirupati
            </h1>
            <p className="mt-4 font-editorial-body text-emerald-100/90 leading-relaxed text-base sm:text-lg">
              Outsourced financial leadership, bank loan CMA project reports, cash flow forecasting, and operational cost governance. Directly supervised by CA Kavitha Vijay (B.Com, CA, CMA All India Rank 49, ex-Deloitte &amp; Ford auditor) for ambitious enterprises in Tirupati and Rayalaseema.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-brand-deep font-editorial-meta text-xs font-semibold hover:bg-brand-gold/90 transition-colors btn-tactile shadow-md"
              >
                <span>Engage Virtual CFO Advisory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/919626350900?text=${encodeURIComponent('Hello CA Kavitha Vijay, I would like to discuss Virtual CFO and CMA services for my business.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-forest/60 text-white font-editorial-meta text-xs hover:bg-brand-forest border border-brand-gold/40 transition-colors btn-tactile"
              >
                <span>WhatsApp CFO Inquiry</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE CA + CMA DUAL COMPETENCE STRIP
          ========================================================================= */}
      <section className="py-12 bg-brand-surface border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-stagger">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <Award className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Rank Advantage</span>
                <h3 className="font-editorial-h3 text-base font-bold text-brand-forest">
                  CMA All India Rank 49
                </h3>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Nationally ranked cost and management accounting competence delivering actionable insights on unit economics and cost optimization.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <Coins className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Credit Readiness</span>
                <h3 className="font-editorial-h3 text-base font-bold text-brand-forest">
                  Bank Loan CMA Reports
                </h3>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Bank-compliant CMA data packs, DSCR calculations, and project reports designed to secure working capital and term loan approvals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <BarChart3 className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Executive Clarity</span>
                <h3 className="font-editorial-h3 text-base font-bold text-brand-forest">
                  Monthly Financial MIS
                </h3>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Structured C-suite dashboards transforming raw general ledger balances into clear revenue, margin, and working capital indicators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CFO SERVICE MATRIX (6 STREAMS)
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Practice Spectrum
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
              Strategic Financial Governance for Growing Businesses
            </h2>
            <p className="font-editorial-body text-sm text-brand-muted mt-2 leading-relaxed">
              We bridge statutory compliance with commercial profitability, providing leadership across credit syndication, cost reduction, and internal controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-stagger">
            {cfoStreams.map((stream) => (
              <div 
                key={stream.id}
                className="bg-brand-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-card card-tactile flex flex-col justify-between scroll-reveal"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-brand-border pb-3">
                    <span className="font-editorial-meta text-brand-forest bg-brand-forest/10 px-3 py-1 rounded-full text-xs font-semibold">
                      {stream.statute}
                    </span>
                  </div>

                  <h3 className="font-editorial-h3 text-xl font-bold text-brand-primary">
                    {stream.title}
                  </h3>

                  <p className="font-editorial-body text-xs sm:text-sm text-charcoal leading-relaxed">
                    {stream.scope}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-brand-border/60">
                    <div className="text-xs">
                      <strong className="text-brand-forest font-semibold">Deliverable: </strong>
                      <span className="text-brand-charcoal">{stream.deliverable}</span>
                    </div>
                    <div className="text-xs">
                      <strong className="text-brand-gold font-semibold">Target Entity: </strong>
                      <span className="text-brand-muted">{stream.threshold}</span>
                    </div>
                  </div>

                  <div className="bg-brand-surface rounded-xl p-3.5 border border-brand-border/70 mt-3">
                    <span className="font-editorial-meta text-[11px] text-brand-forest font-bold block mb-1.5">
                      Required Documents & Inputs:
                    </span>
                    <ul className="space-y-1">
                      {stream.documents.map((doc, dIdx) => (
                        <li key={dIdx} className="text-[11px] text-brand-charcoal flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-brand-gold shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-forest hover:text-brand-deep group"
                  >
                    <span>Engage on this mandate</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href={`tel:${firm.contact.primaryPhoneClean}`}
                    className="text-xs font-semibold text-brand-muted hover:text-brand-forest flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-brand-gold" />
                    <span>{firm.contact.primaryPhone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. LOCAL RELEVANCE & MSME FINANCING
          ========================================================================= */}
      <section className="py-16 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 scroll-reveal-left">
              <span className="font-editorial-meta text-brand-gold block">
                Local Enterprise Leadership
              </span>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
                Financial Architecture for Tirupati Enterprises
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                We work alongside promoters and leadership teams across Tirupati and surrounding industrial hubs to establish financial discipline:
              </p>
              <ul className="space-y-2.5 font-editorial-body text-xs sm:text-sm text-brand-charcoal">
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Bank Credit Syndication in Tirupati</strong>: Structuring loan applications for nationalized and private banks across Tirupati (SBI, Canara Bank, Union Bank, APGB).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Sri City & Renigunta Manufacturing Units</strong>: Cost governance, inventory holding cost minimization, and bill of materials variance auditing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Expanding Healthcare & Hospitality Groups</strong>: Cash flow planning, capital expenditure evaluation, and branch profitability benchmarking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Startups & Tech Ventures</strong>: Financial model preparation, burn-rate monitoring, and investor-ready reporting packs.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6 bg-brand-white p-7 sm:p-9 rounded-2xl border border-brand-border shadow-card scroll-reveal-right">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0" />
                <h3 className="font-editorial-h3 text-lg font-bold text-brand-forest">
                  Practice Chambers in Tirupati
                </h3>
              </div>
              <p className="font-editorial-body text-xs text-brand-muted leading-relaxed mb-4">
                Schedule a confidential review of your financials, bank loan eligibility, or cost structure with CA Kavitha Vijay:
              </p>
              <div className="bg-brand-surface p-4 rounded-xl border border-brand-border/70 text-xs text-brand-charcoal space-y-1 mb-5">
                <strong className="block text-brand-forest">CA Kavitha & Associates</strong>
                <span>19-12-46, 1st Floor, Near Bairagipetteda Arch,</span>
                <span className="block">Bairagi Patteda, Tirupati – 517501, Andhra Pradesh</span>
                <span className="block text-brand-gold font-medium pt-1">Direct Partner Advisory</span>
              </div>
              <a
                href={firm.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-forest hover:text-brand-deep underline"
              >
                <span>Google Maps Location (13.6192242, 79.418046)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CFO & CMA FAQS
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Strategic Clarifications
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
              Frequently Asked Questions on Virtual CFO & CMA Services
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-brand-muted mt-2">
              Management accounting guidance based on professional ICMAI standards.
            </p>
          </div>

          <div className="space-y-4">
            {cfoFaqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-brand-white rounded-xl border border-brand-border overflow-hidden shadow-subtle scroll-reveal"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-editorial-h3 text-sm sm:text-base font-bold text-brand-primary hover:text-brand-deep transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-brand-gold shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-5 pb-5 pt-1 border-t border-brand-border/60 bg-brand-surface/40 space-y-3 ${openFaq === idx ? 'block' : 'hidden'}`}>
                    <p className="font-editorial-body text-xs sm:text-sm text-brand-charcoal leading-relaxed">
                      {faq.a}
                    </p>
                    <span className="inline-block text-[11px] font-editorial-meta text-brand-forest bg-brand-forest/10 px-2.5 py-1 rounded border border-brand-forest/20">
                      Professional Basis: {faq.ref}
                    </span>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. INTAKE BANNER
          ========================================================================= */}
      <section className="py-16 bg-brand-deep text-white border-t border-brand-gold/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 scroll-reveal">
          <span className="font-editorial-meta text-brand-gold text-xs uppercase tracking-wider block">
            C-Suite Financial Advisory
          </span>
          <h2 className="font-editorial-h2 text-2xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
            Strengthen Financial Controls & Working Capital
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            Partner with CA Kavitha Vijay to prepare bank loan CMA reports, streamline accounting systems, and gain visibility over business margins.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-brand-gold text-brand-deep font-editorial-meta text-xs font-semibold hover:bg-brand-gold/90 transition-colors btn-tactile shadow-md"
            >
              <span>Schedule CFO Discovery Meeting</span>
            </Link>
            <a
              href={`tel:${firm.contact.primaryPhoneClean}`}
              className="px-6 py-3 rounded-full bg-brand-forest text-white font-editorial-meta text-xs hover:bg-brand-forest/80 border border-brand-gold/40 transition-colors btn-tactile flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
              <span>Call +91 96263 50900</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
export default VirtualCFOPage;
