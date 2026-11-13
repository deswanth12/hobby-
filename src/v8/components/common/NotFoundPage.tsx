import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Compass, Phone, ShieldAlert, BookOpen, Building2 } from 'lucide-react';
import { CrestMonogram } from './CrestMonogram';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const recoveryLinks = [
    { label: 'Practice Homepage', path: '/', icon: <Home className="w-4 h-4 text-[#B49A64]" /> },
    { label: 'About the Practice', path: '/about', icon: <Compass className="w-4 h-4 text-[#B49A64]" /> },
    { label: 'All Practice Disciplines', path: '/services', icon: <Building2 className="w-4 h-4 text-[#B49A64]" /> },
    { label: 'Audit & Assurance Spotlight', path: '/services/audit-assurance', icon: <ShieldAlert className="w-4 h-4 text-[#B49A64]" /> },
    { label: 'Industry Sectors', path: '/industries', icon: <Building2 className="w-4 h-4 text-[#B49A64]" /> },
    { label: 'Chambers & Locations', path: '/locations', icon: <Compass className="w-4 h-4 text-[#B49A64]" /> },
    { label: 'Regulatory Publications', path: '/blog', icon: <BookOpen className="w-4 h-4 text-[#B49A64]" /> },
    { label: 'Chambers Consultation', path: '/contact', icon: <Phone className="w-4 h-4 text-[#B49A64]" /> },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#F1EBDD] text-[#35271F]">
      <div className="max-w-2xl w-full p-8 sm:p-12 rounded-3xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-editorial text-center space-y-8 relative overflow-hidden">
        {/* Subtle decorative monogram */}
        <div className="flex justify-center">
          <CrestMonogram variant="medallion" size="xl" />
        </div>

        <div className="space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#183529]/10 text-[#7E5E1E] text-xs font-mono font-semibold uppercase tracking-wider border border-[#B49A64]/30">
            STATUTORY REGISTRY • HTTP 404 NOT LOCATED
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#183529]">
            Record or Page Not Located
          </h1>
          <p className="text-xs sm:text-sm text-[#525954] max-w-md mx-auto leading-relaxed">
            The page or statutory reference does not exist, has been archived under periodic regulatory updates, or is currently unpublished.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-[#183529]/10 text-[#183529] border border-[#B49A64]/40 text-xs font-semibold tracking-wider transition-all min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-[#7E5E1E]" />
            <span>Previous Directory View</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B49A64] hover:bg-[#9E844E] text-[#071B14] text-xs font-semibold tracking-wider transition-all shadow-md min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            <span>Practice Homepage</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#183529] hover:bg-[#294B39] text-[#F1EBDD] text-xs font-semibold tracking-wider transition-all min-h-[44px]"
          >
            <Phone className="w-4 h-4 text-[#B49A64]" />
            <span>Contact Chambers</span>
          </Link>
        </div>

        {/* 8 Authoritative Directory Recovery Destinations */}
        <div className="pt-6 border-t border-[#D8D0BE] text-left">
          <h2 className="text-xs uppercase font-serif font-bold text-[#183529] tracking-wider mb-4 text-center sm:text-left">
            Authoritative Practice Navigation Directories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {recoveryLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F1EBDD]/50 hover:bg-[#F1EBDD] border border-transparent hover:border-[#B49A64]/30 text-xs font-medium text-[#35271F] transition-all"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
