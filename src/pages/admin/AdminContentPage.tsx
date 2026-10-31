import React, { useState, useEffect, useMemo } from 'react';
import { 
  HelpCircle, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink,
  Briefcase,
  Eye,
  BookOpen,
  PlusCircle,
  Trash2,
  Edit3,
  Search,
  Clock
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminStorage } from '../../services/adminStorage';
import { useFirmData } from '../../context/FirmDataContext';
import { BlogService, BlogPost } from '../../services/blogService';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { AdminPost } from '../../types/admin';

export const AdminContentPage: React.FC = () => {
  const { data: firmData } = useFirmData();
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

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    adminStorage.fetchContentRemote().then(() => {
      setPosts(BlogService.getAllPosts(true));
    });
  }, []);

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

  const handleSelectPost = (slug: string) => {
    setIsCreatingNewPost(false);
    setSelectedPostSlug(slug);
    setPostViewMode('edit');
  };

  const handleStartNewPost = () => {
    setIsCreatingNewPost(true);
    setSelectedPostSlug('');
    setPostTitle('');
    setPostSlug('');
    setPostExcerpt('');
    setPostTags('Income Tax, Advisory');
    setPostAuthor('CA Kavitha Vijay');
    setPostAuthorRole('Managing Partner (ICAI Mem. 252985 | B.Com, CA, CMA AIR 49)');
    setPostCoverImage('/uploads/blog/corporate-tax-planning-2026.webp');
    setPostCoverImageAlt('');
    setPostStatus('published');
    setPostContent('# Article Title\n\nWrite statutory analysis, commentary, and compliance observations here...');
    setPostViewMode('edit');
  };

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
      setSaveMessage(`Updated "${serviceTitle}" (${serviceStatus.toUpperCase()})`);
      setTimeout(() => setSaveMessage(null), 3500);
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
      setSaveMessage(`Updated FAQ item (${faqStatus.toUpperCase()})`);
      setTimeout(() => setSaveMessage(null), 3500);
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = postSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    if (!cleanSlug || !postTitle.trim() || !postContent.trim()) {
      alert('Please provide an article title, valid URL slug, and content.');
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
      setSaveMessage(`Publication "${postTitle.trim()}" saved (${postStatus.toUpperCase()})`);
      setTimeout(() => setSaveMessage(null), 3500);
    }
  };

  const handleDeletePost = (slug: string) => {
    if (window.confirm(`Delete publication "${slug}"? This cannot be undone.`)) {
      adminStorage.deletePost(slug);
      const updated = BlogService.getAllPosts(true);
      setPosts(updated);
      if (updated.length > 0) {
        setSelectedPostSlug(updated[0].slug);
      } else {
        handleStartNewPost();
      }
      setSaveMessage(`Publication "${slug}" removed`);
      setTimeout(() => setSaveMessage(null), 3500);
    }
  };

  const handleResetToBaseline = () => {
    if (window.confirm('Reset all content back to baseline default? Custom modifications will be cleared.')) {
      adminStorage.resetContentOverrides();
      setPosts(BlogService.getAllPosts(true));
      setSaveMessage('All content restored to verified baseline.');
      setTimeout(() => setSaveMessage(null), 3500);
    }
  };

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
      title="Content & Services" 
      subtitle="Edit practice disciplines, statutory FAQs, and technical articles."
    >
      <div className="space-y-6">

        {/* Minimalist Tab Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EAEAEA]">
          {/* Segmented Control */}
          <div className="inline-flex p-1 bg-neutral-100 rounded-lg border border-neutral-200/60 max-w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`px-3.5 py-1.5 rounded-md text-xs transition-colors flex items-center gap-2 ${
                activeTab === 'services'
                  ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 font-medium'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
              <span>Services ({firmData.serviceCategories.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faqs')}
              className={`px-3.5 py-1.5 rounded-md text-xs transition-colors flex items-center gap-2 ${
                activeTab === 'faqs'
                  ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 font-medium'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
              <span>FAQs ({firmData.faqs.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('posts')}
              className={`px-3.5 py-1.5 rounded-md text-xs transition-colors flex items-center gap-2 ${
                activeTab === 'posts'
                  ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 font-medium'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
              <span>Articles ({posts.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToBaseline}
            className="text-[11px] font-mono text-neutral-400 hover:text-red-700 transition-colors flex items-center gap-1 self-start sm:self-auto py-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Baseline</span>
          </button>
        </div>

        {/* Minimal Toast Feedback */}
        {saveMessage && (
          <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium">{saveMessage}</span>
            </div>
            <a
              href={activeTab === 'posts' ? '/insights' : '/services'}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 underline"
            >
              View on Site <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        )}

        {/* =========================================================================
            TAB 1: SERVICES EDITOR (MINIMALIST)
            ========================================================================= */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Service Selector */}
            <div className="lg:col-span-4 space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2 px-1">
                Disciplines
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
                    className={`w-full text-left p-3.5 rounded-lg border transition-colors text-xs ${
                      isSelected
                        ? 'bg-white border-neutral-900 shadow-xs'
                        : 'bg-white border-[#EAEAEA] hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-neutral-400">
                        0{index + 1}
                      </span>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                        status === 'published' ? 'bg-[#EDF3EC] text-[#2D5A38]' : 'bg-[#FEF7E6] text-[#8A5B00]'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <div className="font-semibold text-neutral-900">
                      {service.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                      {service.shortDescription}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Service Edit Form */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-xl border border-[#EAEAEA]">
              <div className="pb-4 border-b border-[#F0F0F0] mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-neutral-900">
                    {currentService?.title}
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    Identifier: {selectedServiceId}
                  </p>
                </div>
                <a
                  href="/services"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 font-medium px-2.5 py-1 rounded border border-neutral-200 hover:bg-neutral-50"
                >
                  <Eye className="w-3 h-3 text-neutral-400" />
                  <span>Preview</span>
                </a>
              </div>

              <form onSubmit={handleSaveService} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Status
                    </label>
                    <select
                      value={serviceStatus}
                      onChange={(e) => setServiceStatus(e.target.value as 'published' | 'draft')}
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 bg-white font-medium"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Short Overview
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={serviceShortDesc}
                    onChange={(e) => setServiceShortDesc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Statutory Scope Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={serviceFullDesc}
                    onChange={(e) => setServiceFullDesc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Statutory Framework
                    </label>
                    <input
                      type="text"
                      value={serviceStatutory}
                      onChange={(e) => setServiceStatutory(e.target.value)}
                      placeholder="e.g. Income Tax Act, 1961"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Target Entities
                    </label>
                    <input
                      type="text"
                      value={serviceTarget}
                      onChange={(e) => setServiceTarget(e.target.value)}
                      placeholder="e.g. Companies, LLPs"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: FAQS EDITOR (MINIMALIST)
            ========================================================================= */}
        {activeTab === 'faqs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* FAQ List */}
            <div className="lg:col-span-4 space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2 px-1">
                Frequently Asked Questions
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
                    className={`w-full text-left p-3.5 rounded-lg border transition-colors text-xs ${
                      isSelected
                        ? 'bg-white border-neutral-900 shadow-xs'
                        : 'bg-white border-[#EAEAEA] hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-neutral-400">
                        FAQ 0{index + 1}
                      </span>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                        status === 'published' ? 'bg-[#EDF3EC] text-[#2D5A38]' : 'bg-[#FEF7E6] text-[#8A5B00]'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <div className="font-medium text-neutral-900 line-clamp-2">
                      {faq.question}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* FAQ Edit Form */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-xl border border-[#EAEAEA]">
              <div className="pb-4 border-b border-[#F0F0F0] mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-neutral-900">
                    Edit Statutory FAQ
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    Identifier: {selectedFaqId}
                  </p>
                </div>
                <a
                  href="/#knowledge-faq"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 font-medium px-2.5 py-1 rounded border border-neutral-200 hover:bg-neutral-50"
                >
                  <Eye className="w-3 h-3 text-neutral-400" />
                  <span>Preview</span>
                </a>
              </div>

              <form onSubmit={handleSaveFaq} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      required
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Status
                    </label>
                    <select
                      value={faqStatus}
                      onChange={(e) => setFaqStatus(e.target.value as 'published' | 'draft')}
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 bg-white font-medium"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Statutory Answer
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Statute Reference
                  </label>
                  <input
                    type="text"
                    required
                    value={faqStatute}
                    onChange={(e) => setFaqStatute(e.target.value)}
                    placeholder="e.g. Section 44AB of Income Tax Act, 1961"
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800"
                  />
                </div>

                <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save FAQ</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: STATUTORY ARTICLES (MINIMALIST)
            ========================================================================= */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Column: Article Selector */}
            <div className="lg:col-span-4 space-y-2">
              
              <button
                type="button"
                onClick={handleStartNewPost}
                className="w-full py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Write New Article</span>
              </button>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter articles..."
                  value={postSearchQuery}
                  onChange={(e) => setPostSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 text-neutral-800"
                />
              </div>

              <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-0.5">
                {filteredPosts.map((post) => {
                  const isSelected = !isCreatingNewPost && post.slug === selectedPostSlug;
                  return (
                    <button
                      key={post.slug}
                      type="button"
                      onClick={() => handleSelectPost(post.slug)}
                      className={`w-full text-left p-3.5 rounded-lg border transition-colors text-xs ${
                        isSelected
                          ? 'bg-white border-neutral-900 shadow-xs'
                          : 'bg-white border-[#EAEAEA] hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-neutral-400 truncate max-w-[140px]">
                          /{post.slug}
                        </span>
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                          post.draft ? 'bg-[#FEF7E6] text-[#8A5B00]' : 'bg-[#EDF3EC] text-[#2D5A38]'
                        }`}>
                          {post.draft ? 'Draft' : 'Published'}
                        </span>
                      </div>

                      <div className="font-semibold text-neutral-900 line-clamp-2">
                        {post.title}
                      </div>

                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#F5F5F5] text-[10px] text-neutral-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-300" />
                          {post.readingTime}m
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-[140px]">
                          {post.tags[0] || 'Advisory'}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {filteredPosts.length === 0 && (
                  <div className="p-4 text-center text-xs text-neutral-400 bg-white rounded-lg border border-neutral-200">
                    No matching articles.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Article Editor / Preview */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-xl border border-[#EAEAEA]">
              <div className="pb-4 border-b border-[#F0F0F0] mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-base font-bold text-neutral-900">
                    {isCreatingNewPost ? 'New Statutory Article' : (postTitle || postSlug)}
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    Route: /insights/{postSlug || '...'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex p-0.5 bg-neutral-100 rounded-md border border-neutral-200/60 text-xs">
                    <button
                      type="button"
                      onClick={() => setPostViewMode('edit')}
                      className={`px-2.5 py-1 rounded text-xs transition-colors ${
                        postViewMode === 'edit' ? 'bg-white text-neutral-900 font-semibold shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      <Edit3 className="w-3 h-3 inline mr-1" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostViewMode('preview')}
                      className={`px-2.5 py-1 rounded text-xs transition-colors ${
                        postViewMode === 'preview' ? 'bg-white text-neutral-900 font-semibold shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      Preview
                    </button>
                  </div>

                  {!isCreatingNewPost && postSlug && (
                    <a
                      href={`/insights/${postSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 font-medium px-2.5 py-1 rounded border border-neutral-200 hover:bg-neutral-50"
                    >
                      <span>Live</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
                    </a>
                  )}

                  {!isCreatingNewPost && postSlug && (
                    <button
                      type="button"
                      onClick={() => handleDeletePost(postSlug)}
                      title="Delete publication"
                      className="p-1 rounded text-neutral-400 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {postViewMode === 'preview' ? (
                /* LIVE MARKDOWN PREVIEW */
                <div className="p-6 bg-[#FAFAF9] rounded-lg border border-[#EAEAEA] space-y-4 max-h-[620px] overflow-y-auto">
                  <div className="pb-3 border-b border-neutral-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase px-1.5 py-0.5 bg-neutral-200/60 rounded">
                        {postTags.split(',')[0]?.trim() || 'Insight'}
                      </span>
                      <span className="text-xs text-neutral-300">•</span>
                      <span className="text-xs text-neutral-500 italic">
                        By {postAuthor}
                      </span>
                    </div>
                    <h1 className="font-serif text-xl font-bold text-neutral-900 leading-tight">
                      {postTitle || 'Untitled Publication'}
                    </h1>
                    {postExcerpt && (
                      <p className="text-xs text-neutral-600 mt-2 font-medium leading-relaxed italic border-l-2 border-neutral-300 pl-3">
                        {postExcerpt}
                      </p>
                    )}
                  </div>
                  <div className="prose prose-sm max-w-none text-xs leading-relaxed text-neutral-800">
                    <MarkdownRenderer content={postContent} />
                  </div>
                </div>
              ) : (
                /* EDIT FORM */
                <form onSubmit={handleSavePost} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={postTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Corporate Tax Assessment Protocols FY 2026-27"
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        required
                        value={postSlug}
                        onChange={(e) => setPostSlug(e.target.value)}
                        placeholder="e.g. corporate-tax-protocols"
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 font-mono text-neutral-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Tags (Comma separated)
                      </label>
                      <input
                        type="text"
                        required
                        value={postTags}
                        onChange={(e) => setPostTags(e.target.value)}
                        placeholder="e.g. Income Tax, Corporate Tax, Advisory"
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Publishing Status
                      </label>
                      <select
                        value={postStatus}
                        onChange={(e) => setPostStatus(e.target.value as 'published' | 'draft')}
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 bg-white font-medium"
                      >
                        <option value="published">Published (Visible Publicly)</option>
                        <option value="draft">Draft (Quarantined)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        required
                        value={postAuthor}
                        onChange={(e) => setPostAuthor(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Author Designation
                      </label>
                      <input
                        type="text"
                        required
                        value={postAuthorRole}
                        onChange={(e) => setPostAuthorRole(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Synopsis / Summary
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      placeholder="Concise overview of statutory insights discussed in this article..."
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 leading-relaxed text-neutral-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Cover Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={postCoverImage}
                      onChange={(e) => setPostCoverImage(e.target.value)}
                      placeholder="/uploads/blog/corporate-tax-planning-2026.webp"
                      className="w-full text-xs p-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                        Markdown Body
                      </label>
                      <span className="text-[10px] font-mono text-neutral-400">
                        # Heading · **bold** · *italic* · | table | · - list
                      </span>
                    </div>
                    <textarea
                      rows={11}
                      required
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="# Main Title&#10;&#10;Section 1: Statutory Framework...&#10;&#10;| Year | Slab | Rate |&#10;| --- | --- | --- |"
                      className="w-full text-xs p-3 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 font-mono leading-relaxed text-neutral-800 bg-[#FAFAFA]"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between">
                    <div className="text-[11px] font-mono text-neutral-400">
                      ~{Math.max(1, Math.ceil(postContent.trim().split(/\s+/).length / 200))} min ({postContent.trim().split(/\s+/).filter(Boolean).length} words)
                    </div>

                    <div className="flex items-center gap-2">
                      {isCreatingNewPost && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingNewPost(false);
                            if (posts[0]) setSelectedPostSlug(posts[0].slug);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isCreatingNewPost ? 'Publish Article' : 'Save Changes'}</span>
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
