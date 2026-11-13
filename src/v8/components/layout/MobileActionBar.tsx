import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, CheckSquare, Calendar } from 'lucide-react';
import { FIRM_DATA } from '../../../data/firmData';
import { getRouteWhatsAppUrl } from '../../adapters/backendAdapter';

interface MobileActionBarProps {
  onOpenChecklist?: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({ onOpenChecklist }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const dynamicWhatsAppUrl = getRouteWhatsAppUrl(location.pathname);
  const cleanPhone = (FIRM_DATA.contact.primaryPhoneClean || '919626350900').replace(/[^0-9]/g, '');

  const handleConsultClick = () => {
    if (location.pathname === '/') {
      const intakeEl = document.getElementById('intake') || document.getElementById('consultation');
      if (intakeEl) {
        intakeEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate('/contact#intake');
  };

  return (
    <nav
      aria-label="Mobile Quick Action Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#071B14]/95 backdrop-blur-lg border-t border-[#B49A64]/40 shadow-[0_-8px_24px_rgba(0,0,0,0.35)] safe-area-pb"
    >
      <div className="grid grid-cols-4 items-center h-16 px-1">
        {/* 1. Direct Call Chambers */}
        <a
          href={`tel:+${cleanPhone}`}
          className="flex flex-col items-center justify-center h-full text-[#D8D0BE] hover:text-[#B49A64] active:scale-95 transition-all select-none min-h-[48px]"
          aria-label="Call CA Kavitha Vijay's Chambers Desk"
        >
          <div className="w-8 h-8 rounded-full bg-[#183529] flex items-center justify-center text-[#B49A64] mb-0.5 border border-[#B49A64]/30">
            <Phone className="w-4 h-4 text-[#B49A64]" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Call</span>
        </a>

        {/* 2. Direct WhatsApp Click-to-Chat with Page Context */}
        <a
          href={dynamicWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center h-full text-[#D8D0BE] hover:text-emerald-400 active:scale-95 transition-all select-none min-h-[48px]"
          aria-label="Connect on WhatsApp with Practice Context"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-950/70 flex items-center justify-center text-emerald-400 mb-0.5 border border-emerald-500/40">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">WhatsApp</span>
        </a>

        {/* 3. Statutory Checklists & Due-Dates Magnet */}
        <button
          type="button"
          onClick={onOpenChecklist}
          className="flex flex-col items-center justify-center h-full text-[#D8D0BE] hover:text-[#B49A64] active:scale-95 transition-all select-none min-h-[48px]"
          aria-label="Open Statutory Due Date & Compliance Checklists"
        >
          <div className="w-8 h-8 rounded-full bg-[#183529] flex items-center justify-center text-[#B49A64] mb-0.5 border border-[#B49A64]/30">
            <CheckSquare className="w-4 h-4 text-[#B49A64]" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Checklists</span>
        </button>

        {/* 4. Request Consultation Booking */}
        <button
          type="button"
          onClick={handleConsultClick}
          className="flex flex-col items-center justify-center h-full text-[#071B14] active:scale-95 transition-all select-none min-h-[48px]"
          aria-label="Request Partner Consultation"
        >
          <div className="w-full px-2">
            <div className="h-10 rounded-xl bg-[#B49A64] hover:bg-[#F1EBDD] flex flex-col items-center justify-center shadow-md">
              <Calendar className="w-4 h-4 text-[#071B14]" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#071B14] leading-tight">Consult</span>
            </div>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default MobileActionBar;
