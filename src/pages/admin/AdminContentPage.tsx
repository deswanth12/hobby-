import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
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
  Clock,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  X,
  RefreshCw,
  Archive
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminStorage } from '../../services/adminStorage';
import { useFirmData } from '../../context/FirmDataContext';
import { BlogService, BlogPost } from '../../services/blogService';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { AdminPost, AdminService, AdminFaq } from '../../types/admin';

export interface AdminContentPageProps {
  initialTab?: 'services' | 'faqs' | 'posts';
}

export const AdminContentPage: React.FC<AdminContentPageProps> = ({ initialTab }) => {
  const location = useLocation();
  const { data: firmData, reload: reloadFirmData } = useFirmData();
  
  const [activeTab, setActiveTab] = useState<'services' | 'faqs' | 'posts'>(() => {
    if (initialTab) return initialTab;
    if (typeof window !== 'undefined' && window.location.pathname.includes('/articles')) return 'posts';
    return 'services';
  });

  // Global Toast & Loading
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // =========================================================================
  // 1. SERVICES STATE & MANAGEMENT
  // =========================================================================
  const [servicesList, setServicesList] = useState<AdminService[]>(() => {
    const fromStorage = adminStorage.getAllServices();
    if (fromStorage.length > 0) return fromStorage;
    return firmData.serviceCategories.map((s, idx) => ({
      id: s.id,
      title: s.title,
      shortDescription: s.shortDescription,
      fullDescription: s.fullDescription,
      statutoryFramework: s.statutoryFramework,
      targetClients: s.targetClients,
      typicalScenarios: s.typicalScenarios || [],
      services: s.services || [],
      iconName: s.iconName || 'Briefcase',
      status: 'published',
      order: idx + 1,
      seo: {
        metaTitle: `${s.title} in Tirupati | CA Kavitha & Associates`,
        metaDescription: s.shortDescription,
        canonicalUrl: `https://kavithaassociates.com/services/${s.id}`
      }
    }));
  });

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    servicesList[0]?.id || ''
  );
  const [isCreatingNewService, setIsCreatingNewService] = useState(false);
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [servicePreviewOpen, setServicePreviewOpen] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [showArchivedServices, setShowArchivedServices] = useState(false);
  const [archivedServices, setArchivedServices] = useState<AdminService[]>(() => adminStorage.getDeletedServices());

  // Form Fields for Services
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceSlug, setServiceSlug] = useState('');
  const [serviceShortDesc, setServiceShortDesc] = useState('');
  const [serviceFullDesc, setServiceFullDesc] = useState('');
  const [serviceStatutory, setServiceStatutory] = useState('');
  const [serviceTarget, setServiceTarget] = useState('');
  const [serviceIconName, setServiceIconName] = useState('Briefcase');
  const [serviceDeliverablesText, setServiceDeliverablesText] = useState('');
  const [serviceScenariosText, setServiceScenariosText] = useState('');
  const [serviceStatus, setServiceStatus] = useState<'published' | 'draft'>('published');
  const [serviceOrder, setServiceOrder] = useState<number>(1);
  const [serviceMetaTitle, setServiceMetaTitle] = useState('');
  const [serviceMetaDesc, setServiceMetaDesc] = useState('');
  const [serviceCanonical, setServiceCanonical] = useState('');
  const [serviceFormDirty, setServiceFormDirty] = useState(false);

  // =========================================================================
  // 2. FAQS STATE & MANAGEMENT
  // =========================================================================
  const [faqsList, setFaqsList] = useState<AdminFaq[]>(() => {
    const fromStorage = adminStorage.getAllFaqs();
    if (fromStorage.length > 0) return fromStorage;
    return firmData.faqs.map((f, idx) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      statuteReference: f.statuteReference,
      category: f.category || 'General Practice',
      serviceIds: [],
      status: 'published',
      order: idx + 1
    }));
  });

  const [selectedFaqId, setSelectedFaqId] = useState<string>(faqsList[0]?.id || '');
  const [isCreatingNewFaq, setIsCreatingNewFaq] = useState(false);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [faqPreviewOpen, setFaqPreviewOpen] = useState(false);
  const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null);
  const [showArchivedFaqs, setShowArchivedFaqs] = useState(false);
  const [archivedFaqs, setArchivedFaqs] = useState<AdminFaq[]>(() => adminStorage.getDeletedFaqs());

  // Form Fields for FAQs
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqStatute, setFaqStatute] = useState('');
  const [faqCategory, setFaqCategory] = useState('General Practice');
  const [faqServiceIds, setFaqServiceIds] = useState<string[]>([]);
  const [faqStatus, setFaqStatus] = useState<'published' | 'draft'>('published');
  const [faqOrder, setFaqOrder] = useState<number>(1);
  const [faqFormDirty, setFaqFormDirty] = useState(false);

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
  const [postAuthorRole, setPostAuthorRole] = useState<string>('Managing Partner (B.Com, CA, CMA AIR 49)');
  const [postCoverImage, setPostCoverImage] = useState<string>('');
  const [postCoverImageAlt, setPostCoverImageAlt] = useState<string>('');
  const [postStatus, setPostStatus] = useState<'published' | 'draft'>('published');
  const [postContent, setPostContent] = useState<string>('');

  // Initial Sync from Remote Server API
  useEffect(() => {
    adminStorage.fetchContentRemote().then(() => {
      setServicesList(adminStorage.getAllServices());
      setArchivedServices(adminStorage.getDeletedServices());
      setFaqsList(adminStorage.getAllFaqs());
      setArchivedFaqs(adminStorage.getDeletedFaqs());
      setPosts(BlogService.getAllPosts(true));
    });
  }, []);

  // Modal overlay hardening: body scroll locking and Escape key dismissal
  const isAnyModalOpen = Boolean(servicePreviewOpen || faqPreviewOpen || deletingServiceId || deletingFaqId);

  useEffect(() => {
    if (!isAnyModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicePreviewOpen(false);
        setFaqPreviewOpen(false);
        setDeletingServiceId(null);
        setDeletingFaqId(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAnyModalOpen]);

  // Update Services Form on Selection
  useEffect(() => {
    if (isCreatingNewService) return;
    const target = servicesList.find(s => s.id === selectedServiceId);
    if (target) {
      setServiceTitle(target.title);
      setServiceSlug(target.id);
      setServiceShortDesc(target.shortDescription || '');
      setServiceFullDesc(target.fullDescription || '');
      setServiceStatutory(target.statutoryFramework || '');
      setServiceTarget(target.targetClients || '');
      setServiceIconName(target.iconName || 'Briefcase');
      setServiceDeliverablesText((target.services || []).join('\n'));
      setServiceScenariosText((target.typicalScenarios || []).join('\n'));
      setServiceStatus(target.status);
      setServiceOrder(target.order ?? 1);
      setServiceMetaTitle(target.seo?.metaTitle || `${target.title} in Tirupati | CA Kavitha & Associates`);
      setServiceMetaDesc(target.seo?.metaDescription || target.shortDescription || '');
      setServiceCanonical(target.seo?.canonicalUrl || `https://kavithaassociates.com/services/${target.id}`);
      setServiceFormDirty(false);
    }
  }, [selectedServiceId, servicesList, isCreatingNewService]);

  // Update FAQs Form on Selection
  useEffect(() => {
    if (isCreatingNewFaq) return;
    const target = faqsList.find(f => f.id === selectedFaqId);
    if (target) {
      setFaqQuestion(target.question);
      setFaqAnswer(target.answer);
      setFaqStatute(target.statuteReference || '');
      setFaqCategory(target.category || 'General Practice');
      setFaqServiceIds(target.serviceIds || []);
      setFaqStatus(target.status);
      setFaqOrder(target.order ?? 1);
      setFaqFormDirty(false);
    }
  }, [selectedFaqId, faqsList, isCreatingNewFaq]);

  // Update Articles Form on Selection
  useEffect(() => {
    if (!isCreatingNewPost && selectedPostSlug) {
      const target = BlogService.getPostBySlug(selectedPostSlug, true);
      if (target) {
        setPostTitle(target.title);
        setPostSlug(target.slug);
        setPostExcerpt(target.excerpt);
        setPostTags(target.tags.join(', '));
        setPostAuthor(target.author || 'CA Kavitha Vijay');
        setPostAuthorRole(target.authorRole || 'Managing Partner (B.Com, CA, CMA AIR 49)');
        setPostCoverImage(target.coverImage || '');
        setPostCoverImageAlt(target.coverImageAlt || '');
        setPostStatus(target.draft ? 'draft' : 'published');
        setPostContent(target.content || '');
      }
    }
  }, [selectedPostSlug, isCreatingNewPost]);

  // URL Query handling
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      setActiveTab('posts');
      handleStartNewPost();
    } else if (initialTab === 'posts' || location.pathname.includes('/articles')) {
      setActiveTab('posts');
    }
  }, [location.pathname, location.search, initialTab]);

  // -------------------------------------------------------------------------
  // SERVICES HANDLERS
  // -------------------------------------------------------------------------
  const handleSelectService = (id: string) => {
    if (serviceFormDirty && !window.confirm('You have unsaved changes to this service. Discard changes?')) {
      return;
    }
    setIsCreatingNewService(false);
    setSelectedServiceId(id);
  };

  const handleStartNewService = () => {
    if (serviceFormDirty && !window.confirm('You have unsaved changes. Discard and create new service?')) {
      return;
    }
    setIsCreatingNewService(true);
    setSelectedServiceId('');
    setServiceTitle('');
    setServiceSlug('');
    setServiceShortDesc('');
    setServiceFullDesc('');
    setServiceStatutory('');
    setServiceTarget('');
    setServiceIconName('Briefcase');
    setServiceDeliverablesText('');
    setServiceScenariosText('');
    setServiceStatus('published');
    setServiceOrder(servicesList.length + 1);
    setServiceMetaTitle('');
    setServiceMetaDesc('');
    setServiceCanonical('');
    setServiceFormDirty(false);
  };

  const handleServiceTitleChange = (val: string) => {
    setServiceTitle(val);
    setServiceFormDirty(true);
    if (isCreatingNewService) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
      setServiceSlug(autoSlug);
      setServiceMetaTitle(`${val.trim()} in Tirupati | CA Kavitha & Associates`);
      setServiceCanonical(`https://kavithaassociates.com/services/${autoSlug}`);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = serviceTitle.trim();
    const cleanSlug = serviceSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, '');

    if (!cleanTitle || cleanTitle.length < 2) {
      setErrorMessage('Please enter a valid service title (at least 2 characters).');
      return;
    }

    if (!cleanSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) {
      setErrorMessage('Invalid URL slug format. Use lowercase letters, numbers, and single hyphens.');
      return;
    }

    // Check duplicate slug
    const duplicate = servicesList.find(s => s.id === cleanSlug && (isCreatingNewService || s.id !== selectedServiceId));
    if (duplicate) {
      setErrorMessage(`The slug "${cleanSlug}" is already in use by another service.`);
      return;
    }

    const deliverables = serviceDeliverablesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const scenarios = serviceScenariosText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload: AdminService = {
      id: cleanSlug,
      title: cleanTitle,
      shortDescription: serviceShortDesc.trim(),
      fullDescription: serviceFullDesc.trim(),
      statutoryFramework: serviceStatutory.trim(),
      targetClients: serviceTarget.trim(),
      typicalScenarios: scenarios,
      services: deliverables,
      iconName: serviceIconName,
      status: serviceStatus,
      order: serviceOrder,
      seo: {
        metaTitle: serviceMetaTitle.trim() || `${cleanTitle} in Tirupati | CA Kavitha & Associates`,
        metaDescription: serviceMetaDesc.trim() || serviceShortDesc.trim() || `Professional ${cleanTitle} services in Tirupati, AP.`,
        canonicalUrl: serviceCanonical.trim() || `https://kavithaassociates.com/services/${cleanSlug}`
      }
    };

    setIsSaving(true);
    setErrorMessage(null);
    const res = await adminStorage.saveService(payload, isCreatingNewService);
    setIsSaving(false);

    if (res.success && res.service) {
      const updatedList = adminStorage.getAllServices();
      setServicesList(updatedList);
      setSelectedServiceId(res.service.id);
      setIsCreatingNewService(false);
      setServiceFormDirty(false);
      setSaveMessage(`Successfully saved "${cleanTitle}" (${serviceStatus.toUpperCase()})`);
      setTimeout(() => setSaveMessage(null), 3500);
      reloadFirmData();
    } else {
      setErrorMessage(res.error || 'Failed to save service.');
    }
  };

  const handleConfirmDeleteService = async () => {
    if (!deletingServiceId) return;
    setIsSaving(true);
    const res = await adminStorage.deleteService(deletingServiceId);
    setIsSaving(false);
    setDeletingServiceId(null);

    if (res.success) {
      const updated = adminStorage.getAllServices();
      setServicesList(updated);
      setArchivedServices(adminStorage.getDeletedServices());
      if (selectedServiceId === deletingServiceId) {
        setSelectedServiceId(updated[0]?.id || '');
      }
      setSaveMessage('Service archived to recovery store.');
      setTimeout(() => setSaveMessage(null), 3500);
      reloadFirmData();
    } else {
      setErrorMessage(res.error || 'Failed to delete service.');
    }
  };

  const handleRecoverService = async (id: string) => {
    setIsSaving(true);
    const res = await adminStorage.recoverService(id);
    setIsSaving(false);

    if (res.success) {
      setServicesList(adminStorage.getAllServices());
      setArchivedServices(adminStorage.getDeletedServices());
      setSelectedServiceId(id);
      setSaveMessage(`Restored service "${res.service?.title || id}".`);
      setTimeout(() => setSaveMessage(null), 3500);
      reloadFirmData();
    } else {
      setErrorMessage(res.error || 'Failed to restore service.');
    }
  };

  const handleMoveService = async (id: string, direction: 'up' | 'down') => {
    const idx = servicesList.findIndex(s => s.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === servicesList.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newList = [...servicesList];
    const [moved] = newList.splice(idx, 1);
    newList.splice(targetIdx, 0, moved);

    const orderedIds = newList.map(s => s.id);
    setServicesList(newList);

    const res = await adminStorage.reorderServices(orderedIds);
    if (res.success) {
      reloadFirmData();
    }
  };

  // -------------------------------------------------------------------------
  // FAQS HANDLERS
  // -------------------------------------------------------------------------
  const handleSelectFaq = (id: string) => {
    if (faqFormDirty && !window.confirm('You have unsaved changes to this FAQ. Discard changes?')) {
      return;
    }
    setIsCreatingNewFaq(false);
    setSelectedFaqId(id);
  };

  const handleStartNewFaq = () => {
    if (faqFormDirty && !window.confirm('You have unsaved changes. Discard and add new FAQ?')) {
      return;
    }
    setIsCreatingNewFaq(true);
    setSelectedFaqId('');
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqStatute('');
    setFaqCategory('General Practice');
    setFaqServiceIds([]);
    setFaqStatus('published');
    setFaqOrder(faqsList.length + 1);
    setFaqFormDirty(false);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuestion = faqQuestion.trim();
    const cleanAnswer = faqAnswer.trim();

    if (!cleanQuestion || cleanQuestion.length < 5) {
      setErrorMessage('FAQ question is required (at least 5 characters).');
      return;
    }

    if (!cleanAnswer || cleanAnswer.length < 10) {
      setErrorMessage('FAQ answer is required (at least 10 characters).');
      return;
    }

    const faqId = isCreatingNewFaq 
      ? `faq-${Date.now().toString(36)}-${Math.floor(Math.random() * 899 + 100)}` 
      : selectedFaqId;

    const payload: AdminFaq = {
      id: faqId,
      question: cleanQuestion,
      answer: cleanAnswer,
      statuteReference: faqStatute.trim(),
      category: faqCategory.trim() || 'General Practice',
      serviceIds: faqServiceIds,
      status: faqStatus,
      order: faqOrder
    };

    setIsSaving(true);
    setErrorMessage(null);
    const res = await adminStorage.saveFaq(payload, isCreatingNewFaq);
    setIsSaving(false);

    if (res.success && res.faq) {
      const updatedList = adminStorage.getAllFaqs();
      setFaqsList(updatedList);
      setSelectedFaqId(res.faq.id);
      setIsCreatingNewFaq(false);
      setFaqFormDirty(false);
      setSaveMessage(`Successfully saved FAQ item (${faqStatus.toUpperCase()})`);
      setTimeout(() => setSaveMessage(null), 3500);
      reloadFirmData();
    } else {
      setErrorMessage(res.error || 'Failed to save FAQ.');
    }
  };

  const handleConfirmDeleteFaq = async () => {
    if (!deletingFaqId) return;
    setIsSaving(true);
    const res = await adminStorage.deleteFaq(deletingFaqId);
    setIsSaving(false);
    setDeletingFaqId(null);

    if (res.success) {
      const updated = adminStorage.getAllFaqs();
      setFaqsList(updated);
      setArchivedFaqs(adminStorage.getDeletedFaqs());
      if (selectedFaqId === deletingFaqId) {
        setSelectedFaqId(updated[0]?.id || '');
      }
      setSaveMessage('FAQ item archived to recovery store.');
      setTimeout(() => setSaveMessage(null), 3500);
      reloadFirmData();
    } else {
      setErrorMessage(res.error || 'Failed to delete FAQ.');
    }
  };

  const handleRecoverFaq = async (id: string) => {
    setIsSaving(true);
    const res = await adminStorage.recoverFaq(id);
    setIsSaving(false);

    if (res.success) {
      setFaqsList(adminStorage.getAllFaqs());
      setArchivedFaqs(adminStorage.getDeletedFaqs());
      setSelectedFaqId(id);
      setSaveMessage('Restored FAQ from recovery store.');
      setTimeout(() => setSaveMessage(null), 3500);
      reloadFirmData();
    } else {
      setErrorMessage(res.error || 'Failed to restore FAQ.');
    }
  };

  const handleMoveFaq = async (id: string, direction: 'up' | 'down') => {
    const idx = faqsList.findIndex(f => f.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === faqsList.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newList = [...faqsList];
    const [moved] = newList.splice(idx, 1);
    newList.splice(targetIdx, 0, moved);

    const orderedIds = newList.map(f => f.id);
    setFaqsList(newList);

    const res = await adminStorage.reorderFaqs(orderedIds);
    if (res.success) {
      reloadFirmData();
    }
  };

  // -------------------------------------------------------------------------
  // ARTICLES HANDLERS (PRESERVED)
  // -------------------------------------------------------------------------
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
    setPostAuthorRole('Managing Partner (B.Com, CA, CMA AIR 49)');
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

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = postSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    if (!cleanSlug || !postTitle.trim() || !postContent.trim()) {
      setErrorMessage('Please provide an article title, valid URL slug, and content.');
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
      authorRole: postAuthorRole.trim() || 'Managing Partner (B.Com, CA, CMA AIR 49)',
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
        canonicalUrl: `https://kavithaassociates.com/blog/${cleanSlug}`
      }
    };

    const ok = adminStorage.savePost(postPayload);
    if (ok) {
      if (!isCreatingNewPost && selectedPostSlug && selectedPostSlug !== cleanSlug) {
        adminStorage.deletePost(selectedPostSlug);
      }
      const updated = BlogService.getAllPosts(true);
      setPosts(updated);
      setSelectedPostSlug(cleanSlug);
      setIsCreatingNewPost(false);
      setSaveMessage(`Successfully saved article "${postTitle.trim()}" (${postStatus.toUpperCase()})`);
      setTimeout(() => setSaveMessage(null), 3500);
    } else {
      setErrorMessage('Failed to save article.');
    }
  };

  const handleDeletePost = (slug: string) => {
    if (!window.confirm(`Are you sure you want to delete article "${slug}"?`)) return;
    const ok = adminStorage.deletePost(slug);
    if (ok) {
      const updated = BlogService.getAllPosts(true);
      setPosts(updated);
      if (selectedPostSlug === slug) {
        setSelectedPostSlug(updated[0]?.slug || '');
      }
      setSaveMessage(`Article "${slug}" removed.`);
      setTimeout(() => setSaveMessage(null), 3500);
    }
  };

  const handleResetToBaseline = async () => {
    if (!window.confirm('Reset ALL services and FAQs to default baseline? Custom additions will be cleared.')) return;
    try {
      const session = adminStorage.getSession();
      const res = await fetch('/api/admin/content/reset', {
        method: 'POST',
        headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch {
      alert('Could not reset baseline.');
    }
  };

  // -------------------------------------------------------------------------
  // FILTERED LISTS
  // -------------------------------------------------------------------------
  const filteredServices = useMemo(() => {
    return servicesList.filter(s => 
      s.title.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
      (s.shortDescription || '').toLowerCase().includes(serviceSearchQuery.toLowerCase())
    );
  }, [servicesList, serviceSearchQuery]);

  const filteredFaqs = useMemo(() => {
    return faqsList.filter(f => 
      f.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      (f.category || '').toLowerCase().includes(faqSearchQuery.toLowerCase())
    );
  }, [faqsList, faqSearchQuery]);

  const filteredPosts = useMemo(() => {
    return posts.filter(p => 
      p.title.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(postSearchQuery.toLowerCase())
    );
  }, [posts, postSearchQuery]);

  return (
    <AdminLayout title="Content Management" subtitle="Statutory Services, FAQs & Articles">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Sub-navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-brand-gold">
              Editorial Governance
            </div>
            <h1 className="font-serif text-2xl font-light text-neutral-900 tracking-tight">
              Statutory Content & Knowledge Base
            </h1>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#F0F2F0] rounded-lg border border-[#E0E5E0] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'services'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Practice Services ({servicesList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('faqs')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'faqs'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Statutory FAQs ({faqsList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('posts')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'posts'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Articles ({posts.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToBaseline}
            className="text-[11px] font-mono text-neutral-400 hover:text-red-700 transition-colors flex items-center gap-1 self-start sm:self-auto py-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Baseline</span>
          </button>
        </div>

        {/* Success Toast */}
        {saveMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{saveMessage}</span>
            </div>
            <a
              href={activeTab === 'posts' ? '/blog' : '/services'}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 underline"
            >
              View on Site <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        )}

        {/* Error Toast */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-600 hover:text-red-900 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: SERVICES CRUD & REORDERING
            ========================================================================= */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Services List & Management */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleStartNewService}
                  className="flex-1 py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-xs font-mono"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#D8C296]" />
                  <span>Create Service</span>
                </button>

                {archivedServices.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowArchivedServices(!showArchivedServices)}
                    className="py-2 px-3 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors flex items-center gap-1 font-mono"
                    title="View Archived Services"
                  >
                    <Archive className="w-3.5 h-3.5 text-neutral-500" />
                    <span>({archivedServices.length})</span>
                  </button>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter practice services..."
                  value={serviceSearchQuery}
                  onChange={(e) => setServiceSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 text-neutral-800"
                />
              </div>

              {/* Archived Recovery Panel */}
              {showArchivedServices && archivedServices.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
                  <div className="font-mono text-[10px] uppercase font-bold text-amber-900 flex items-center justify-between">
                    <span>Archived Services Recovery</span>
                    <button onClick={() => setShowArchivedServices(false)}>
                      <X className="w-3 h-3 text-amber-700" />
                    </button>
                  </div>
                  {archivedServices.map(archived => (
                    <div key={archived.id} className="flex items-center justify-between bg-white p-2 rounded border border-amber-200/60">
                      <div className="truncate pr-2">
                        <span className="font-medium text-neutral-900">{archived.title}</span>
                        <span className="block text-[10px] font-mono text-neutral-400">/{archived.id}</span>
                      </div>
                      <button
                        onClick={() => handleRecoverService(archived.id)}
                        className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[10px] font-mono flex items-center gap-1 shrink-0"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Restore</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Service Items */}
              <div className="space-y-1.5 max-h-[650px] overflow-y-auto pr-0.5">
                {filteredServices.map((service, index) => {
                  const isSelected = !isCreatingNewService && service.id === selectedServiceId;
                  const isPublished = service.status === 'published';

                  return (
                    <div
                      key={service.id}
                      className={`group w-full p-3 rounded-lg border transition-all text-xs flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-white border-neutral-900 shadow-sm'
                          : 'bg-white border-[#EAEAEA] hover:border-neutral-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectService(service.id)}
                        className="flex-1 text-left min-w-0"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] text-neutral-400">
                            #{String(service.order || index + 1).padStart(2, '0')}
                          </span>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            isPublished ? 'bg-[#EDF3EC] text-[#2D5A38]' : 'bg-[#FEF7E6] text-[#8A5B00]'
                          }`}>
                            {service.status}
                          </span>
                        </div>
                        <div className="font-semibold text-neutral-900 truncate">
                          {service.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono truncate mt-0.5">
                          /services/{service.id}
                        </div>
                      </button>

                      {/* Reorder Buttons */}
                      <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveService(service.id, 'up')}
                          className="p-1 rounded hover:bg-neutral-100 disabled:opacity-20 text-neutral-600"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === filteredServices.length - 1}
                          onClick={() => handleMoveService(service.id, 'down')}
                          className="p-1 rounded hover:bg-neutral-100 disabled:opacity-20 text-neutral-600"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Service Form & Preview */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-xl border border-[#EAEAEA]">
              <div className="pb-4 border-b border-[#F0F0F0] mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    {isCreatingNewService ? 'Create Practice Service' : `Edit: ${serviceTitle || selectedServiceId}`}
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    {isCreatingNewService ? 'Generates persistent statutory route' : `URL: /services/${serviceSlug}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!isCreatingNewService && (
                    <>
                      <button
                        type="button"
                        onClick={() => setServicePreviewOpen(true)}
                        className="text-xs text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 font-medium px-2.5 py-1.5 rounded border border-neutral-200 hover:bg-neutral-50"
                      >
                        <Eye className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Preview Modal</span>
                      </button>

                      <a
                        href={`/services/${serviceSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 font-medium px-2.5 py-1.5 rounded border border-neutral-200 hover:bg-neutral-50"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Live Route</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setDeletingServiceId(selectedServiceId)}
                        className="text-xs text-red-600 hover:text-red-800 inline-flex items-center gap-1 font-medium px-2.5 py-1.5 rounded border border-red-200 hover:bg-red-50"
                        title="Archive Service"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveService} className="space-y-4">
                
                {/* Title & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-7">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceTitle}
                      onChange={(e) => handleServiceTitleChange(e.target.value)}
                      placeholder="e.g. Transfer Pricing Advisory"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      URL Slug * (lowercase, hyphens)
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceSlug}
                      onChange={(e) => {
                        setServiceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                        setServiceFormDirty(true);
                      }}
                      placeholder="transfer-pricing-advisory"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 font-mono text-neutral-900"
                    />
                  </div>
                </div>

                {/* Status, Order & Icon */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Publication Status
                    </label>
                    <select
                      value={serviceStatus}
                      onChange={(e) => {
                        setServiceStatus(e.target.value as 'published' | 'draft');
                        setServiceFormDirty(true);
                      }}
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 bg-white font-medium"
                    >
                      <option value="published">Published (Live on Website)</option>
                      <option value="draft">Draft (Hidden from Public)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Display Order #
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={serviceOrder}
                      onChange={(e) => {
                        setServiceOrder(Number(e.target.value) || 1);
                        setServiceFormDirty(true);
                      }}
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Icon Presentation
                    </label>
                    <select
                      value={serviceIconName}
                      onChange={(e) => {
                        setServiceIconName(e.target.value);
                        setServiceFormDirty(true);
                      }}
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 bg-white font-medium"
                    >
                      <option value="Briefcase">Briefcase (General Advisory)</option>
                      <option value="ShieldCheck">ShieldCheck (Statutory Audit)</option>
                      <option value="FileText">FileText (Taxation Compliance)</option>
                      <option value="LineChart">LineChart (Virtual CFO & CMA)</option>
                      <option value="Building2">Building2 (Corporate Affairs)</option>
                      <option value="Landmark">Landmark (RERA & Regulatory)</option>
                    </select>
                  </div>
                </div>

                {/* Short Overview */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Short Overview (Hero description & Card summary) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={serviceShortDesc}
                    onChange={(e) => {
                      setServiceShortDesc(e.target.value);
                      setServiceFormDirty(true);
                    }}
                    placeholder="Brief 1-2 sentence regulatory scope summary..."
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 leading-relaxed"
                  />
                </div>

                {/* Statutory Scope Description */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Full Statutory Scope & Methodology
                  </label>
                  <textarea
                    rows={4}
                    value={serviceFullDesc}
                    onChange={(e) => {
                      setServiceFullDesc(e.target.value);
                      setServiceFormDirty(true);
                    }}
                    placeholder="Comprehensive description of statutory examinations, audit standards, or compliance workflows..."
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 leading-relaxed font-sans"
                  />
                </div>

                {/* Statutory Framework & Target Clients */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Statutory Framework
                    </label>
                    <input
                      type="text"
                      value={serviceStatutory}
                      onChange={(e) => {
                        setServiceStatutory(e.target.value);
                        setServiceFormDirty(true);
                      }}
                      placeholder="e.g. Income Tax Act 1961, Section 92E"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Target Entities & Sectors
                    </label>
                    <input
                      type="text"
                      value={serviceTarget}
                      onChange={(e) => {
                        setServiceTarget(e.target.value);
                        setServiceFormDirty(true);
                      }}
                      placeholder="e.g. MNC Subsidiaries, Exporters, LLPs"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800"
                    />
                  </div>
                </div>

                {/* Sub-services / Deliverables & Typical Scenarios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Deliverables / Sub-services (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={serviceDeliverablesText}
                      onChange={(e) => {
                        setServiceDeliverablesText(e.target.value);
                        setServiceFormDirty(true);
                      }}
                      placeholder="Form 3CEB Certification&#10;Transfer Pricing Study Documentation&#10;Arm's Length Benchmark Analysis"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Applicable Business Scenarios (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={serviceScenariosText}
                      onChange={(e) => {
                        setServiceScenariosText(e.target.value);
                        setServiceFormDirty(true);
                      }}
                      placeholder="Cross-border related party transactions exceeding threshold&#10;Specified domestic transactions under Section 92BA"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* SEO Metadata Card */}
                <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#EAEAEA] space-y-3">
                  <div className="font-mono text-[11px] font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Search Engine Optimization (SEO Metadata)</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 mb-1">
                      Meta Title (Title Tag)
                    </label>
                    <input
                      type="text"
                      value={serviceMetaTitle}
                      onChange={(e) => {
                        setServiceMetaTitle(e.target.value);
                        setServiceFormDirty(true);
                      }}
                      placeholder="Service in Tirupati | CA Kavitha & Associates"
                      className="w-full text-xs p-2 rounded border border-neutral-200 bg-white text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 mb-1">
                      Meta Description (Search Snippet)
                    </label>
                    <input
                      type="text"
                      value={serviceMetaDesc}
                      onChange={(e) => {
                        setServiceMetaDesc(e.target.value);
                        setServiceFormDirty(true);
                      }}
                      placeholder="Professional statutory services in Tirupati, Andhra Pradesh..."
                      className="w-full text-xs p-2 rounded border border-neutral-200 bg-white text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-neutral-500 mb-1">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      value={serviceCanonical}
                      onChange={(e) => {
                        setServiceCanonical(e.target.value);
                        setServiceFormDirty(true);
                      }}
                      placeholder="https://kavithaassociates.com/services/slug"
                      className="w-full text-xs p-2 rounded border border-neutral-200 bg-white text-neutral-900 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between">
                  <div className="text-[11px] font-mono text-neutral-400">
                    {serviceFormDirty && (
                      <span className="text-amber-600 font-medium">● Unsaved changes</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isCreatingNewService && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingNewService(false);
                          if (servicesList[0]) setSelectedServiceId(servicesList[0].id);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors shadow-xs font-mono"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : isCreatingNewService ? 'Create Service' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: FAQS CRUD & SERVICE ASSIGNMENTS
            ========================================================================= */}
        {activeTab === 'faqs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: FAQ List & Management */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleStartNewFaq}
                  className="flex-1 py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-xs font-mono"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#D8C296]" />
                  <span>Add FAQ</span>
                </button>

                {archivedFaqs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowArchivedFaqs(!showArchivedFaqs)}
                    className="py-2 px-3 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors flex items-center gap-1 font-mono"
                    title="View Archived FAQs"
                  >
                    <Archive className="w-3.5 h-3.5 text-neutral-500" />
                    <span>({archivedFaqs.length})</span>
                  </button>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter statutory FAQs..."
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 text-neutral-800"
                />
              </div>

              {/* Archived FAQs Recovery Panel */}
              {showArchivedFaqs && archivedFaqs.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
                  <div className="font-mono text-[10px] uppercase font-bold text-amber-900 flex items-center justify-between">
                    <span>Archived FAQs Recovery</span>
                    <button onClick={() => setShowArchivedFaqs(false)}>
                      <X className="w-3 h-3 text-amber-700" />
                    </button>
                  </div>
                  {archivedFaqs.map(archived => (
                    <div key={archived.id} className="flex items-center justify-between bg-white p-2 rounded border border-amber-200/60">
                      <div className="truncate pr-2">
                        <span className="font-medium text-neutral-900">{archived.question}</span>
                      </div>
                      <button
                        onClick={() => handleRecoverFaq(archived.id)}
                        className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[10px] font-mono flex items-center gap-1 shrink-0"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Restore</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* FAQ Items */}
              <div className="space-y-1.5 max-h-[650px] overflow-y-auto pr-0.5">
                {filteredFaqs.map((faq, index) => {
                  const isSelected = !isCreatingNewFaq && faq.id === selectedFaqId;
                  const isPublished = faq.status === 'published';

                  return (
                    <div
                      key={faq.id}
                      className={`group w-full p-3 rounded-lg border transition-all text-xs flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-white border-neutral-900 shadow-sm'
                          : 'bg-white border-[#EAEAEA] hover:border-neutral-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectFaq(faq.id)}
                        className="flex-1 text-left min-w-0"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] text-neutral-400">
                            FAQ #{String(faq.order || index + 1).padStart(2, '0')}
                          </span>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            isPublished ? 'bg-[#EDF3EC] text-[#2D5A38]' : 'bg-[#FEF7E6] text-[#8A5B00]'
                          }`}>
                            {faq.status}
                          </span>
                        </div>
                        <div className="font-medium text-neutral-900 line-clamp-2">
                          {faq.question}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-1">
                          {faq.category || 'General Practice'}
                        </div>
                      </button>

                      {/* Reorder Buttons */}
                      <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveFaq(faq.id, 'up')}
                          className="p-1 rounded hover:bg-neutral-100 disabled:opacity-20 text-neutral-600"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === filteredFaqs.length - 1}
                          onClick={() => handleMoveFaq(faq.id, 'down')}
                          className="p-1 rounded hover:bg-neutral-100 disabled:opacity-20 text-neutral-600"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: FAQ Form & Assignments */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-xl border border-[#EAEAEA]">
              <div className="pb-4 border-b border-[#F0F0F0] mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    {isCreatingNewFaq ? 'Create Statutory FAQ' : 'Edit Statutory FAQ'}
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    {isCreatingNewFaq ? 'Generates FAQ schema for public display' : `Identifier: ${selectedFaqId}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!isCreatingNewFaq && (
                    <>
                      <button
                        type="button"
                        onClick={() => setFaqPreviewOpen(true)}
                        className="text-xs text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 font-medium px-2.5 py-1.5 rounded border border-neutral-200 hover:bg-neutral-50"
                      >
                        <Eye className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingFaqId(selectedFaqId)}
                        className="text-xs text-red-600 hover:text-red-800 inline-flex items-center gap-1 font-medium px-2.5 py-1.5 rounded border border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveFaq} className="space-y-4">
                
                {/* Question */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Statutory Question *
                  </label>
                  <input
                    type="text"
                    required
                    value={faqQuestion}
                    onChange={(e) => {
                      setFaqQuestion(e.target.value);
                      setFaqFormDirty(true);
                    }}
                    placeholder="e.g. Which entities are required to appoint a Statutory Auditor under Companies Act 2013?"
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 font-medium"
                  />
                </div>

                {/* Status, Order & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Status
                    </label>
                    <select
                      value={faqStatus}
                      onChange={(e) => {
                        setFaqStatus(e.target.value as 'published' | 'draft');
                        setFaqFormDirty(true);
                      }}
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 bg-white font-medium"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Display Order #
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={faqOrder}
                      onChange={(e) => {
                        setFaqOrder(Number(e.target.value) || 1);
                        setFaqFormDirty(true);
                      }}
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Category
                    </label>
                    <select
                      value={faqCategory}
                      onChange={(e) => {
                        setFaqCategory(e.target.value);
                        setFaqFormDirty(true);
                      }}
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 bg-white font-medium"
                    >
                      <option value="Audit & Assurance">Audit & Assurance</option>
                      <option value="Income Tax">Income Tax</option>
                      <option value="GST Compliance">GST Compliance</option>
                      <option value="Corporate & RERA">Corporate & RERA</option>
                      <option value="General Practice">General Practice</option>
                    </select>
                  </div>
                </div>

                {/* Statutory Answer */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Statutory Answer & Regulatory Analysis *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={faqAnswer}
                    onChange={(e) => {
                      setFaqAnswer(e.target.value);
                      setFaqFormDirty(true);
                    }}
                    placeholder="Provide authoritative technical clarification referencing relevant sections and rules..."
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 leading-relaxed font-sans"
                  />
                </div>

                {/* Statute Reference */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Statute Reference
                  </label>
                  <input
                    type="text"
                    value={faqStatute}
                    onChange={(e) => {
                      setFaqStatute(e.target.value);
                      setFaqFormDirty(true);
                    }}
                    placeholder="e.g. Section 139 of Companies Act, 2013"
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 font-mono text-[11px]"
                  />
                </div>

                {/* Assigned Services Multi-select */}
                <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#EAEAEA]">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-700 font-semibold mb-2">
                    Linked Practice Services (Display this FAQ on service detail pages)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {servicesList.map(srv => {
                      const isChecked = faqServiceIds.includes(srv.id);
                      return (
                        <label
                          key={srv.id}
                          className="flex items-center gap-2 p-1.5 rounded hover:bg-white cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFaqServiceIds([...faqServiceIds, srv.id]);
                              } else {
                                setFaqServiceIds(faqServiceIds.filter(id => id !== srv.id));
                              }
                              setFaqFormDirty(true);
                            }}
                            className="rounded border-neutral-300 text-brand-deep focus:ring-brand-gold"
                          />
                          <span className="text-neutral-800 truncate">{srv.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between">
                  <div className="text-[11px] font-mono text-neutral-400">
                    {faqFormDirty && (
                      <span className="text-amber-600 font-medium">● Unsaved changes</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isCreatingNewFaq && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingNewFaq(false);
                          if (faqsList[0]) setSelectedFaqId(faqsList[0].id);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors shadow-xs font-mono"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : isCreatingNewFaq ? 'Add FAQ' : 'Save FAQ'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: STATUTORY ARTICLES (100% PRESERVED)
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
              </div>
            </div>

            {/* Right Column: Article Form & Markdown */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-xl border border-[#EAEAEA]">
              <div className="pb-4 border-b border-[#F0F0F0] mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-neutral-900">
                    {isCreatingNewPost ? 'New Technical Article' : `Editing: ${postTitle || selectedPostSlug}`}
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    {isCreatingNewPost ? 'Drafting new analysis' : `Slug: /blog/${postSlug}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center p-0.5 bg-neutral-100 rounded-md border border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setPostViewMode('edit')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        postViewMode === 'edit' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      <Edit3 className="w-3 h-3 inline mr-1" />
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostViewMode('preview')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        postViewMode === 'preview' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      Preview
                    </button>
                  </div>

                  {!isCreatingNewPost && (
                    <button
                      type="button"
                      onClick={() => handleDeletePost(selectedPostSlug)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {postViewMode === 'preview' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#EAEAEA]">
                    <div className="font-mono text-[10px] text-amber-700 uppercase tracking-widest mb-1">
                      {postTags || 'Taxation'}
                    </div>
                    <h1 className="font-serif text-2xl text-neutral-900 font-bold mb-2">
                      {postTitle || 'Untitled Article'}
                    </h1>
                    <p className="text-xs text-neutral-600 italic">
                      {postExcerpt}
                    </p>
                  </div>
                  <div className="prose prose-sm max-w-none text-neutral-800 leading-relaxed font-sans border-t border-[#F0F0F0] pt-4">
                    <MarkdownRenderer content={postContent} />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSavePost} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Article Title
                      </label>
                      <input
                        type="text"
                        required
                        value={postTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Union Budget 2026: Key Statutory Tax Amendments"
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Status
                      </label>
                      <select
                        value={postStatus}
                        onChange={(e) => setPostStatus(e.target.value as 'published' | 'draft')}
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-900 bg-white font-medium"
                      >
                        <option value="published">Published (Live)</option>
                        <option value="draft">Draft (Quarantined)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        required
                        value={postSlug}
                        onChange={(e) => setPostSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                        placeholder="union-budget-2026-tax-amendments"
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={postTags}
                        onChange={(e) => setPostTags(e.target.value)}
                        placeholder="Taxation, Union Budget, Corporate"
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Excerpt / SEO Summary
                    </label>
                    <textarea
                      rows={2}
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

      {/* =========================================================================
          MODALS & CONFIRMATION DIALOGS
          ========================================================================= */}
      
      {/* Service Preview Modal */}
      {servicePreviewOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setServicePreviewOpen(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="font-mono text-xs uppercase text-brand-gold font-bold">
                Live Preview • /services/{serviceSlug}
              </span>
              <button
                onClick={() => setServicePreviewOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#102D25] text-white p-6 rounded-lg">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D8C296]">
                  Practice Discipline
                </span>
                <h2 className="font-serif text-2xl font-light mt-1 mb-2 text-white">
                  {serviceTitle || 'Untitled Service'}
                </h2>
                <p className="text-xs text-white/80 leading-relaxed font-light">
                  {serviceShortDesc || 'No summary provided.'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#FAF9F6] border border-neutral-200 space-y-2">
                <h4 className="font-serif text-sm font-bold text-neutral-900">Statutory Framework & Scope</h4>
                <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
                  {serviceFullDesc || serviceShortDesc}
                </p>
                <div className="pt-2 text-[11px] font-mono text-neutral-500">
                  Framework: <span className="text-neutral-800">{serviceStatutory || 'ICAI Guidelines'}</span> | Target: <span className="text-neutral-800">{serviceTarget || 'All Entities'}</span>
                </div>
              </div>

              {serviceDeliverablesText && (
                <div className="p-4 rounded-lg bg-white border border-neutral-200 space-y-2">
                  <h4 className="font-serif text-sm font-bold text-neutral-900">Engagement Deliverables</h4>
                  <ul className="list-disc list-inside text-xs text-neutral-700 space-y-1">
                    {serviceDeliverablesText.split('\n').filter(Boolean).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setServicePreviewOpen(false)}
                className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-mono"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Preview Modal */}
      {faqPreviewOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setFaqPreviewOpen(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="font-mono text-xs uppercase text-brand-gold font-bold">
                FAQ Public Preview
              </span>
              <button
                onClick={() => setFaqPreviewOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border border-[#102D25]/15 rounded-lg p-4 bg-[#FAF9F6] space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#D8C296] font-bold">
                {faqCategory}
              </span>
              <h3 className="font-serif text-base text-[#102D25] font-medium">
                {faqQuestion || 'No question text provided'}
              </h3>
              <p className="text-xs text-[#102D25]/80 leading-relaxed font-light whitespace-pre-line">
                {faqAnswer || 'No answer text provided'}
              </p>
              {faqStatute && (
                <div className="text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-200">
                  Statute Ref: {faqStatute}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setFaqPreviewOpen(false)}
                className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-mono"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Service Confirmation Dialog */}
      {deletingServiceId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setDeletingServiceId(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-900">
                Archive Practice Service?
              </h3>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to delete <span className="font-mono font-bold text-neutral-900">{deletingServiceId}</span>? 
              The service will be archived to the recovery store and immediately removed from the live website and sitemap.
            </p>

            <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingServiceId(null)}
                className="px-3 py-1.5 rounded text-xs font-medium text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteService}
                className="px-4 py-1.5 rounded text-xs font-medium bg-red-600 hover:bg-red-700 text-white shadow-xs font-mono"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete FAQ Confirmation Dialog */}
      {deletingFaqId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setDeletingFaqId(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-900">
                Archive FAQ Item?
              </h3>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to remove this FAQ item? It will be archived to the recovery store and hidden from public search schema and website accordions.
            </p>

            <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingFaqId(null)}
                className="px-3 py-1.5 rounded text-xs font-medium text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteFaq}
                className="px-4 py-1.5 rounded text-xs font-medium bg-red-600 hover:bg-red-700 text-white shadow-xs font-mono"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};
