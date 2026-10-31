import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Briefcase,
  Eye,
  Cloud,
  Database
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminStorage } from '../../services/adminStorage';
import { useFirmData } from '../../context/FirmDataContext';

export const AdminContentPage: React.FC = () => {
  const { data: firmData, isModified } = useFirmData();
  const [activeTab, setActiveTab] = useState<'services' | 'faqs'>('services');

  // Selected service to edit
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    firmData.serviceCategories[0]?.id || ''
  );
  const currentService = firmData.serviceCategories.find(s => s.id === selectedServiceId);

  // Form states for service
  const [serviceTitle, setServiceTitle] = useState(currentService?.title || '');
  const [serviceShortDesc, setServiceShortDesc] = useState(currentService?.shortDescription || '');
  const [serviceFullDesc, setServiceFullDesc] = useState(currentService?.fullDescription || '');
  const [serviceStatutory, setServiceStatutory] = useState(currentService?.statutoryFramework || '');
  const [serviceTarget, setServiceTarget] = useState(currentService?.targetClients || '');
  const [serviceStatus, setServiceStatus] = useState<'published' | 'draft'>('published');

  // Selected FAQ to edit
  const [selectedFaqId, setSelectedFaqId] = useState<string>(firmData.faqs[0]?.id || '');
  const currentFaq = firmData.faqs.find(f => f.id === selectedFaqId);

  const [faqQuestion, setFaqQuestion] = useState(currentFaq?.question || '');
  const [faqAnswer, setFaqAnswer] = useState(currentFaq?.answer || '');
  const [faqStatute, setFaqStatute] = useState(currentFaq?.statuteReference || '');
  const [faqStatus, setFaqStatus] = useState<'published' | 'draft'>('published');

  // Notification banners
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isCloud = adminStorage.isCloudConnected();

  // Load remote content on mount if Supabase is active
  useEffect(() => {
    adminStorage.fetchContentRemote();
  }, []);

  // When changing selected service
  const handleSelectService = (id: string) => {
    setSelectedServiceId(id);
    const target = firmData.serviceCategories.find(s => s.id === id);
    const overrides = adminStorage.getContentOverrides().services?.[id];
    if (target) {
      setServiceTitle(overrides?.title || target.title);
      setServiceShortDesc(overrides?.shortDescription || target.shortDescription);
      setServiceFullDesc(overrides?.fullDescription || target.fullDescription);
      setServiceStatutory(overrides?.statutoryFramework || target.statutoryFramework || '');
      setServiceTarget(overrides?.targetClients || target.targetClients || '');
      setServiceStatus(overrides?.status || 'published');
    }
  };

  // When changing selected FAQ
  const handleSelectFaq = (id: string) => {
    setSelectedFaqId(id);
    const target = firmData.faqs.find(f => f.id === id);
    const overrides = adminStorage.getContentOverrides().faqs?.[id];
    if (target) {
      setFaqQuestion(overrides?.question || target.question);
      setFaqAnswer(overrides?.answer || target.answer);
      setFaqStatute(overrides?.statuteReference || target.statuteReference || '');
      setFaqStatus(overrides?.status || 'published');
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) return;

    const ok = adminStorage.saveServiceOverride(selectedServiceId, {
      title: serviceTitle.trim(),
      shortDescription: serviceShortDesc.trim(),
      fullDescription: serviceFullDesc.trim(),
      statutoryFramework: serviceStatutory.trim(),
      targetClients: serviceTarget.trim(),
      status: serviceStatus,
    });

    if (ok) {
      setSaveMessage(`Successfully saved changes for "${serviceTitle}" (${serviceStatus.toUpperCase()}). Live on public website!`);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFaqId) return;

    const ok = adminStorage.saveFAQOverride(selectedFaqId, {
      question: faqQuestion.trim(),
      answer: faqAnswer.trim(),
      statuteReference: faqStatute.trim(),
      status: faqStatus,
    });

    if (ok) {
      setSaveMessage(`Successfully updated FAQ item (${faqStatus.toUpperCase()}). Live on public site!`);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  const handleResetToBaseline = () => {
    if (window.confirm('Are you sure you want to revert all services and FAQ content back to original baseline? Any custom edits will be removed.')) {
      adminStorage.resetContentOverrides();
      setSaveMessage('All content has been restored to default verified baseline.');
      setTimeout(() => setSaveMessage(null), 4000);

      // Refresh form fields
      setTimeout(() => {
        const targetService = firmData.serviceCategories.find(s => s.id === selectedServiceId);
        if (targetService) {
          setServiceTitle(targetService.title);
          setServiceShortDesc(targetService.shortDescription);
          setServiceFullDesc(targetService.fullDescription);
          setServiceStatutory(targetService.statutoryFramework || '');
          setServiceTarget(targetService.targetClients || '');
          setServiceStatus('published');
        }
      }, 100);
    }
  };

  return (
    <AdminLayout 
      title="Content & Services Editor" 
      subtitle="Edit approved statutory service scopes and FAQ answers. Updates reflect live on the public website."
    >
      <div className="space-y-6">

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-200 flex items-center gap-2 ${
                activeTab === 'services'
                  ? 'bg-brand-darkgreen text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Practice Services ({firmData.serviceCategories.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faqs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-200 flex items-center gap-2 ${
                activeTab === 'faqs'
                  ? 'bg-brand-darkgreen text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Statutory FAQs ({firmData.faqs.length})
            </button>
          </div>

          {/* Engine indicator & Reset Action */}
          <div className="flex items-center gap-3">
            {isCloud ? (
              <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <Cloud className="w-3 h-3 text-emerald-600" /> Supabase Content Table
              </span>
            ) : (
              <span className="text-[11px] text-gray-600 font-semibold bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200 flex items-center gap-1">
                <Database className="w-3 h-3 text-gray-500" /> Local Storage Sync
              </span>
            )}
            
            {isModified && (
              <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Custom Overrides Active
              </span>
            )}
            
            <button
              type="button"
              onClick={handleResetToBaseline}
              className="inline-flex items-center text-xs font-bold text-gray-600 hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50/50"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset All to Baseline
            </button>
          </div>
        </div>

        {/* Success Toast Banner */}
        {saveMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-brand-darkgreen flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveMessage}</span>
            </div>
            <a
              href="/services"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-700 hover:underline inline-flex items-center font-bold"
            >
              Preview Live on Website <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        )}

        {/* =========================================================================
            TAB 1: SERVICES EDITOR
            ========================================================================= */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Service Selector List */}
            <div className="lg:col-span-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 px-1">
                Select Service Category:
              </div>
              {firmData.serviceCategories.map((service, index) => {
                const isSelected = service.id === selectedServiceId;
                const serviceOverride = adminStorage.getContentOverrides().services?.[service.id];
                const status = serviceOverride?.status || 'published';
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleSelectService(service.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white border-brand-darkgreen ring-2 ring-brand-darkgreen/10 shadow-sm'
                        : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase text-gray-400">
                        Discipline 0{index + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {status}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-emerald-100 text-brand-darkgreen font-bold px-2 py-0.5 rounded-full">
                            Editing
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="font-bold text-xs text-brand-darkgreen mt-1 line-clamp-1">
                      {service.title}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                      {service.shortDescription}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Edit Form */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="pb-4 border-b border-gray-100 mb-6 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-darkgreen">
                    Edit Service: {currentService?.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Identifier: <code className="font-mono text-emerald-800">{selectedServiceId}</code>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="/services"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-brand-darkgreen hover:text-gold inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Preview Live <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>

              <form onSubmit={handleSaveService} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Service Display Title
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Publishing State
                    </label>
                    <select
                      value={serviceStatus}
                      onChange={(e) => setServiceStatus(e.target.value as 'published' | 'draft')}
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen font-semibold bg-white"
                    >
                      <option value="published">Published (Visible Publicly)</option>
                      <option value="draft">Draft (Practice Internal)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Short Description (Homepage Card & Overview)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={serviceShortDesc}
                    onChange={(e) => setServiceShortDesc(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen leading-relaxed text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Comprehensive Statutory Scope / Full Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={serviceFullDesc}
                    onChange={(e) => setServiceFullDesc(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen leading-relaxed text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Statutory Framework
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceStatutory}
                      onChange={(e) => setServiceStatutory(e.target.value)}
                      placeholder="e.g. Income Tax Act 1961, Section 44AB"
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Target Entities / Clients
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceTarget}
                      onChange={(e) => setServiceTarget(e.target.value)}
                      placeholder="e.g. Companies, LLPs, High-Net-Worth Individuals"
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen text-gray-800"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center px-5 py-2.5 bg-brand-darkgreen hover:bg-brand-chambers text-white text-xs font-bold rounded-xl transition-colors duration-200 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Save & Publish Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: FAQS EDITOR
            ========================================================================= */}
        {activeTab === 'faqs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* FAQ List */}
            <div className="lg:col-span-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 px-1">
                Select FAQ Question:
              </div>
              {firmData.faqs.map((faq, index) => {
                const isSelected = faq.id === selectedFaqId;
                const faqOverride = adminStorage.getContentOverrides().faqs?.[faq.id];
                const status = faqOverride?.status || 'published';
                return (
                  <button
                    key={faq.id}
                    type="button"
                    onClick={() => handleSelectFaq(faq.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors duration-200 ${
                      isSelected
                        ? 'bg-white border-brand-darkgreen ring-2 ring-brand-darkgreen/10 shadow-sm'
                        : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-gray-400">
                        FAQ #{index + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {status}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-emerald-100 text-brand-darkgreen font-bold px-2 py-0.5 rounded-full">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="font-bold text-xs text-brand-darkgreen line-clamp-2">
                      {faq.question}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* FAQ Edit Form */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="pb-4 border-b border-gray-100 mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-darkgreen">
                    Edit Statutory FAQ
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Identifier: <code className="font-mono text-emerald-800">{selectedFaqId}</code>
                  </p>
                </div>
                <a
                  href="/#knowledge-faq"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-brand-darkgreen hover:text-gold inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Preview FAQ Section <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>

              <form onSubmit={handleSaveFaq} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Question Text
                    </label>
                    <input
                      type="text"
                      required
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={faqStatus}
                      onChange={(e) => setFaqStatus(e.target.value as 'published' | 'draft')}
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen font-semibold bg-white"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Statutory Answer (ICAI Compliant, Informational)
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen leading-relaxed text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Statute Citation / Authority
                  </label>
                  <input
                    type="text"
                    required
                    value={faqStatute}
                    onChange={(e) => setFaqStatute(e.target.value)}
                    placeholder="e.g. Section 44AB of Income Tax Act, 1961"
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen text-gray-800"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-5 py-2.5 bg-brand-darkgreen hover:bg-brand-chambers text-white text-xs font-bold rounded-xl transition-colors duration-200 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Save & Publish FAQ
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
};
