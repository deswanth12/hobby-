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
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminStorage, FIRM_DATA_UPDATE_EVENT } from '../../services/adminStorage';
import { EnquiryRecord } from '../../types/admin';
import { useFirmData } from '../../context/FirmDataContext';
import { ADMIN_ROUTES } from '../../config/adminConfig';

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
  const closedEnquiries = enquiries.filter(e => e.status === 'contacted' || e.status === 'closed').length;

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
  };

  const handleCreateSampleEnquiry = () => {
    adminStorage.recordEnquiry({
      fullName: 'Sreenivasulu Naidu',
      entityType: 'Private Limited Company',
      organization: 'Tirupati Agro Processing Pvt Ltd',
      phone: '+91 94401 23456',
      email: 'sreenivas@tirupatiagro.com',
      serviceCategory: 'Taxation & Statutory Compliances',
      city: 'Tirupati',
      urgency: 'statutory-deadline',
      message: 'Urgent consultation requested for GST annual reconciliation and filing before statutory deadline next week.',
    });
    loadData();
  };

  return (
    <AdminLayout 
      title="Practice Overview" 
      subtitle={`Welcome back, ${session?.user.displayName || 'Administrator'}. Real-time practice dashboard.`}
    >
      <div className="space-y-8">
        
        {/* =========================================================================
            1. KPI SUMMARY CARDS (Genuine Data Only)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Enquiries */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Total Enquiries
              </div>
              <div className="text-3xl font-serif font-bold text-[#0F3E2E] mt-1">
                {totalEnquiries}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Logged in practice register
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0F3E2E] flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
          </div>

          {/* New / Action Required */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
                New Action Required
              </div>
              <div className="text-3xl font-serif font-bold text-amber-700 mt-1">
                {newEnquiries}
              </div>
              <div className="text-[11px] text-amber-600 mt-0.5">
                Pending partner review
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Under Review */}
          <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Under Review
              </div>
              <div className="text-3xl font-serif font-bold text-blue-700 mt-1">
                {inReviewEnquiries}
              </div>
              <div className="text-[11px] text-blue-600 mt-0.5">
                Follow-up in progress
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Contacted / Completed */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Contacted / Closed
              </div>
              <div className="text-3xl font-serif font-bold text-emerald-700 mt-1">
                {closedEnquiries}
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">
                Consultation addressed
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. QUICK ACTIONS & PRACTICE STATUS BANNER
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Shortcuts */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F3E2E] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              Practice Operations & Navigation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to={ADMIN_ROUTES.enquiries}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#0F3E2E] hover:bg-emerald-50/40 transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/60 text-[#0F3E2E] flex items-center justify-center mb-2">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F3E2E]">
                    Client Enquiries
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Filter, reply, and add follow-up notes
                  </div>
                </div>
                <div className="flex items-center text-[11px] font-bold text-[#0F3E2E] mt-3">
                  Open Register <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>

              <Link
                to={ADMIN_ROUTES.content}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#0F3E2E] hover:bg-emerald-50/40 transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/60 text-[#0F3E2E] flex items-center justify-center mb-2">
                    <FileEdit className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F3E2E]">
                    Content Editor
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Update services, statutory FAQs & copy
                  </div>
                </div>
                <div className="flex items-center text-[11px] font-bold text-[#0F3E2E] mt-3">
                  Edit Content <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>

              <Link
                to={ADMIN_ROUTES.settings}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#0F3E2E] hover:bg-emerald-50/40 transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/60 text-[#0F3E2E] flex items-center justify-center mb-2">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F3E2E]">
                    Practice Settings
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Chambers phone, email, and location
                  </div>
                </div>
                <div className="flex items-center text-[11px] font-bold text-[#0F3E2E] mt-3">
                  Manage Settings <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-[#0F3E2E] bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export Enquiries Register (CSV)
              </button>

              <button
                type="button"
                onClick={handleCreateSampleEnquiry}
                className="inline-flex items-center px-3 py-1.5 text-xs text-gray-600 hover:text-[#0F3E2E] transition-colors"
              >
                + Inject Evaluation Sample Enquiry
              </button>
            </div>
          </div>

          {/* Active Chambers Configuration */}
          <div className="bg-[#0A2F24] text-white p-6 rounded-2xl border border-emerald-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                  Live Public Configuration
                </span>
                {isModified ? (
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                    Custom Overrides Active
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                    Standard Baseline
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg font-bold text-white leading-snug">
                {firmData.name}
              </h3>
              <p className="text-xs text-emerald-200/80 mt-1">
                Chartered Accountants • Tirupati Chambers
              </p>

              <div className="mt-4 space-y-2 text-xs text-gray-200">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>{firmData.contact.primaryPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="truncate">{firmData.contact.primaryLocation}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-800/60 flex items-center justify-between">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-bold text-gold hover:text-white transition-colors"
              >
                Visit Public Website <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <span className="text-[10px] text-emerald-300/60 font-mono">
                Reactive Sync: Active
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. RECENT CLIENT ENQUIRIES TABLE
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-base font-bold text-[#0F3E2E]">Recent Inquiries</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Latest client consultation submissions from the public website contact form
              </p>
            </div>
            <Link
              to={ADMIN_ROUTES.enquiries}
              className="inline-flex items-center text-xs font-bold text-[#0F3E2E] hover:text-[#C5A059] transition-colors"
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
                <button
                  type="button"
                  onClick={handleCreateSampleEnquiry}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0F3E2E] hover:bg-[#0A2F24] rounded-xl transition-all"
                >
                  Create Evaluation Sample
                </button>
                <Link
                  to="/contact"
                  target="_blank"
                  className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all inline-flex items-center gap-1"
                >
                  Test Public Contact Form <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Mobile Responsive Cards (< md) */}
              <div className="md:hidden divide-y divide-gray-100">
                {recentEnquiries.map((enquiry) => (
                  <div key={enquiry.id} className="p-4 space-y-2 hover:bg-gray-50/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-[#0F3E2E]">
                        {enquiry.id}
                      </span>
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
                        className="min-h-[44px] inline-flex items-center font-bold text-[#0F3E2E] hover:text-gold"
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
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Ref ID</th>
                      <th className="py-3 px-4">Date / Time</th>
                      <th className="py-3 px-4">Client / Entity</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Service Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentEnquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0F3E2E]">
                          {enquiry.id}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900">{enquiry.fullName}</div>
                          {enquiry.organization && (
                            <div className="text-[11px] text-gray-500">{enquiry.organization}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-gray-900 font-medium">{enquiry.phone}</div>
                          {enquiry.email && (
                            <div className="text-[11px] text-gray-500">{enquiry.email}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-gray-700 font-medium">
                          {enquiry.serviceCategory}
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
                            className="inline-flex items-center font-bold text-[#0F3E2E] hover:text-gold transition-colors"
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
