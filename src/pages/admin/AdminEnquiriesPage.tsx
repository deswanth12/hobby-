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
  ChevronRight,
  ChevronLeft,
  Clock,
  RefreshCw,
  Cloud,
  Database,
  AlertCircle
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminStorage, FIRM_DATA_UPDATE_EVENT } from '../../services/adminStorage';
import { EnquiryRecord, EnquiryStatus } from '../../types/admin';

export const AdminEnquiriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Selected enquiry & drawer
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);
  const [editStatus, setEditStatus] = useState<EnquiryStatus>('new');
  const [editNotes, setEditNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isCloud = adminStorage.isCloudConnected();

  const loadEnquiries = async (fetchRemote = false) => {
    if (fetchRemote && isCloud) {
      setIsLoading(true);
      setFetchError(null);
      const res = await adminStorage.fetchEnquiriesRemote();
      setIsLoading(false);
      if (res.error) {
        setFetchError(res.error);
      }
      setEnquiries(res.data);
    } else {
      setEnquiries(adminStorage.getEnquiries());
    }

    // Direct deep-link via query parameter ?id=...
    const queryId = searchParams.get('id');
    if (queryId) {
      const match = adminStorage.getEnquiries().find(e => e.id === queryId);
      if (match) {
        openEnquiryDrawer(match);
      }
    }
  };

  useEffect(() => {
    loadEnquiries(true);
    window.addEventListener(FIRM_DATA_UPDATE_EVENT, () => loadEnquiries(false));
    return () => window.removeEventListener(FIRM_DATA_UPDATE_EVENT, () => loadEnquiries(false));
  }, []);

  // Reset pagination to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, urgencyFilter]);

  const openEnquiryDrawer = (enquiry: EnquiryRecord) => {
    setSelectedEnquiry(enquiry);
    setEditStatus(enquiry.status === 'in-review' ? 'in-progress' : enquiry.status);
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
      loadEnquiries(false);
    }
  };

  const handleDeleteEnquiry = (id: string) => {
    if (window.confirm(`Are you sure you want to permanently delete enquiry ${id}?`)) {
      adminStorage.deleteEnquiry(id);
      if (selectedEnquiry?.id === id) {
        closeEnquiryDrawer();
      }
      loadEnquiries(false);
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

    const matchStatus = statusFilter === 'all' || 
      item.status === statusFilter || 
      (statusFilter === 'in-progress' && item.status === 'in-review');

    const matchUrgency = urgencyFilter === 'all' || 
      item.urgency === urgencyFilter ||
      (urgencyFilter === 'statutory-deadline' && item.urgency === 'Urgent / Approaching Deadline');

    return matchQuery && matchStatus && matchUrgency;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEnquiries = filtered.slice(startIndex, startIndex + pageSize);

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">New</span>;
      case 'contacted':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">Contacted</span>;
      case 'in-progress':
      case 'in-review':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">In Progress</span>;
      case 'closed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">Closed</span>;
    }
  };

  return (
    <AdminLayout 
      title="Client Enquiries Register" 
      subtitle="Manage, track, and record follow-ups for consultation requests received from the public website."
    >
      <div className="space-y-6">

        {/* Database Status Bar */}
        <div className="flex items-center justify-between text-xs bg-white px-4 py-2.5 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center gap-2">
            {isCloud ? (
              <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Cloud className="w-4 h-4 text-emerald-600" />
                PostgreSQL Cloud DB Active (Supabase)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                <Database className="w-4 h-4 text-gray-500" />
                Local Storage Mode (All enquiries persist on this device)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => loadEnquiries(true)}
            disabled={isLoading}
            className="inline-flex items-center text-xs font-bold text-brand-darkgreen hover:text-brand-brightgold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {fetchError && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Notice: Cloud synchronization reported: {fetchError}. Serving verified local cache.</span>
          </div>
        )}

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
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen bg-gray-50/50"
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
              <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-h-[44px] py-2 px-3 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none focus:border-brand-darkgreen bg-white"
              >
                <option value="all">All Statuses ({enquiries.length})</option>
                <option value="new">New ({enquiries.filter(e => e.status === 'new').length})</option>
                <option value="contacted">Contacted ({enquiries.filter(e => e.status === 'contacted').length})</option>
                <option value="in-progress">In Progress ({enquiries.filter(e => e.status === 'in-progress' || e.status === 'in-review').length})</option>
                <option value="closed">Closed ({enquiries.filter(e => e.status === 'closed').length})</option>
              </select>
            </div>

            {/* Urgency Filter */}
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="min-h-[44px] py-2 px-3 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none focus:border-brand-darkgreen bg-white text-gray-600"
            >
              <option value="all">All Urgencies</option>
              <option value="statutory-deadline">Statutory Deadline</option>
              <option value="routine">Routine</option>
            </select>

            {/* CSV Export */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold text-brand-darkgreen bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. ENQUIRIES TABLE WITH PAGINATION
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-700">No Enquiries Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                {enquiries.length === 0 
                  ? 'No consultation requests logged yet. Submissions from the public contact form will appear here in real time.' 
                  : 'Try adjusting your search query or status filter.'}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Responsive Cards (< md) */}
              <div className="md:hidden divide-y divide-gray-100">
                {paginatedEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    onClick={() => openEnquiryDrawer(enquiry)}
                    className={`p-4 space-y-2.5 transition-colors cursor-pointer ${
                      selectedEnquiry?.id === enquiry.id ? 'bg-emerald-50/60' : 'hover:bg-gray-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-brand-darkgreen">
                        {enquiry.id}
                      </span>
                      {getStatusBadge(enquiry.status)}
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
                      <span>{enquiry.city}</span>
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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEnquiryDrawer(enquiry);
                        }}
                        className="min-h-[44px] inline-flex items-center font-bold text-brand-darkgreen hover:text-brand-brightgold"
                      >
                        Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
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
                    {paginatedEnquiries.map((enquiry) => (
                      <tr 
                        key={enquiry.id} 
                        className={`hover:bg-emerald-50/30 transition-colors cursor-pointer ${
                          selectedEnquiry?.id === enquiry.id ? 'bg-emerald-50/60 font-semibold' : ''
                        }`}
                        onClick={() => openEnquiryDrawer(enquiry)}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-darkgreen">
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
                          {enquiry.urgency === 'statutory-deadline' || enquiry.urgency === 'Urgent / Approaching Deadline' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800">
                              Deadline
                            </span>
                          ) : (
                            <span className="text-gray-500 text-[11px]">Routine</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(enquiry.status)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEnquiryDrawer(enquiry);
                            }}
                            className="text-brand-darkgreen hover:text-brand-brightgold font-bold inline-flex items-center"
                          >
                            Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
                <div>
                  Showing <span className="font-bold">{startIndex + 1}</span> to{' '}
                  <span className="font-bold">{Math.min(startIndex + pageSize, filtered.length)}</span> of{' '}
                  <span className="font-bold">{filtered.length}</span> enquiries
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                          p === currentPage
                            ? 'bg-brand-darkgreen text-white'
                            : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
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
                      <span className="font-mono text-sm font-bold text-brand-darkgreen">
                        {selectedEnquiry.id}
                      </span>
                      {getStatusBadge(selectedEnquiry.status)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Received on {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                    </div>
                    {selectedEnquiry.updatedAt && (
                      <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last Updated: {new Date(selectedEnquiry.updatedAt).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={closeEnquiryDrawer}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
                      className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-lg bg-emerald-50 text-brand-darkgreen font-bold hover:bg-emerald-100 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 mr-1.5" />
                      Call {selectedEnquiry.phone}
                    </a>
                    {selectedEnquiry.email && (
                      <a
                        href={`mailto:${selectedEnquiry.email}?subject=Consultation%20Inquiry%20—%20Kavitha%20%26%20Associates%20[${selectedEnquiry.id}]`}
                        className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                        Email Client
                      </a>
                    )}
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(selectedEnquiry.fullName)},%20greetings%20from%20Kavitha%20%26%20Associates%20regarding%20your%20consultation%20request%20[${selectedEnquiry.id}].`}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
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
                    <div className="text-xs font-bold text-brand-darkgreen bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
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
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-darkgreen">
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
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen bg-white font-semibold"
                    >
                      <option value="new">New (Pending Action)</option>
                      <option value="contacted">Contacted (Meeting / Call Completed)</option>
                      <option value="in-progress">In Progress (Audit / Filing in Progress)</option>
                      <option value="closed">Closed (Engagement Formalized / Concluded)</option>
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
                      placeholder="e.g. Discussed with managing partner; requested audited financials for FY 25-26."
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[44px] inline-flex items-center justify-center py-3 px-4 bg-brand-darkgreen hover:bg-brand-chambers text-white text-xs font-bold rounded-xl transition-colors duration-200 shadow-sm"
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
                  className="min-h-[44px] px-3 py-2 text-xs text-red-600 hover:text-red-800 font-bold inline-flex items-center rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete Enquiry
                </button>
                <button
                  type="button"
                  onClick={closeEnquiryDrawer}
                  className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors inline-flex items-center justify-center"
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
