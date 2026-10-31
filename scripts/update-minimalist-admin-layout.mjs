import fs from 'fs';

const minimalistAdminLayout = `import React, { useState, useEffect } from 'react';
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
  CheckCircle2
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
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#191919] flex flex-col md:flex-row font-sans selection:bg-neutral-200">
      <SEOHead title={\`Admin — \${title}\`} description="Practice Management Console" noIndex={true} />

      {/* =========================================================================
          1. MINIMALIST DESKTOP SIDEBAR
          ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white text-neutral-800 shrink-0 border-r border-[#EAEAEA]">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-[#F0F0F0]">
          <Link to={ADMIN_ROUTES.root} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center font-serif text-sm font-bold text-amber-300 shrink-0">
              KA
            </div>
            <div className="min-w-0">
              <span className="font-serif text-sm font-bold text-neutral-900 block leading-tight truncate group-hover:text-neutral-700 transition-colors">
                Kavitha & Associates
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5 block truncate">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3.5 space-y-1" aria-label="Admin Navigation">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-3 py-1.5 mb-1">
            Navigation
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
                className={\`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 \${
                  isActive
                    ? 'bg-neutral-100 text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }\`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={\`w-4 h-4 \${isActive ? 'text-neutral-900' : 'text-neutral-400'}\`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Actions Footer */}
        <div className="p-3.5 border-t border-[#F0F0F0] space-y-2 bg-[#FAFAFA]">
          
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-700 font-serif font-bold text-[10px] shrink-0">
                {session?.user.displayName.substring(0, 2).toUpperCase() || 'CA'}
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold text-neutral-900 block truncate leading-tight">
                  {session?.user.displayName || 'Authorized Admin'}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono block truncate">
                  {session?.user.role || 'Managing Partner'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 text-[11px] font-medium border border-neutral-200 transition-colors"
            >
              <Globe className="w-3 h-3 text-neutral-400" />
              <span>Live Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white hover:bg-red-50 text-neutral-600 hover:text-red-700 text-[11px] font-medium border border-neutral-200 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </aside>

      {/* =========================================================================
          2. MINIMALIST MOBILE HEADER
          ========================================================================= */}
      <div className="md:hidden bg-white text-neutral-900 p-3.5 flex items-center justify-between border-b border-[#EAEAEA]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center font-serif font-bold text-amber-300 text-xs shrink-0">
            KA
          </div>
          <span className="font-serif text-sm font-bold text-neutral-900 truncate">
            Kavitha & Associates
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none transition-colors"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[#EAEAEA] p-3 space-y-1 animate-in fade-in">
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
                className={\`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors \${
                  isActive ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'text-neutral-600 hover:bg-neutral-50'
                }\`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-neutral-500" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 mt-2 border-t border-[#F0F0F0] flex items-center justify-between text-xs px-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="text-neutral-600 hover:text-neutral-900 py-1.5 flex items-center gap-1.5 font-medium"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span>Live Site</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="text-red-600 hover:text-red-700 py-1.5 flex items-center gap-1.5 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MAIN CONTENT CONTAINER (MINIMALIST)
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Minimalist Top Header */}
        <header className="bg-white border-b border-[#EAEAEA] px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-20">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-0.5">
              Practice / {title}
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-neutral-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Encrypted Session</span>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
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
`;

fs.writeFileSync('src/components/admin/AdminLayout.tsx', minimalistAdminLayout, 'utf8');
console.log('Successfully updated src/components/admin/AdminLayout.tsx with minimalist UI');
