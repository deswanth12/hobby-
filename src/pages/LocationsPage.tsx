import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  Globe, 
  ShieldAlert, 
  ArrowRight,
  Navigation
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const LocationsPage: React.FC = () => {
  const { data } = useFirmData();
  const firm = data || FIRM_DATA;

  const regionalCorridors = [
    {
      city: "Chennai",
      state: "Tamil Nadu",
      mandate: "High Court direct tax litigation, GST departmental representation, and statutory audits across the Guindy, Ambattur, and Sriperumbudur industrial corridors.",
      focus: "Appellate Representation & Corporate Audit"
    },
    {
      city: "Bengaluru",
      state: "Karnataka",
      mandate: "Technology venture virtual CFO mandates, Section 80-IAC filings, DPIIT compliance, ESOP planning, and cross-border audit coordination for tech startups.",
      focus: "Venture Virtual CFO & Startup Structuring"
    },
    {
      city: "Hyderabad",
      state: "Telangana",
      mandate: "Real estate RERA compliance, construction cost certifications, project finance CMA data preparation, and corporate tax scrutiny representation.",
      focus: "Real Estate RERA & Project Finance"
    },
    {
      city: "Coimbatore",
      state: "Tamil Nadu",
      mandate: "Manufacturing unit-cost audits, MSME financial controls, textile and engineering stock verification, and indirect tax health checks.",
      focus: "Manufacturing Cost & Inventory Verification"
    }
  ];

  return (
    <div className="bg-brand-ivory page-reveal text-brand-charcoal min-h-screen">
      <SEOHead
        title="CA Chambers in Tirupati & Regional Client Coverage | Kavitha & Associates"
        description="Principal practice chambers located at Bairagi Patteda, Tirupati, Andhra Pradesh, with verified regional client coverage across Chennai, Bengaluru, and Hyderabad."
        canonicalPath="/locations"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Locations', path: '/locations' }
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: 'Kavitha & Associates Chambers',
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
          hasMap: 'https://maps.app.goo.gl/p9ToGUtxqYDCghpF6'
        }}
      />

      {/* =========================================================================
          1. HEADER BANNER
          ========================================================================= */}
      <section className="bg-brand-surface py-20 sm:py-24 lg:py-28 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="font-editorial-meta text-brand-gold block mb-3">
              Practice Chambers & Regional Corridors • South India Footprint
            </span>
            <h1 className="font-editorial-h1 text-brand-forest">
              Principal Chambers in Tirupati. Active Regional Coverage.
            </h1>
            <p className="mt-4 font-editorial-body text-brand-muted leading-relaxed text-base sm:text-lg">
              Operating with our primary practice chambers in Tirupati, Andhra Pradesh, under the leadership of CA Kavitha Vijay, and providing scheduled client consultations, statutory audit representations, and advisory engagements across major commercial corridors in South India.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PRINCIPAL CHAMBERS (ASYMMETRIC 7:5 SPLIT)
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left 7 Columns: Architectural Dossier */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-forest/10 text-brand-forest font-editorial-meta text-xs border border-brand-forest/20">
                <Building className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                <span>Head Office & Registered Chambers</span>
              </div>

              <h2 className="font-editorial-h2 text-3xl sm:text-4xl font-bold text-brand-forest">
                Principal Chambers, Tirupati
              </h2>

              <p className="font-editorial-body text-base text-brand-muted leading-relaxed">
                Headquarters for Kavitha & Associates under the direction of <strong className="text-brand-forest font-semibold">CA Kavitha Vijay</strong> (B.Com, CA, CMA AIR 49), located at <strong className="text-brand-forest font-semibold">19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India</strong>. In-person client consultations, physical documentation reviews, audit workpaper archives, and core audit planning are coordinated directly from our Tirupati chambers.
              </p>

              {/* Verified GPS & Navigation Box */}
              <div className="p-5 rounded-2xl bg-brand-white border border-brand-border shadow-card space-y-3">
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <span className="font-editorial-meta text-brand-gold text-[11px] flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Verified Geodetic Coordinates</span>
                  </span>
                  <span className="font-editorial-meta text-brand-forest text-[11px]">
                    PIN 517501
                  </span>
                </div>
                <div className="font-mono text-xs text-brand-charcoal bg-brand-surface p-3 rounded-xl border border-brand-border/60">
                  GPS DMS: 13°37'09.2"N 79°25'05.0"E • Decimal: 13.6192242, 79.418046
                </div>
                <div className="pt-1">
                  <a
                    href={firm.contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-2 text-xs font-semibold text-brand-forest hover:text-brand-deep underline underline-offset-4"
                  >
                    <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>Open Tirupati Chambers in Google Maps (Directions)</span>
                  </a>
                </div>
              </div>

              {/* Direct Communication Channels */}
              <div className="pt-2 flex flex-wrap gap-6 text-xs font-semibold font-editorial-body">
                <a 
                  href={`tel:${firm.contact.primaryPhoneClean}`} 
                  className="min-h-[44px] inline-flex items-center gap-2 text-brand-forest hover:text-brand-deep"
                >
                  <Phone className="w-4 h-4 text-brand-gold" />
                  <span>{firm.contact.primaryPhone}</span>
                </a>
                <a 
                  href={`mailto:${firm.contact.email}`} 
                  className="min-h-[44px] inline-flex items-center gap-2 text-brand-forest hover:text-brand-deep"
                >
                  <Mail className="w-4 h-4 text-brand-gold" />
                  <span>{firm.contact.email}</span>
                </a>
              </div>
            </div>

            {/* Right 5 Columns: Double-Bezel Dark Plaque */}
            <div className="lg:col-span-5">
              <div className="double-bezel-dark animate-fade-up">
                <div className="double-bezel-inner-dark bg-brand-deep rounded-2xl p-7 sm:p-8 text-white border border-white/10 shadow-editorial-lg space-y-6">
                  <div className="flex items-center justify-between pb-5 border-b border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-brand-forest border border-brand-gold/40 flex items-center justify-center font-serif text-xl font-bold text-brand-gold shadow-inner">
                      KA
                    </div>
                    <span className="font-editorial-meta text-brand-gold bg-black/40 px-3 py-1 rounded-full border border-brand-gold/30 text-[10px]">
                      Principal Practice Register
                    </span>
                  </div>

                  <div>
                    <span className="font-editorial-meta text-brand-gold block mb-1 text-xs">
                      In-Person Chambers Consultations
                    </span>
                    <h3 className="font-editorial-h3 text-xl font-bold text-white">
                      Direct Senior Partner Review
                    </h3>
                    <p className="font-editorial-body text-xs text-emerald-100/90 mt-2 leading-relaxed">
                      Available by prior appointment for founders, directors, builders, and taxpayers seeking authoritative statutory audit, direct tax defense, or strategic corporate counsel.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10 text-xs font-editorial-body text-emerald-200">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                      <span>Chambers Hours: Mon – Sat (9:30 AM – 7:00 PM)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                      <span>Dedicated Confidential Consultation Room</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                      <span>Complete Working Paper Document Archival</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/contact"
                      className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-brand-deep font-editorial-meta text-xs font-bold uppercase tracking-wider transition-colors duration-200 shadow-md btn-tactile"
                    >
                      <span>Schedule Chambers Appointment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. THE 4 ACTIVE REGIONAL CORRIDORS (2x2 STRUCTURED LEDGER)
          ========================================================================= */}
      <section className="py-20 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Active Regional Client Coverage Corridors
            </span>
            <h2 className="font-editorial-h2 text-brand-forest">
              Metropolitan Client Engagements
            </h2>
            <p className="font-editorial-body text-sm sm:text-base text-brand-muted mt-3">
              We represent corporations, emerging tech startups, and institutions across South India through dedicated on-site audit visits, department representations, and regional client corridors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regionalCorridors.map((hub) => (
              <div
                key={hub.city}
                className="bg-brand-white rounded-2xl p-7 sm:p-8 border border-brand-border shadow-card card-tactile flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                        <MapPin className="w-5 h-5 text-brand-forest" />
                      </div>
                      <div>
                        <h3 className="font-editorial-h3 text-xl font-bold text-brand-forest">
                          {hub.city}
                        </h3>
                        <span className="font-editorial-body text-xs text-brand-muted">{hub.state}</span>
                      </div>
                    </div>
                    <span className="font-editorial-meta text-brand-gold text-[10px] bg-brand-surface px-2.5 py-1 rounded-full border border-brand-border">
                      Regional Corridor
                    </span>
                  </div>

                  <span className="font-editorial-meta text-brand-forest text-xs block mb-2">
                    {hub.focus}
                  </span>

                  <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {hub.mandate}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between text-xs">
                  <span className="font-editorial-meta text-brand-forest text-[11px]">
                    Regional Client Coverage
                  </span>
                  <a
                    href={firm.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center text-brand-forest font-semibold hover:text-brand-deep underline underline-offset-2 text-xs"
                  >
                    <span>Connect in {hub.city}</span>
                    <span className="ml-1">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PAN-INDIA SECURE DIGITAL AUDIT INFRASTRUCTURE
          ========================================================================= */}
      <section className="py-20 sm:py-24 bg-brand-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-white rounded-2xl p-8 sm:p-10 lg:p-12 border border-brand-border shadow-card card-tactile flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-brand-forest text-brand-gold flex items-center justify-center shrink-0 border border-brand-gold/40 shadow-inner">
                <Globe className="w-7 h-7" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold block mb-1">
                  Pan-India Reach
                </span>
                <h3 className="font-editorial-h3 text-2xl font-bold text-brand-forest">
                  Pan-India Virtual Compliance & Advisory Infrastructure
                </h3>
                <p className="font-editorial-body text-sm text-brand-muted mt-2 max-w-2xl leading-relaxed">
                  Through bank-grade encrypted document exchanges, secure cloud accounting pipelines, and direct integration with MCA V3 and ITD portals, we support corporate clients, NRIs, and ventures nationwide regardless of physical distance.
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-forest text-white font-editorial-meta text-xs hover:bg-brand-deep transition-colors shrink-0 shadow-card hover:shadow-card-hover btn-tactile border border-brand-gold/30"
            >
              <span>Consult Remotely</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-gold" />
            </Link>
          </div>

          {/* Institutional ICAI Regulatory Disclosure */}
          <div className="mt-12 p-6 rounded-2xl bg-brand-surface border border-brand-border flex items-start gap-4">
            <ShieldAlert className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
            <div>
              <span className="font-editorial-meta text-brand-forest block text-xs mb-1">
                ICAI Regulatory Disclosure & Regional Footprint Notice
              </span>
              <p className="font-editorial-body text-xs text-brand-muted leading-relaxed">
                In strict adherence to the Chartered Accountants Act, 1949 and regulations established by the Institute of Chartered Accountants of India (ICAI), the chambers at 19-12-46, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, constitute the firm's Principal Operating Chambers. The representations in Chennai, Bengaluru, Hyderabad, and Coimbatore indicate active regional client coverage corridors for regular on-site audits and client representations, and are not represented as autonomous branch offices under Section 27.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. APPOINTMENT SCHEDULING CTA
          ========================================================================= */}
      <section className="py-20 sm:py-24 bg-brand-surface text-center border-t border-brand-border">
        <div className="max-w-3xl mx-auto px-4">
          <span className="font-editorial-meta text-brand-gold block mb-2.5">
            Chambers & Virtual Meetings
          </span>
          <h2 className="font-editorial-h2 text-brand-forest">
            Schedule a Direct Chambers or Regional Session
          </h2>
          <p className="mt-4 font-editorial-body text-sm sm:text-base text-brand-muted leading-relaxed">
            Whether visiting our Tirupati chambers in person or coordinating an on-site corporate audit in Chennai, Bengaluru, Hyderabad, or Coimbatore, our team provides seamless statutory execution.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="min-h-[44px] btn-pill-action bg-brand-forest text-white hover:bg-brand-deep group font-editorial-meta text-xs shadow-card hover:shadow-card-hover border border-brand-gold/40"
            >
              <span>Book Practice Appointment</span>
              <span className="icon-badge bg-white/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-deep">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
            <a
              href={`tel:${firm.contact.primaryPhoneClean}`}
              className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-border bg-brand-white text-brand-forest font-editorial-meta text-xs hover:bg-brand-surface shadow-subtle transition-colors duration-200 active:scale-[0.98] btn-tactile"
            >
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>Call Chambers</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
