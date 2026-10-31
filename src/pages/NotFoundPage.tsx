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
  ChevronRight,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { FIRM_DATA } from '../data/firmData';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 8 Authoritative Practice Registry Destinations
  const recoveryDirectory = [
    {
      title: "Practice Homepage",
      desc: "Firm credentials plaque, dual CA+CMA advantage, and comprehensive service overview.",
      path: "/",
      icon: Home,
      badge: "Firm Overview"
    },
    {
      title: "About the Practice",
      desc: "Leadership bio of CA Kavitha Vijay (ICAI Mem. 252985, CMA AIR 49, Big 4 background).",
      path: "/about",
      icon: UserCheck,
      badge: "Credentials"
    },
    {
      title: "All Practice Disciplines",
      desc: "Income Tax return filing, GST dispute handling, MCA corporate filings, and RERA.",
      path: "/services",
      icon: FileText,
      badge: "Core Services"
    },
    {
      title: "Audit & Assurance Spotlight",
      desc: "Statutory audits, Tax Sec 44AB, Internal, Concurrent, and Due Diligence reviews.",
      path: "/services/audit-assurance",
      icon: ShieldCheck,
      badge: "Audit Spotlight"
    },
    {
      title: "Industry Sectors We Serve",
      desc: "Specialized advisory for Startups (80-IAC), MSMEs, Manufacturing, and Real Estate.",
      path: "/industries",
      icon: Building2,
      badge: "Sectors"
    },
    {
      title: "Chambers & Locations",
      desc: "Principal practice in Tirupati and coverage corridors in Chennai, Bengaluru, Hyderabad.",
      path: "/locations",
      icon: MapPin,
      badge: "Regional Reach"
    },
    {
      title: "Regulatory Publications",
      desc: "Technical commentary on statutory audit guidelines, GST circulars, and tax planning.",
      path: "/blog",
      icon: BookOpen,
      badge: "Insights"
    },
    {
      title: "Chambers Consultation",
      desc: "Priority consultation intake, Tirupati physical chambers address, and GPS location.",
      path: "/contact",
      icon: Phone,
      badge: "Direct Intake"
    }
  ];

  return (
    <div className="bg-brand-ivory page-reveal min-h-[90vh] py-14 sm:py-20 border-b border-brand-border">
      <SEOHead
        title="404 — Page Not Located in Practice Registry | Kavitha & Associates"
        description="The requested document could not be located in the Kavitha & Associates directory. Explore our verified practice areas or contact our chambers directly."
        noIndex={true}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            1. MAIN 404 STATUS BANNER
            ========================================================================= */}
        <div className="bg-brand-white rounded-2xl border border-brand-border shadow-card p-8 sm:p-14 text-center space-y-6 relative overflow-hidden scroll-reveal scroll-reveal-scale">
          
          {/* Subtle Top Status Watermark Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-forest/10 text-brand-forest text-xs font-semibold border border-brand-forest/20 min-h-[44px]">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-editorial-meta tracking-wider">STATUTORY REGISTRY • HTTP 404 NOT LOCATED</span>
          </div>

          {/* Big Editorial 404 Display & Typography */}
          <div className="space-y-4">
            <div className="font-serif text-[clamp(4.5rem,10vw,7.5rem)] font-bold text-brand-forest tracking-tight leading-none selection:bg-brand-pale">
              404
            </div>
            <h1 className="font-editorial-h1 text-brand-forest">
              Page Not Located in Practice Registry
            </h1>
            <p className="font-editorial-body text-brand-muted max-w-xl mx-auto leading-relaxed">
              The page or statutory reference at <code className="bg-brand-surface px-2.5 py-1 rounded text-brand-deep font-mono text-xs border border-brand-border">{location.pathname}</code> does not exist, has been archived under periodic regulatory updates, or is currently unpublished.
            </p>
          </div>

          {/* Primary Action Buttons (WCAG 2.5.5 AAA min 44px) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to="/"
              className="btn-pill-primary"
            >
              <Home className="w-4 h-4 text-brand-gold" />
              <span>Return to Practice Homepage</span>
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-pill-secondary"
            >
              <ArrowLeft className="w-4 h-4 text-brand-muted" />
              <span>Previous Directory View</span>
            </button>

            <Link
              to="/contact"
              className="btn-pill-secondary"
            >
              <Phone className="w-4 h-4 text-brand-forest" />
              <span>Contact Tirupati Chambers</span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            2. DIRECTORY RECOVERY GRID (ALL 8 CORE DESTINATIONS)
            ========================================================================= */}
        <div className="mt-14 space-y-5 scroll-reveal">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="font-editorial-meta text-gold-dark block mb-1">
                PRACTICE REGISTRY DIRECTORY
              </span>
              <h2 className="font-editorial-h2 text-brand-primary">
                Direct Practice Navigation & Document Recovery
              </h2>
              <p className="font-editorial-body text-charcoal-muted mt-1 max-w-2xl">
                Locate verified statutory filings, practice disciplines, sector advisory, and regional chambers through our directory index.
              </p>
            </div>
            <Search className="w-5 h-5 text-gold-dark hidden sm:block shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 scroll-stagger">
            {recoveryDirectory.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.path}
                  className="bg-white rounded-xl p-5 border border-border shadow-subtle card-tactile flex flex-col justify-between group min-h-[44px] scroll-reveal"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-brand-primary group-hover:text-gold transition-colors">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="font-editorial-meta text-[10px] px-2 py-0.5 rounded bg-brand-surface border border-border text-charcoal-muted">
                        {item.badge}
                      </span>
                    </div>
                    
                    <h3 className="font-editorial-h3 text-base font-bold text-brand-primary group-hover:text-brand-deep">
                      {item.title}
                    </h3>
                    
                    <p className="font-editorial-body text-xs text-charcoal-muted mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-brand-deep">
                    <span className="text-[11px] uppercase tracking-wider">Access Section</span>
                    <ChevronRight className="w-4 h-4 text-charcoal-light group-hover:text-gold-dark group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            3. URGENT STATUTORY AUDIT & TAX FILING ASSISTANCE DESK
            ========================================================================= */}
        <div className="mt-12 bg-brand-chambers text-white rounded-2xl p-6 sm:p-8 border border-emerald-900 shadow-card flex flex-col md:flex-row items-center justify-between gap-6 scroll-reveal">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gold text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span className="font-editorial-meta">URGENT FILING & AUDIT DESK</span>
            </div>
            <h3 className="font-editorial-h2 text-xl sm:text-2xl font-bold text-white">
              Facing an impending statutory audit or tax filing deadline?
            </h3>
            <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/80 max-w-xl">
              Connect directly with CA Kavitha Vijay for priority escalation, statutory assessments, and emergency compliance guidance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
            <a
              href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-lg bg-white text-brand-primary text-xs font-semibold hover:bg-emerald-50 transition-colors shadow-sm btn-tactile min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-brand-primary" />
              <span>Call {FIRM_DATA.contact.primaryPhone}</span>
            </a>

            <a
              href={FIRM_DATA.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold border border-emerald-500/40 transition-colors shadow-sm btn-tactile min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 text-gold" />
              <span>WhatsApp Urgent Desk</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
export default NotFoundPage;
