import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Scale, 
  ChevronDown,
  FileCheck,
  Rocket,
  MapPin,
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const CompanyRegistrationPage: React.FC = () => {
  const { data } = useFirmData();
  const firm = data || FIRM_DATA;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const corpStreams = [
    {
      id: 'pvt-ltd',
      title: 'Private Limited Company Incorporation',
      statute: 'Companies Act, 2013 & SPICe+ (INC-32) Framework',
      scope: 'End-to-end company formation via MCA SPICe+ Part A (Name Reservation) and Part B (Incorporation). Drafting customized Memorandum of Association (e-MoA INC-33) and Articles of Association (e-AoA INC-34), obtaining PAN, TAN, EPFO, ESIC, Professional Tax, and bank account integration via AGILE-PRO-S.',
      deliverable: 'Certificate of Incorporation (CoI) with Corporate Identification Number (CIN), PAN, TAN & e-MoA/AoA',
      threshold: 'Minimum 2 Directors & 2 Shareholders (Can be the same individuals); ₹1 Lakh Authorized Capital recommended',
      documents: ['PAN & Aadhaar / Passport of Directors', 'Passport Size Photos of Directors', 'Electricity Bill / Municipal Tax Receipt of Registered Office', 'NOC from Landlord / Property Owner']
    },
    {
      id: 'llp-reg',
      title: 'Limited Liability Partnership (LLP) Registration',
      statute: 'Limited Liability Partnership Act, 2008 & FiLLiP Rules',
      scope: 'Formation of LLP offering corporate limited liability with partnership operational simplicity. Name reservation via RUN-LLP, drafting comprehensive LLP Agreement covering profit ratios and dispute governance, and Form 3 filing with ROC.',
      deliverable: 'LLP Registration Certificate, Form 3 Approved Agreement & Designated Partner Identification Numbers (DPIN)',
      threshold: 'Minimum 2 Designated Partners; Ideal for Professional Firms, Family Businesses & Service Entities',
      documents: ['PAN & Aadhaar of Designated Partners', 'Registered Office Proof in Andhra Pradesh / Tirupati', 'Drafted Capital Contribution Matrix', 'Bank Account Verification']
    },
    {
      id: 'startup-india',
      title: 'DPIIT Startup India Recognition & 80-IAC Exemptions',
      statute: 'Department for Promotion of Industry and Internal Trade (DPIIT) Norms',
      scope: 'Securing official Startup India recognition for innovation-driven enterprises in Tirupati. Assistance with Inter-Ministerial Board (IMB) application for 3-consecutive-year 100% tax holiday under Section 80-IAC and Angel Tax relief under Section 56(2)(viib).',
      deliverable: 'DPIIT Recognition Certificate, Startup India Portal Registration & Section 80-IAC Application Dossier',
      threshold: 'Private Limited or LLP incorporated within last 10 years with annual turnover not exceeding ₹100 Crores',
      documents: ['Certificate of Incorporation & MoA/AoA', 'Pitch Deck / Business Model Explaining Innovation & Scalability', 'Website / App Link or Prototype Demonstration', 'Financial Statements or Projected Financials']
    },
    {
      id: 'roc-annual',
      title: 'Annual ROC Compliance (AOC-4, MGT-7 & DIR-3 KYC)',
      statute: 'Sections 92, 137 & Section 196, Companies Act, 2013',
      scope: 'Preparation and statutory e-filing of audited Financial Statements (Form AOC-4), Annual Return (Form MGT-7/7A), Director KYC verification (DIR-3 KYC Web/e-Form), and Annual Return of Deposits (Form DPT-3) to avoid severe per-day late penalties.',
      deliverable: 'MCA Service Request Number (SRN) Receipts, Approved Filing Challans & Secretarial Compliance Register',
      threshold: 'Mandatory Annual Obligation for All Incorporated Private & Public Companies in India',
      documents: ['Audited Financial Statements Signed by Auditor and Directors', 'Directors’ Report with Statutory Disclosures', 'Shareholder & Share Transfer Register', 'Board Meeting Minutes & AGM Resolutions']
    },
    {
      id: 'opc-section8',
      title: 'OPC & Section 8 NGO Company Registration',
      statute: 'Section 3(1)(c) & Section 8, Companies Act, 2013',
      scope: 'Single-founder company formation via One Person Company (OPC) or non-profit social organization via Section 8 Company. Drafting specialized charter documents without commercial profit distribution clauses.',
      deliverable: 'Section 8 License from Central Government (ROC) & Certificate of Incorporation',
      threshold: 'Sole Founders (OPC) or Social Entrepreneurs, Educational Trusts & Research Foundations in Tirupati',
      documents: ['Identity & Address Proof of Founder / Promoters', 'Objects Clause & Projected Income/Expenditure Estimate', 'Registered Office Documentation', 'Consent Letters & Declarations']
    },
    {
      id: 'mca-restructuring',
      title: 'Director Changes, Share Transfers & Capital Increases',
      statute: 'Companies Act, 2013 read with PAS Rules',
      scope: 'Procedural secretarial modifications: Appointment or resignation of Directors (Form DIR-12), alteration of authorized share capital (Form SH-7), allotment of shares (Form PAS-3), and change of registered office address (Form INC-22).',
      deliverable: 'Board Resolutions, Statutory Notices, Stamped Share Certificates & MCA Approval Letters',
      threshold: 'Expanding Companies Raising Capital, Restructuring Equity, or Re-organizing Boards',
      documents: ['Board & Shareholder Resolutions (Special/Ordinary)', 'Form SH-4 Stamped Transfer Deeds', 'Updated Register of Members and Directors', 'Valuation Reports if shares are issued at premium']
    }
  ];

  const corpFaqs = [
    {
      q: 'Which legal structure is best for a new business in Tirupati: Private Limited Company or LLP?',
      a: 'A Private Limited Company is the standard legal structure for venture capital investment, angel funding, employee stock options (ESOPs), and DPIIT startup tax exemptions (under Section 80-IAC). An LLP provides corporate limited liability with lower mandatory secretarial filing burdens and no dividend distribution tax complexities, making it ideal for consulting firms, professional practices, and closely held service businesses.',
      ref: 'Companies Act, 2013 & Limited Liability Partnership Act, 2008'
    },
    {
      q: 'How long does it take to incorporate a Private Limited Company in Andhra Pradesh through CA Kavitha & Associates?',
      a: 'Under the integrated SPICe+ MCA-21 platform, incorporation typically takes 3 to 7 business days once all required identity documents, DSCs (Digital Signature Certificates), and registered office proofs are assembled. The process includes name approval, DIN generation, certificate of incorporation, PAN, TAN, and bank account opening in a single unified workflow.',
      ref: 'MCA SPICe+ (INC-32) Process, Ministry of Corporate Affairs'
    },
    {
      q: 'What are the consequences of failing to file annual ROC forms (AOC-4 and MGT-7) on time?',
      a: 'The Ministry of Corporate Affairs imposes severe statutory penalties for delayed filings. Under Section 403 of the Companies Act, 2013, a mandatory additional fee of ₹100 per day per form is levied without any upper cap. Furthermore, continuous default for two consecutive years can result in director disqualification under Section 164(2) for 5 years and company strike-off by the Registrar of Companies (ROC).',
      ref: 'Section 403 & Section 164(2), Companies Act, 2013'
    },
    {
      q: 'What is the minimum capital requirement to register a company in Tirupati?',
      a: 'The Companies (Amendment) Act eliminated the earlier requirement of mandatory minimum paid-up capital of ₹1 Lakh for Private Limited Companies. A company can now be incorporated with nominal paid-up capital of ₹1,000 or ₹10,000, though having an authorized capital of ₹1,00,000 is standard practice.',
      ref: 'Section 2(68) & Amendment Act, 2015'
    }
  ];

  return (
    <div className="bg-brand-ivory page-reveal text-brand-charcoal min-h-screen">
      <SEOHead
        title="Company Registration in Tirupati | ROC | Kavitha & Associates"
        description="Expert company registration in Tirupati. CA Kavitha & Associates provides Private Limited, LLP, OPC incorporation, DPIIT Startup India & annual ROC compliance."
        canonicalPath="/services/company-registration-tirupati"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Company Registration in Tirupati', path: '/services/company-registration-tirupati' }
        ]}
        jsonLd={[
          {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Company Incorporation & ROC Compliance Services in Tirupati',
          serviceType: 'Corporate Law and MCA Compliance',
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
          description: 'End-to-end Private Limited, LLP, and OPC incorporation, Startup India advisory, and annual MCA / ROC compliance led by CA Kavitha Vijay.'
        },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: corpFaqs.map(f => ({
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
              <Building2 className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Corporate Secretarial Practice • MCA 21</span>
            </div>
            <h1 className="font-editorial-h1 text-white">
              Company Registration in Tirupati
            </h1>
            <p className="mt-4 font-editorial-body text-emerald-100/90 leading-relaxed text-base sm:text-lg">
              Incorporate your Private Limited Company, LLP, or One Person Company with precision. Partner-led business formation, DPIIT Startup India registration, and annual ROC filing management supervised directly by CA Kavitha Vijay from our Tirupati chambers.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-brand-deep font-editorial-meta text-xs font-semibold hover:bg-brand-gold/90 transition-colors btn-tactile shadow-md"
              >
                <span>Start Company Incorporation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/?text=${encodeURIComponent('Hello CA Kavitha Vijay, I want to register a new Company / LLP in Tirupati.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-forest/60 text-white font-editorial-meta text-xs hover:bg-brand-forest border border-brand-gold/40 transition-colors btn-tactile"
              >
                <span>WhatsApp Incorporation Query</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. METHODOLOGY & ASSURANCE STRIP
          ========================================================================= */}
      <section className="py-12 bg-brand-surface border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-stagger">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <Rocket className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Turnaround Speed</span>
                <p className="font-editorial-h3 text-base font-bold text-brand-forest">
                  3 to 7 Days Fast-Track
                </p>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Streamlined SPICe+ filing ensuring rapid name approval, DIN allotment, and incorporation certificate delivery.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <Scale className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Legal Precision</span>
                <p className="font-editorial-h3 text-base font-bold text-brand-forest">
                  Custom MoA & AoA Charters
                </p>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Bespoke object clauses and governance agreements tailored to protect founder equity and future venture capital rounds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                <FileCheck className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold text-[10px] block mb-1">Annual Shield</span>
                <p className="font-editorial-h3 text-base font-bold text-brand-forest">
                  Guaranteed ROC Compliance
                </p>
                <p className="font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed">
                  Proactive annual filing of AOC-4, MGT-7, and DIR-3 KYC protecting directors from disqualification and penalties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CORPORATE SERVICES MATRIX (6 STREAMS)
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Practice Spectrum
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
              Corporate & Business Formation Solutions
            </h2>
            <p className="font-editorial-body text-sm text-brand-muted mt-2 leading-relaxed">
              From early-stage entity structuring and incorporation to ongoing secretarial compliance and capital table modifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-stagger">
            {corpStreams.map((stream) => (
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
                    <span>Inquire regarding this structure</span>
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
          4. LOCAL RELEVANCE & STARTUP ECOSYSTEM
          ========================================================================= */}
      <section className="py-16 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 scroll-reveal-left">
              <span className="font-editorial-meta text-brand-gold block">
                Local Business Incorporation
              </span>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
                Empowering Enterprises in Tirupati & Sri City Corridors
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                We handle the complete statutory incorporation process under the jurisdiction of the Registrar of Companies (ROC) for enterprises throughout Southern Andhra Pradesh:
              </p>
              <ul className="space-y-2.5 font-editorial-body text-xs sm:text-sm text-brand-charcoal">
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Tirupati & Renigunta Startups</strong>: Tech innovators, logistics companies, and e-commerce founders setting up Private Limited structures with DPIIT recognition.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Family Businesses Transitioning to LLP</strong>: Converting traditional proprietorships and partnerships into LLPs for asset protection and succession.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Manufacturing Units in APIIC Plots</strong>: Special industrial corporate chartering, factory licensing assistance, and capital structure advisory.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Educational & Healthcare Trusts</strong>: Registering Section 8 non-profit companies with specialized social objectives and CSR eligibility.</span>
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
                Meet directly with CA Kavitha Vijay at our Bairagi Patteda chambers to review founding documents, director eligibility, and shareholding agreements:
              </p>
              <div className="bg-brand-surface p-4 rounded-xl border border-brand-border/70 text-xs text-brand-charcoal space-y-1 mb-5">
                <strong className="block text-brand-forest">CA Kavitha & Associates</strong>
                <span>19-12-46, 1st Floor, Near Bairagipetteda Arch,</span>
                <span className="block">Bairagi Patteda, Tirupati – 517501, Andhra Pradesh</span>
                <span className="block text-brand-gold font-medium pt-1">Direct Partner Supervision</span>
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
          5. CORPORATE LAW FAQS
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Statutory Clarifications
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
              Frequently Asked Questions on Company Registration
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-brand-muted mt-2">
              Corporate governance guidance grounded in the Companies Act, 2013 and MCA rules.
            </p>
          </div>

          <div className="space-y-4">
            {corpFaqs.map((faq, idx) => (
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
            Partner-Led Corporate Services
          </span>
          <h2 className="font-editorial-h2 text-2xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
            Establish Your Enterprise on Sound Statutory Foundations
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            From company formation to post-incorporation bank account opening and annual ROC filings, work directly with CA Kavitha Vijay in Tirupati.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-brand-gold text-brand-deep font-editorial-meta text-xs font-semibold hover:bg-brand-gold/90 transition-colors btn-tactile shadow-md"
            >
              <span>Schedule Incorporation Consultation</span>
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
export default CompanyRegistrationPage;
