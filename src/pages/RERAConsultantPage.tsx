import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Building2, 
  Scale, 
  ChevronDown,
  MapPin,
  Landmark,
  FileSignature
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const RERAConsultantPage: React.FC = () => {
  const { data } = useFirmData();
  const firm = data || FIRM_DATA;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const reraStreams = [
    {
      id: 'form3-cert',
      title: 'Mandatory CA Form 3 Escrow Withdrawal Certificates',
      statute: 'Section 4(2)(l)(D), RERA Act, 2016',
      scope: 'Statutory verification and certification of land costs, construction expenditure incurred, and percentage of project completion required to withdraw funds from the mandatory 70% designated escrow bank account.',
      deliverable: 'Chartered Accountant Form 3 Certificate with Valid ICAI UDIN for Bank Escrow Operations',
      threshold: 'Mandatory for All Ongoing and New RERA-Registered Real Estate Projects in Andhra Pradesh',
      documents: ['Architect’s Form 1 Certificate (Percentage of Work Done)', 'Engineer’s Form 2 Certificate (Estimated & Incurred Cost of Construction)', 'Designated Escrow Bank Statement & General Ledger of Project Inflows', 'Land Purchase Documents and Title Verification Details']
    },
    {
      id: 'rera-reg',
      title: 'AP RERA Project Registration for Builders & Layout Promoters',
      statute: 'Section 3 & Section 4, Real Estate (Regulation and Development) Act, 2016',
      scope: 'End-to-end project registration on the Andhra Pradesh Real Estate Regulatory Authority (AP RERA) portal. Preparation of project finance schedules, cost estimations, encumbrance verifications, and promoter background dossiers.',
      deliverable: 'AP RERA Registration Number, Approved Project Dossier & Legal Disclosure Documents',
      threshold: 'Residential, Commercial, or Plotted Real Estate Projects exceeding 500 sq. meters or 8 apartments',
      documents: ['Approved Layout / Building Plan from TUDA / Municipal Corporation', 'Land Title Deeds and Non-Encumbrance Certificate (NEC) for 30 Years', 'Pro-forma Agreement for Sale and Allotment Letter', 'Chartered Accountant Net Worth Certificate of Promoters']
    },
    {
      id: 'quarterly-compliance',
      title: 'Quarterly RERA Portal Updates & Progress Audits',
      statute: 'Section 11, RERA Act, 2016 read with AP RERA Rules',
      scope: 'Mandatory quarterly reporting of booked units, construction milestones achieved, pending approvals, and fund utilization reports uploaded to the AP RERA public web portal within prescribed timelines.',
      deliverable: 'Quarterly Financial Compliance Filings, Public Portal Status Receipts & Variance Memos',
      threshold: 'All Active Promoters and Builders with Ongoing Projects in Tirupati and Rayalaseema',
      documents: ['Quarterly Sales & Booking Register with Allottee Considerations', 'Quarterly Bank Escrow Account Statements', 'Incurred Construction Cost Vouchers and Material Purchase Invoices', 'Updated Construction Photographs and Milestone Proofs']
    },
    {
      id: 'annual-rera-audit',
      title: 'Annual Statutory RERA Audit & Form 5 Certification',
      statute: 'Section 4(2)(l)(D) Third Proviso, RERA Act, 2016',
      scope: 'Mandatory annual audit by a practicing Chartered Accountant other than the statutory auditor of the promoter. Verification that 70% of realizations were deposited in escrow and utilized strictly in proportion to completion.',
      deliverable: 'Form 5 Annual RERA Audit Report Uploaded to AP RERA Portal with Partner UDIN',
      threshold: 'Every Real Estate Promoter with an Active Registered Project within 6 Months of Financial Year End',
      documents: ['Audited Financial Statements of the Project', 'Form 3 Certificates issued during the Financial Year', 'Bank Confirmation of Designated RERA Separate Account Operations', 'Reconciliation of Realizations vs Escrow Deposits']
    },
    {
      id: 'jda-structuring',
      title: 'Joint Development Agreement (JDA) Tax & Capital Gains Structuring',
      statute: 'Section 45(5A), Income Tax Act, 1961',
      scope: 'Tax advisory for Tirupati landowners and developers entering into Joint Development Agreements (JDAs). Determination of capital gains liability in the year of Completion Certificate (CC) issuance and stamp duty valuation alignment.',
      deliverable: 'JDA Tax Optimization Model, Developer Share Computation & Advance Tax Advisory',
      threshold: 'Landowners and Real Estate Developers in Tirupati, Renigunta, and Chandragiri',
      documents: ['Registered Joint Development Agreement (JDA)', 'Sharing Ratio Agreement (Area Sharing / Revenue Sharing)', 'Approved Sanction Plan and Completion Certificate Copy if issued', 'Fair Market Valuation of Land on Transfer Date']
    },
    {
      id: 'rera-deregistration',
      title: 'Project Completion & Escrow Closure Certification',
      statute: 'Section 17 & Section 4, RERA Act, 2016',
      scope: 'Final audit certifying 100% completion, conveyance of common areas to registered allottee associations, zero outstanding project liabilities against escrow funds, and formal project completion closure with AP RERA.',
      deliverable: 'Final CA Project Completion Certificate, Escrow Closure Sanction & Handover Audit Dossier',
      threshold: 'Developers Completing Construction and Handing Over Projects to Resident Welfare Associations',
      documents: ['Occupancy / Completion Certificate from Municipal Corporation / TUDA', 'Final Form 3 and Form 5 Audit Reports', 'Allottee Possession Handover Receipts and Association Registration Deeds']
    }
  ];

  const reraFaqs = [
    {
      q: 'Why is a Chartered Accountant Form 3 Certificate mandatory under RERA before withdrawing funds?',
      a: 'Under Section 4(2)(l)(D) of the Real Estate (Regulation and Development) Act, 2016, promoters are legally required to deposit 70% of the amounts realized from allottees into a designated separate bank account. Funds can be withdrawn from this account strictly to cover land cost and construction cost, in proportion to the percentage of completion of the project. A certificate from a practicing Chartered Accountant (Form 3) is statutory evidence that the withdrawal matches the verified expenditure and completion percentage.',
      ref: 'Section 4(2)(l)(D), RERA Act, 2016'
    },
    {
      q: 'What is the threshold for mandatory AP RERA project registration in Tirupati and surrounding areas?',
      a: 'Under Section 3 of the RERA Act, registration with the Andhra Pradesh Real Estate Regulatory Authority (AP RERA) is mandatory for any commercial or residential real estate project where: (1) the area of land proposed to be developed exceeds 500 square meters, or (2) the number of apartments proposed to be developed exceeds 8 apartments. Plotted layouts meeting these size thresholds must also be registered before advertising, marketing, or selling plots.',
      ref: 'Section 3(2), RERA Act, 2016'
    },
    {
      q: 'Can the same Chartered Accountant issue both the statutory audit report of the builder and the RERA Form 5 audit report?',
      a: 'Under the third proviso to Section 4(2)(l)(D) of the RERA Act, the annual RERA audit of the designated separate account must be conducted by a practicing Chartered Accountant. Many state RERA authorities (including AP RERA guidance) strongly recommend that the Form 5 auditor be an independent CA who is not the statutory auditor of the company, ensuring objective assurance and conflict-free verification of escrow fund utilization.',
      ref: 'Section 4(2)(l)(D) Third Proviso, RERA Act, 2016'
    },
    {
      q: 'How does Section 45(5A) of the Income Tax Act apply to Joint Development Agreements (JDA) in Tirupati?',
      a: 'Section 45(5A) provides relief to individual and HUF landowners entering into specified JDAs with builders. Rather than paying capital gains tax in the year the agreement is registered, the capital gains liability is deferred to the financial year in which the completion certificate (CC) is issued by the competent authority (such as TUDA or the Municipal Corporation). The stamp duty value of the landowner’s share of developed property plus cash consideration is treated as full value of consideration.',
      ref: 'Section 45(5A), Income Tax Act, 1961'
    }
  ];

  return (
    <div className="bg-brand-ivory page-reveal text-brand-charcoal min-h-screen">
      <SEOHead
        title="RERA Advisory & CA Certificates in Tirupati | Kavitha & Associates"
        description="Specialized RERA advisory in Tirupati. CA Kavitha & Associates provides mandatory Form 3 CA certificates for escrow withdrawal, AP RERA compliance & JDA tax planning."
        canonicalPath="/services/rera-consultant-tirupati"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'RERA Advisory in Tirupati', path: '/services/rera-consultant-tirupati' }
        ]}
        jsonLd={[
          {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'RERA Compliance & Chartered Accountant Certification Services in Tirupati',
          serviceType: 'Real Estate Regulatory Advisory',
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
          description: 'Mandatory Form 3 CA escrow certificates, AP RERA project registration, and annual Form 5 audits for builders and developers led by CA Kavitha Vijay.'
        },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: reraFaqs.map(f => ({
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
              <Building className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Real Estate Regulatory Practice • AP RERA</span>
            </div>
            <h1 className="font-editorial-h1 text-white">
              RERA Advisory in Tirupati
            </h1>
            <p className="mt-4 font-editorial-body text-emerald-100/90 leading-relaxed text-base sm:text-lg">
              Specialized regulatory advisory for builders, developers, and plotted layout promoters. Mandatory CA Form 3 escrow withdrawal certificates, AP RERA quarterly reporting, and JDA tax structuring supervised directly by CA Kavitha Vijay from our Tirupati chambers.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-brand-deep font-editorial-meta text-xs font-semibold hover:bg-brand-gold/90 transition-colors btn-tactile shadow-md"
              >
                <span>Request RERA CA Certificate</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/?text=${encodeURIComponent('Hello CA Kavitha Vijay, I need consultation regarding RERA CA certificates and AP RERA compliance.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-forest/60 text-white font-editorial-meta text-xs hover:bg-brand-forest border border-brand-gold/40 transition-colors btn-tactile"
              >
                <span>WhatsApp RERA Query</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. STATUTORY RIGOR STRIP
          ========================================================================= */}
      <section className="py-12 bg-brand-surface border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-stagger">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <FileSignature className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Escrow Compliance</span>
                <p className="font-editorial-h3 text-base font-bold text-brand-forest">
                  CA Form 3 Certification
                </p>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Verified cost-to-completion calculations ensuring legal fund withdrawals from 70% designated bank escrow accounts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <Landmark className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">AP RERA Alignment</span>
                <p className="font-editorial-h3 text-base font-bold text-brand-forest">
                  Quarterly Portal Filings
                </p>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Timely financial disclosures and booked unit reporting to keep project registrations active and penalty-free.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <Scale className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Fiscal Security</span>
                <p className="font-editorial-h3 text-base font-bold text-brand-forest">
                  JDA Capital Gains Optimization
                </p>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Structuring joint development contracts under Section 45(5A) to defer and minimize capital gains tax for landowners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. RERA SERVICE MATRIX (6 STREAMS)
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Practice Spectrum
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
              Complete RERA Compliance Solutions
            </h2>
            <p className="font-editorial-body text-sm text-brand-muted mt-2 leading-relaxed">
              We guide real estate project promoters through the entire statutory lifecycle, from initial registration to final occupancy certification and escrow closure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-stagger">
            {reraStreams.map((stream) => (
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
                      <strong className="text-brand-gold font-semibold">Mandatory Threshold: </strong>
                      <span className="text-brand-muted">{stream.threshold}</span>
                    </div>
                  </div>

                  <div className="bg-brand-surface rounded-xl p-3.5 border border-brand-border/70 mt-3">
                    <span className="font-editorial-meta text-[11px] text-brand-forest font-bold block mb-1.5">
                      Required Documentation & Audit Inputs:
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
                    <span>Request this certification</span>
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
          4. LOCAL RELEVANCE & REAL ESTATE ECOSYSTEM
          ========================================================================= */}
      <section className="py-16 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 scroll-reveal-left">
              <span className="font-editorial-meta text-brand-gold block">
                Local Real Estate Practice
              </span>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
                Serving Builders in Tirupati, Renigunta & Chandragiri
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                We work directly with builders, developers, and layout promoters navigating statutory compliance under the Andhra Pradesh Real Estate Regulatory Authority:
              </p>
              <ul className="space-y-2.5 font-editorial-body text-xs sm:text-sm text-brand-charcoal">
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Residential Apartment Builders in Tirupati</strong>: Mandatory Form 3 CA certificates for escrow withdrawal and quarterly sales reconciliation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>TUDA Approved Layout Promoters</strong>: Plotted layout RERA registration, promoter net worth certification, and infrastructure completion reporting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Commercial Project Developers</strong>: Mixed-use commercial complex compliance, GST input tax credit matching for construction contracts, and AP RERA portal filing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Landowners in Joint Ventures</strong>: Capital gains tax computation on development rights transfer and Section 45(5A) timing optimization.</span>
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
                Visit our chambers to examine project accounts, review escrow bank statements, and obtain certified CA Form 3 reports:
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
          5. RERA FAQS
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Statutory Clarifications
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
              Frequently Asked Questions on RERA
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-brand-muted mt-2">
              Legal guidance based strictly on the Real Estate (Regulation and Development) Act, 2016.
            </p>
          </div>

          <div className="space-y-4">
            {reraFaqs.map((faq, idx) => (
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
                      Legal Authority: {faq.ref}
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
            Real Estate Compliance Practice
          </span>
          <h2 className="font-editorial-h2 text-2xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
            Secure Your RERA Escrow Operations &amp; Certifications
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            Ensure complete compliance with AP RERA regulations, obtain valid Form 3 CA certificates with UDIN, and protect your real estate projects against penalties.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-brand-gold text-brand-deep font-editorial-meta text-xs font-semibold hover:bg-brand-gold/90 transition-colors btn-tactile shadow-md"
            >
              <span>Consult on RERA Services</span>
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
export default RERAConsultantPage;
