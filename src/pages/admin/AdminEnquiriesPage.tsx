import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Inbox, 
  Search, 
  Filter, 
  Download, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  X, 
  Trash2, 
  Save, 
  ChevronRight
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminStorage, FIRM_DATA_UPDATE_EVENT } from '../../services/adminStorage';
import { EnquiryRecord, EnquiryStatus } from '../../types/admin';

export const AdminEnquiriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);

  // Edit fields for drawer
  const [editStatus, setEditStatus] = useState<EnquiryStatus>('new');
  const [editNotes, setEditNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadEnquiries = () => {
    const list = adminStorage.getEnquiries();
    setEnquiries(list);

    // If query parameter `id` is present, select that enquiry
    const queryId = searchParams.get('id');
    if (queryId) {
      const match = list.find(e => e.id === queryId);
      if (match) {
        openEnquiryDrawer(match);
      }
    }
  };

  useEffect(() => {
    loadEnquiries();
    window.addEventListener(FIRM_DATA_UPDATE_EVENT, loadEnquiries);
    return () => window.removeEventListener(FIRM_DATA_UPDATE_EVENT, loadEnquiries);
  }, []);

  const openEnquiryDrawer = (enquiry: EnquiryRecord) => {
    setSelectedEnquiry(enquiry);
    setEditStatus(enquiry.status);
    setEditNotes(enquiry.followUpNotes || '');
    setSaveSuccess(false);
  };

  const closeEnquiryDrawer = () => {
    setSelectedEnquiry(null);
    if (searchParams.get('id')) {
      searchParams.delete('id');
      setSearchParams(searchParams);
    }
  };

  const handleSaveStatusAndNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    const ok = adminStorage.updateEnquiryStatus(selectedEnquiry.id, editStatus, editNotes);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      loadEnquiries();
    }
  };

  const handleDeleteEnquiry = (id: string) => {
    if (window.confirm(`Are you sure you want to delete enquiry ${id}? This cannot be undone.`)) {
      adminStorage.deleteEnquiry(id);
      if (selectedEnquiry?.id === id) {
        closeEnquiryDrawer();
      }
      loadEnquiries();
    }
  };

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

  // Filter enquiries
  const filtered = enquiries.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    const matchQuery = !query || 
      item.id.toLowerCase().includes(query) ||
      item.fullName.toLowerCase().includes(query) ||
      (item.organization || '').toLowerCase().includes(query) ||
      item.phone.toLowerCase().includes(query) ||
      (item.email || '').toLowerCase().includes(query) ||
      item.serviceCategory.toLowerCase().includes(query) ||
      item.city.toLowerCase().includes(query);

    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchUrgency = urgencyFilter === 'all' || item.urgency === urgencyFilter;

    return matchQuery && matchStatus && matchUrgency;
  });

  return (
    <AdminLayout 
      title="Client Enquiries Register" 
      subtitle="Manage, track, and record follow-ups for consultation requests received from the public website."
    >
      <div className="space-y-6">

        {/* =========================================================================
            1. FILTER & SEARCH TOOLBAR
            ========================================================================= */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, firm, phone, ID or town..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F3E2E]/20 focus:border-[#0F3E2E] bg-gray-50/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 px-2.5 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#0F3E2E] bg-white"
              >
                <option value="all">All Statuses ({enquiries.length})</option>
                <option value="new">New ({enquiries.filter(e => e.status === 'new').length})</option>
                <option value="in-review">In Review ({enquiries.filter(e => e.status === 'in-review').length})</option>
                <option value="contacted">Contacted ({enquiries.filter(e => e.status === 'contacted').length})</option>
                <option value="closed">Closed ({enquiries.filter(e => e.status === 'closed').length})</option>
              </select>
            </div>

            {/* Urgency Filter */}
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#0F3E2E] bg-white text-gray-600"
            >
              <option value="all">All Urgency Levels</option>
              <option value="statutory-deadline">Statutory Deadline</option>
              <option value="routine">Routine</option>
            </select>

            {/* CSV Export */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold text-[#0F3E2E] bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. ENQUIRIES TABLE
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-700">No Enquiries Match Filter</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                {enquiries.length === 0 
                  ? 'No consultation requests logged yet. Submissions from the public contact form will appear here in real time.' 
                  : 'Try adjusting your search keywords or status filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Ref ID</th>
                    <th className="py-3 px-4">Received</th>
                    <th className="py-3 px-4">Client / Entity</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Service Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Urgency</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((enquiry) => (
                    <tr 
                      key={enquiry.id} 
                      className={`hover:bg-emerald-50/30 transition-colors cursor-pointer ${
                        selectedEnquiry?.id === enquiry.id ? 'bg-emerald-50/60 font-semibold' : ''
                      }`}
                      onClick={() => openEnquiryDrawer(enquiry)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F3E2E]">
                        {enquiry.id}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        {new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        <span className="text-[10px] text-gray-400">
                          {new Date(enquiry.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{enquiry.fullName}</div>
                        {enquiry.organization && (
                          <div className="text-[11px] text-gray-500 truncate max-w-[160px]">
                            {enquiry.organization}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-gray-900 font-medium">{enquiry.phone}</div>
                        {enquiry.email && (
                          <div className="text-[11px] text-gray-500 truncate max-w-[160px]">
                            {enquiry.email}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 font-medium max-w-[160px] truncate">
                        {enquiry.serviceCategory}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {enquiry.city}
                      </td>
                      <td className="py-3.5 px-4">
                        {enquiry.urgency === 'statutory-deadline' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800">
                            Deadline
                          </span>
                        ) : (
                          <span className="text-gray-500 text-[11px]">Routine</span>
                        )}
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
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEnquiryDrawer(enquiry);
                          }}
                          className="text-[#0F3E2E] hover:text-[#C5A059] font-bold inline-flex items-center"
                        >
                          Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =========================================================================
            3. ENQUIRY DETAIL MODAL / DRAWER
            ========================================================================= */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
            <div 
              className="bg-white w-full max-w-xl min-h-screen p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#0F3E2E]">
                        {selectedEnquiry.id}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          selectedEnquiry.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : selectedEnquiry.status === 'in-review'
                            ? 'bg-blue-100 text-blue-800'
                            : selectedEnquiry.status === 'contacted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {selectedEnquiry.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Received on {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeEnquiryDrawer}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    aria-label="Close details"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Client Profile Card */}
                <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                      Client Contact & Entity
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-0.5">
                      {selectedEnquiry.fullName}
                    </h3>
                    {selectedEnquiry.organization && (
                      <div className="text-xs text-gray-700 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold">{selectedEnquiry.organization}</span>
                        {selectedEnquiry.entityType && (
                          <span className="text-gray-500">({selectedEnquiry.entityType})</span>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-gray-600 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{selectedEnquiry.city}</span>
                    </div>
                  </div>

                  {/* Direct Contact Links */}
                  <div className="pt-2 border-t border-gray-200/60 flex flex-wrap gap-2 text-xs">
                    <a
                      href={`tel:${selectedEnquiry.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0F3E2E] font-bold hover:bg-emerald-100 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 mr-1.5" />
                      Call {selectedEnquiry.phone}
                    </a>
                    {selectedEnquiry.email && (
                      <a
                        href={`mailto:${selectedEnquiry.email}?subject=Consultation%20Inquiry%20—%20Kavitha%20%26%20Associates%20[${selectedEnquiry.id}]`}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                        Email Client
                      </a>
                    )}
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(selectedEnquiry.fullName)},%20greetings%20from%20Kavitha%20%26%20Associates%20regarding%20your%20consultation%20request%20[${selectedEnquiry.id}].`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                      WhatsApp Client
                    </a>
                  </div>
                </div>

                {/* Inquiry Service & Message */}
                <div className="mt-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Requested Service Domain
                    </span>
                    <div className="text-xs font-bold text-[#0F3E2E] bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                      {selectedEnquiry.serviceCategory}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Client Brief / Statutory Query
                    </span>
                    <div className="text-xs text-gray-800 bg-white p-3.5 rounded-xl border border-gray-200 leading-relaxed whitespace-pre-wrap">
                      {selectedEnquiry.message}
                    </div>
                  </div>
                </div>

                {/* Update Status & Practice Follow-Up Notes */}
                <form onSubmit={handleSaveStatusAndNotes} className="mt-6 space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F3E2E]">
                      Practice Follow-Up & Action Log
                    </span>
                    {saveSuccess && (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Changes saved!
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Enquiry Stage / Status:
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as EnquiryStatus)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0F3E2E] bg-white font-semibold"
                    >
                      <option value="new">New (Pending Action)</option>
                      <option value="in-review">In Review (Partner Assessment)</option>
                      <option value="contacted">Contacted (Meeting / Call Completed)</option>
                      <option value="closed">Closed (Engagement Formalized / Resolved)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Internal Practice Notes (Private to Firm):
                    </label>
                    <textarea
                      rows={3}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="e.g. Called client on 29 Oct; scheduled in-person chambers discussion for Monday 10:00 AM regarding GST audit documentation."
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F3E2E]/20 focus:border-[#0F3E2E] leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-[#0F3E2E] hover:bg-[#0A2F24] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Save Status & Practice Notes
                  </button>
                </form>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-gray-200 mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                  className="text-xs text-red-600 hover:text-red-800 font-bold inline-flex items-center"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete Enquiry
                </button>
                <button
                  type="button"
                  onClick={closeEnquiryDrawer}
                  className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
