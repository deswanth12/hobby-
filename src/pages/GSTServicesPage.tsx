import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Receipt, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Building2, 
  Scale, 
  ChevronDown,
  MapPin,
  FileCheck2,
  Clock
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';


export const GSTServicesPage: React.FC = () => {
  const { data } = useFirmData();
  const firm = data || FIRM_DATA;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const gstFaqs = [
    {
      q: 'When is GST registration mandatory for a business operating in Tirupati, Andhra Pradesh?',
      a: 'Under Section 22 of the CGST/APGST Act, GST registration is legally mandatory if your aggregate annual turnover exceeds ₹40 Lakhs for businesses exclusively engaged in the supply of goods, or ₹20 Lakhs for service providers. However, registration is compulsory irrespective of turnover threshold for: (a) anyone making inter-state taxable supplies, (b) e-commerce sellers, (c) casual taxable persons, and (d) persons liable to pay reverse charge (RCM).',
      ref: 'Section 22 & Section 24, CGST Act, 2017'
    },
    {
      q: 'How does CA Kavitha & Associates resolve Input Tax Credit (ITC) mismatches between GSTR-2B and purchase records?',
      a: 'Under Section 16(2)(aa) of the CGST Act, ITC can strictly be claimed only if the invoice has been uploaded by the supplier and is reflected in your auto-generated GSTR-2B. We execute automated and manual line-by-line reconciliations to identify: (1) suppliers who have not filed GSTR-1, (2) incorrect GSTIN or invoice number entries, (3) timing differences, and (4) ineligible credits under Section 17(5). We provide structured vendor-follow-up lists to recover blocked working capital before return filing deadlines.',
      ref: 'Section 16(2)(aa) & Rule 36(4), CGST Act, 2017'
    },
    {
      q: 'What should a business do upon receiving a Form ASMT-10 or DRC-01A notice from the Andhra Pradesh GST Department?',
      a: 'Form ASMT-10 is a notice pointing out discrepancies under scrutiny of returns (Section 61), while Form DRC-01A is an intimation of tax ascertained before formal demand. You must submit a point-by-point factual reply in Form ASMT-11 within 30 days. We examine the statutory allegations, extract transactional evidence, prepare comprehensive reconciliation statements, and submit verified legal arguments to close the scrutiny without escalation into penalty orders.',
      ref: 'Section 61 & Rule 99, APGST Rules, 2017'
    },
    {
      q: 'Can a composition dealer in Tirupati switch to the regular scheme, and what are the compliance requirements?',
      a: 'Yes. A taxpayer can opt out of the composition scheme voluntarily by filing Form CMP-04, or automatically if turnover exceeds ₹1.5 Crores (or ₹75 Lakhs for service composition) or if the business begins inter-state supply. Upon switching, the taxpayer can claim Input Tax Credit on input stock held on the switch date by filing Form ITC-01 within 30 days, accompanied by a CA certificate if the credit amount exceeds ₹2 Lakhs.',
      ref: 'Section 10 & Section 18(1)(c), CGST Act, 2017'
    }
  ];

  return (
    <div className="bg-brand-ivory page-reveal text-brand-charcoal min-h-screen">
      <SEOHead
        title="GST Consultant in Tirupati | GST Filing | Kavitha & Associates"
        description="Expert GST consultant in Tirupati. CA Kavitha & Associates provides GST registration, monthly GSTR-1 & 3B return filing, GSTR-9/9C reconciliation & notice defense."
        canonicalPath="/services/gst-consultant-tirupati"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'GST Services in Tirupati', path: '/services/gst-consultant-tirupati' }
        ]}
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
          description: 'Comprehensive GST advisory, monthly return preparation, annual GSTR-9/9C audits, and departmental representation led by CA Kavitha Vijay.'
        },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: gstFaqs.map(f => ({
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
              <Receipt className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Indirect Tax Practice • Tirupati Chambers</span>
            </div>
            <h1 className="font-editorial-h1 text-white">
              GST Consultant in Tirupati
            </h1>
            <p className="mt-4 font-editorial-body text-emerald-100/90 leading-relaxed text-base sm:text-lg">
              Partner-led Goods and Services Tax advisory, periodic return compliance, Input Tax Credit reconciliation, and departmental scrutiny defense. Supervised directly by CA Kavitha Vijay (B.Com, CA, CMA AIR 49) for businesses in Tirupati, Renigunta, and the Rayalaseema commercial corridor.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-brand-deep font-editorial-meta text-xs font-semibold hover:bg-brand-gold/90 transition-colors btn-tactile shadow-md"
              >
                <span>Book a GST Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/?text=${encodeURIComponent('Hello CA Kavitha Vijay, I need assistance with GST services in Tirupati.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-forest/60 text-white font-editorial-meta text-xs hover:bg-brand-forest border border-brand-gold/40 transition-colors btn-tactile"
              >
                <span>WhatsApp GST Query</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. STATUTORY COMPLIANCE BENCHMARK STRIP
          ========================================================================= */}
      <section className="py-12 bg-brand-surface border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-stagger">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <FileCheck2 className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Filing Integrity</span>
                <p className="font-editorial-h3 text-base font-bold text-brand-forest">
                  100% Reconciled Returns
                </p>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Zero unverified credits. Every GSTR-3B is mathematically matched against GSTR-2B before portal submission.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <Scale className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Litigation Shield</span>
                <p className="font-editorial-h3 text-base font-bold text-brand-forest">
                  Departmental Scrutiny Defense
                </p>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Proactive handling of ASMT-10, DRC-01A, and audit summons with structured legal replies backed by judicial precedents.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <Clock className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Calendar Rigor</span>
                <p className="font-editorial-h3 text-base font-bold text-brand-forest">
                  Zero Late Fee Guarantee
                </p>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Scheduled monthly accounting cycles ensuring GSTR-1 by 11th and GSTR-3B by 20th to eliminate interest and late fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. COMPREHENSIVE GST SERVICE SPECTRUM (6 DETAILED STREAMS)
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Practice Spectrum
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
              Complete GST Services for Tirupati Businesses
            </h2>
            <p className="font-editorial-body text-sm text-brand-muted mt-2 leading-relaxed">
              From initial registration to complex departmental appellate defense, each engagement is structured according to statutory rules and executed under partner supervision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-stagger">
            {gstStreams.map((stream) => (
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
          4. LOCAL TIRUPATI COMMERCIAL JURISDICTION & SECTOR APPLICABILITY
          ========================================================================= */}
      <section className="py-16 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 scroll-reveal-left">
              <span className="font-editorial-meta text-brand-gold block">
                Local Commercial Expertise
              </span>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
                Serving Businesses Across Tirupati & Rayalaseema
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                Our practice chambers at Bairagi Patteda provide accessible, direct GST assistance to business entities across all local commercial corridors:
              </p>
              <ul className="space-y-2.5 font-editorial-body text-xs sm:text-sm text-brand-charcoal">
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Tirupati Retail & Wholesale Hubs</strong>: High-volume trading, reverse charge, and composite billing for retail corridors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Renigunta Industrial Cluster & APIIC</strong>: Manufacturing GST, inverted duty structures, and capital goods credit optimization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Hospitality, Tourism & Transportation</strong>: E-commerce operator compliance, hotel tariff slabs, and travel booking GST reconciliation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Sri City SEZ / DTA Corridors</strong>: Cross-border supply verification, zero-rated exports, and LUT bond filings under Rule 96A.</span>
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
                Located conveniently at Bairagi Patteda, our office is accessible for physical consultation, original invoice verification, and statutory ledger handovers:
              </p>
              <div className="bg-brand-surface p-4 rounded-xl border border-brand-border/70 text-xs text-brand-charcoal space-y-1 mb-5">
                <strong className="block text-brand-forest">CA Kavitha & Associates</strong>
                <span>19-12-46, 1st Floor, Near Bairagipetteda Arch,</span>
                <span className="block">Bairagi Patteda, Tirupati – 517501, Andhra Pradesh</span>
                <span className="block text-brand-gold font-medium pt-1">Landmark: Near Bairagipetteda Arch</span>
              </div>
              <a
                href={firm.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-forest hover:text-brand-deep underline"
              >
                <span>View on Google Maps (GPS: 13.6192242, 79.418046)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. STATUTORY GST FAQS
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Statutory Clarifications
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
              Frequently Asked Questions on GST
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-brand-muted mt-2">
              Legal guidance grounded strictly in the Central & Andhra Pradesh Goods and Services Tax Acts.
            </p>
          </div>

          <div className="space-y-4">
            {gstFaqs.map((faq, idx) => (
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
                      Legal Reference: {faq.ref}
                    </span>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. INTAKE & CONSULTATION BANNER
          ========================================================================= */}
      <section className="py-16 bg-brand-deep text-white border-t border-brand-gold/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 scroll-reveal">
          <span className="font-editorial-meta text-brand-gold text-xs uppercase tracking-wider block">
            Partner-Supervised Compliance
          </span>
          <h2 className="font-editorial-h2 text-2xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
            Schedule a Confidential GST Review at our Tirupati Chambers
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            Whether registering a new business, resolving chronic ITC variances, or responding to departmental notices, consult directly with CA Kavitha Vijay.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-brand-gold text-brand-deep font-editorial-meta text-xs font-semibold hover:bg-brand-gold/90 transition-colors btn-tactile shadow-md"
            >
              <span>Submit Practice Inquiry</span>
            </Link>
            <a
              href={`tel:${firm.contact.primaryPhoneClean}`}
              className="px-6 py-3 rounded-full bg-brand-forest text-white font-editorial-meta text-xs hover:bg-brand-forest/80 border border-brand-gold/40 transition-colors btn-tactile flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
              <span>Call {firm.contact.primaryPhone}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
export default GSTServicesPage;
