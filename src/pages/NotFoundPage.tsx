import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Phone, 
  FileText, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { FIRM_DATA } from '../data/firmData';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const recoveryDirectory = [
    {
      title: "Audit & Assurance Spotlight",
      desc: "Statutory, Tax Sec 44AB, Internal, Concurrent, and Due Diligence Audits.",
      path: "/services/audit-assurance",
      icon: ShieldCheck,
      badge: "High Intent"
    },
    {
      title: "All Practice Disciplines",
      desc: "Income Tax return filing, GST dispute handling, and ROC corporate compliance.",
      path: "/services",
      icon: FileText,
      badge: "Core Services"
    },
    {
      title: "Industries We Serve",
      desc: "Advisory tailored to Startups, MSMEs, Manufacturing, and Real Estate.",
      path: "/industries",
      icon: Building2,
      badge: "Sectors"
    },
    {
      title: "Chambers & Locations",
      desc: "Principal practice in Tirupati and regional client coverage hubs.",
      path: "/locations",
      icon: MapPin,
      badge: "Reach"
    }
  ];

  return (
    <div className="bg-brand-warm page-reveal min-h-[85vh] py-14 sm:py-20 border-b border-border">
      <SEOHead
        title="404 — Page Not Found"
        description="The requested page could not be located in the Kavitha & Associates directory. Explore our verified practice areas or contact our chambers directly."
        noIndex={true}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 404 Status Banner */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          
          {/* Subtle Top Watermark Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pale text-brand-primary text-xs font-semibold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>HTTP Status: 404 • Resource Not Located</span>
          </div>

          {/* Big Editorial 404 Display */}
          <div className="space-y-3">
            <div className="font-serif text-6xl sm:text-7xl font-bold text-brand-primary tracking-tight">
              404
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary">
              Directory Item Not Found
            </h1>
            <p className="text-sm sm:text-base text-charcoal-muted max-w-xl mx-auto leading-relaxed">
              The page or document at <code className="bg-brand-surface px-2 py-0.5 rounded text-brand-deep font-mono text-xs border border-border">{location.pathname}</code> does not exist, may have been relocated, or is undergoing statutory updates.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep shadow-sm transition-colors btn-tactile"
            >
              <Home className="w-4 h-4 text-gold" />
              <span>Return to Homepage</span>
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-white text-charcoal text-xs font-semibold hover:bg-brand-pale shadow-subtle transition-colors btn-tactile"
            >
              <ArrowLeft className="w-4 h-4 text-charcoal-muted" />
              <span>Go Back</span>
            </button>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-emerald-300 bg-brand-pale text-brand-primary text-xs font-semibold hover:bg-emerald-100 transition-colors btn-tactile"
            >
              <Phone className="w-4 h-4 text-brand-primary" />
              <span>Contact Chambers</span>
            </Link>
          </div>
        </div>

        {/* Quick Directory Recovery Grid */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block">
                Directory Assistance
              </span>
              <h2 className="font-serif text-xl font-bold text-brand-primary">
                Were you looking for one of these practice areas?
              </h2>
            </div>
            <Search className="w-5 h-5 text-gold-dark hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {recoveryDirectory.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.path}
                  className="bg-white rounded-xl p-5 border border-border shadow-subtle card-tactile flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-brand-primary group-hover:text-gold transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base font-bold text-brand-primary group-hover:text-brand-deep">
                        {item.title}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-charcoal-light group-hover:text-gold-dark group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Urgent Filing / Audit Assistance Desk */}
        <div className="mt-10 bg-[#0A2F24] text-white rounded-xl p-6 sm:p-8 border border-emerald-900 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gold text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Direct Client Assistance</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-white">
              Have an impending statutory audit or tax filing deadline?
            </h3>
            <p className="text-xs text-emerald-100/80 max-w-lg">
              Contact CA KavithaVijay SRJ directly through our verified priority telephone or WhatsApp channels.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
            <a
              href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-brand-primary text-xs font-semibold hover:bg-emerald-50 transition-colors shadow-sm btn-tactile"
            >
              <Phone className="w-4 h-4 text-brand-primary" />
              <span>Call {FIRM_DATA.contact.primaryPhone}</span>
            </a>

            <a
              href={FIRM_DATA.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold border border-emerald-500/40 transition-colors shadow-sm btn-tactile"
            >
              <MessageSquare className="w-4 h-4 text-gold" />
              <span>WhatsApp Desk</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
