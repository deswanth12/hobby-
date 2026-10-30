import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  FileEdit, 
  Sliders, 
  LogOut, 
  Globe, 
  Menu, 
  X, 
  ShieldCheck, 
  ExternalLink
} from 'lucide-react';
import { adminStorage, FIRM_DATA_UPDATE_EVENT } from '../../services/adminStorage';
import { ADMIN_ROUTES } from '../../config/adminConfig';
import { SEOHead } from '../SEOHead';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newEnquiryCount, setNewEnquiryCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const session = adminStorage.getSession();

  const updateCounts = () => {
    const enquiries = adminStorage.getEnquiries();
    const newItems = enquiries.filter(e => e.status === 'new').length;
    setNewEnquiryCount(newItems);
  };

  useEffect(() => {
    updateCounts();
    const handleUpdate = () => updateCounts();
    window.addEventListener(FIRM_DATA_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(FIRM_DATA_UPDATE_EVENT, handleUpdate);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    adminStorage.logout();
    navigate(ADMIN_ROUTES.login);
  };

  const navItems = [
    { name: 'Overview', path: ADMIN_ROUTES.root, icon: LayoutDashboard, exact: true },
    { 
      name: 'Client Enquiries', 
      path: ADMIN_ROUTES.enquiries, 
      icon: Inbox, 
      badge: newEnquiryCount > 0 ? newEnquiryCount : undefined 
    },
    { name: 'Content Editor', path: ADMIN_ROUTES.content, icon: FileEdit },
    { name: 'Practice Settings', path: ADMIN_ROUTES.settings, icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-[#24342F] flex flex-col md:flex-row font-sans">
      <SEOHead title={`Admin — ${title}`} description="Practice Management Console" noIndex={true} />

      {/* =========================================================================
          1. SIDEBAR (Desktop)
          ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#0A2F24] text-white shrink-0 border-r border-emerald-950/60 shadow-card">
        
        {/* Brand Plaque */}
        <div className="p-6 border-b border-emerald-800/60">
          <Link to={ADMIN_ROUTES.root} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#0F3E2E] border border-gold/60 flex items-center justify-center font-serif text-lg font-bold text-gold">
              KA
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white block leading-tight tracking-wide group-hover:text-gold transition-colors">
                Kavitha & Associates
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light mt-0.5 block">
                Practice Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5" aria-label="Admin Navigation">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 px-3 py-1 mb-1">
            Core Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0F3E2E] text-white border border-gold/40 shadow-xs'
                    : 'text-emerald-100/80 hover:bg-[#0F3E2E]/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-emerald-300'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-emerald-800/60 space-y-3 bg-[#08261D]">
          
          {/* User Profile Info */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#0F3E2E] border border-gold/30 flex items-center justify-center text-gold font-serif font-bold text-xs shrink-0">
              {session?.user.displayName.substring(0, 2).toUpperCase() || 'CA'}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">
                {session?.user.displayName || 'Authorized Admin'}
              </span>
              <span className="text-[10px] text-gold font-medium block truncate">
                {session?.user.role || 'Senior Partner'}
              </span>
            </div>
          </div>

          {/* Public Website Link */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-[#0F3E2E]/60 hover:bg-[#0F3E2E] text-emerald-200 hover:text-white text-xs font-medium border border-emerald-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-gold" />
              <span>View Live Website</span>
            </span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </Link>

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-rose-300 hover:text-white hover:bg-rose-950/60 text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>

        </div>
      </aside>

      {/* =========================================================================
          2. MOBILE NAVBAR
          ========================================================================= */}
      <div className="md:hidden bg-[#0A2F24] text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-emerald-950">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#0F3E2E] border border-gold/60 flex items-center justify-center font-serif font-bold text-gold text-sm shrink-0">
            KA
          </div>
          <span className="font-serif text-sm sm:text-base font-bold text-white truncate">
            Kavitha & Associates Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-[#0F3E2E] text-emerald-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold transition-colors shrink-0"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A2F24] text-white border-b border-emerald-800 p-4 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold min-h-[44px] transition-colors ${
                  isActive ? 'bg-[#0F3E2E] text-gold border border-gold/40' : 'text-emerald-100 hover:bg-[#0F3E2E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="text-gold font-medium flex items-center gap-1.5 min-h-[44px] px-2 py-2 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Public Site</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="text-rose-300 font-medium flex items-center gap-1.5 min-h-[44px] px-2 py-2 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MAIN CONTENT CONTAINER
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-border px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-charcoal-light uppercase tracking-wider mb-0.5">
              <span>Practice Admin</span>
              <span>/</span>
              <span className="text-gold-dark">{title}</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-brand-primary">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-charcoal-muted mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Protected Session Active</span>
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-brand-primary text-xs font-semibold transition-colors btn-tactile shadow-xs"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3 text-gold-dark" />
            </Link>
          </div>
        </header>

        {/* Verified Shared Database Banner */}
        <div className="bg-emerald-50/90 border-b border-emerald-200/90 px-6 sm:px-8 py-2.5 text-xs text-emerald-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Shared Practice Database Active:</strong> Enquiries, content updates, and practice settings are persistently synchronized across all authorized devices and browser sessions.
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 hidden lg:inline bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
            PostgreSQL Synced
          </span>
        </div>

        {/* Page Content Canvas */}
        <main className="p-6 sm:p-8 flex-1 scroll-reveal">
          {children}
        </main>

      </div>

    </div>
  );
};
