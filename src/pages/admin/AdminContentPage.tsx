import React, { useState, useEffect, useMemo } from 'react';
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
  Database,
  BookOpen,
  PlusCircle,
  Trash2,
  Edit3,
  Search,
  Clock,
  Tag
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminStorage } from '../../services/adminStorage';
import { useFirmData } from '../../context/FirmDataContext';
import { BlogService, BlogPost } from '../../services/blogService';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { AdminPost } from '../../types/admin';

export const AdminContentPage: React.FC = () => {
  const { data: firmData, isModified } = useFirmData();
  const [activeTab, setActiveTab] = useState<'services' | 'faqs' | 'posts'>('services');

  // =========================================================================
  // 1. SERVICES STATE
  // =========================================================================
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    firmData.serviceCategories[0]?.id || ''
  );
  const currentService = firmData.serviceCategories.find(s => s.id === selectedServiceId);

  const [serviceTitle, setServiceTitle] = useState(currentService?.title || '');
  const [serviceShortDesc, setServiceShortDesc] = useState(currentService?.shortDescription || '');
  const [serviceFullDesc, setServiceFullDesc] = useState(currentService?.fullDescription || '');
  const [serviceStatutory, setServiceStatutory] = useState(currentService?.statutoryFramework || '');
  const [serviceTarget, setServiceTarget] = useState(currentService?.targetClients || '');
  const [serviceStatus, setServiceStatus] = useState<'published' | 'draft'>('published');

  // =========================================================================
  // 2. FAQS STATE
  // =========================================================================
  const [selectedFaqId, setSelectedFaqId] = useState<string>(firmData.faqs[0]?.id || '');
  const currentFaq = firmData.faqs.find(f => f.id === selectedFaqId);

  const [faqQuestion, setFaqQuestion] = useState(currentFaq?.question || '');
  const [faqAnswer, setFaqAnswer] = useState(currentFaq?.answer || '');
  const [faqStatute, setFaqStatute] = useState(currentFaq?.statuteReference || '');
  const [faqStatus, setFaqStatus] = useState<'published' | 'draft'>('published');

  // =========================================================================
  // 3. ARTICLES / INSIGHTS STATE
  // =========================================================================
  const [posts, setPosts] = useState<BlogPost[]>(() => BlogService.getAllPosts(true));
  const [selectedPostSlug, setSelectedPostSlug] = useState<string>(posts[0]?.slug || '');
  const [isCreatingNewPost, setIsCreatingNewPost] = useState<boolean>(false);
  const [postSearchQuery, setPostSearchQuery] = useState<string>('');
  const [postViewMode, setPostViewMode] = useState<'edit' | 'preview'>('edit');

  const [postTitle, setPostTitle] = useState<string>('');
  const [postSlug, setPostSlug] = useState<string>('');
  const [postExcerpt, setPostExcerpt] = useState<string>('');
  const [postTags, setPostTags] = useState<string>('');
  const [postAuthor, setPostAuthor] = useState<string>('CA Kavitha Vijay');
  const [postAuthorRole, setPostAuthorRole] = useState<string>('Managing Partner (ICAI Mem. 252985 | B.Com, CA, CMA AIR 49)');
  const [postCoverImage, setPostCoverImage] = useState<string>('');
  const [postCoverImageAlt, setPostCoverImageAlt] = useState<string>('');
  const [postStatus, setPostStatus] = useState<'published' | 'draft'>('published');
  const [postContent, setPostContent] = useState<string>('');

  // Notification banners
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isCloud = adminStorage.isCloudConnected();

  // Load remote content on mount if Supabase/Server API is active
  useEffect(() => {
    adminStorage.fetchContentRemote().then(() => {
      setPosts(BlogService.getAllPosts(true));
    });
  }, []);

  // Initialize selected post fields
  useEffect(() => {
    if (!isCreatingNewPost && selectedPostSlug) {
      const target = BlogService.getPostBySlug(selectedPostSlug, true);
      if (target) {
        setPostTitle(target.title);
        setPostSlug(target.slug);
        setPostExcerpt(target.excerpt);
        setPostTags(target.tags.join(', '));
        setPostAuthor(target.author || 'CA Kavitha Vijay');
        setPostAuthorRole(target.authorRole || 'Managing Partner (ICAI Mem. 252985 | B.Com, CA, CMA AIR 49)');
        setPostCoverImage(target.coverImage || '');
        setPostCoverImageAlt(target.coverImageAlt || '');
        setPostStatus(target.draft ? 'draft' : 'published');
        setPostContent(target.content || '');
      }
    }
  }, [selectedPostSlug, isCreatingNewPost]);

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

  // When changing selected post
  const handleSelectPost = (slug: string) => {
    setIsCreatingNewPost(false);
    setSelectedPostSlug(slug);
    setPostViewMode('edit');
  };

  // Start new article form
  const handleStartNewPost = () => {
    setIsCreatingNewPost(true);
    setSelectedPostSlug('');
    setPostTitle('');
    setPostSlug('');
    setPostExcerpt('');
    setPostTags('Income Tax, Statutory Advisory');
    setPostAuthor('CA Kavitha Vijay');
    setPostAuthorRole('Managing Partner (ICAI Mem. 252985 | B.Com, CA, CMA AIR 49)');
    setPostCoverImage('/uploads/blog/corporate-tax-planning-2026.webp');
    setPostCoverImageAlt('');
    setPostStatus('published');
    setPostContent('# Article Heading\n\nEnter article text with Markdown formatting, statutory references, and tax analysis.');
    setPostViewMode('edit');
  };

  // Slug generator helper
  const handleTitleChange = (val: string) => {
    setPostTitle(val);
    if (isCreatingNewPost) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
      setPostSlug(generated);
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

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = postSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    if (!cleanSlug || !postTitle.trim() || !postContent.trim()) {
      alert('Please provide an article title, valid URL slug, and article body content.');
      return;
    }

    const tagsArray = postTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const wordCount = postContent.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const postPayload: AdminPost = {
      slug: cleanSlug,
      title: postTitle.trim(),
      date: isCreatingNewPost ? new Date().toISOString() : (BlogService.getPostBySlug(cleanSlug, true)?.date || new Date().toISOString()),
      author: postAuthor.trim() || 'CA Kavitha Vijay',
      authorRole: postAuthorRole.trim() || 'Managing Partner (ICAI Mem. 252985 | B.Com, CA, CMA AIR 49)',
      coverImage: postCoverImage.trim() || undefined,
      coverImageAlt: postCoverImageAlt.trim() || postTitle.trim(),
      excerpt: postExcerpt.trim() || postContent.trim().slice(0, 160) + '...',
      tags: tagsArray.length > 0 ? tagsArray : ['Taxation'],
      draft: postStatus === 'draft',
      content: postContent,
      readingTime,
      seo: {
        metaTitle: `${postTitle.trim()} | Kavitha & Associates`,
        metaDescription: postExcerpt.trim() || postTitle.trim(),
        canonicalUrl: `https://kavithaassociates.com/insights/${cleanSlug}`
      }
    };

    const ok = adminStorage.savePost(postPayload);
    if (ok) {
      const updated = BlogService.getAllPosts(true);
      setPosts(updated);
      setSelectedPostSlug(cleanSlug);
      setIsCreatingNewPost(false);
      setSaveMessage(`Article "${postTitle.trim()}" published successfully (${postStatus.toUpperCase()})!`);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const handleDeletePost = (slug: string) => {
    if (window.confirm(`Are you sure you want to delete the publication "${slug}"? This action cannot be undone.`)) {
      adminStorage.deletePost(slug);
      const updated = BlogService.getAllPosts(true);
      setPosts(updated);
      if (updated.length > 0) {
        setSelectedPostSlug(updated[0].slug);
      } else {
        handleStartNewPost();
      }
      setSaveMessage(`Article "${slug}" was deleted.`);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  const handleResetToBaseline = () => {
    if (window.confirm('Are you sure you want to revert all services, FAQs, and articles back to baseline? Custom modifications will be cleared.')) {
      adminStorage.resetContentOverrides();
      setPosts(BlogService.getAllPosts(true));
      setSaveMessage('All content has been restored to default verified baseline.');
      setTimeout(() => setSaveMessage(null), 4000);

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

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (!postSearchQuery.trim()) return posts;
    const q = postSearchQuery.toLowerCase().trim();
    return posts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.slug.toLowerCase().includes(q)
    );
  }, [posts, postSearchQuery]);

  return (
    <AdminLayout 
      title="Content & Services Editor" 
      subtitle="Edit approved statutory service scopes, FAQ answers, and technical articles. Updates reflect live on the public website."
    >
      <div className="space-y-6">

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
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
            <button
              type="button"
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-200 flex items-center gap-2 ${
                activeTab === 'posts'
                  ? 'bg-brand-darkgreen text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Statutory Articles & Insights ({posts.length})
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
              href={activeTab === 'posts' ? '/insights' : '/services'}
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
                      <span className="font-mono text-[10px] font-bold text-gray-400">
                        DISCIPLINE 0{index + 1}
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
                    <div className="font-bold text-xs text-brand-darkgreen mt-1">
                      {service.title}
                    </div>
                    <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {service.shortDescription}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Service Edit Form */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="pb-4 border-b border-gray-100 mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-darkgreen">
                    Edit Service: {currentService?.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Identifier: <code className="font-mono text-emerald-800">{selectedServiceId}</code>
                  </p>
                </div>
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
                      <option value="draft">Draft (Quarantined)</option>
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
                      value={serviceStatutory}
                      onChange={(e) => setServiceStatutory(e.target.value)}
                      placeholder="e.g. Income Tax Act 1961"
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Target Entities / Clients
                    </label>
                    <input
                      type="text"
                      value={serviceTarget}
                      onChange={(e) => setServiceTarget(e.target.value)}
                      placeholder="e.g. Private Limited Companies, LLPs"
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen text-gray-800"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
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

        {/* =========================================================================
            TAB 3: STATUTORY ARTICLES & INSIGHTS PUBLISHING
            ========================================================================= */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column: Article Selector & New Article CTA */}
            <div className="lg:col-span-4 space-y-3">
              
              {/* New Article Action Button */}
              <button
                type="button"
                onClick={handleStartNewPost}
                className="w-full py-3 px-4 rounded-xl bg-brand-darkgreen text-white text-xs font-bold hover:bg-brand-chambers transition-colors shadow-sm flex items-center justify-center gap-2 border border-brand-darkgreen"
              >
                <PlusCircle className="w-4 h-4 text-gold-300" />
                Write & Publish New Article
              </button>

              {/* Search Filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles by title or tag..."
                  value={postSearchQuery}
                  onChange={(e) => setPostSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-darkgreen text-gray-800"
                />
              </div>

              {/* Articles List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredPosts.map((post) => {
                  const isSelected = !isCreatingNewPost && post.slug === selectedPostSlug;
                  return (
                    <button
                      key={post.slug}
                      type="button"
                      onClick={() => handleSelectPost(post.slug)}
                      className={`w-full text-left p-4 rounded-xl border transition-colors duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-brand-darkgreen ring-2 ring-brand-darkgreen/10 shadow-sm'
                          : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-bold text-gray-400 truncate max-w-[150px]">
                          /{post.slug}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            post.draft ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {post.draft ? 'Draft' : 'Published'}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] bg-emerald-100 text-brand-darkgreen font-bold px-2 py-0.5 rounded-full">
                              Editing
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="font-bold text-xs text-brand-darkgreen line-clamp-2 mt-1">
                        {post.title}
                      </div>

                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {post.readingTime} min
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-[140px] text-gray-600 font-medium">
                          {post.tags[0] || 'Advisory'}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {filteredPosts.length === 0 && (
                  <div className="p-6 text-center text-xs text-gray-500 bg-white rounded-xl border border-gray-200">
                    No articles found matching "{postSearchQuery}".
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Article Editor & Live Markdown Preview */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="pb-4 border-b border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-darkgreen">
                    {isCreatingNewPost ? 'Write New Statutory Article' : `Edit Article: ${postTitle || postSlug}`}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    Public Route: <code className="font-mono text-emerald-800">/insights/{postSlug || 'your-slug-here'}</code>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mode Toggle: Edit vs Preview */}
                  <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPostViewMode('edit')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        postViewMode === 'edit' ? 'bg-white text-brand-darkgreen shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Edit3 className="w-3 h-3 inline mr-1" />
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostViewMode('preview')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        postViewMode === 'preview' ? 'bg-white text-brand-darkgreen shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      Preview
                    </button>
                  </div>

                  {/* Public Link */}
                  {!isCreatingNewPost && postSlug && (
                    <a
                      href={`/insights/${postSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-brand-darkgreen hover:text-gold inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      View Live
                    </a>
                  )}

                  {/* Delete button (for custom articles) */}
                  {!isCreatingNewPost && postSlug && (
                    <button
                      type="button"
                      onClick={() => handleDeletePost(postSlug)}
                      title="Delete publication"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {postViewMode === 'preview' ? (
                /* LIVE MARKDOWN PREVIEW */
                <div className="p-6 bg-parchment-50 rounded-xl border border-gray-200 space-y-4 max-h-[600px] overflow-y-auto">
                  <div className="pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-gold-700 uppercase tracking-widest bg-gold-100/60 px-2 py-0.5 rounded">
                        {postTags.split(',')[0]?.trim() || 'Insight'}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 font-serif italic">
                        By {postAuthor}
                      </span>
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-brand-darkgreen leading-tight">
                      {postTitle || 'Untitled Article'}
                    </h1>
                    {postExcerpt && (
                      <p className="text-xs text-gray-600 mt-2 font-medium leading-relaxed italic border-l-2 border-gold-400 pl-3">
                        {postExcerpt}
                      </p>
                    )}
                  </div>
                  <div className="prose prose-sm max-w-none text-xs leading-relaxed text-gray-800">
                    <MarkdownRenderer content={postContent} />
                  </div>
                </div>
              ) : (
                /* EDIT FORM */
                <form onSubmit={handleSavePost} className="space-y-4">
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Article Title
                      </label>
                      <input
                        type="text"
                        required
                        value={postTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Assessment Defense Protocols under Income Tax Act"
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-bold text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        required
                        value={postSlug}
                        onChange={(e) => setPostSlug(e.target.value)}
                        placeholder="e.g. assessment-defense-protocols"
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen font-mono text-gray-700"
                      />
                    </div>
                  </div>

                  {/* Tags & Publishing Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                        <span>Category Tags (Comma separated)</span>
                        <Tag className="w-3 h-3 text-gray-400" />
                      </label>
                      <input
                        type="text"
                        required
                        value={postTags}
                        onChange={(e) => setPostTags(e.target.value)}
                        placeholder="e.g. Income Tax, Corporate Tax, Advisory"
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Publishing Status
                      </label>
                      <select
                        value={postStatus}
                        onChange={(e) => setPostStatus(e.target.value as 'published' | 'draft')}
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen font-semibold bg-white"
                      >
                        <option value="published">Published (Visible Publicly on /insights)</option>
                        <option value="draft">Draft (Quarantined / Private)</option>
                      </select>
                    </div>
                  </div>

                  {/* Author Name & Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Author Name
                      </label>
                      <input
                        type="text"
                        required
                        value={postAuthor}
                        onChange={(e) => setPostAuthor(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Author Professional Designation
                      </label>
                      <input
                        type="text"
                        required
                        value={postAuthorRole}
                        onChange={(e) => setPostAuthorRole(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Excerpt / Overview */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Executive Summary / Excerpt (Displayed on Cards & Search Engines)
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      placeholder="Concise 1-2 sentence overview of statutory insights discussed in this publication..."
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen leading-relaxed text-gray-800"
                    />
                  </div>

                  {/* Cover Image URL */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Cover Image Path or URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={postCoverImage}
                      onChange={(e) => setPostCoverImage(e.target.value)}
                      placeholder="/uploads/blog/corporate-tax-planning-2026.webp"
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-darkgreen text-gray-800 font-mono text-[11px]"
                    />
                  </div>

                  {/* Markdown Body Content */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Article Body (Markdown Supported)
                      </label>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Supports # Headings, **bold**, *italics*, tables, and lists
                      </span>
                    </div>
                    <textarea
                      rows={10}
                      required
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="# Main Title&#10;&#10;Section 1: Statutory Framework...&#10;&#10;| Assessment Year | Slab | Rate |&#10;| --- | --- | --- |"
                      className="w-full text-xs p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-mono leading-relaxed text-gray-800"
                    />
                  </div>

                  {/* Action Bar */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-[11px] text-gray-500 font-mono">
                      Estimated Reading Time: ~{Math.max(1, Math.ceil(postContent.trim().split(/\s+/).length / 200))} min ({postContent.trim().split(/\s+/).filter(Boolean).length} words)
                    </div>

                    <div className="flex items-center gap-2">
                      {isCreatingNewPost && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingNewPost(false);
                            if (posts[0]) setSelectedPostSlug(posts[0].slug);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        type="submit"
                        className="inline-flex items-center px-5 py-2.5 bg-brand-darkgreen hover:bg-brand-chambers text-white text-xs font-bold rounded-xl transition-colors duration-200 shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5 mr-1.5" />
                        {isCreatingNewPost ? 'Publish New Article' : 'Save & Publish Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
};
