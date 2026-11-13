import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Landmark,
  FileSignature,
  Scale,
  ChevronRight,
  Home
} from 'lucide-react';
import { FIRM_DATA } from '../../../data/firmData';
import { SEOHead } from '../../../components/SEOHead';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Accordion, AccordionItem } from '../../components/common/Accordion';

export const RERAConsultantPage: React.FC = () => {
  const firm = FIRM_DATA;

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
    }
  ];

  const reraFaqItems: AccordionItem[] = [
    {
      id: 'faq-form3-why',
      title: 'Why is a Chartered Accountant Form 3 Certificate mandatory under RERA before withdrawing funds?',
      statuteReference: 'Section 4(2)(l)(D), RERA Act, 2016',
      content: (
        <p>
          Under Section 4(2)(l)(D) of the Real Estate (Regulation and Development) Act, 2016, promoters are legally required to deposit 70% of the amounts realized from allottees into a designated separate bank account. Funds can be withdrawn from this account strictly to cover land cost and construction cost, in proportion to the percentage of completion of the project. A certificate from a practicing Chartered Accountant (Form 3) is statutory evidence that the withdrawal matches the verified expenditure and completion percentage.
        </p>
      )
    },
    {
      id: 'faq-thresholds',
      title: 'What is the threshold for mandatory AP RERA project registration in Tirupati and surrounding areas?',
      statuteReference: 'Section 3(2), RERA Act, 2016',
      content: (
        <p>
          Under Section 3 of the RERA Act, registration with the Andhra Pradesh Real Estate Regulatory Authority (AP RERA) is mandatory for any commercial or residential real estate project where: (1) the area of land proposed to be developed exceeds 500 square meters, or (2) the number of apartments proposed to be developed exceeds 8 apartments. Plotted layouts meeting these size thresholds must also be registered before advertising, marketing, or selling plots.
        </p>
      )
    },
    {
      id: 'faq-independent-auditor',
      title: 'Can the same Chartered Accountant issue both the statutory audit report of the builder and the RERA Form 5 audit report?',
      statuteReference: 'Section 4(2)(l)(D) Third Proviso, RERA Act, 2016',
      content: (
        <p>
          Under the third proviso to Section 4(2)(l)(D) of the RERA Act, the annual RERA audit of the designated separate account must be conducted by a practicing Chartered Accountant. Many state RERA authorities (including AP RERA guidance) strongly recommend that the Form 5 auditor be an independent CA who is not the statutory auditor of the company, ensuring objective assurance and conflict-free verification of escrow fund utilization.
        </p>
      )
    },
    {
      id: 'faq-escrow-penalties',
      title: 'What are the penalties for unauthorized withdrawal from the 70% RERA escrow account?',
      statuteReference: 'Section 60 & Section 61, RERA Act, 2016',
      content: (
        <p>
          Non-compliance with escrow account mandates is treated as a major statutory offense under RERA. Violations attract penalties up to 5% of the estimated cost of the real estate project under Section 61, or up to 10% under Section 60 for providing false information. Furthermore, the Authority can freeze the escrow account and revoke project registration.
        </p>
      )
    }
  ];

  const reraFaqAnswers: Record<string, string> = {
    'faq-form3-why': 'Under Section 4(2)(l)(D) of the Real Estate (Regulation and Development) Act, 2016, promoters must deposit 70% of realized amounts into a designated separate account. Funds can be withdrawn strictly in proportion to project percentage completion. A CA Form 3 certificate is statutory proof that withdrawals match verified expenditure.',
    'faq-thresholds': 'Under Section 3 of the RERA Act, registration with AP RERA is mandatory for any project where land area exceeds 500 square meters or apartments exceed 8 units. Plotted layouts meeting size criteria must also be registered prior to marketing or sale.',
    'faq-independent-auditor': 'Under the third proviso to Section 4(2)(l)(D), the annual RERA audit of the separate account must be conducted by a practicing Chartered Accountant. Independent CA verification ensures objective assurance and conflict-free verification of escrow fund utilization.',
    'faq-escrow-penalties': 'Non-compliance with escrow account mandates attracts penalties up to 5% of estimated project cost under Section 61, or up to 10% under Section 60. The Authority can freeze accounts and revoke registration.'
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'RERA Advisory in Tirupati', path: '/services/rera-consultant-tirupati' }
  ];

  return (
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen page-reveal">
      <SEOHead
        title="RERA Advisory & CA Certificates in Tirupati | Kavitha & Associates"
        description="AP RERA registration, mandatory CA Form 3 escrow withdrawal certificates, quarterly returns, and project cost audits for builders and developers in Tirupati."
        canonicalPath="/services/rera-consultant-tirupati"
        breadcrumbs={breadcrumbs}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'RERA Advisory & CA Escrow Certification in Tirupati',
            serviceType: 'Real Estate Regulatory Advisory',
            provider: {
              '@type': 'AccountingService',
              '@id': 'https://kavithaassociates.com/#organization',
              name: 'Kavitha & Associates',
              url: 'https://kavithaassociates.com/',
              telephone: firm.contact.primaryPhone,
            },
            areaServed: ['Tirupati', 'Sri City', 'Renigunta', 'Chittoor', 'Nellore', 'Andhra Pradesh', 'India'],
            description: 'AP RERA project registration, Section 4(2)(l)(D) CA Form 3 escrow certificates, quarterly progress filings, and Form 5 annual audits led by CA Kavitha Vijay.'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: reraFaqItems.map(f => ({
              '@type': 'Question',
              name: f.title,
              acceptedAnswer: {
                '@type': 'Answer',
                text: reraFaqAnswers[f.id] || (typeof f.content === 'string' ? f.content : 'RERA guidance based on the Real Estate (Regulation and Development) Act, 2016.')
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
            <span className="text-[#B49A64] font-semibold">RERA Advisory Practice</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge variant="kicker">PRAC-06 / REAL ESTATE REGULATION</Badge>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#B49A64]">
                <Building className="w-4 h-4 text-[#B49A64] shrink-0" />
                <span>Section 4(2)(l)(D) Escrow Certification • Tirupati Chambers</span>
              </div>
            </div>

            <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F1EBDD] leading-tight">
              Real Estate &amp; RERA Regulatory Advisory in Tirupati
            </h1>

            <p className="font-editorial-body text-sm sm:text-base text-[#F1EBDD]/80 leading-relaxed">
              AP RERA project registration, mandatory CA Form 3 escrow withdrawal certificates, quarterly progress filings, and Form 5 annual audits. Directly supervised by CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI).
            </p>
          </div>
        </div>
      </section>

      {/* 2. Statutory Rigor Strip */}
      <section className="py-10 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                <FileSignature className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1EBDD] text-[#7E5E1E] font-mono text-[10px] font-semibold border border-[#D8D0BE]">
                  Escrow Compliance
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                  CA Form 3 Certification
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Verified cost-to-completion calculations ensuring legal fund withdrawals from 70% designated bank escrow accounts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                <Landmark className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1EBDD] text-[#7E5E1E] font-mono text-[10px] font-semibold border border-[#D8D0BE]">
                  AP RERA Alignment
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                  Quarterly Portal Filings
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Timely financial disclosures and booked unit reporting to keep project registrations active and penalty-free.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                <Scale className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1EBDD] text-[#7E5E1E] font-mono text-[10px] font-semibold border border-[#D8D0BE]">
                  Fiscal Security
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                  JDA Capital Gains Optimization
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Structuring joint development contracts under Section 45(5A) to defer and minimize capital gains tax for landowners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 4(2)(l)(D) 70% Escrow Account Mechanics Breakdown */}
      <section className="py-12 sm:py-16 bg-[#F1EBDD] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-[#071B14] text-[#F1EBDD] p-8 sm:p-10 rounded-3xl border border-[#B49A64]/40 shadow-xl space-y-6">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#183529] text-[#B49A64] font-mono text-xs font-semibold border border-[#B49A64]/40">
                Statutory Mechanics
              </span>
              <span className="font-mono text-xs text-[#AAB4A0] bg-[#0B241C] px-3 py-1 rounded-full border border-white/10">
                Section 4(2)(l)(D) Mandatory Separate Account
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F1EBDD]">
                How the 70% RERA Escrow Account Operates
              </h3>
              <p className="font-editorial-body text-xs sm:text-sm text-[#F1EBDD]/80 leading-relaxed max-w-3xl">
                The Real Estate (Regulation and Development) Act mandates that 70% of all allottee receipts must be deposited into a dedicated bank account in a scheduled bank. Withdrawals are mathematically governed by actual project completion:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#183529]/70 border border-[#B49A64]/20 space-y-1">
                <span className="font-mono text-xs font-bold text-[#B49A64] block">Step 1: Architect (Form 1)</span>
                <span className="text-sm font-bold text-white">Percentage of Work Done</span>
                <p className="text-[11px] text-[#AAB4A0]">Certified physical completion of building stages.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#183529]/70 border border-[#B49A64]/20 space-y-1">
                <span className="font-mono text-xs font-bold text-[#B49A64] block">Step 2: Engineer (Form 2)</span>
                <span className="text-sm font-bold text-white">Actual Incurred Construction Cost</span>
                <p className="text-[11px] text-[#AAB4A0]">Material and labor cost verification vs estimate.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#183529]/70 border border-[#B49A64]/20 space-y-1">
                <span className="font-mono text-xs font-bold text-[#B49A64] block">Step 3: CA (Form 3)</span>
                <span className="text-sm font-bold text-emerald-300">Escrow Withdrawal Authorization</span>
                <p className="text-[11px] text-[#AAB4A0]">Partner-issued certificate with mandatory UDIN.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 5 RERA Practice Areas Catalog */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-2">
            <Badge variant="statutory">RERA ACT, 2016 • 5 PRACTICE DISCIPLINES</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#183529]">
              Complete RERA Compliance Solutions
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
              We guide real estate project promoters through the entire statutory lifecycle, from initial registration to final occupancy certification and escrow closure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reraStreams.map((stream) => (
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
                      <strong className="text-[#7E5E1E] font-semibold">Mandatory Threshold: </strong>
                      <span className="text-[#525954]">{stream.threshold}</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F0] rounded-xl p-3.5 border border-[#D8D0BE]/80 mt-2">
                    <span className="font-mono text-[10px] text-[#183529] font-bold uppercase tracking-wider block mb-1.5">
                      Required Documentation &amp; Inputs:
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
                    <span>Inquire regarding this RERA service</span>
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

      {/* 5. Real Estate Developer FAQs Accordion */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F1EBDD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="gold">STATUTORY CLARIFICATIONS</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
              Frequently Asked Questions on RERA Compliance
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954]">
              Legal guidance based strictly on the Real Estate (Regulation and Development) Act, 2016.
            </p>
          </div>

          <Accordion items={reraFaqItems} defaultExpandedId="faq-form3-why" />
        </div>
      </section>

      {/* 6. Consultation Desk CTA */}
      <section className="py-12 sm:py-16 bg-[#FAF7F0] text-center border-t border-[#D8D0BE]">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <Badge variant="gold">BUILDER &amp; DEVELOPER CONSULTATION</Badge>
          <h2 className="font-editorial-h2 text-2xl sm:text-4xl font-serif font-bold text-[#183529]">
            Structure Your Real Estate Project with CA Kavitha Vijay
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-xl mx-auto leading-relaxed">
            Ensure seamless project registration with AP RERA, obtain CA Form 3 withdrawal certificates, and manage joint development tax planning.
          </p>
          <div className="pt-4 flex justify-center gap-4 flex-wrap">
            <Button to="/contact" variant="primary" size="md" dualArrow>
              Schedule RERA Review
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

export default RERAConsultantPage;
