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
  ExternalLink,
  BookOpen,
  PenTool,
  KeyRound,
  ShieldCheck,
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
    { name: 'Articles & Insights', path: ADMIN_ROUTES.articles, icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#191919] flex flex-col md:flex-row font-sans selection:bg-[#071B14] selection:text-[#F1EBDD]">
      <SEOHead title={`Admin — ${title}`} description="Practice Management Console" noIndex={true} />

      {/* =========================================================================
          1. BOTANICAL LEDGER CHAMBERS DESKTOP SIDEBAR
          ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#071B14] text-[#F1EBDD] shrink-0 border-r border-[#B49A64]/20 shadow-xl">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-[#B49A64]/20 bg-[#04100C]/70">
          <Link to={ADMIN_ROUTES.root} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F0] border border-[#B49A64]/40 flex items-center justify-center p-1 shrink-0 shadow-sm transition-transform group-hover:scale-105">
              <img src="/brand/ca-india-logo.png" alt="CA India" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <span className="font-serif text-sm font-bold text-[#F1EBDD] block leading-tight truncate group-hover:text-[#B49A64] transition-colors">
                Kavitha & Associates
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B49A64] mt-0.5 block truncate">
                Chambers Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3.5 space-y-1" aria-label="Admin Navigation">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#B49A64]/80 px-3 py-1.5 mb-1 font-semibold flex items-center justify-between">
            <span>Chambers Navigation</span>
            <ShieldCheck className="w-3 h-3 text-[#B49A64]/60" />
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border-l-2 min-h-[44px] ${
                  isActive
                    ? 'bg-[#0B241C] text-[#F1EBDD] font-semibold border-[#B49A64] shadow-[inset_0_1px_0_0_rgba(180,154,100,0.15)]'
                    : 'text-[#AAB4A0] hover:text-[#F1EBDD] hover:bg-[#0B241C]/60 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#B49A64]' : 'text-[#AAB4A0]'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B49A64]/20 text-[#F1EBDD] border border-[#B49A64]/40 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
          
          <div className="pt-3 px-1 mt-2 border-t border-[#B49A64]/20">
            <Link
              to={`${ADMIN_ROUTES.articles}?action=new`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#183529] hover:bg-[#0B241C] border border-[#B49A64]/40 hover:border-[#B49A64] text-[#F1EBDD] text-xs font-semibold shadow-xs transition-all duration-200 group min-h-[44px]"
            >
              <PenTool className="w-3.5 h-3.5 text-[#B49A64] group-hover:rotate-12 transition-transform" />
              <span>+ Write New Article</span>
            </Link>
          </div>
        </nav>

        {/* User Profile & Actions Footer */}
        <div className="p-3.5 border-t border-[#B49A64]/20 space-y-2.5 bg-[#04100C]/70">
          
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#183529] border border-[#B49A64]/40 flex items-center justify-center text-[#B49A64] font-serif font-bold text-xs shrink-0 shadow-xs">
                {session?.user.displayName.substring(0, 2).toUpperCase() || 'CA'}
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold text-[#F1EBDD] block truncate leading-tight">
                  {session?.user.displayName || 'Authorized Admin'}
                </span>
                <span className="text-[10px] text-[#B49A64] font-mono block truncate">
                  {session?.user.role || 'Managing Partner'}
                </span>
              </div>
            </div>
            <Link
              to={`${ADMIN_ROUTES.settings}?tab=security`}
              className="p-2 rounded-lg hover:bg-[#0B241C] text-[#AAB4A0] hover:text-[#B49A64] border border-transparent hover:border-[#B49A64]/30 transition-colors shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Account Security & Password"
              aria-label="Account Security & Password"
            >
              <KeyRound className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#0B241C] hover:bg-[#183529] text-[#D8D0BE] hover:text-[#F1EBDD] text-[11px] font-medium border border-[#B49A64]/30 hover:border-[#B49A64]/60 transition-all min-h-[44px]"
            >
              <Globe className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Live Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#0B241C] hover:bg-red-950/40 text-[#D8D0BE] hover:text-red-300 text-[11px] font-medium border border-[#B49A64]/30 hover:border-red-500/40 transition-all min-h-[44px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </aside>

      {/* =========================================================================
          2. BOTANICAL LEDGER MOBILE HEADER
          ========================================================================= */}
      <div className="md:hidden bg-[#071B14] text-[#F1EBDD] p-3.5 flex items-center justify-between border-b border-[#B49A64]/20 shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#FAF7F0] border border-[#B49A64]/40 flex items-center justify-center p-1 shrink-0">
            <img src="/brand/ca-india-logo.png" alt="CA India" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <span className="font-serif text-sm font-bold text-[#F1EBDD] truncate block">
              Kavitha & Associates
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B49A64] block">
              Chambers Admin
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#F1EBDD] hover:bg-[#0B241C] border border-[#B49A64]/30 focus:outline-none transition-colors"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5 text-[#B49A64]" /> : <Menu className="w-5 h-5 text-[#B49A64]" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#071B14] border-b border-[#B49A64]/20 p-4 space-y-1.5 animate-in fade-in">
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
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-colors border-l-2 min-h-[44px] ${
                  isActive 
                    ? 'bg-[#0B241C] text-[#F1EBDD] font-semibold border-[#B49A64]' 
                    : 'text-[#AAB4A0] hover:text-[#F1EBDD] hover:bg-[#0B241C]/60 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B49A64]' : 'text-[#AAB4A0]'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B49A64]/20 text-[#F1EBDD] border border-[#B49A64]/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          
          <div className="pt-2 mt-2 border-t border-[#B49A64]/20 space-y-2">
            <Link
              to={`${ADMIN_ROUTES.articles}?action=new`}
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-[#183529] hover:bg-[#0B241C] border border-[#B49A64]/40 text-[#F1EBDD] text-xs font-semibold shadow-xs min-h-[44px]"
            >
              <PenTool className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>+ Write New Article</span>
            </Link>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#0B241C] text-[#D8D0BE] hover:text-[#F1EBDD] text-xs font-medium border border-[#B49A64]/30 min-h-[44px]"
              >
                <Globe className="w-3.5 h-3.5 text-[#B49A64]" />
                <span>Live Site</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#0B241C] text-red-300 hover:text-red-200 text-xs font-medium border border-red-500/30 min-h-[44px]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MAIN CONTENT CONTAINER (BOTANICAL LEDGER)
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Architectural Warm Ledger Header */}
        <header className="bg-[#FAF7F0] border-b border-[#D8D0BE] px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.03)] backdrop-blur-xs">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#7E5E1E] font-semibold mb-0.5">
              Chambers Practice / {title}
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#071B14] tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-[#525954] mt-0.5 font-sans">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to={`${ADMIN_ROUTES.articles}?action=new`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#183529] hover:bg-[#071B14] border border-[#B49A64]/40 hover:border-[#B49A64] text-[#F1EBDD] text-xs font-semibold shadow-xs transition-all min-h-[44px]"
            >
              <PenTool className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>+ Write Article</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#071B14] text-[#F1EBDD] text-[11px] font-medium border border-[#B49A64]/30 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] animate-pulse"></span>
              <span className="font-mono">Encrypted Session</span>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#D8D0BE] bg-white hover:bg-[#F1EBDD] text-[#071B14] text-xs font-semibold transition-all min-h-[44px] hover:border-[#B49A64] shadow-xs"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#7E5E1E]" />
            </Link>
          </div>
        </header>

        {/* Clean Content Canvas */}
        <main className="p-6 sm:p-8 flex-1 max-w-7xl mx-auto w-full">
          {children}
        </main>

      </div>

    </div>
  );
};
