import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Building, Globe, ShieldAlert } from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';

export const LocationsPage: React.FC = () => {
  return (
    <div className="bg-brand-warm">
      {/* Header Banner */}
      <section className="bg-brand-surface py-14 sm:py-18 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Geographic Scope & Representation
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
              Service Footprint & Regional Presence
            </h1>
            <p className="mt-4 text-base sm:text-lg text-charcoal-muted leading-relaxed">
              Operating with our primary practice in Tirupati and providing scheduled client consultations, statutory audit representations, and advisory engagements across major commercial hubs.
            </p>
          </div>
        </div>
      </section>

      {/* Primary Practice Center */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-6 sm:p-10 border-2 border-brand-primary shadow-card mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-primary text-gold text-xs font-bold uppercase tracking-wider">
                  <Building className="w-3.5 h-3.5" />
                  <span>Principal Operating Practice</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
                  Tirupati, Andhra Pradesh
                </h2>
                <p className="text-sm text-charcoal leading-relaxed">
                  Headquarters for CA Kavitha & Associates under the direction of CA KavithaVijay SRJ. In-person client meetings, physical documentation reviews, and core audit planning are coordinated from our Tirupati chambers.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-brand-primary">
                  <a href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`} className="flex items-center gap-1.5 hover:text-gold-dark">
                    <Phone className="w-4 h-4 text-gold-dark" />
                    <span>{FIRM_DATA.contact.primaryPhone}</span>
                  </a>
                  <a href={`mailto:${FIRM_DATA.contact.email}`} className="flex items-center gap-1.5 hover:text-gold-dark">
                    <Mail className="w-4 h-4 text-gold-dark" />
                    <span>{FIRM_DATA.contact.email}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 bg-brand-surface p-6 rounded-xl border border-border text-center space-y-2">
                <span className="text-xs text-gold-dark uppercase tracking-wider font-semibold block">In-Person Consultations</span>
                <p className="text-xs text-charcoal-muted">Available by prior appointment for founders, directors, and taxpayers.</p>
                <Link
                  to="/contact"
                  className="inline-block mt-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep transition-colors"
                >
                  Schedule Appointment
                </Link>
              </div>
            </div>
          </div>

          {/* Regional Hubs & Client Coverage */}
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-1">
              Active Regional Client Coverage
            </span>
            <h3 className="font-serif text-2xl font-bold text-brand-primary">
              Metropolitan Client Engagements
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              We represent corporations, startups, and institutions with regular client visits and dedicated departmental representation in these cities:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FIRM_DATA.serviceFootprint.filter(f => f.city !== 'Tirupati').map((hub) => (
              <div
                key={hub.city}
                className="bg-white rounded-xl p-6 border border-border shadow-subtle hover:border-brand-primary transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center mb-4 border border-emerald-100">
                    <MapPin className="w-5 h-5 text-emerald-800" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-brand-primary mb-1">
                    {hub.city}
                  </h4>
                  <span className="text-xs text-charcoal-light block mb-3">{hub.state}</span>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    Client advisory, corporate secretarial coordination, GST audit assistance, and local stakeholder representation.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border text-xs font-semibold text-emerald-800">
                  Regional Client Coverage
                </div>
              </div>
            ))}
          </div>

          {/* Pan India & Remote Compliance Box */}
          <div className="mt-12 bg-white rounded-xl p-6 sm:p-8 border border-border shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary text-gold flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-brand-primary">
                  Pan-India Virtual Compliance & Advisory
                </h4>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-xl">
                  Through secure cloud accounting systems, encrypted document sharing, and MCA/ITD portals, we support corporate clients across India regardless of geography.
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep transition-colors shrink-0"
            >
              Consult Remotely
            </Link>
          </div>

          {/* Transparency & ICAI Regulatory Disclaimer */}
          <div className="mt-10 p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Practice Locations Notice (For Discussion):</strong>
              <p className="mt-0.5 text-amber-800">
                This presentation reflects Tirupati as the principal practice location and Chennai, Bengaluru, Hyderabad, and Coimbatore as active regional client coverage corridors. The exact classification and branch disclosure will be confirmed with the firm before production launch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
