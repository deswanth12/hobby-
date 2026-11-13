import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Building2, 
  MapPin,
  Calendar,
  ChevronRight,
  Home
} from 'lucide-react';
import { FIRM_DATA } from '../../../data/firmData';
import { SEOHead } from '../../../components/SEOHead';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Accordion, AccordionItem } from '../../components/common/Accordion';

export const IncomeTaxPage: React.FC = () => {
  const firm = FIRM_DATA;

  const taxStreams = [
    {
      id: 'itr-filing',
      title: 'Individual & Business ITR Filing (ITR-1 to ITR-7)',
      statute: 'Section 139(1), Income Tax Act, 1961',
      scope: 'Annual tax return preparation and filing for salaried employees, high-net-worth individuals, business partnerships, LLPs, companies, and trusts. Triangulation across AIS, TIS, and Form 26AS to prevent processing defects.',
      deliverable: 'Computation of Total Income, Tax Computation Ledger & ITR-V Filing Acknowledgement',
      threshold: 'Mandatory for all entities with taxable income above basic exemption or holding foreign assets',
      documents: ['Form 16 / 16A (TDS Certificates)', 'Annual Information Statement (AIS) & Form 26AS', 'Bank Account Statements for all accounts held', 'Capital Gain Statements from Brokers / Mutual Funds']
    },
    {
      id: 'corporate-tax',
      title: 'Corporate Tax Advisory & Section 115BAA Evaluation',
      statute: 'Sections 115BAA, 115JB & Section 80-IAC, Income Tax Act',
      scope: 'Evaluation between the concessional 22% corporate tax regime (effective 25.168% with surcharge/cess) vs. normal 25%/30% rates with MAT credit set-off. Strategic advance tax forecasting and corporate dividend planning.',
      deliverable: 'Corporate Tax Regime Comparison Model, Form 10-IC Filing & Advance Tax Schedules',
      threshold: 'Domestic Private Limited & Public Companies Operating in Tirupati & Pan India',
      documents: ['Audited Profit & Loss Statement & Balance Sheet', 'Depreciation Schedule under Income Tax Rules', 'Brought-Forward Loss and MAT Credit Ledger', 'Form 10-IC Election Records']
    },
    {
      id: 'tax-audit',
      title: 'Tax Audit & Statutory Form 3CD Certification',
      statute: 'Section 44AB, Income Tax Act, 1961',
      scope: 'Rigorous examination of financial accounts, verification of allowable business deductions, 3CD reporting clauses, reconciliation of GST turnover with ITR turnover, and partner-certified audit report issuance.',
      deliverable: 'Form 3CA/3CB Audit Report & Comprehensive Form 3CD Annexures Uploaded with CA UDIN',
      threshold: 'Business turnover > ₹1 Crore (or > ₹10 Crores if cash transactions <= 5%) & Professionals > ₹50L/₹75L',
      documents: ['Trial Balance, General Ledgers & Journal Vouchers', 'Bank Statements & Cash Book Reconciliations', 'Fixed Asset Register with Physical Invoices', 'GST Annual Turnover Reconciliation']
    },
    {
      id: 'capital-gains',
      title: 'Capital Gains Structuring (Real Estate & Shares)',
      statute: 'Sections 45 to 54EC & Section 112A, Income Tax Act',
      scope: 'Specialized capital gains planning for landowners, real estate developers, and property sellers in Tirupati. Optimization of exemptions under Section 54, 54EC (Capital Gains Bonds), 54F, and Joint Development Agreement (JDA) tax under 45(5A).',
      deliverable: 'Indexed Cost of Acquisition Calculation, Capital Gains Tax Worksheet & Reinvestment Schedule',
      threshold: 'Property Sellers, Inherited Asset Liquidation, and High-Value Stock Investors',
      documents: ['Registered Sale Deed & Original Purchase Deed', 'Improvement / Construction Expense Invoices', 'Bank Statements Reflecting Sale Considerations', '54EC Capital Gain Bond / Capital Gain Account Scheme Proof']
    },
    {
      id: 'scrutiny-defense',
      title: 'Scrutiny Defense & Faceless Appeals (CIT Appeals)',
      statute: 'Sections 143(3), 147, 148 & Section 246A, Income Tax Act',
      scope: 'Drafting factual, evidentiary, and statutory submissions in response to notices issued under Section 143(2) (Complete Scrutiny) and Section 148 (Reassessment). Representation before the National Faceless Appeal Centre (NFAC).',
      deliverable: 'Written Submissions with Legal Authorities, Triangulated Financial Schedules & Appellate Briefs',
      threshold: 'Taxpayers Facing Tax Scrutiny Notices, Penalty Proceedings under 271AAC, or Additions',
      documents: ['Copy of Notice under Section 143(2) or 148', 'Assessment Year Return & Computation Copy', 'Documentary Evidence substantiating specific query items', 'Previous Assessment Orders if applicable']
    },
    {
      id: 'tds-compliance',
      title: 'TDS & TCS Returns & Compliance Management',
      statute: 'Sections 192 to 206C, Income Tax Act, 1961',
      scope: 'Quarterly withholding tax computations, TRACES reconciliation, Section 194Q & 206C(1H) high-value sales compliance, Form 24Q (Salaries), Form 26Q (Non-Salaries), Form 27Q (Non-Residents), and Form 16 issuance.',
      deliverable: 'Quarterly TDS Filing Receipts, Form 16/16A Downloads & TRACES Default Rectifications',
      threshold: 'All Entities Deducting or Collecting Tax at Source (Proprietors under 44AB, LLPs, Companies)',
      documents: ['Monthly TDS Deductions & Payment Challans', 'Vendor Details with PAN Validation', 'Salary Sheets with Chapter VI-A Deductions', 'TRACES Default / Justification Reports']
    }
  ];

  const taxFaqItems: AccordionItem[] = [
    {
      id: 'faq-44ab',
      title: 'When does a business or professional in Tirupati require a mandatory Tax Audit under Section 44AB?',
      statuteReference: 'Section 44AB & Section 44ADA, Income Tax Act, 1961',
      content: (
        <p>
          Under Section 44AB of the Income Tax Act, a Tax Audit by an independent practicing Chartered Accountant is mandatory if: (1) business turnover exceeds ₹1 Crore (or ₹10 Crores where aggregate cash receipts and payments do not exceed 5% of total turnover); (2) professional gross receipts exceed ₹50 Lakhs (or ₹75 Lakhs under presumptive Section 44ADA if cash receipts are &le; 5%); or (3) a taxpayer opts out of presumptive taxation while earning income above the basic exemption threshold.
        </p>
      )
    },
    {
      id: 'faq-54-54ec',
      title: 'How should property sellers in Tirupati plan capital gains on real estate under Section 54 and Section 54EC?',
      statuteReference: 'Section 54, Section 54EC & Section 54F, Income Tax Act, 1961',
      content: (
        <p>
          Long-term capital gains arising from the sale of residential property can be exempted under Section 54 by purchasing another residential property within 1 year before or 2 years after the transfer (or constructing within 3 years). Alternatively, under Section 54EC, gains up to ₹50 Lakhs can be invested in specified infrastructure bonds (REC, NHAI, PFC, IRFC) within 6 months from the date of transfer. If funds are not reinvested prior to the ITR filing due date, they must be deposited into a Capital Gains Account Scheme (CGAS) with an authorized bank in Tirupati.
        </p>
      )
    },
    {
      id: 'faq-115baa',
      title: 'What are the key advantages of Section 115BAA for corporate entities in Andhra Pradesh?',
      statuteReference: 'Section 115BAA & Section 115JB, Income Tax Act, 1961',
      content: (
        <p>
          Section 115BAA offers domestic companies a reduced base corporate tax rate of 22% (effective tax rate of 25.168% inclusive of 10% surcharge and 4% cess) compared to the standard 30% slab. Crucially, companies electing Section 115BAA are completely exempt from Minimum Alternate Tax (MAT under Section 115JB). However, brought-forward MAT credits cannot be set off and certain deductions (like accelerated depreciation or Section 80-IA) must be foregone. We prepare comparative models before submitting irrevocable Form 10-IC.
        </p>
      )
    },
    {
      id: 'faq-faceless-scrutiny',
      title: 'How does CA Kavitha & Associates handle Faceless Scrutiny notices issued under Section 143(2)?',
      statuteReference: 'Section 144B (Faceless Assessment), Income Tax Act, 1961',
      content: (
        <p>
          Faceless scrutiny requires strictly electronic, document-backed responses with zero physical hearings. We analyze the specific questionnaire issued by the Assessment Unit, cross-reference transactions against bank statements, purchase bills, and TDS credits, draft legal arguments citing relevant High Court and Supreme Court precedents, and upload structured PDF annexures via the e-Filing portal well within statutory response deadlines.
        </p>
      )
    },
    {
      id: 'faq-87a-rebate',
      title: 'How does the Section 87A rebate apply under the new concessional tax regime vs old regime?',
      statuteReference: 'Section 87A, Income Tax Act, 1961',
      content: (
        <p>
          Under the new tax regime (Section 115BAC), resident individuals with total taxable income up to ₹7,00,000 are eligible for a complete tax rebate up to ₹25,000, resulting in zero tax liability. In contrast, under the old tax regime, the Section 87A rebate is capped at ₹12,500 for total income up to ₹5,00,000. Marginal relief is also provided where income marginally exceeds ₹7,00,000.
        </p>
      )
    }
  ];

  const taxFaqAnswers: Record<string, string> = {
    'faq-44ab': 'Under Section 44AB of the Income Tax Act, a Tax Audit by an independent practicing Chartered Accountant is mandatory if: (1) business turnover exceeds ₹1 Crore (or ₹10 Crores where aggregate cash receipts and payments do not exceed 5% of total turnover); (2) professional gross receipts exceed ₹50 Lakhs (or ₹75 Lakhs under presumptive Section 44ADA if cash receipts are <= 5%); or (3) a taxpayer opts out of presumptive taxation while earning income above the basic exemption threshold.',
    'faq-54-54ec': 'Long-term capital gains arising from the sale of residential property can be exempted under Section 54 by purchasing another residential property within 1 year before or 2 years after the transfer (or constructing within 3 years). Alternatively, under Section 54EC, gains up to ₹50 Lakhs can be invested in specified infrastructure bonds (REC, NHAI, PFC, IRFC) within 6 months from the date of transfer. If funds are not reinvested prior to the ITR filing due date, they must be deposited into a Capital Gains Account Scheme (CGAS) with an authorized bank in Tirupati.',
    'faq-115baa': 'Section 115BAA offers domestic companies a reduced base corporate tax rate of 22% (effective tax rate of 25.168% inclusive of 10% surcharge and 4% cess) compared to the standard 30% slab. Crucially, companies electing Section 115BAA are completely exempt from Minimum Alternate Tax (MAT under Section 115JB). However, brought-forward MAT credits cannot be set off and certain deductions (like accelerated depreciation or Section 80-IA) must be foregone. We prepare comparative models before submitting irrevocable Form 10-IC.',
    'faq-faceless-scrutiny': 'Faceless scrutiny requires strictly electronic, document-backed responses with zero physical hearings. We analyze the specific questionnaire issued by the Assessment Unit, cross-reference transactions against bank statements, purchase bills, and TDS credits, draft legal arguments citing relevant High Court and Supreme Court precedents, and upload structured PDF annexures via the e-Filing portal well within statutory response deadlines.',
    'faq-87a-rebate': 'Under the new tax regime (Section 115BAC), resident individuals with total taxable income up to ₹7,00,000 are eligible for a complete tax rebate up to ₹25,000, resulting in zero tax liability. In contrast, under the old tax regime, the Section 87A rebate is capped at ₹12,500 for total income up to ₹5,00,000. Marginal relief is also provided where income marginally exceeds ₹7,00,000.'
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Income Tax Services in Tirupati', path: '/services/income-tax-consultant-tirupati' }
  ];

  return (
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen page-reveal">
      <SEOHead
        title="Income Tax Consultant in Tirupati | ITR | Kavitha & Associates"
        description="Direct tax consultant in Tirupati: ITR filing, corporate tax under Sec 115BAA, tax audits under Sec 44AB, capital gains under Sec 54/54EC, scrutiny defense & appeals."
        canonicalPath="/services/income-tax-consultant-tirupati"
        breadcrumbs={breadcrumbs}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Income Tax Consulting & Return Filing in Tirupati',
            serviceType: 'Direct Tax Compliance and Planning',
            provider: {
              '@type': 'AccountingService',
              '@id': 'https://kavithaassociates.com/#organization',
              name: 'Kavitha & Associates',
              url: 'https://kavithaassociates.com/',
              telephone: firm.contact.primaryPhone,
            },
            areaServed: ['Tirupati', 'Sri City', 'Renigunta', 'Chittoor', 'Nellore', 'Andhra Pradesh', 'India'],
            description: 'Comprehensive direct tax services, Section 44AB tax audits, Section 115BAA corporate planning, and faceless scrutiny defense supervised by CA Kavitha Vijay.'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: taxFaqItems.map(f => ({
              '@type': 'Question',
              name: f.title,
              acceptedAnswer: {
                '@type': 'Answer',
                text: taxFaqAnswers[f.id] || (typeof f.content === 'string' ? f.content : 'Direct tax guidance governed by the Income Tax Act, 1961.')
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
            <span className="text-[#B49A64] font-semibold">Income Tax Practice</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge variant="kicker">PRAC-02 / DIRECT TAXATION</Badge>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#B49A64]">
                <FileSpreadsheet className="w-4 h-4 text-[#B49A64] shrink-0" />
                <span>Direct Tax Practice • Tirupati Chambers</span>
              </div>
            </div>

            <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F1EBDD] leading-tight">
              Direct Tax Advisory &amp; Scrutiny Defense in Tirupati
            </h1>

            <p className="font-editorial-body text-sm sm:text-base text-[#F1EBDD]/80 leading-relaxed">
              Strategic direct tax planning, corporate return filing, Section 44AB tax audits, and faceless scrutiny representation. Directly supervised by CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI, ex-Deloitte Big 4 auditor) from our practice chambers at Bairagi Patteda, Tirupati.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Direct Tax Compliance Calendar Strip */}
      <section className="py-8 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-[#B49A64]" />
            <h2 className="font-serif text-lg font-bold text-[#183529]">
              Annual Direct Tax Statutory Calendar
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { date: '15 June / 15 Sept / 15 Dec / 15 Mar', label: 'Advance Tax Installments', desc: '15%, 45%, 75% and 100% of estimated tax liability under Sec 208/211.' },
              { date: '31 July', label: 'Non-Audit ITR Due Date', desc: 'Salaried individuals, HUFs, and non-audit business entities (Sec 139(1)).' },
              { date: '30 September / 31 October', label: 'Tax Audit & Corporate ITR', desc: 'Form 3CD tax audit report by 30 Sept; corporate ITR by 31 Oct.' },
              { date: 'Quarterly (7th / 31st)', label: 'TDS / TCS Filings', desc: 'Payment by 7th of following month; quarterly returns (24Q/26Q) by 31st.' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs space-y-1">
                <span className="font-mono text-xs font-bold text-[#7E5E1E] block">{item.date}</span>
                <h4 className="font-serif text-sm font-bold text-[#183529]">{item.label}</h4>
                <p className="font-editorial-body text-[11px] text-[#525954]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The 6 Direct Tax Streams Catalog */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#F1EBDD] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-2">
            <Badge variant="statutory">INCOME TAX ACT, 1961 • 6 SPECIALIZED STREAMS</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#183529]">
              Direct Tax Advisory Spectrum
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
              Every stream is delivered with evidentiary rigor, reconciliation against CBDT databases, and direct partner sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {taxStreams.map((stream) => (
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
                      <strong className="text-[#7E5E1E] font-semibold">Applicability Threshold: </strong>
                      <span className="text-[#525954]">{stream.threshold}</span>
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] rounded-xl p-3.5 border border-[#D8D0BE]/80 mt-2">
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
                    <span>Consult on this stream</span>
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

      {/* 4. Local Relevance: Tirupati Range Jurisdiction */}
      <section className="py-12 sm:py-16 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <Badge variant="gold">LOCAL DIRECT TAX EXPERTISE</Badge>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
                Serving Taxpayers in Tirupati &amp; Andhra Pradesh
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                Our chambers provide tailored direct tax representation under the jurisdiction of the Tirupati Income Tax Range:
              </p>
              <ul className="space-y-2.5 font-editorial-body text-xs sm:text-sm text-[#35271F]">
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                  <span><strong>Salaried Professionals &amp; Doctors:</strong> Detailed deduction planning for medical professionals (SVIMS, BIRRD), university faculty, and executives.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                  <span><strong>Real Estate &amp; Property Sellers:</strong> Capital gains tax computation on agricultural conversion, plots, and apartment sales with Section 54/54EC optimization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                  <span><strong>Tirupati MSMEs &amp; Traders:</strong> Section 44AB tax audits, presumptive taxation under Section 44AD/44ADA, and advance tax schedules.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                  <span><strong>Charitable Trusts &amp; Institutions:</strong> Registration under Section 12AB and 80G, Form 10B/10BB audit reports, and corpus fund compliance.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-5 bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#D8D0BE] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#B49A64] shrink-0" />
                <h3 className="font-serif text-lg font-bold text-[#183529]">
                  Practice Chambers in Tirupati
                </h3>
              </div>
              <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                Visit our physical chambers for direct partner consultations, document verification, and statutory tax planning sessions:
              </p>
              <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#D8D0BE] text-xs text-[#35271F] space-y-1">
                <strong className="block text-[#183529]">CA Kavitha &amp; Associates</strong>
                <span>19-12-46, 1st Floor, Near Bairagipetteda Arch,</span>
                <span className="block">Bairagi Patteda, Tirupati – 517501, Andhra Pradesh</span>
                <span className="block text-[#7E5E1E] font-medium pt-1">Direct Consultation with CA Kavitha Vijay</span>
              </div>
              <a
                href={firm.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#183529] hover:text-[#071B14] underline min-h-[44px]"
              >
                <span>Google Maps Location (13.6192242, 79.418046)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Direct Tax Statutory FAQs Accordion */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F1EBDD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="gold">STATUTORY CLARIFICATIONS</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
              Frequently Asked Questions on Income Tax
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954]">
              Legal guidance based strictly on the provisions of the Income Tax Act, 1961.
            </p>
          </div>

          <Accordion items={taxFaqItems} defaultExpandedId="faq-44ab" />
        </div>
      </section>

      {/* 6. Consultation Desk CTA */}
      <section className="py-12 sm:py-16 bg-[#FAF7F0] text-center border-t border-[#D8D0BE]">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <Badge variant="gold">PARTNER-LED ADVISORY</Badge>
          <h2 className="font-editorial-h2 text-2xl sm:text-4xl font-serif font-bold text-[#183529]">
            Plan Your Direct Tax Strategy with CA Kavitha Vijay
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-xl mx-auto leading-relaxed">
            Ensure complete compliance with the Income Tax Department while optimizing tax liabilities legitimately through proactive planning.
          </p>
          <div className="pt-4 flex justify-center gap-4 flex-wrap">
            <Button to="/contact" variant="primary" size="md" dualArrow>
              Schedule Tax Appointment
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

export default IncomeTaxPage;
