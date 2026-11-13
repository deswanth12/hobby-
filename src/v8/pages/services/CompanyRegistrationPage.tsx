import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  MapPin,
  Rocket,
  Scale,
  Award,
  ChevronRight,
  Home,
  MessageSquare,
  CheckSquare
} from 'lucide-react';
import { FIRM_DATA } from '../../../data/firmData';
import { SEOHead } from '../../../components/SEOHead';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Accordion, AccordionItem } from '../../components/common/Accordion';
import { StatutoryChecklistModal } from '../../components/common/StatutoryChecklistModal';
import { getRouteWhatsAppUrl } from '../../adapters/backendAdapter';

export const CompanyRegistrationPage: React.FC = () => {
  const firm = FIRM_DATA;
  const [checklistOpen, setChecklistOpen] = useState(false);

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
      scope: 'Securing official Startup India recognition for innovation-driven enterprises in Tirupati. Assistance with Inter-Ministerial Board (IMB) application for 3-consecutive-year 100% tax holiday under Section 80-IAC and Cap Table Valuation Advisory.',
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

  const corpFaqItems: AccordionItem[] = [
    {
      id: 'faq-pvt-vs-llp',
      title: 'Which legal structure is best for a new business in Tirupati: Private Limited Company or LLP?',
      statuteReference: 'Companies Act, 2013 & Limited Liability Partnership Act, 2008',
      content: (
        <p>
          A Private Limited Company is the standard legal structure for venture capital investment, angel funding, employee stock options (ESOPs), and DPIIT startup tax exemptions (under Section 80-IAC). An LLP provides corporate limited liability with lower mandatory secretarial filing burdens and no dividend distribution tax complexities, making it ideal for consulting firms, professional practices, and closely held service businesses.
        </p>
      )
    },
    {
      id: 'faq-incorporation-speed',
      title: 'How long does it take to incorporate a Private Limited Company in Andhra Pradesh through CA Kavitha & Associates?',
      statuteReference: 'MCA SPICe+ (INC-32) Process, Ministry of Corporate Affairs',
      content: (
        <p>
          Under the integrated SPICe+ MCA-21 platform, incorporation typically takes 3 to 7 business days once all required identity documents, DSCs (Digital Signature Certificates), and registered office proofs are assembled. The process includes name approval, DIN generation, certificate of incorporation, PAN, TAN, and bank account opening in a single unified workflow.
        </p>
      )
    },
    {
      id: 'faq-annual-roc-penalties',
      title: 'What are the consequences of failing to file annual ROC forms (AOC-4 and MGT-7) on time?',
      statuteReference: 'Section 403 & Section 164(2), Companies Act, 2013',
      content: (
        <p>
          The Ministry of Corporate Affairs imposes severe statutory penalties for delayed filings. Under Section 403 of the Companies Act, 2013, a mandatory additional fee of ₹100 per day per form is levied without any upper cap. Furthermore, continuous default for two consecutive years can result in director disqualification under Section 164(2) for 5 years and company strike-off by the Registrar of Companies (ROC).
        </p>
      )
    },
    {
      id: 'faq-min-capital',
      title: 'What is the minimum capital requirement to register a company in Tirupati?',
      statuteReference: 'Companies (Amendment) Act, 2015',
      content: (
        <p>
          There is no statutory minimum paid-up capital requirement to incorporate a Private Limited Company or LLP in India. Promoters can start with any nominal capital, such as ₹10,000 or ₹1,00,000, deposited into the company’s bank account post-incorporation prior to filing Form INC-20A (Commencement of Business).
        </p>
      )
    },
    {
      id: 'faq-post-incorporation',
      title: 'What are the mandatory post-incorporation compliances within the first 180 days?',
      statuteReference: 'Section 139(6) (ADT-1) & Section 10A (INC-20A), Companies Act, 2013',
      content: (
        <p>
          Following incorporation, every company must: (1) Appoint the first statutory auditor via Board Resolution within 30 days and file Form ADT-1; (2) Open the company bank account and deposit paid-up subscription capital; (3) File Form INC-20A (Declaration of Commencement of Business) within 180 days; and (4) Issue stamped share certificates to initial subscribers within 60 days.
        </p>
      )
    }
  ];

  const corpFaqAnswers: Record<string, string> = {
    'faq-pvt-vs-llp': 'A Private Limited Company is the standard legal structure for venture capital investment, angel funding, employee stock options (ESOPs), and DPIIT startup tax exemptions (under Section 80-IAC). An LLP provides corporate limited liability with lower mandatory secretarial filing burdens and no dividend distribution tax complexities.',
    'faq-incorporation-speed': 'Under the integrated SPICe+ MCA-21 platform, incorporation typically takes 3 to 7 business days once all required identity documents, DSCs (Digital Signature Certificates), and registered office proofs are assembled. The process includes name approval, DIN generation, certificate of incorporation, PAN, TAN, and bank account opening.',
    'faq-annual-roc-penalties': 'Under Section 403 of the Companies Act, 2013, a mandatory additional fee of ₹100 per day per form is levied without any upper cap for delayed ROC filings (AOC-4, MGT-7). Continuous default for two consecutive years can result in director disqualification under Section 164(2) for 5 years.',
    'faq-min-capital': 'There is no statutory minimum paid-up capital requirement to incorporate a Private Limited Company or LLP in India. Promoters can start with any nominal capital, such as ₹10,000 or ₹1,00,000, deposited post-incorporation.',
    'faq-post-incorporation': 'Following incorporation, every company must: (1) Appoint first statutory auditor via Board Resolution within 30 days and file Form ADT-1; (2) Deposit paid-up subscription capital; (3) File Form INC-20A within 180 days; and (4) Issue stamped share certificates.'
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Company Registration in Tirupati', path: '/services/company-registration-tirupati' }
  ];

  return (
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen page-reveal">
      <SEOHead
        title="Company Registration in Tirupati | ROC | Kavitha & Associates"
        description="Incorporate your Private Limited Company, LLP, or OPC in Tirupati with CA Kavitha & Associates. SPICe+ filing, MCA/ROC secretarial compliance & DPIIT Startup India."
        canonicalPath="/services/company-registration-tirupati"
        breadcrumbs={breadcrumbs}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Company Incorporation & Corporate Law Advisory in Tirupati',
            serviceType: 'Corporate Secretarial and Business Incorporation',
            provider: {
              '@type': 'AccountingService',
              '@id': 'https://kavithaassociates.com/#organization',
              name: 'Kavitha & Associates',
              url: 'https://kavithaassociates.com/',
              telephone: firm.contact.primaryPhone,
            },
            areaServed: ['Tirupati', 'Sri City', 'Renigunta', 'Chittoor', 'Nellore', 'Andhra Pradesh', 'India'],
            description: 'Fast-track corporate registration, LLP incorporation, ROC annual secretarial compliance, and Startup India DPIIT recognition led by CA Kavitha Vijay.'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: corpFaqItems.map(f => ({
              '@type': 'Question',
              name: f.title,
              acceptedAnswer: {
                '@type': 'Answer',
                text: corpFaqAnswers[f.id] || (typeof f.content === 'string' ? f.content : 'Corporate secretarial guidance governed by the Companies Act, 2013.')
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
            <span className="text-[#B49A64] font-semibold">Company Registration Practice</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge variant="kicker">PRAC-04 / CORPORATE GOVERNANCE</Badge>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#B49A64]">
                <Building2 className="w-4 h-4 text-[#B49A64] shrink-0" />
                <span>MCA V3 Fast-Track • Tirupati Chambers</span>
              </div>
            </div>

            <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F1EBDD] leading-tight">
              Entity Incorporation &amp; ROC Secretarial in Tirupati
            </h1>

            <p className="font-editorial-body text-sm sm:text-base text-[#F1EBDD]/80 leading-relaxed">
              Fast-track Private Limited company registration, Limited Liability Partnership (LLP) formation, DPIIT Startup India certification, and rigorous ROC secretarial governance. Directly supervised by CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI).
            </p>
          </div>
        </div>
      </section>

      {/* 2. 5-to-7 Day Incorporation Roadmap */}
      <section className="py-12 sm:py-16 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl space-y-2">
            <Badge variant="gold">SYSTEMATIC SPICe+ ROADMAP</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
              5–7 Day Incorporation Workflow
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954]">
              Structured milestone delivery through the Ministry of Corporate Affairs (MCA) V3 digital portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'DSC & DIN', desc: 'Procuring Class-3 Digital Signatures and Director Identification Numbers.' },
              { step: '02', title: 'Name Reservation', desc: 'Filing RUN / SPICe+ Part A with two unique corporate nomenclature choices.' },
              { step: '03', title: 'SPICe+ Part B', desc: 'Custom drafting of e-MoA, e-AoA, EPFO, ESIC, Professional Tax & AGILE-PRO-S.' },
              { step: '04', title: 'CoI Issuance', desc: 'Receipt of Certificate of Incorporation with PAN and TAN from Registrar of Companies.' },
              { step: '05', title: 'Post-Inc INC-20A', desc: 'Auditor appointment (ADT-1) and commencement of business verification within 180 days.' },
            ].map((st, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs flex flex-col justify-between">
                <div>
                  <span className="font-mono text-sm font-bold text-[#7E5E1E] block mb-2">{st.step}</span>
                  <h4 className="font-serif text-sm font-bold text-[#183529] mb-1">{st.title}</h4>
                  <p className="font-editorial-body text-[11px] text-[#525954] leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The 6 Corporate & Business Formation Disciplines */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#F1EBDD] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-2">
            <Badge variant="statutory">COMPANIES ACT, 2013 • 6 CORPORATE DISCIPLINES</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#183529]">
              Corporate &amp; Business Formation Solutions
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
              From early-stage entity structuring and incorporation to ongoing secretarial compliance and capital table modifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {corpStreams.map((stream) => (
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
                    <span>Inquire regarding this structure</span>
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

      {/* 4. Post-Incorporation Mandatory Compliance & DPIIT */}
      <section className="py-12 sm:py-16 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <Badge variant="gold">STARTUP ECOSYSTEM &amp; DPIIT</Badge>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
                Empowering Enterprises in Tirupati &amp; Sri City Corridors
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                We handle the complete statutory incorporation process under the jurisdiction of the Registrar of Companies (ROC) for enterprises throughout Southern Andhra Pradesh:
              </p>
              <ul className="space-y-2.5 font-editorial-body text-xs sm:text-sm text-[#35271F]">
                <li className="flex items-start gap-2">
                  <Rocket className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                  <span><strong>Tirupati &amp; Renigunta Startups:</strong> Tech innovators, logistics companies, and e-commerce founders setting up Private Limited structures with DPIIT recognition.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Scale className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                  <span><strong>Family Businesses Transitioning to LLP:</strong> Converting traditional proprietorships and partnerships into LLPs for asset protection and succession.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                  <span><strong>Manufacturing Units in APIIC Plots:</strong> Special industrial corporate chartering, factory licensing assistance, and capital structure advisory.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                  <span><strong>Educational &amp; Healthcare Trusts:</strong> Registering Section 8 non-profit companies with specialized social objectives and CSR eligibility.</span>
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
                Meet directly with CA Kavitha Vijay at our Bairagi Patteda chambers to review founding documents, director eligibility, and shareholding agreements:
              </p>
              <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#D8D0BE] text-xs text-[#35271F] space-y-1">
                <strong className="block text-[#183529]">CA Kavitha &amp; Associates</strong>
                <span>19-12-46, 1st Floor, Near Bairagipetteda Arch,</span>
                <span className="block">Bairagi Patteda, Tirupati – 517501, Andhra Pradesh</span>
                <span className="block text-[#7E5E1E] font-medium pt-1">Direct Partner Supervision</span>
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

      {/* 5. ROC Statutory FAQs Accordion */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F1EBDD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="gold">STATUTORY CLARIFICATIONS</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
              Frequently Asked Questions on Company Registration
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954]">
              Legal guidance based strictly on the Companies Act, 2013 and LLP Act, 2008.
            </p>
          </div>

          <Accordion items={corpFaqItems} defaultExpandedId="faq-pvt-vs-llp" />
        </div>
      </section>

      {/* 6. Consultation Desk CTA */}
      <section className="py-12 sm:py-16 bg-[#FAF7F0] text-center border-t border-[#D8D0BE]">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <Badge variant="gold">STARTUP INCORPORATION DESK</Badge>
          <h2 className="font-editorial-h2 text-2xl sm:text-4xl font-serif font-bold text-[#183529]">
            Incorporate Your Venture with CA Kavitha Vijay
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-xl mx-auto leading-relaxed">
            From name reservation to DPIIT recognition and capital structuring, launch your enterprise with institutional clarity.
          </p>
          <div className="pt-4 flex justify-center gap-3 flex-wrap">
            <Button to="/contact" variant="primary" size="md" dualArrow>
              Schedule Incorporation Discussion
            </Button>
            <a
              href={getRouteWhatsAppUrl('/services/company-registration-tirupati')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5 active:scale-95 min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>WhatsApp Startup Desk</span>
            </a>
            <button
              type="button"
              onClick={() => setChecklistOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#183529] hover:bg-[#294B39] text-[#B49A64] border border-[#B49A64]/50 text-xs font-semibold transition-all hover:-translate-y-0.5 active:scale-95 min-h-[44px]"
            >
              <CheckSquare className="w-4 h-4 text-[#B49A64]" />
              <span>SPICe+ Incorporation Kit</span>
            </button>
            <Button href={`tel:${firm.contact.primaryPhoneClean}`} variant="outline" size="md" leftIcon={<Phone className="w-4 h-4 text-[#B49A64]" />}>
              Call Senior Partner
            </Button>
          </div>
        </div>
      </section>

      <StatutoryChecklistModal
        isOpen={checklistOpen}
        onClose={() => setChecklistOpen(false)}
        defaultTab="incorporation"
      />
    </div>
  );
};

export default CompanyRegistrationPage;
