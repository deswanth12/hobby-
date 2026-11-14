import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileEdit, 
  Sliders, 
  ArrowRight, 
  Download, 
  PhoneCall, 
  Building2, 
  ExternalLink,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminStorage, FIRM_DATA_UPDATE_EVENT } from '../../services/adminStorage';
import { EnquiryRecord } from '../../types/admin';
import { useFirmData } from '../../context/FirmDataContext';
import { ADMIN_ROUTES } from '../../config/adminConfig';
import { getUrgencyBadge } from './AdminEnquiriesPage';

export const AdminOverviewPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const { data: firmData, isModified } = useFirmData();
  const session = adminStorage.getSession();

  const loadData = () => {
    setEnquiries(adminStorage.getEnquiries());
  };

  useEffect(() => {
    loadData();
    adminStorage.fetchEnquiriesRemote().then(res => {
      if (res && res.data) setEnquiries(res.data);
    });
    window.addEventListener(FIRM_DATA_UPDATE_EVENT, loadData);
    return () => window.removeEventListener(FIRM_DATA_UPDATE_EVENT, loadData);
  }, []);

  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;
  const inReviewEnquiries = enquiries.filter(e => e.status === 'in-progress' || e.status === 'in-review').length;
  const contactedEnquiries = enquiries.filter(e => e.status === 'contacted').length;
  const convertedClients = new Set(
    enquiries
      .filter(e => e.status === 'closed')
      .map(e => (e.phone || e.email || e.fullName).trim().toLowerCase())
  ).size;

  const urgentEnquiries = enquiries.filter(e => {
    const u = (e.urgency || '').toLowerCase();
    return (
      u.includes('urgent') || 
      u.includes('deadline') || 
      u.includes('demand') || 
      u.includes('notice') || 
      u.includes('statutory-deadline') || 
      u.includes('priority') || 
      u.includes('48')
    ) && e.status !== 'closed';
  }).length;

  const recentEnquiries = enquiries.slice(0, 5);

  const handleExportCSV = () => {
    const csv = adminStorage.exportEnquiriesCSV();
    if (!csv) {
      alert('No enquiries available to export.');
      return;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Kavitha_Associates_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout 
      title="Practice Overview" 
      subtitle={`Welcome back, ${session?.user.displayName || 'Administrator'}. Real-time practice dashboard.`}
    >
      <div className="space-y-8">
        
        {/* =========================================================================
            0. HIGH-URGENCY STATUTORY NOTICE RADAR BANNER
            ========================================================================= */}
        {urgentEnquiries > 0 && (
          <div className="bg-red-50 border-l-4 border-l-red-600 border-y border-r border-red-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <div>
                <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                  <span>⚡ Priority Action Radar:</span>
                  <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                    {urgentEnquiries} Critical {urgentEnquiries === 1 ? 'Matter' : 'Matters'}
                  </span>
                </div>
                <div className="text-[11px] text-red-700 mt-0.5">
                  High-intent regulatory notices or statutory deadline enquiries require partner review within 24h/48h SLA.
                </div>
              </div>
            </div>
            <Link
              to={`${ADMIN_ROUTES.enquiries}?urgency=urgent`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors shrink-0 shadow-sm min-h-[44px]"
            >
              Review Urgent Enquiries <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* =========================================================================
            1. KPI SUMMARY CARDS (Botanical Ledger Chambers Theme)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Enquiries */}
          <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#D8D0BE] shadow-xs flex items-center justify-between hover:border-[#B49A64]/60 transition-all">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#7E5E1E]">
                Total Enquiries
              </div>
              <div className="text-3xl font-serif font-bold text-[#071B14] mt-1">
                {totalEnquiries}
              </div>
              <div className="text-[11px] text-[#525954] mt-0.5">
                Logged in practice register
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#0B241C] text-[#B49A64] border border-[#B49A64]/30 flex items-center justify-center shrink-0 shadow-xs">
              <Inbox className="w-6 h-6" />
            </div>
          </div>

          {/* New / Action Required */}
          <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-amber-300/80 shadow-xs flex items-center justify-between hover:border-amber-400 transition-all">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <span>New Action Required</span>
                {urgentEnquiries > 0 && (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    ⚡ {urgentEnquiries} Urgent
                  </span>
                )}
              </div>
              <div className="text-3xl font-serif font-bold text-amber-800 mt-1">
                {newEnquiries}
              </div>
              <div className="text-[11px] text-amber-700 mt-0.5">
                Pending partner review
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Under Review & Active Consultations */}
          <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-blue-200/80 shadow-xs flex items-center justify-between hover:border-blue-300 transition-all">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Active Follow-up
              </div>
              <div className="text-3xl font-serif font-bold text-blue-900 mt-1">
                {inReviewEnquiries + contactedEnquiries}
              </div>
              <div className="text-[11px] text-blue-700 mt-0.5">
                {contactedEnquiries} contacted • {inReviewEnquiries} in review
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Converted Clients (Deduplicated Closed Engagements) */}
          <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-emerald-300/80 shadow-xs flex items-center justify-between hover:border-emerald-400 transition-all">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Converted Clients
              </div>
              <div className="text-3xl font-serif font-bold text-emerald-900 mt-1">
                {convertedClients}
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                Closed client engagements
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#0B241C] text-[#B49A64] border border-[#B49A64]/30 flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. QUICK ACTIONS & PRACTICE STATUS BANNER
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Shortcuts */}
          <div className="lg:col-span-2 bg-[#FAF7F0] p-6 rounded-2xl border border-[#D8D0BE] shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#071B14] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B49A64]" />
              Chambers Operations & Quick Navigation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link
                to={ADMIN_ROUTES.enquiries}
                className="p-4 rounded-xl border border-[#D8D0BE] bg-white hover:border-[#B49A64] hover:bg-[#F1EBDD]/40 transition-all duration-200 text-left flex flex-col justify-between group shadow-xs min-h-[140px]"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#0B241C] text-[#B49A64] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-[#071B14] group-hover:text-[#183529]">
                    Client Enquiries
                  </div>
                  <div className="text-[11px] text-[#525954] mt-0.5">
                    Filter, reply, and add follow-up notes
                  </div>
                </div>
                <div className="flex items-center text-[11px] font-bold text-[#7E5E1E] group-hover:text-[#071B14] mt-3">
                  Open Register <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>

              <Link
                to={ADMIN_ROUTES.content}
                className="p-4 rounded-xl border border-[#D8D0BE] bg-white hover:border-[#B49A64] hover:bg-[#F1EBDD]/40 transition-all duration-200 text-left flex flex-col justify-between group shadow-xs min-h-[140px]"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#0B241C] text-[#B49A64] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <FileEdit className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-[#071B14] group-hover:text-[#183529]">
                    Content Editor
                  </div>
                  <div className="text-[11px] text-[#525954] mt-0.5">
                    Update services, statutory FAQs & copy
                  </div>
                </div>
                <div className="flex items-center text-[11px] font-bold text-[#7E5E1E] group-hover:text-[#071B14] mt-3">
                  Edit Content <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>

              <Link
                to={ADMIN_ROUTES.articles}
                className="p-4 rounded-xl border border-[#D8D0BE] bg-white hover:border-[#B49A64] hover:bg-[#F1EBDD]/40 transition-all duration-200 text-left flex flex-col justify-between group shadow-xs min-h-[140px]"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#0B241C] text-[#B49A64] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-[#071B14] group-hover:text-[#183529]">
                    Articles & Insights
                  </div>
                  <div className="text-[11px] text-[#525954] mt-0.5">
                    Write, edit, and publish statutory commentary
                  </div>
                </div>
                <div className="flex items-center text-[11px] font-bold text-[#7E5E1E] group-hover:text-[#071B14] mt-3">
                  Write / Edit Articles <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>

              <Link
                to={ADMIN_ROUTES.settings}
                className="p-4 rounded-xl border border-[#D8D0BE] bg-white hover:border-[#B49A64] hover:bg-[#F1EBDD]/40 transition-all duration-200 text-left flex flex-col justify-between group shadow-xs min-h-[140px]"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#0B241C] text-[#B49A64] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-[#071B14] group-hover:text-[#183529]">
                    Practice Settings
                  </div>
                  <div className="text-[11px] text-[#525954] mt-0.5">
                    Chambers phone, email, and location
                  </div>
                </div>
                <div className="flex items-center text-[11px] font-bold text-[#7E5E1E] group-hover:text-[#071B14] mt-3">
                  Manage Settings <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-[#D8D0BE]/60 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center px-4 py-2 text-xs font-bold text-[#F1EBDD] bg-[#0B241C] hover:bg-[#183529] border border-[#B49A64]/40 hover:border-[#B49A64] rounded-xl transition-all shadow-xs min-h-[44px]"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-[#B49A64]" />
                Export Enquiries Register (CSV)
              </button>
            </div>
          </div>

          {/* Active Chambers Configuration */}
          <div className="bg-[#071B14] text-[#F1EBDD] p-6 rounded-2xl border border-[#B49A64]/30 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#B49A64]">
                  Live Public Configuration
                </span>
                {isModified ? (
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-400/30">
                    Custom Overrides Active
                  </span>
                ) : (
                  <span className="text-[10px] bg-[#183529] text-[#B49A64] px-2 py-0.5 rounded-full font-semibold border border-[#B49A64]/30">
                    Standard Baseline
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F1EBDD] leading-snug">
                {firmData.name}
              </h3>
              <p className="text-xs text-[#AAB4A0] mt-1 font-sans">
                Chartered Accountants • Tirupati Chambers
              </p>

              <div className="mt-4 space-y-2 text-xs text-[#D8D0BE]">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                  <span>{firmData.contact.primaryPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                  <span className="truncate">{firmData.contact.primaryLocation}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#B49A64]/20 flex items-center justify-between">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-bold text-[#B49A64] hover:text-[#F1EBDD] transition-colors min-h-[44px]"
              >
                Visit Public Website <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <span className="text-[10px] text-[#AAB4A0] font-mono">
                Reactive Sync: Active
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. RECENT CLIENT ENQUIRIES TABLE
            ========================================================================= */}
        <div className="bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#D8D0BE] bg-white/70 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-base font-serif font-bold text-[#071B14]">Recent Inquiries</h2>
              <p className="text-xs text-[#525954] mt-0.5">
                Latest client consultation submissions from the public website contact form
              </p>
            </div>
            <Link
              to={ADMIN_ROUTES.enquiries}
              className="inline-flex items-center text-xs font-bold text-[#7E5E1E] hover:text-[#071B14] transition-colors min-h-[44px]"
            >
              View All {totalEnquiries} Enquiries <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-700">No Enquiries Registered Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                Submissions made through the public website contact form will appear here automatically with real-time reactive sync.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Link
                  to="/contact"
                  target="_blank"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-darkgreen hover:bg-brand-chambers rounded-xl transition-colors duration-200 inline-flex items-center gap-1.5"
                >
                  Open Public Contact Form <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Mobile Responsive Cards (< md) */}
              <div className="md:hidden divide-y divide-gray-100">
                {recentEnquiries.map((enquiry) => (
                  <div key={enquiry.id} className="p-4 space-y-2 hover:bg-gray-50/60 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-brand-darkgreen">
                          {enquiry.id}
                        </span>
                        {getUrgencyBadge(enquiry.urgency, 'sm')}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          enquiry.status === 'new'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : enquiry.status === 'in-review'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : enquiry.status === 'contacted'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{enquiry.fullName}</h4>
                      {enquiry.organization && (
                        <p className="text-xs text-gray-500">{enquiry.organization}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 flex flex-wrap gap-x-3 gap-y-1">
                      <span>{enquiry.phone}</span>
                      <span>•</span>
                      <span>{enquiry.serviceCategory}</span>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-gray-100 text-xs">
                      <span className="text-[11px] text-gray-400">
                        {new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <Link
                        to={`${ADMIN_ROUTES.enquiries}?id=${enquiry.id}`}
                        className="min-h-[44px] inline-flex items-center font-bold text-brand-darkgreen hover:text-gold"
                      >
                        Review Enquiry →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table (>= md) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F1EBDD]/70 border-b border-[#D8D0BE] text-[#7E5E1E] font-bold uppercase tracking-wider font-mono">
                      <th className="py-3 px-4">Ref ID</th>
                      <th className="py-3 px-4">Date / Time</th>
                      <th className="py-3 px-4">Client / Entity</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Service Category</th>
                      <th className="py-3 px-4">Urgency</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5D9]">
                    {recentEnquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="hover:bg-[#F1EBDD]/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#071B14]">
                          {enquiry.id}
                        </td>
                        <td className="py-3.5 px-4 text-[#525954]">
                          {new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#071B14]">{enquiry.fullName}</div>
                          {enquiry.organization && (
                            <div className="text-[11px] text-[#525954]">{enquiry.organization}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-[#071B14] font-medium">{enquiry.phone}</div>
                          {enquiry.email && (
                            <div className="text-[11px] text-[#525954]">{enquiry.email}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#183529] font-medium">
                          {enquiry.serviceCategory}
                        </td>
                        <td className="py-3.5 px-4">
                          {getUrgencyBadge(enquiry.urgency, 'sm')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              enquiry.status === 'new'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : enquiry.status === 'in-review'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : enquiry.status === 'contacted'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}
                          >
                            {enquiry.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`${ADMIN_ROUTES.enquiries}?id=${enquiry.id}`}
                            className="inline-flex items-center font-bold text-[#7E5E1E] hover:text-[#071B14] transition-colors min-h-[44px]"
                          >
                            Review →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
