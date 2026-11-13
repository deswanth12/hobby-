import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Building2, 
  Navigation, 
  ArrowRight, 
  Home, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  Globe2, 
  MessageSquare
} from 'lucide-react';
import { FIRM_DATA } from '../../data/firmData';
import { SEOHead } from '../../components/SEOHead';
import { Badge } from '../components/common/Badge';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animation';

export const LocationsPage: React.FC = () => {
  const firm = FIRM_DATA;

  const regionalCorridors = [
    {
      city: 'Chennai',
      state: 'Tamil Nadu',
      focus: 'Corporate Tax, GST Scrutiny & High Court Litigation',
      mandate: 'Active representation before the High Court of Madras, ITAT Chennai Benches, GST Appellate Authorities, and corporate audits across Guindy, Sriperumbudur, and Ambattur industrial estates.',
      highlights: [
        'Direct Tax Appeals & CIT Litigation',
        'State & Central GST Appellate Advocacy',
        'Manufacturing & Automotive Supply Audits'
      ]
    },
    {
      city: 'Bengaluru',
      state: 'Karnataka',
      focus: 'Tech Startups, Virtual CFO & DPIIT Governance',
      mandate: 'Financial governance and Virtual CFO mandates for venture-backed tech startups, Section 80-IAC tax holiday certification, cap-table advisory, and compliance frameworks across Koramangala, Indiranagar, and Whitefield clusters.',
      highlights: [
        'Startup India DPIIT Recognition & Tax Exemption',
        'Unit-Cost Modeling & C-Suite MIS Retainers',
        'Pre-Series Due Diligence & Clean Cap Tables'
      ]
    },
    {
      city: 'Hyderabad',
      state: 'Telangana',
      focus: 'RERA Escrow Certification & Infrastructure Audits',
      mandate: 'Real estate advisory for builders and developers across Telangana and Rayalaseema border corridors, statutory Form 3 escrow withdrawal certifications, joint development tax structuring, and project finance CMA packs.',
      highlights: [
        'TS RERA & AP RERA Section 4(2)(l)(D) Certificates',
        'Section 45(5A) Joint Development Tax Deferral',
        'Bank CMA Data & Project Working Capital Limits'
      ]
    },
    {
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      focus: 'Industrial MSME Cost Modeling & Stock Audits',
      mandate: 'Cost accounting, inventory valuation under CARO 2020 / Ind AS 2, Section 43B(h) MSME payment compliance, and financial health audits for textile, foundry, and precision engineering enterprises.',
      highlights: [
        'Physical Stock Verification & Work-in-Progress Audits',
        'MSME Section 43B(h) 45-Day Payment Audit Checks',
        'Cost-Volume-Profit Margin Optimization'
      ]
    }
  ];

  return (
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen texture-warm-ivory page-reveal">
      <SEOHead
        title="CA Chambers in Tirupati & Regional Client Coverage | Kavitha & Associates"
        description="Principal practice chambers located at Bairagi Patteda, Tirupati, Andhra Pradesh, with verified regional client coverage across Chennai, Bengaluru, and Hyderabad."
        canonicalPath="/locations"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Locations & Chambers', path: '/locations' }
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: 'Kavitha & Associates Chartered Accountants - Principal Chambers',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda',
            addressLocality: 'Tirupati',
            addressRegion: 'Andhra Pradesh',
            postalCode: '517501',
            addressCountry: 'IN'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 13.6192242,
            longitude: 79.418046
          },
          telephone: '+919626350900',
          openingHours: 'Mo-Sa 09:30-19:00'
        }}
      />

      {/* 1. EDITORIAL HEADER BANNER */}
      <section className="bg-[#071B14] text-[#F1EBDD] py-12 sm:py-16 md:py-20 border-b border-[#B49A64]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal delay={60} duration={650}>
            <div>
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#D8D0BE]">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-white transition-colors min-h-[44px] py-2">
              <Home className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#B49A64]/50" />
            <span className="text-[#B49A64] font-semibold" aria-current="page">Locations</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B241C] text-[#B49A64] font-mono text-xs mb-4 border border-[#B49A64]/40 min-h-[44px]">
              <MapPin className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
              <span>Chambers &amp; Practice Footprint • Editorial Marker 08</span>
            </div>
            
            <h1 className="font-editorial-h1 text-[#F1EBDD] font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Principal Chambers in Tirupati. Active Regional Coverage.
            </h1>
            
            <p className="mt-4 font-editorial-body text-sm sm:text-base text-[#D8D0BE] leading-relaxed">
              Our principal practice chambers are located in the historic temple city and commercial junction of Tirupati, Andhra Pradesh. We deliver partner-led Chartered Accountancy and Cost Advisory engagements across strategic regional corridors including Chennai, Bengaluru, Hyderabad, and Coimbatore.
            </p>
            </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. PRINCIPAL CHAMBERS DOSSIER (7:5 ASYMMETRIC SPLIT) */}
      <section className="py-12 sm:py-16 lg:py-20 border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Reveal delay={60} duration={650}>
            <div className="mb-10">
              <Badge variant="gold" className="text-[#7E5E1E] border-[#D8D0BE] bg-[#FAF7F0] mb-3">
                HEAD OFFICE &amp; REGISTRATION
              </Badge>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#35271F]">
                Principal Chambers Dossier
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] mt-1 max-w-2xl">
                All statutory audit certifications, tax filings, secretarial documentation, and physical evidence archives are centralized at our registered practice chambers in Tirupati.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Columns: Practice Registry & Physical Address */}
            <div className="lg:col-span-7 space-y-6">
              <Reveal direction="left" delay={80} duration={650}>
                <div className="bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] p-6 sm:p-8 shadow-sm space-y-6 transition-all duration-300 hover:border-[#B49A64]/60">
                
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#071B14] border border-[#B49A64]/60 flex items-center justify-center font-serif text-xl font-bold text-[#B49A64] shrink-0 shadow-inner">
                    KA
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-[#183529] bg-emerald-100/70 px-2.5 py-0.5 rounded border border-emerald-300">
                        PRIMARY CHAMBERS
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#7E5E1E] bg-[#F1EBDD] px-2.5 py-0.5 rounded border border-[#D8D0BE]">
                        REGISTERED HEAD OFFICE
                      </span>
                    </div>
                    <h3 className="font-editorial-h3 text-xl font-serif font-bold text-[#35271F] mt-1">
                      Kavitha &amp; Associates
                    </h3>
                    <p className="font-editorial-body text-xs text-[#525954]">
                      Chartered Accountants &amp; Financial Governance Advisory
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D8D0BE] space-y-4">
                  
                  {/* Physical Address */}
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-[#7E5E1E] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#7E5E1E] font-mono block">
                        Chambers Address
                      </span>
                      <p className="font-editorial-body text-sm font-semibold text-[#35271F] mt-0.5 leading-relaxed">
                        19-12-46, 1st Floor, Near Bairagipetteda Arch,<br />
                        Bairagi Patteda, Tirupati – 517501,<br />
                        Andhra Pradesh, India
                      </p>
                      <span className="inline-block mt-1 font-mono text-[11px] text-[#525954] bg-[#F1EBDD] px-2 py-0.5 rounded border border-[#D8D0BE]">
                        Landmark: Adjacent to Bairagipetteda Arch
                      </span>
                    </div>
                  </div>

                  {/* GPS Coordinates */}
                  <div className="flex items-start gap-3.5">
                    <Navigation className="w-5 h-5 text-[#7E5E1E] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#7E5E1E] font-mono block">
                        Verified Geolocation
                      </span>
                      <p className="font-mono text-xs text-[#35271F] mt-0.5">
                        {firm.contact.geoCoordinates.dms}
                      </p>
                      <p className="font-mono text-[11px] text-[#525954]">
                        Decimal: {firm.contact.geoCoordinates.latitude}, {firm.contact.geoCoordinates.longitude}
                      </p>
                    </div>
                  </div>

                  {/* Visiting Hours */}
                  <div className="flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-[#7E5E1E] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#7E5E1E] font-mono block">
                        Consultation &amp; Filing Hours
                      </span>
                      <p className="font-editorial-body text-sm text-[#35271F] mt-0.5 font-medium">
                        Monday – Saturday: 9:30 AM – 7:00 PM
                      </p>
                      <p className="font-editorial-meta text-xs text-[#7E5E1E]">
                        Sunday: Closed for statutory filings • Prior appointment recommended for in-person consultations.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Direct Communications Matrix */}
                <div className="pt-4 border-t border-[#D8D0BE] grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`tel:${firm.contact.primaryPhoneClean}`}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE] text-[#183529] hover:bg-[#FAF7F0] transition-colors min-h-[44px]"
                  >
                    <Phone className="w-4 h-4 text-[#B49A64] shrink-0" />
                    <div className="text-left overflow-hidden">
                      <span className="block text-[10px] uppercase font-mono text-[#7E5E1E]">Telephone</span>
                      <span className="font-mono text-xs font-semibold truncate block">{firm.contact.primaryPhone}</span>
                    </div>
                  </a>

                  <a
                    href={`mailto:${firm.contact.email}`}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE] text-[#183529] hover:bg-[#FAF7F0] transition-colors min-h-[44px]"
                  >
                    <Mail className="w-4 h-4 text-[#B49A64] shrink-0" />
                    <div className="text-left overflow-hidden">
                      <span className="block text-[10px] uppercase font-mono text-[#7E5E1E]">Email Chambers</span>
                      <span className="font-mono text-xs font-semibold truncate block">{firm.contact.email}</span>
                    </div>
                  </a>
                </div>

                {/* Statutory Registration Summary */}
                <div className="pt-4 border-t border-[#D8D0BE] text-xs text-[#525954] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#7E5E1E]">Practice Discipline:</span>
                    <span className="font-medium text-[#35271F]">Chartered Accountancy &amp; Cost Advisory</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#7E5E1E]">Supervising Partner:</span>
                    <span className="font-medium text-[#35271F]">CA Kavitha Vijay (CMA AIR 49 ICMAI)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#7E5E1E]">Jurisdiction:</span>
                    <span className="font-medium text-[#35271F]">Tirupati • Andhra Pradesh &amp; Pan-India Corridors</span>
                  </div>
                </div>

              </div>
            </Reveal>
            </div>

            {/* Right 5 Columns: Interactive Map View & External Link */}
            <div className="lg:col-span-5 space-y-4">
              <Reveal direction="right" delay={120} duration={650}>
                <div className="bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] p-2 sm:p-2.5 shadow-md transition-all duration-300 hover:border-[#B49A64]/60">
                  <div className="relative rounded-xl overflow-hidden border border-[#D8D0BE] bg-[#071B14] aspect-[4/3] sm:aspect-[16/11]">
                    
                    {/* Google Maps Embed iframe */}
                    <iframe
                      title="Kavitha and Associates Practice Chambers Map"
                      src={`https://www.google.com/maps?q=${firm.contact.geoCoordinates.latitude},${firm.contact.geoCoordinates.longitude}&hl=en&z=16&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay Coordinates Pill */}
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      <div className="bg-[#071B14]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#B49A64]/40 text-[11px] font-mono text-[#F1EBDD] shadow-sm flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B49A64]" />
                        <span>{firm.contact.geoCoordinates.dms}</span>
                      </div>
                    </div>

                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-serif font-bold text-sm text-[#35271F] block">
                          Navigation &amp; Driving Directions
                        </span>
                        <span className="text-xs text-[#525954]">
                          Located near Bairagipetteda Arch on Tirupati municipal route
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href={firm.contact.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#183529] hover:bg-[#071B14] text-white text-xs font-semibold transition-colors min-h-[44px]"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#B49A64]" />
                      </a>

                      <a
                        href={firm.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#D8D0BE] bg-[#F1EBDD] hover:bg-[#FAF7F0] text-[#183529] text-xs font-semibold transition-colors min-h-[44px]"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#7E5E1E]" />
                        <span>Live Location on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                </div>

                {/* Transit & Accessibility Note */}
                <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#D8D0BE] text-xs text-[#525954] space-y-1 mt-4">
                  <span className="font-bold text-[#35271F] block font-mono text-[11px] uppercase tracking-wider">
                    Transit Proximity:
                  </span>
                  <p>• 2.5 km from Tirupati Central Railway Station (TPTY)</p>
                  <p>• 3.0 km from Tirupati APSRTC Central Bus Station</p>
                  <p>• 14 km from Tirupati International Airport (Renigunta)</p>
                </div>
              </Reveal>
            </div>

          </div>

        </div>
      </section>

      {/* 3. 4 REGIONAL CLIENT COVERAGE CORRIDORS */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Reveal delay={60} duration={650}>
            <div className="max-w-3xl mb-12">
              <Badge variant="gold" className="text-[#7E5E1E] border-[#D8D0BE] bg-[#F1EBDD] mb-3">
                REGIONAL CLIENT ADVISORY
              </Badge>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#35271F]">
                Active Regional Engagement Corridors
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] mt-2 leading-relaxed">
                While our statutory chambers and working papers remain centralized in Tirupati, our practice maintains continuous advisory engagements across southern India's primary industrial and commercial centers.
              </p>
            </div>
          </Reveal>

          <StaggerContainer staggerMs={80} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regionalCorridors.map((corridor, i) => (
              <StaggerItem key={corridor.city} index={i} distance={18} durationMs={550}>
                <div
                  className="h-full bg-[#F1EBDD] rounded-2xl border border-[#D8D0BE] p-6 sm:p-8 flex flex-col justify-between card-interactive transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64] hover:shadow-card-hover"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#7E5E1E]" />
                        <h3 className="font-editorial-h3 text-xl font-serif font-bold text-[#35271F]">
                          {corridor.city}
                        </h3>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-[#7E5E1E] bg-[#FAF7F0] px-2.5 py-0.5 rounded border border-[#D8D0BE]">
                        {corridor.state}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-[#183529] block mb-2 font-mono">
                      {corridor.focus}
                    </span>

                    <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed mb-4">
                      {corridor.mandate}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-[#D8D0BE]/70">
                      {corridor.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#35271F]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#183529] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#D8D0BE] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#7E5E1E]">Engagement Model: In-Person / Hybrid</span>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#183529] hover:text-[#071B14] min-h-[44px]"
                    >
                      <span>Request Corridor Consultation</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B49A64]" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

        </div>
      </section>

      {/* 4. PAN-INDIA ENCRYPTED VIRTUAL INFRASTRUCTURE */}
      <section className="py-12 sm:py-16 bg-[#071B14] text-[#F1EBDD] border-b border-[#B49A64]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <Reveal direction="left" delay={60} duration={650}>
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183529] text-[#B49A64] text-xs font-mono border border-[#B49A64]/30">
                    <Lock className="w-3.5 h-3.5 text-[#B49A64]" />
                    <span>CONFIDENTIAL CLIENT DATA ENVIRONMENT</span>
                  </div>

                  <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-white">
                    Pan-India Encrypted Virtual Infrastructure
                  </h2>

                  <p className="font-editorial-body text-xs sm:text-sm text-[#D8D0BE] leading-relaxed">
                    For non-resident Indian clients, cross-state enterprises, and tech companies operating outside Andhra Pradesh, our chambers offer a fully encrypted digital delivery framework. We execute end-to-end statutory audits, ROC secretarial filings, and monthly Virtual CFO governance via secure cloud transmission.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 transition-all duration-300 hover:border-[#B49A64]/60">
                      <span className="font-mono text-xs font-bold text-[#B49A64] block mb-1">
                        Direct MCA &amp; ITD API Gateway
                      </span>
                      <p className="text-xs text-[#D8D0BE]">
                        Direct digital signature (DSC) token handshake for MCA V3, GSTN, and Income Tax portals without physical paper transit.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 transition-all duration-300 hover:border-[#B49A64]/60">
                      <span className="font-mono text-xs font-bold text-[#B49A64] block mb-1">
                        Encrypted Evidence Vaults
                      </span>
                      <p className="text-xs text-[#D8D0BE]">
                        Bank-grade AES-256 cloud repositories for audit working papers, voucher samples, and corporate secretarial records.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal direction="right" delay={120} duration={650}>
                <div className="p-6 sm:p-8 rounded-2xl bg-[#0B241C] border border-[#B49A64]/40 space-y-4 transition-all duration-300 hover:border-[#B49A64]/80">
                  <Globe2 className="w-8 h-8 text-[#B49A64]" />
                  <h3 className="font-editorial-h3 text-xl font-serif font-bold text-white">
                    Pan-India Virtual CFO &amp; Tax Engagements
                  </h3>
                  <p className="font-editorial-body text-xs text-[#D8D0BE] leading-relaxed">
                    Engage our chambers remotely regardless of your corporate headquarters. We conduct structured video board reviews, coordinate faceless tax appeals, and deliver periodic MIS packages to leadership across India.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B49A64] text-[#071B14] hover:bg-[#F1EBDD] font-semibold text-xs tracking-wide transition-all shadow-md min-h-[44px]"
                    >
                      <span>Schedule Virtual Chamber Session</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>

        </div>
      </section>

      {/* 5. ICAI REGULATORY DISCLOSURE NOTICE */}
      <section className="py-10 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={60} duration={650}>
            <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] flex items-start gap-4 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#7E5E1E] shrink-0 mt-0.5" />
              <div className="text-xs text-[#525954] leading-relaxed space-y-1">
                <strong className="text-[#35271F] block text-sm font-semibold mb-1 font-serif">
                  Mandatory Regulatory Disclosure • Chartered Accountants Act, 1949
                </strong>
                <p className="font-editorial-body text-xs text-[#525954]">
                  In compliance with the regulations issued by the Council of the Institute of Chartered Accountants of India (ICAI) under the Chartered Accountants Act, 1949, and specifically Section 27 thereof: Kavitha &amp; Associates operates exclusively from its registered Principal Chambers in Tirupati, Andhra Pradesh. Mention of regional corridors (Chennai, Bengaluru, Hyderabad, Coimbatore) denotes active client representation, institutional liaison, and commercial advisory footprint serviced centrally from Tirupati. These regional corridors do not constitute autonomous branch offices under Section 27.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. APPOINTMENT BOOKING CTA DESK */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F1EBDD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <Reveal delay={60} duration={650}>
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7E5E1E] block">
                CHAMBERS APPOINTMENTS &amp; INTAKE
              </span>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#35271F]">
                Visit Our Chambers or Book a Virtual Session
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-xl mx-auto leading-relaxed">
                Whether visiting our Tirupati chambers in person or collaborating through our encrypted virtual channel, our team is prepared to assist with your statutory audit, tax planning, and strategic finance requirements.
              </p>
              <div className="pt-4 flex justify-center items-center gap-3 flex-wrap">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#183529] text-white hover:bg-[#071B14] font-semibold text-xs tracking-wide transition-all shadow-md min-h-[44px]"
                >
                  <span>Schedule Practice Consultation</span>
                  <ArrowRight className="w-4 h-4 text-[#B49A64]" />
                </Link>
                <a
                  href={firm.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D8D0BE] bg-[#FAF7F0] text-[#35271F] hover:bg-[#F1EBDD] font-semibold text-xs tracking-wide transition-all min-h-[44px]"
                >
                  <MessageSquare className="w-4 h-4 text-[#7E5E1E]" />
                  <span>Connect on WhatsApp</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
};

export default LocationsPage;
