import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Building2, 
  Scale, 
  ChevronDown,
  FileCheck,
  TrendingDown,
  MapPin,
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const IncomeTaxPage: React.FC = () => {
  const { data } = useFirmData();
  const firm = data || FIRM_DATA;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const taxFaqs = [
    {
      q: 'When does a business or professional in Tirupati require a mandatory Tax Audit under Section 44AB?',
      a: 'Under Section 44AB of the Income Tax Act, a Tax Audit by an independent practicing Chartered Accountant is mandatory if: (1) business turnover exceeds ₹1 Crore (or ₹10 Crores where aggregate cash receipts and payments do not exceed 5% of total turnover); (2) professional gross receipts exceed ₹50 Lakhs (or ₹75 Lakhs under presumptive Section 44ADA if cash receipts are <= 5%); or (3) a taxpayer opts out of presumptive taxation while earning income above the basic exemption threshold.',
      ref: 'Section 44AB & Section 44ADA, Income Tax Act, 1961'
    },
    {
      q: 'How should property sellers in Tirupati plan capital gains on real estate under Section 54 and Section 54EC?',
      a: 'Long-term capital gains arising from the sale of residential property can be exempted under Section 54 by purchasing another residential property within 1 year before or 2 years after the transfer (or constructing within 3 years). Alternatively, under Section 54EC, gains up to ₹50 Lakhs can be invested in specified infrastructure bonds (REC, NHAI, PFC, IRFC) within 6 months from the date of transfer. If funds are not reinvested prior to the ITR filing due date, they must be deposited into a Capital Gains Account Scheme (CGAS) with an authorized bank in Tirupati.',
      ref: 'Section 54, Section 54EC & Section 54F, Income Tax Act, 1961'
    },
    {
      q: 'What are the key advantages of Section 115BAA for corporate entities in Andhra Pradesh?',
      a: 'Section 115BAA offers domestic companies a reduced base corporate tax rate of 22% (effective tax rate of 25.168% inclusive of 10% surcharge and 4% cess) compared to the standard 30% slab. Crucially, companies electing Section 115BAA are completely exempt from Minimum Alternate Tax (MAT under Section 115JB). However, brought-forward MAT credits cannot be set off and certain deductions (like accelerated depreciation or Section 80-IA) must be foregone. We prepare comparative models before submitting irrevocable Form 10-IC.',
      ref: 'Section 115BAA & Section 115JB, Income Tax Act, 1961'
    },
    {
      q: 'How does CA Kavitha & Associates handle Faceless Scrutiny notices issued under Section 143(2)?',
      a: 'Faceless scrutiny requires strictly electronic, document-backed responses with zero physical hearings. We analyze the specific questionnaire issued by the Assessment Unit, cross-reference transactions against bank statements, purchase bills, and TDS credits, draft legal arguments citing relevant High Court and Supreme Court precedents, and upload structured PDF annexures via the e-Filing portal well within statutory response deadlines.',
      ref: 'Section 144B (Faceless Assessment), Income Tax Act, 1961'
    }
  ];

  return (
    <div className="bg-brand-ivory page-reveal text-brand-charcoal min-h-screen">
      <SEOHead
        title="Income Tax Consultant in Tirupati | ITR | Kavitha & Associates"
        description="Expert Income Tax consultant in Tirupati. CA Kavitha & Associates provides corporate tax planning, Section 44AB tax audit, capital gains advisory & ITR filing."
        canonicalPath="/services/income-tax-consultant-tirupati"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Income Tax Services in Tirupati', path: '/services/income-tax-consultant-tirupati' }
        ]}
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
          description: 'Comprehensive direct tax services, Section 44AB tax audits, Section 115BAA corporate planning, and faceless scrutiny defense supervised by CA Kavitha Vijay.'
        },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: taxFaqs.map(f => ({
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
              <FileSpreadsheet className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Direct Tax Practice • Tirupati Chambers</span>
            </div>
            <h1 className="font-editorial-h1 text-white">
              Income Tax Consultant in Tirupati
            </h1>
            <p className="mt-4 font-editorial-body text-emerald-100/90 leading-relaxed text-base sm:text-lg">
              Strategic direct tax planning, corporate return filing, Section 44AB tax audits, and faceless scrutiny representation. Directly supervised by CA Kavitha Vijay (B.Com, CA, CMA AIR 49, ex-Deloitte Big 4 auditor) from our practice chambers at Bairagi Patteda, Tirupati.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-brand-deep font-editorial-meta text-xs font-semibold hover:bg-brand-gold/90 transition-colors btn-tactile shadow-md"
              >
                <span>Book Tax Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/919626350900?text=${encodeURIComponent('Hello CA Kavitha Vijay, I need consultation regarding Income Tax filing and planning in Tirupati.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-forest/60 text-white font-editorial-meta text-xs hover:bg-brand-forest border border-brand-gold/40 transition-colors btn-tactile"
              >
                <span>WhatsApp Tax Query</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. STANDARDS & INTEGRITY STRIP
          ========================================================================= */}
      <section className="py-12 bg-brand-surface border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-stagger">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <FileCheck className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Data Triangulation</span>
                <h3 className="font-editorial-h3 text-base font-bold text-brand-forest">
                  AIS & 26AS Reconciliation
                </h3>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Every ITR is audited against Annual Information Statement and 26AS data to eliminate defective return notices under Section 139(9).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <TrendingDown className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Fiscal Optimization</span>
                <h3 className="font-editorial-h3 text-base font-bold text-brand-forest">
                  Legitimate Tax Mitigation
                </h3>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Maximizing permissible deductions under Chapter VI-A, Section 115BAA, and capital gains exemptions while staying strictly compliant.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <Scale className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Appellate Defense</span>
                <h3 className="font-editorial-h3 text-base font-bold text-brand-forest">
                  Faceless Scrutiny Defense
                </h3>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Structured submissions citing High Court and ITAT precedents to protect taxpayers from arbitrary additions and penalty notices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. COMPREHENSIVE TAX SERVICE MATRIX (6 STREAMS)
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Practice Spectrum
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
              Direct Tax Solutions for Individuals & Corporate Entities
            </h2>
            <p className="font-editorial-body text-sm text-brand-muted mt-2 leading-relaxed">
              From routine annual return filing to complex enterprise restructuring and Section 44AB audits, our direct tax engagements deliver rigorous compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-stagger">
            {taxStreams.map((stream) => (
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
                      <strong className="text-brand-gold font-semibold">Applicability Threshold: </strong>
                      <span className="text-brand-muted">{stream.threshold}</span>
                    </div>
                  </div>

                  <div className="bg-brand-surface rounded-xl p-3.5 border border-brand-border/70 mt-3">
                    <span className="font-editorial-meta text-[11px] text-brand-forest font-bold block mb-1.5">
                      Required Documents & Preparation:
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
                    <span>Consult on this service</span>
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
          4. LOCAL RELEVANCE & TIRUPATI TAXPAYERS
          ========================================================================= */}
      <section className="py-16 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 scroll-reveal-left">
              <span className="font-editorial-meta text-brand-gold block">
                Local Direct Tax Expertise
              </span>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
                Serving Taxpayers in Tirupati & Andhra Pradesh
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                Our chambers provide tailored direct tax representation under the jurisdiction of the Tirupati Income Tax Range:
              </p>
              <ul className="space-y-2.5 font-editorial-body text-xs sm:text-sm text-brand-charcoal">
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Salaried Professionals & Doctors</strong>: Detailed deduction planning for medical professionals (SVIMS, BIRRD), university faculty, and executives.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Real Estate & Property Sellers</strong>: Capital gains tax computation on agricultural conversion, plots, and apartment sales with Section 54/54EC optimization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Tirupati MSMEs & Traders</strong>: Section 44AB tax audits, presumptive taxation under Section 44AD/44ADA, and advance tax schedules.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Charitable Trusts & Institutions</strong>: Registration under Section 12AB and 80G, Form 10B/10BB audit reports, and corpus fund compliance.</span>
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
                Visit our physical chambers for direct partner consultations, document verification, and statutory tax planning sessions:
              </p>
              <div className="bg-brand-surface p-4 rounded-xl border border-brand-border/70 text-xs text-brand-charcoal space-y-1 mb-5">
                <strong className="block text-brand-forest">CA Kavitha & Associates</strong>
                <span>19-12-46, 1st Floor, Near Bairagipetteda Arch,</span>
                <span className="block">Bairagi Patteda, Tirupati – 517501, Andhra Pradesh</span>
                <span className="block text-brand-gold font-medium pt-1">Direct Consultation with CA Kavitha Vijay</span>
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
          5. DIRECT TAX FAQS
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Statutory Clarifications
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
              Frequently Asked Questions on Income Tax
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-brand-muted mt-2">
              Legal guidance based strictly on the provisions of the Income Tax Act, 1961.
            </p>
          </div>

          <div className="space-y-4">
            {taxFaqs.map((faq, idx) => (
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
                      Statutory Reference: {faq.ref}
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
            Partner-Led Advisory
          </span>
          <h2 className="font-editorial-h2 text-2xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
            Plan Your Direct Tax Strategy with CA Kavitha Vijay
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            Ensure complete compliance with the Income Tax Department while optimizing tax liabilities legitimately through proactive planning.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-brand-gold text-brand-deep font-editorial-meta text-xs font-semibold hover:bg-brand-gold/90 transition-colors btn-tactile shadow-md"
            >
              <span>Schedule Tax Appointment</span>
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
export default IncomeTaxPage;
