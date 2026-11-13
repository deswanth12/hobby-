import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Receipt, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Building2, 
  MapPin,
  FileCheck2,
  Clock,
  Scale,
  ChevronRight,
  Home
} from 'lucide-react';
import { FIRM_DATA } from '../../../data/firmData';
import { SEOHead } from '../../../components/SEOHead';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Accordion, AccordionItem } from '../../components/common/Accordion';

export const GSTServicesPage: React.FC = () => {
  const firm = FIRM_DATA;

  const gstStreams = [
    {
      id: 'gst-reg',
      title: 'GST Registration & Amendments',
      statute: 'Sections 22 to 30, CGST & APGST Act, 2017',
      scope: 'New GSTIN registration for manufacturers, traders, e-commerce operators, and service professionals in Tirupati. Core field amendments, additional place of business registration, and composition levy transitions.',
      deliverable: 'GSTIN Certificate (Form REG-06) & Verified Portal Credentials',
      threshold: 'Aggregate turnover > ₹40 Lakhs (Goods) / > ₹20 Lakhs (Services) & Mandatory for Inter-State Trade',
      documents: ['PAN & Aadhaar of Promoter/Directors', 'Tirupati Business Premises Proof (Electricity Bill / Rent Agreement)', 'Bank Account Proof / Cancelled Cheque', 'Partnership Deed / Certificate of Incorporation']
    },
    {
      id: 'periodic-filings',
      title: 'Monthly & Quarterly Return Filing (GSTR-1 & GSTR-3B)',
      statute: 'Sections 37 & 39, CGST Act, 2017',
      scope: 'Invoice-level sales reporting in Form GSTR-1, outward liability computation, Input Tax Credit (ITC) optimization, reverse charge liability (RCM) checks, and timely submission of Form GSTR-3B.',
      deliverable: 'Monthly Tax Computation Sheet, GSTR-1 & GSTR-3B Filing Acknowledgements & Tax Challans',
      threshold: 'All Regular GST Registered Taxpayers in Andhra Pradesh & India',
      documents: ['Sales Register / Outward Invoices', 'Purchase Register with Supplier GSTINs', 'E-Way Bill Reports', 'Bank Account Statements for Tax Challan Reconciliation']
    },
    {
      id: 'annual-return',
      title: 'GST Annual Return & Reconciliation (GSTR-9 & 9C)',
      statute: 'Section 44, CGST Act, 2017 read with Rule 80',
      scope: 'Comprehensive annual consolidation of turnover, taxes paid, ITC availed, reversal under Rules 37, 42 & 43, HSN summaries, and self-certified reconciliation with audited financial statements.',
      deliverable: 'Form GSTR-9 Annual Return & Form GSTR-9C Reconciliation Statement Filings',
      threshold: 'Mandatory GSTR-9 for Turnover > ₹2 Crores; GSTR-9C Reconciliation for Turnover > ₹5 Crores',
      documents: ['Audited Annual Financial Statements (P&L and Balance Sheet)', 'Filed GSTR-1 and GSTR-3B Returns for all 12 Months', 'Annual GSTR-2B ITC Ledger', 'HSN-Wise Summary of Outward and Inward Supplies']
    },
    {
      id: 'itc-reconciliation',
      title: 'Input Tax Credit (ITC) Governance & 2B Matching',
      statute: 'Section 16(2)(aa), CGST Act & Rule 36(4)',
      scope: 'Rigorous line-by-line verification between accounting purchase ledgers and auto-generated GSTR-2B. Identification of defaulting vendors, non-filers, and pre-emptive prevention of ineligible ITC claims.',
      deliverable: 'Monthly Invoice Matching Variance Matrix, Vendor Default List & ITC Optimization Advice',
      threshold: 'Active Businesses Seeking to Eliminate ITC Loss and Avoid Section 50 Interest Penalties',
      documents: ['Purchase Ledger / ERP Dump (Tally, SAP, Zoho Books)', 'Supplier Invoices with Valid Tax Breakup', 'Quarterly GSTR-2B Extracts from GSTN Portal']
    },
    {
      id: 'notice-defense',
      title: 'GST Departmental Notice Handling & Scrutiny Defense',
      statute: 'Sections 61, 73 & 74, CGST & APGST Act, 2017',
      scope: 'Drafting structured factual and statutory replies to departmental intimations: Form ASMT-10 scrutiny notices, DRC-01A preliminary intimations, DRC-01 demand notices, and departmental audit representation.',
      deliverable: 'Formal Written Submissions, Legal Citations, Reconciliation Tables & Departmental Representation',
      threshold: 'Taxpayers Facing Discrepancy Notices, ITC Mismatches, or Departmental Tax Audit Intimations',
      documents: ['Departmental Notice Copy (ASMT-10, DRC-01A, DRC-01)', 'Reconciliation of Discrepancies Point-by-Point', 'Supporting Invoices, Delivery Challans & Bank Statements']
    },
    {
      id: 'refund-advisory',
      title: 'GST Refund Processing & Export Advisory',
      statute: 'Section 54, CGST Act read with Rule 89',
      scope: 'End-to-end refund applications for zero-rated export supplies (with or without payment of tax), inverted duty structure refunds for manufacturing enterprises, and excess balance in Electronic Cash Ledger.',
      deliverable: 'Form RFD-01 Refund Application, CA Certification under Rule 89(2)(m) & Order Sanctions',
      threshold: 'Exporters, SEZ Unit Suppliers, and Manufacturers with Inverted Duty Structures (e.g. Sri City & Renigunta)',
      documents: ['Shipping Bills / Export Invoices & BRC / FIRC', 'Inverted Duty Structure Input vs Output Tax Invoices', 'Bank Account Verification Certificate']
    }
  ];

  const gstFaqItems: AccordionItem[] = [
    {
      id: 'faq-gst-reg',
      title: 'When is GST registration mandatory for a business operating in Tirupati, Andhra Pradesh?',
      statuteReference: 'Section 22 & Section 24, CGST Act, 2017',
      content: (
        <p>
          Under Section 22 of the CGST/APGST Act, GST registration is legally mandatory if your aggregate annual turnover exceeds ₹40 Lakhs for businesses exclusively engaged in the supply of goods, or ₹20 Lakhs for service providers. However, registration is compulsory irrespective of turnover threshold for: (a) anyone making inter-state taxable supplies, (b) e-commerce sellers, (c) casual taxable persons, and (d) persons liable to pay reverse charge (RCM).
        </p>
      )
    },
    {
      id: 'faq-itc-2b',
      title: 'How does CA Kavitha & Associates resolve Input Tax Credit (ITC) mismatches between GSTR-2B and purchase records?',
      statuteReference: 'Section 16(2)(aa) & Rule 36(4), CGST Act, 2017',
      content: (
        <p>
          Under Section 16(2)(aa) of the CGST Act, ITC can strictly be claimed only if the invoice has been uploaded by the supplier and is reflected in your auto-generated GSTR-2B. We execute automated and manual line-by-line reconciliations to identify: (1) suppliers who have not filed GSTR-1, (2) incorrect GSTIN or invoice number entries, (3) timing differences, and (4) ineligible credits under Section 17(5). We provide structured vendor-follow-up lists to recover blocked working capital before return filing deadlines.
        </p>
      )
    },
    {
      id: 'faq-asmt-10',
      title: 'What should a business do upon receiving a Form ASMT-10 or DRC-01A notice from the Andhra Pradesh GST Department?',
      statuteReference: 'Section 61 & Rule 99, APGST Rules, 2017',
      content: (
        <p>
          Form ASMT-10 is a notice pointing out discrepancies under scrutiny of returns (Section 61), while Form DRC-01A is an intimation of tax ascertained before formal demand. You must submit a point-by-point factual reply in Form ASMT-11 within 30 days. We examine the statutory allegations, extract transactional evidence, prepare comprehensive reconciliation statements, and submit verified legal arguments to close the scrutiny without escalation into penalty orders.
        </p>
      )
    },
    {
      id: 'faq-sec-50',
      title: 'How is interest calculated under Section 50 of the CGST Act on delayed return filings?',
      statuteReference: 'Proviso to Section 50(1), CGST Act, 2017 (Finance Act, 2021)',
      content: (
        <p>
          Under the retrospective proviso to Section 50(1), interest at 18% per annum is payable strictly on the net cash liability — that is, the portion of tax discharged by debiting the Electronic Cash Ledger. Zero interest is levied on the portion of tax settled by debiting eligible Input Tax Credit (Electronic Credit Ledger). Furthermore, delay in filing outward Form GSTR-1 does not attract Section 50 interest provided Form GSTR-3B was filed on time.
        </p>
      )
    },
    {
      id: 'faq-composition',
      title: 'Can a composition dealer in Tirupati switch to the regular scheme, and what are the compliance requirements?',
      statuteReference: 'Section 10 & Section 18(1)(c), CGST Act, 2017',
      content: (
        <p>
          Yes. A taxpayer can opt out of the composition scheme voluntarily by filing Form CMP-04, or automatically if turnover exceeds ₹1.5 Crores (or ₹75 Lakhs for service composition) or if the business begins inter-state supply. Upon switching, the taxpayer can claim Input Tax Credit on input stock held on the switch date by filing Form ITC-01 within 30 days, accompanied by a CA certificate if the credit amount exceeds ₹2 Lakhs.
        </p>
      )
    }
  ];

  const gstFaqAnswers: Record<string, string> = {
    'faq-gst-reg': 'Under Section 22 of the CGST/APGST Act, GST registration is legally mandatory if your aggregate annual turnover exceeds ₹40 Lakhs for businesses exclusively engaged in the supply of goods, or ₹20 Lakhs for service providers. However, registration is compulsory irrespective of turnover threshold for inter-state taxable supplies, e-commerce sellers, casual taxable persons, and reverse charge mechanisms.',
    'faq-itc-2b': 'Under Section 16(2)(aa) of the CGST Act, ITC can strictly be claimed only if the invoice has been uploaded by the supplier and is reflected in auto-generated GSTR-2B. We execute automated and manual reconciliations to identify non-compliant suppliers, incorrect GSTIN entries, timing differences, and ineligible credits under Section 17(5).',
    'faq-asmt-10': 'Form ASMT-10 is a notice pointing out discrepancies under return scrutiny (Section 61), while Form DRC-01A is an intimation of tax ascertained prior to demand. We prepare comprehensive factual replies in Form ASMT-11 within 30 days, backed by purchase invoices, bank statements, and reconciliations to close the scrutiny cleanly.',
    'faq-sec-50': 'Under the retrospective proviso to Section 50(1), interest at 18% per annum is payable strictly on the net cash liability discharged via the Electronic Cash Ledger. Zero interest is levied on the portion of tax settled using eligible Input Tax Credit.',
    'faq-composition': 'A taxpayer can opt out of the composition scheme voluntarily by filing Form CMP-04, or automatically if turnover exceeds statutory limits. Taxpayers switching to the regular scheme can claim Input Tax Credit on input stock held on the switch date by filing Form ITC-01.'
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'GST Services in Tirupati', path: '/services/gst-consultant-tirupati' }
  ];

  return (
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen page-reveal">
      <SEOHead
        title="GST Consultant in Tirupati | GST Filing | Kavitha & Associates"
        description="Expert GST consultant in Tirupati: GST registration, monthly GSTR-1/3B filing, GSTR-9/9C annual reconciliation, ITC 2B matching, and departmental scrutiny defense."
        canonicalPath="/services/gst-consultant-tirupati"
        breadcrumbs={breadcrumbs}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'GST Consulting & Return Filing Services in Tirupati',
            serviceType: 'Goods & Services Tax Compliance',
            provider: {
              '@type': 'AccountingService',
              '@id': 'https://kavithaassociates.com/#organization',
              name: 'Kavitha & Associates',
              url: 'https://kavithaassociates.com/',
              telephone: firm.contact.primaryPhone,
            },
            areaServed: ['Tirupati', 'Sri City', 'Renigunta', 'Chittoor', 'Nellore', 'Andhra Pradesh', 'India'],
            description: 'Comprehensive GST advisory, monthly return preparation, annual GSTR-9/9C audits, and departmental representation led by CA Kavitha Vijay.'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: gstFaqItems.map(f => ({
              '@type': 'Question',
              name: f.title,
              acceptedAnswer: {
                '@type': 'Answer',
                text: gstFaqAnswers[f.id] || (typeof f.content === 'string' ? f.content : 'GST advisory grounded in the Central and Andhra Pradesh GST Acts.')
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
            <span className="text-[#B49A64] font-semibold">GST Compliance Practice</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge variant="kicker">PRAC-03 / GST &amp; INDIRECT TAX</Badge>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#B49A64]">
                <Receipt className="w-4 h-4 text-[#B49A64] shrink-0" />
                <span>Indirect Tax Practice • Tirupati Chambers</span>
              </div>
            </div>

            <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F1EBDD] leading-tight">
              Indirect Tax &amp; GST Compliance in Tirupati
            </h1>

            <p className="font-editorial-body text-sm sm:text-base text-[#F1EBDD]/80 leading-relaxed">
              Partner-led Goods and Services Tax advisory, periodic return compliance, Input Tax Credit reconciliation, and departmental scrutiny defense. Supervised directly by CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI) for businesses in Tirupati, Renigunta, and the Rayalaseema commercial corridor.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Statutory Compliance Benchmark Strip */}
      <section className="py-10 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1EBDD] text-[#7E5E1E] font-mono text-[10px] font-semibold border border-[#D8D0BE]">
                  Filing Integrity
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                  Systematic Return Reconciliation
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Zero unverified credits. Every GSTR-3B is mathematically matched against GSTR-2B before portal submission.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                <Scale className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1EBDD] text-[#7E5E1E] font-mono text-[10px] font-semibold border border-[#D8D0BE]">
                  Litigation Shield
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                  Departmental Scrutiny Defense
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Proactive handling of ASMT-10, DRC-01A, and audit summons with structured legal replies backed by judicial precedents.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1EBDD] text-[#7E5E1E] font-mono text-[10px] font-semibold border border-[#D8D0BE]">
                  Calendar Rigor
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                  Penalty Mitigation Cycles
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Scheduled monthly accounting cycles ensuring GSTR-1 by 11th and GSTR-3B by 20th to eliminate interest and late fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 50 Net Cash Interest Plaque & Reconciliation Matrix */}
      <section className="py-12 sm:py-16 bg-[#F1EBDD] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="bg-[#071B14] text-[#F1EBDD] p-8 sm:p-10 rounded-3xl border border-[#B49A64]/40 shadow-xl space-y-6">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#183529] text-[#B49A64] font-mono text-xs font-semibold border border-[#B49A64]/40">
                Statutory Defense Highlight
              </span>
              <span className="font-mono text-xs text-[#AAB4A0] bg-[#0B241C] px-3 py-1 rounded-full border border-white/10">
                Section 50(1) CGST Act (Finance Act, 2021 Retrospective Proviso)
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F1EBDD]">
                Section 50 Interest Rules: Strictly on Net Cash Liability
              </h3>
              <p className="font-editorial-body text-xs sm:text-sm text-[#F1EBDD]/80 leading-relaxed max-w-3xl">
                Taxpayers cannot be charged interest on tax liability discharged using eligible Input Tax Credit (Electronic Credit Ledger). Under the retrospective amendment to Section 50(1), interest at 18% is legally limited to the net cash paid via Electronic Cash Ledger.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#183529]/70 border border-[#B49A64]/20 space-y-1">
                <span className="font-mono text-xs font-bold text-[#B49A64] block">Cash Ledger Portion</span>
                <span className="text-sm font-bold text-white">18% p.a. on Net Cash</span>
                <p className="text-[11px] text-[#AAB4A0]">Calculated only for days delayed past 20th.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#183529]/70 border border-[#B49A64]/20 space-y-1">
                <span className="font-mono text-xs font-bold text-[#B49A64] block">Credit Ledger Portion</span>
                <span className="text-sm font-bold text-emerald-300">0% Interest Applicable</span>
                <p className="text-[11px] text-[#AAB4A0]">Zero interest on tax offset by verified ITC.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#183529]/70 border border-[#B49A64]/20 space-y-1">
                <span className="font-mono text-xs font-bold text-[#B49A64] block">GSTR-1 Outward Delay</span>
                <span className="text-sm font-bold text-white">Zero Interest Liability</span>
                <p className="text-[11px] text-[#AAB4A0]">Late fees only; interest applies only on 3B.</p>
              </div>
            </div>
          </div>

          {/* Statutory 4-Way Reconciliation Matrix Table */}
          <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#D8D0BE] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8D0BE] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#183529]">
                Continuous 4-Way GST Reconciliation Architecture
              </h3>
              <Badge variant="statutory">Rule 36(4) Compliant</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#D8D0BE] text-[#7E5E1E] font-mono">
                    <th className="py-2.5 pr-4">Reconciliation Vector</th>
                    <th className="py-2.5 pr-4">Primary Source</th>
                    <th className="py-2.5 pr-4">Cross-Match Target</th>
                    <th className="py-2.5">Audit Risk Mitigated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D0BE]/60 text-[#35271F]">
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">Outward Supplies Turnover</td>
                    <td className="py-2.5 pr-4">Financial Books (P&amp;L)</td>
                    <td className="py-2.5 pr-4">GSTR-1 Invoices &amp; GSTR-3B Table 3.1</td>
                    <td className="py-2.5 text-[#525954]">Turnover mismatch notices (ASMT-10)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">Input Tax Credit (ITC)</td>
                    <td className="py-2.5 pr-4">Purchase Ledgers &amp; Bills</td>
                    <td className="py-2.5 pr-4">GSTR-2B Static Auto-Drafted Statement</td>
                    <td className="py-2.5 text-[#525954]">Ineligible credit clawbacks under Sec 16(2)(aa)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">Reverse Charge (RCM)</td>
                    <td className="py-2.5 pr-4">Expense Ledgers (Freight, Legal)</td>
                    <td className="py-2.5 pr-4">GSTR-3B Table 3.1(d) &amp; Self-Invoices</td>
                    <td className="py-2.5 text-[#525954]">Section 9(3) interest and penalty demands</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">E-Way Bill vs Invoice</td>
                    <td className="py-2.5 pr-4">E-Way Bill Portal Logins</td>
                    <td className="py-2.5 pr-4">GSTR-1 Table 12 HSN Summary</td>
                    <td className="py-2.5 text-[#525954]">Consignment intercept scrutiny &amp; penalty</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 6 Specialized GST Streams Catalog */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-2">
            <Badge variant="statutory">PRACTICE SPECTRUM • 6 INDIRECT TAX DISCIPLINES</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#183529]">
              Complete GST Services for Tirupati Businesses
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
              From initial registration to complex departmental appellate defense, each engagement is structured according to statutory rules and executed under partner supervision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gstStreams.map((stream) => (
              <div 
                key={stream.id} 
                className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#D8D0BE] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-mono text-[11px] text-[#7E5E1E] bg-[#FAF7F0] px-2.5 py-0.5 rounded-full border border-[#D8D0BE]">
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
                      <strong className="text-[#7E5E1E] font-semibold">Applicability Threshold: </strong>
                      <span className="text-[#525954]">{stream.threshold}</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F0] rounded-xl p-3.5 border border-[#D8D0BE]/80 mt-2">
                    <span className="font-mono text-[10px] text-[#183529] font-bold uppercase tracking-wider block mb-1.5">
                      Required Documents &amp; Preparation:
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
                    <span>Consult on this service</span>
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

      {/* 5. Local Commercial Jurisdiction & SEZ Clusters */}
      <section className="py-12 sm:py-16 bg-[#F1EBDD] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <Badge variant="gold">LOCAL COMMERCIAL EXPERTISE</Badge>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
                Serving Businesses Across Tirupati &amp; Rayalaseema
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                Our practice chambers at Bairagi Patteda provide accessible, direct GST assistance to business entities across all local commercial corridors:
              </p>
              <ul className="space-y-2.5 font-editorial-body text-xs sm:text-sm text-[#35271F]">
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                  <span><strong>Tirupati Retail &amp; Wholesale Hubs:</strong> High-volume trading, reverse charge, and composite billing for retail corridors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                  <span><strong>Renigunta Industrial Cluster &amp; APIIC:</strong> Manufacturing GST, inverted duty structures, and capital goods credit optimization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                  <span><strong>Hospitality, Tourism &amp; Transportation:</strong> E-commerce operator compliance, hotel tariff slabs, and travel booking GST reconciliation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                  <span><strong>Sri City SEZ / DTA Corridors:</strong> Cross-border supply verification, zero-rated exports, and LUT bond filings under Rule 96A.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-5 bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#D8D0BE] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#B49A64] shrink-0" />
                <h3 className="font-serif text-lg font-bold text-[#183529]">
                  Practice Chambers in Tirupati
                </h3>
              </div>
              <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                Located conveniently at Bairagi Patteda, our office is accessible for physical consultation, original invoice verification, and statutory ledger handovers:
              </p>
              <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#D8D0BE] text-xs text-[#35271F] space-y-1">
                <strong className="block text-[#183529]">CA Kavitha &amp; Associates</strong>
                <span>19-12-46, 1st Floor, Near Bairagipetteda Arch,</span>
                <span className="block">Bairagi Patteda, Tirupati – 517501, Andhra Pradesh</span>
                <span className="block text-[#7E5E1E] font-medium pt-1">Landmark: Near Bairagipetteda Arch</span>
              </div>
              <a
                href={firm.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#183529] hover:text-[#071B14] underline min-h-[44px]"
              >
                <span>View on Google Maps (GPS: 13.6192242, 79.418046)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Statutory GST FAQs Accordion */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF7F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="gold">STATUTORY CLARIFICATIONS</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
              Frequently Asked Questions on GST
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954]">
              Legal guidance grounded strictly in the Central &amp; Andhra Pradesh Goods and Services Tax Acts.
            </p>
          </div>

          <Accordion items={gstFaqItems} defaultExpandedId="faq-gst-reg" />
        </div>
      </section>

      {/* 7. Consultation Desk CTA */}
      <section className="py-12 sm:py-16 bg-[#F1EBDD] text-center border-t border-[#D8D0BE]">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <Badge variant="gold">PARTNER-LED INDIRECT TAX COUNSEL</Badge>
          <h2 className="font-editorial-h2 text-2xl sm:text-4xl font-serif font-bold text-[#183529]">
            Resolve Your GST Compliance and ITC Reconciliations
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-xl mx-auto leading-relaxed">
            Eliminate input tax credit leakages, resolve departmental notices, and institute automated invoice matching under the supervision of CA Kavitha Vijay.
          </p>
          <div className="pt-4 flex justify-center gap-4 flex-wrap">
            <Button to="/contact" variant="primary" size="md" dualArrow>
              Schedule GST Consultation
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

export default GSTServicesPage;
