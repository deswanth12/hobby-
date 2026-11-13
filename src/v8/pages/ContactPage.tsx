import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  FileText,
  Lock,
  Building,
  Navigation
} from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import { ContactForm } from '../components/forms/ContactForm';
import { DotGrid, ArchitecturalLines, DecorativeLayer } from '../components/decorative';
import { ArchitecturalFrame } from '../components/common/ArchitecturalFrame';
import { Badge } from '../components/common/Badge';
import { useFirmProfile } from '../adapters/backendAdapter';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animation';

export const ContactPage: React.FC = () => {
  const firmProfile = useFirmProfile();
  const { contact } = firmProfile;

  return (
    <div className="bg-[#F1EBDD] text-[#071B14] min-h-screen page-reveal">
      <SEOHead
        title="Chambers Intake & Contact | Kavitha & Associates Chartered Accountants"
        description="Reach Kavitha & Associates in Tirupati, Andhra Pradesh. Direct telephone (+91 96263 50900), email (cakavithasrj@gmail.com), WhatsApp quick connect, and confidential consultation brief registration."
        canonicalPath="/contact"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact & Chambers Intake', path: '/contact' },
        ]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'AccountingService',
            name: 'Kavitha & Associates',
            legalName: 'Kavitha & Associates Chartered Accountants',
            url: 'https://kavithaassociates.com/contact',
            logo: 'https://kavithaassociates.com/favicon.svg',
            image: 'https://kavithaassociates.com/brand/ka-google-cover-banner.svg',
            telephone: '+919626350900',
            email: 'cakavithasrj@gmail.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda',
              addressLocality: 'Tirupati',
              addressRegion: 'Andhra Pradesh',
              postalCode: '517501',
              addressCountry: 'IN',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 13.6192242,
              longitude: 79.418046,
            },
            hasMap: 'https://maps.app.goo.gl/p9ToGUtxqYDCghpF6',
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:30',
                closes: '18:30',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday'],
                opens: '10:00',
                closes: '14:00',
              },
            ],
            founder: {
              '@type': 'Person',
              name: 'CA Kavitha Vijay',
              jobTitle: 'Practicing Chartered Accountant & Senior Partner',
              honorificPrefix: 'CA',
              description: 'B.Com, CA, CMA (AIR 49, The Institute of Cost Accountants of India - ICMAI)',
            },
          },
        ]}
      />

      {/* ---------------------------------------------------------------------
          Section 1: Editorial Hero
          --------------------------------------------------------------------- */}
      <section className="bg-[#071B14] text-[#F1EBDD] pt-12 sm:pt-16 lg:pt-20 pb-14 sm:pb-16 border-b border-[#B49A64]/25 texture-architectural-lines relative overflow-hidden">
        {/* Precision Dot System Top-Left Anchor */}
        <div className="absolute top-6 left-6 pointer-events-none hidden lg:block opacity-30" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            {[0, 16, 32].map((x) =>
              [0, 16, 32].map((y) => (
                <circle key={`${x}-${y}`} cx={x + 4} cy={y + 4} r="1.5" fill="#B49A64" />
              ))
            )}
          </svg>
        </div>

        {/* Contact Ambient Decorative Layer */}
        <DecorativeLayer>
          <DotGrid
            variant="bronze"
            width={220}
            height={220}
            className="absolute -top-8 -right-8 opacity-18 hidden md:block"
          />
        </DecorativeLayer>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal delay={60} duration={650}>
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Badge variant="kicker">CHAMBERS INTAKE &amp; CONSULTATIONS</Badge>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B241C] border border-[#B49A64]/30 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#B49A64] animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-semibold text-[#B49A64] tracking-wider uppercase">
                    DIRECT PARTNER ACCESS • TIRUPATI
                  </span>
                </div>
              </div>

              <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F1EBDD] leading-[1.15]">
                Reach Our Practicing Chambers in Tirupati
              </h1>

              <p className="font-editorial-body text-sm sm:text-base text-[#D8D0BE] leading-relaxed border-l-2 border-[#B49A64]/50 pl-4">
                Connect directly with our practice desk for statutory audits, direct tax scrutiny proceedings, corporate registrations, and management reporting. All client consultations and engagement records are maintained under the strict professional confidentiality standards of the ICAI Code of Ethics.
              </p>

              {/* Contact Header Double-Rule Accent */}
              <ArchitecturalLines type="double-rule" variant="bronze" length="90px" className="my-3.5 opacity-60" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Section 2: Split 5:7 Layout (Contact Grid & Embedded Intake Form)
          --------------------------------------------------------------------- */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F1EBDD] border-b border-[#D8D0BE] texture-warm-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left 5 Columns: Direct Chambers Contact Grid */}
            <div className="lg:col-span-5 space-y-6">
              <Reveal direction="left" delay={70} duration={650}>
                <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#7E5E1E] font-mono uppercase tracking-wider block mb-1">
                  OFFICIAL COORDINATES
                </span>
                <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#071B14]">
                  Direct Practice Channels
                </h2>
                <p className="font-editorial-body text-xs sm:text-sm text-[#525954] mt-2 leading-relaxed">
                  Choose your preferred channel below or register your consultation brief using the secure intake desk.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="space-y-4">
                
                {/* Physical Chambers Card */}
                <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-xs space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#B49A64]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#7E5E1E] uppercase tracking-wider block font-editorial-meta">
                        Physical Chambers Address
                      </span>
                      <p className="font-editorial-body text-xs sm:text-sm font-semibold text-[#071B14] mt-1 leading-snug">
                        {contact.streetAddress}, {contact.locality}, Andhra Pradesh {contact.postalCode}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#D8D0BE] flex items-center justify-between">
                    <span className="text-[11px] text-[#525954]">Geo: 13.6192242, 79.418046</span>
                    <a
                      href={contact.googleMapsUrl || "https://maps.app.goo.gl/p9ToGUtxqYDCghpF6"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F1EBDD] hover:bg-[#E8D5B5] text-[#183529] font-semibold text-xs border border-[#D8D0BE] transition-colors btn-tactile"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#7E5E1E]" />
                      <span>Google Maps Directions</span>
                      <ExternalLink className="w-3 h-3 text-[#7E5E1E]" />
                    </a>
                  </div>
                </div>

                {/* Telephone Desk Card */}
                <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-xs flex flex-col justify-between">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#B49A64]" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-[#7E5E1E] uppercase tracking-wider block font-editorial-meta">
                        Official Telephone Desk
                      </span>
                      <a
                        href={`tel:${contact.primaryPhoneClean}`}
                        className="font-serif text-lg font-bold text-[#071B14] hover:text-[#7E5E1E] transition-colors block"
                      >
                        {contact.primaryPhone}
                      </a>
                      <span className="text-xs text-[#525954] block">
                        Secondary Chambers Line: {contact.secondaryPhone}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#D8D0BE]">
                    <a
                      href={`tel:${contact.primaryPhoneClean}`}
                      className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#183529] hover:bg-[#071B14] text-[#F1EBDD] font-semibold text-xs border border-[#B49A64]/40 transition-colors btn-tactile"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#B49A64]" />
                      <span>Place Call to Chambers</span>
                    </a>
                  </div>
                </div>

                {/* Confidential Email Card */}
                <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-xs flex flex-col justify-between">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#B49A64]" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-[#7E5E1E] uppercase tracking-wider block font-editorial-meta">
                        Chambers Email Desk
                      </span>
                      <a
                        href={`mailto:${contact.email}`}
                        className="font-mono text-sm font-bold text-[#071B14] hover:text-[#7E5E1E] transition-colors block break-all"
                      >
                        {contact.email}
                      </a>
                      <span className="text-xs text-[#525954] block">
                        Direct delivery to senior partner desk
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#D8D0BE]">
                    <a
                      href={`mailto:${contact.email}`}
                      className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#FAF7F0] hover:bg-[#E8D5B5] text-[#071B14] font-semibold text-xs border border-[#D8D0BE] transition-colors btn-tactile"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#7E5E1E]" />
                      <span>Dispatch Confidential Email</span>
                    </a>
                  </div>
                </div>

                {/* WhatsApp Quick Connect Card */}
                <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-xs flex flex-col justify-between">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#0B241C] text-[#B49A64] flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-[#B49A64]" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-[#7E5E1E] uppercase tracking-wider block font-editorial-meta">
                        WhatsApp Quick Connect
                      </span>
                      <span className="font-serif text-sm font-bold text-[#071B14] block">
                        Direct Practice Handshake Link
                      </span>
                      <span className="text-xs text-[#525954] block">
                        Rapid document submission &amp; schedule verification
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#D8D0BE]">
                    <a
                      href={contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#071B14] hover:bg-[#183529] text-[#B49A64] font-semibold text-xs border border-[#B49A64]/40 transition-colors btn-tactile"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#B49A64]" />
                      <span>Open WhatsApp Consultation</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#B49A64]" />
                    </a>
                  </div>
                </div>

                {/* Consultation Hours Card */}
                <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-xs space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-[#B49A64]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#7E5E1E] uppercase tracking-wider block font-editorial-meta">
                        Chambers Consultation Hours
                      </span>
                      <div className="text-xs text-[#35271F] space-y-1.5 mt-2">
                        <div className="flex justify-between border-b border-[#D8D0BE]/60 pb-1">
                          <span className="font-medium">Monday – Friday:</span>
                          <span className="font-mono font-semibold text-[#071B14]">09:30 – 18:30 IST</span>
                        </div>
                        <div className="flex justify-between border-b border-[#D8D0BE]/60 pb-1">
                          <span className="font-medium">Saturday:</span>
                          <span className="font-mono font-semibold text-[#071B14]">10:00 – 14:00 IST</span>
                        </div>
                        <div className="flex justify-between pt-0.5">
                          <span className="font-medium text-[#7E5E1E]">Sunday:</span>
                          <span className="font-semibold text-[#7E5E1E]">Closed (By Prior Appointment for Urgent Scrutiny Matters)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Protocol Card */}
                <div className="p-5 rounded-2xl bg-[#F1EBDD] border border-[#B49A64]/40 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#7E5E1E]" />
                    <span className="font-editorial-meta text-xs font-bold uppercase tracking-wider text-[#7E5E1E]">
                      Consultation Protocol &amp; Ethics Guarantee
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#35271F]">
                    <li className="flex items-start gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#183529] shrink-0 mt-0.5" />
                      <span><strong>Document Confidentiality:</strong> All shared accounts, GST ledgers, and return filings are treated as strictly confidential under Section 126 of the Evidence Act and ICAI professional conduct rules.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#183529] shrink-0 mt-0.5" />
                      <span><strong>Conflict Checks:</strong> We conduct thorough independence and conflict-of-interest evaluations before accepting formal statutory audit appointments.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Building className="w-3.5 h-3.5 text-[#183529] shrink-0 mt-0.5" />
                      <span><strong>Direct Partner Oversight:</strong> Inquiries are addressed directly by CA Kavitha Vijay, ensuring seasoned statutory insight from the outset.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </Reveal>
        </div>

            {/* Right 7 Columns: Embedded ContactForm inside ArchitecturalFrame */}
            <div className="lg:col-span-7">
              <Reveal direction="right" delay={120} duration={650}>
                <div className="sticky top-28">
                  <ArchitecturalFrame variant="evergreen" className="shadow-editorial rounded-2xl transition-all duration-300 hover:border-[#B49A64]/70">
                    <div className="space-y-6">
                    <div className="border-b border-[#B49A64]/25 pb-4">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="kicker">SECURE INTAKE REGISTER</Badge>
                        <span className="text-[10px] font-mono text-[#AAB4A0]">ICAI Ethics Pull-Model Compliant</span>
                      </div>
                      <h3 className="font-editorial-h3 text-xl sm:text-2xl font-serif font-bold text-[#F1EBDD]">
                        Register a Consultation Brief
                      </h3>
                      <p className="font-editorial-body text-xs text-[#AAB4A0] mt-1.5 leading-relaxed">
                        Please outline your corporate statutory audit, direct tax scrutiny notice, GST litigation, or advisory requirement. Our chambers will review the brief and initiate contact under partner supervision.
                      </p>
                    </div>

                    {/* Embedded Contact Form Component */}
                    <ContactForm />
                  </div>
                </ArchitecturalFrame>
              </div>
            </Reveal>
          </div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Section 3: Location Guidance & Transit Dossier
          --------------------------------------------------------------------- */}
      <section className="py-12 sm:py-16 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer staggerMs={80} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem index={0} distance={18} durationMs={550}>
              <div className="h-full p-6 rounded-2xl bg-[#F1EBDD] border border-[#D8D0BE] card-interactive transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64]/60 hover:shadow-card-hover">
                <span className="text-[10px] uppercase font-bold text-[#7E5E1E] tracking-wider block font-editorial-meta mb-1">
                  LANDMARK IDENTIFIER
                </span>
                <h4 className="font-serif text-base font-bold text-[#071B14] mb-2">
                  Near Bairagipetteda Arch
                </h4>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Located on the 1st Floor at Door No. 19-12-46, directly adjacent to the prominent Bairagipetteda Arch entrance corridor, Bairagi Patteda, Tirupati.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem index={1} distance={18} durationMs={550}>
              <div className="h-full p-6 rounded-2xl bg-[#F1EBDD] border border-[#D8D0BE] card-interactive transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64]/60 hover:shadow-card-hover">
                <span className="text-[10px] uppercase font-bold text-[#7E5E1E] tracking-wider block font-editorial-meta mb-1">
                  TRANSIT ACCESSIBILITY
                </span>
                <h4 className="font-serif text-base font-bold text-[#071B14] mb-2">
                  Tirupati Rail &amp; Air Connections
                </h4>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Approximately 3.5 km from Tirupati Central Railway Station (TPTY) and 18 km from Tirupati International Airport (TIR), accessible via arterial ring roads.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem index={2} distance={18} durationMs={550}>
              <div className="h-full p-6 rounded-2xl bg-[#F1EBDD] border border-[#D8D0BE] card-interactive transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64]/60 hover:shadow-card-hover">
                <span className="text-[10px] uppercase font-bold text-[#7E5E1E] tracking-wider block font-editorial-meta mb-1">
                  PRIOR APPOINTMENT POLICY
                </span>
                <h4 className="font-serif text-base font-bold text-[#071B14] mb-2">
                  In-Chambers Appointments
                </h4>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  To guarantee uninterrupted partner attention and conflict verification, clients visiting chambers in person are requested to book an appointment slot in advance.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
