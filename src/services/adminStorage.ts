import { 
  EnquiryRecord, 
  EnquiryStatus, 
  AdminSession, 
  ContentOverrides, 
  SettingsOverrides,
  AdminPost,
  AdminService,
  AdminFaq
} from '../types/admin';
import { supabase, isSupabaseConfigured, DbEnquiry, DbContentService, DbContentFaq } from '../lib/supabase';
import { ADMIN_ROUTES } from '../config/adminConfig';

const ENQUIRIES_KEY = 'ka_admin_enquiries_v1';
const CONTENT_KEY = 'ka_admin_content_v1';
const SETTINGS_KEY = 'ka_admin_settings_v1';
const SESSION_KEY = 'ka_admin_session_v1';

// Custom event name for instant reactive updates across public components
export const FIRM_DATA_UPDATE_EVENT = 'ka_firm_data_updated';

// ---------------------------------------------------------------------------
// 1. Unified Shared Storage Service (Server API + Supabase + Local Cache)
// ---------------------------------------------------------------------------

export const adminStorage = {
  isCloudConnected(): boolean {
    return isSupabaseConfigured();
  },

  getEnquiries(): EnquiryRecord[] {
    try {
      const data = localStorage.getItem(ENQUIRIES_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to load enquiries from persistent storage:', e);
      return [];
    }
  },

  // Remote fetch from Shared Server API (or Supabase)
  async fetchEnquiriesRemote(): Promise<{ success: boolean; data: EnquiryRecord[]; error?: string }> {
    const session = this.getSession();

    // 1. Try Shared Server API
    let serverRecords: EnquiryRecord[] | null = null;
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
      });

      if (res.ok) {
        const body = await res.json();
        if (body.allEnquiries || body.enquiries) {
          serverRecords = body.allEnquiries || body.enquiries;
        }
      }
    } catch {
      // Fall through to Supabase or cache
    }

    // 2. Try Supabase if configured (especially if server returned empty array on cold container start)
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const supabaseRecords: EnquiryRecord[] = data.map((d: DbEnquiry) => ({
            id: d.id,
            fullName: d.full_name,
            entityType: d.entity_type || '',
            organization: d.organization || '',
            phone: d.phone,
            email: d.email || '',
            serviceCategory: d.service_category,
            city: d.city,
            urgency: d.urgency,
            message: d.message,
            createdAt: d.created_at,
            status: d.status,
            followUpNotes: d.follow_up_notes || '',
            updatedAt: d.updated_at,
          }));

          const localRecords = this.getEnquiries();
          const supabaseIds = new Set(supabaseRecords.map(r => r.id));
          const unsynced = localRecords.filter(r => !supabaseIds.has(r.id));
          const merged = [...supabaseRecords, ...unsynced];

          localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(merged));
          window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
          return { success: true, data: merged };
        }
      } catch (err) {
        console.warn('Supabase fetch fallback:', err);
      }
    }

    // 3. Fallback / Safe Merge with Server Records: Never overwrite local data with empty array
    if (serverRecords) {
      const localRecords = this.getEnquiries();
      let finalRecords = serverRecords;
      if (serverRecords.length === 0 && localRecords.length > 0) {
        // Retain existing local enquiries rather than clobbering with empty serverless baseline
        finalRecords = localRecords;
      } else if (serverRecords.length > 0 && localRecords.length > 0) {
        const serverIds = new Set(serverRecords.map(r => r.id));
        const unsynced = localRecords.filter(r => !serverIds.has(r.id));
        finalRecords = [...serverRecords, ...unsynced];
      }

      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(finalRecords));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
      return { success: true, data: finalRecords };
    }

    return { success: true, data: this.getEnquiries() };
  },

  recordEnquiry(enquiry: Omit<EnquiryRecord, 'id' | 'createdAt' | 'status'>): EnquiryRecord {
    const existing = this.getEnquiries();
    const newRecord: EnquiryRecord = {
      ...enquiry,
      id: `ENQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    const updated = [newRecord, ...existing];
    try {
      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
    } catch (e) {
      console.error('Failed to save enquiry to persistent storage:', e);
    }

    // Sync to Shared Server API
    fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    }).catch(() => {});

    // Sync to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      supabase.from('enquiries').insert({
        id: newRecord.id,
        full_name: newRecord.fullName,
        entity_type: newRecord.entityType || null,
        organization: newRecord.organization || null,
        phone: newRecord.phone,
        email: newRecord.email || null,
        service_category: newRecord.serviceCategory,
        city: newRecord.city,
        urgency: newRecord.urgency === 'Urgent / Approaching Deadline' ? 'statutory-deadline' : 'routine',
        message: newRecord.message,
        status: 'new',
      }).then();
    }

    return newRecord;
  },

  async recordEnquiryAsync(enquiry: Omit<EnquiryRecord, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; data?: EnquiryRecord; error?: string }> {
    // 1. Send to Shared Server API
    let rec: EnquiryRecord | null = null;
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.enquiry) {
          rec = json.enquiry;
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        return { 
          success: false, 
          error: errJson.error || 'Chambers consultation server is currently unreachable. Please connect directly via WhatsApp or telephone (+91 96263 50900).' 
        };
      }
    } catch {
      return {
        success: false,
        error: 'Chambers consultation server is currently unreachable. Please connect directly via WhatsApp or telephone (+91 96263 50900).'
      };
    }

    if (!rec || !rec.id) {
      return {
        success: false,
        error: 'Chambers consultation server did not return a valid consultation reference. Please connect directly via WhatsApp or telephone (+91 96263 50900).'
      };
    }

    const savedRec: EnquiryRecord = rec;
    const existing = this.getEnquiries();
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify([savedRec, ...existing.filter(e => e.id !== savedRec.id)]));
    window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));

    // 2. Also persist to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      supabase.from('enquiries').insert({
        id: savedRec.id,
        full_name: savedRec.fullName,
        entity_type: savedRec.entityType || null,
        organization: savedRec.organization || null,
        phone: savedRec.phone,
        email: savedRec.email || null,
        service_category: savedRec.serviceCategory,
        city: savedRec.city,
        urgency: savedRec.urgency === 'Urgent / Approaching Deadline' ? 'statutory-deadline' : 'routine',
        message: savedRec.message,
        status: 'new',
      }).then();
    }

    return { success: true, data: rec };
  },

  updateEnquiryStatus(id: string, status: EnquiryStatus, followUpNotes?: string): boolean {
    const existing = this.getEnquiries();
    const index = existing.findIndex(e => e.id === id);
    if (index === -1) return false;

    const normalizedStatus: EnquiryStatus = status === 'in-review' ? 'in-progress' : status;

    existing[index] = {
      ...existing[index],
      status: normalizedStatus,
      followUpNotes: followUpNotes !== undefined ? followUpNotes : existing[index].followUpNotes,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
    } catch (e) {
      console.error('Failed to update enquiry status in storage:', e);
      return false;
    }

    const session = this.getSession();

    // Sync to Shared Server API
    fetch(`/api/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
      },
      body: JSON.stringify({
        status: normalizedStatus,
        followUpNotes
      })
    }).catch(() => {});

    // Sync to Supabase
    if (isSupabaseConfigured() && supabase) {
      supabase.from('enquiries').update({
        status: normalizedStatus as 'new' | 'contacted' | 'in-progress' | 'closed',
        follow_up_notes: followUpNotes,
        updated_at: new Date().toISOString(),
      }).eq('id', id).then();
    }

    return true;
  },

  deleteEnquiry(id: string): boolean {
    const existing = this.getEnquiries();
    const filtered = existing.filter(e => e.id !== id);
    try {
      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
    } catch (e) {
      console.error('Failed to delete enquiry:', e);
      return false;
    }

    const session = this.getSession();

    // Sync to Shared Server API
    fetch(`/api/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
    }).catch(() => {});

    // Sync to Supabase
    if (isSupabaseConfigured() && supabase) {
      supabase.from('enquiries').delete().eq('id', id).then();
    }

    return true;
  },

  exportEnquiriesCSV(): string {
    const enquiries = this.getEnquiries();
    if (enquiries.length === 0) return '';

    const headers = [
      'ID',
      'Date',
      'Status',
      'Full Name',
      'Entity Type',
      'Organization',
      'Phone',
      'Email',
      'Service Category',
      'City',
      'Urgency',
      'Message',
      'Follow-Up Notes'
    ];

    const sanitizeCSVField = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      // Neutralize spreadsheet formula injection (CWE-1236) for =, +, -, @, %, \t, \r
      if (/^[=+\-@%\t\r]/.test(str)) {
        str = "'" + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = enquiries.map(e => [
      sanitizeCSVField(e.id),
      sanitizeCSVField(new Date(e.createdAt).toLocaleString('en-IN')),
      sanitizeCSVField(e.status.toUpperCase()),
      sanitizeCSVField(e.fullName),
      sanitizeCSVField(e.entityType),
      sanitizeCSVField(e.organization),
      sanitizeCSVField(e.phone),
      sanitizeCSVField(e.email),
      sanitizeCSVField(e.serviceCategory),
      sanitizeCSVField(e.city),
      sanitizeCSVField(e.urgency),
      sanitizeCSVField(e.message),
      sanitizeCSVField(e.followUpNotes)
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  // ---------------------------------------------------------------------------
  // 2. Content Overrides Storage (Services & FAQs)
  // ---------------------------------------------------------------------------

  getContentOverrides(): ContentOverrides {
    try {
      const data = localStorage.getItem(CONTENT_KEY);
      if (!data) return {};
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load content overrides:', e);
      return {};
    }
  },

  async fetchContentRemote(): Promise<ContentOverrides> {
    const current = this.getContentOverrides();
    const session = this.getSession();

    // 1. Fetch from Shared Server API
    try {
      const res = await fetch('/api/content', {
        headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
      });
      if (res.ok) {
        const body = await res.json();
        current.services = current.services || {};
        (body.allServices || body.services || []).forEach((s: AdminService) => {
          current.services![s.id] = {
            id: s.id,
            title: s.title,
            shortDescription: s.shortDescription,
            fullDescription: s.fullDescription,
            statutoryFramework: s.statutoryFramework || '',
            targetClients: s.targetClients || '',
            typicalScenarios: s.typicalScenarios || [],
            services: s.services || [],
            iconName: s.iconName || 'Briefcase',
            status: s.status,
            order: s.order,
            seo: s.seo,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
            deletedAt: s.deletedAt
          };
        });

        current.posts = current.posts || {};
        (body.allPosts || body.posts || []).forEach((p: AdminPost) => {
          if (p.slug) {
            current.posts![p.slug.toLowerCase().trim()] = p;
          }
        });

        current.faqs = current.faqs || {};
        (body.allFaqs || body.faqs || []).forEach((f: AdminFaq) => {
          current.faqs![f.id] = {
            id: f.id,
            question: f.question,
            answer: f.answer,
            statuteReference: f.statuteReference || '',
            category: f.category || 'General Practice',
            serviceIds: f.serviceIds || [],
            status: f.status,
            order: f.order,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt,
            deletedAt: f.deletedAt
          };
        });

        if (body.deletedServices) {
          current.deletedServices = body.deletedServices;
        }
        if (body.deletedFaqs) {
          current.deletedFaqs = body.deletedFaqs;
        }
        if (body.slugRedirects) {
          current.slugRedirects = body.slugRedirects;
        }

        localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
        return current;
      }
    } catch {
      // Fall through to Supabase
    }

    // 2. Try Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const [servicesRes, faqsRes] = await Promise.all([
          supabase.from('content_services').select('*'),
          supabase.from('content_faqs').select('*'),
        ]);

        if (servicesRes.data) {
          current.services = current.services || {};
          servicesRes.data.forEach((s: DbContentService) => {
            current.services![s.id] = {
              id: s.id,
              title: s.title,
              shortDescription: s.short_description,
              fullDescription: s.full_description,
              statutoryFramework: s.statutory_framework || '',
              targetClients: s.target_clients || '',
              status: s.status,
            };
          });
        }

        if (faqsRes.data) {
          current.faqs = current.faqs || {};
          faqsRes.data.forEach((f: DbContentFaq) => {
            current.faqs![f.id] = {
              id: f.id,
              question: f.question,
              answer: f.answer,
              statuteReference: f.statute_reference || '',
              category: 'General Practice',
              status: f.status,
            };
          });
        }

        localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
        return current;
      } catch (e) {
        console.warn('Failed to load remote content from Supabase:', e);
      }
    }

    return current;
  },

  saveServiceOverride(serviceId: string, override: {
    title?: string;
    shortDescription?: string;
    fullDescription?: string;
    statutoryFramework?: string;
    targetClients?: string;
    status?: 'published' | 'draft';
  }): boolean {
    const current = this.getContentOverrides();
    const services = current.services || {};
    services[serviceId] = {
      ...(services[serviceId] || {}),
      ...override,
    };

    current.services = services;
    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
    } catch (e) {
      console.error('Failed to save service override:', e);
      return false;
    }

    const session = this.getSession();

    // Sync to Shared Server API
    fetch(`/api/admin/content/services/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
      },
      body: JSON.stringify(override)
    }).catch(() => {});

    // Sync to Supabase
    if (isSupabaseConfigured() && supabase) {
      supabase.from('content_services').upsert({
        id: serviceId,
        title: override.title || '',
        short_description: override.shortDescription || '',
        full_description: override.fullDescription || '',
        statutory_framework: override.statutoryFramework,
        target_clients: override.targetClients,
        status: override.status || 'published',
        display_order: 1,
      }).then();
    }

    return true;
  },

  saveFAQOverride(faqId: string, override: {
    question?: string;
    answer?: string;
    statuteReference?: string;
    status?: 'published' | 'draft';
  }): boolean {
    const current = this.getContentOverrides();
    const faqs = current.faqs || {};
    faqs[faqId] = {
      ...(faqs[faqId] || {}),
      ...override,
    };

    current.faqs = faqs;
    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
    } catch (e) {
      console.error('Failed to save FAQ override:', e);
      return false;
    }

    const session = this.getSession();

    // Sync to Shared Server API
    fetch(`/api/admin/content/faqs/${faqId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
      },
      body: JSON.stringify(override)
    }).catch(() => {});

    // Sync to Supabase
    if (isSupabaseConfigured() && supabase) {
      supabase.from('content_faqs').upsert({
        id: faqId,
        question: override.question || '',
        answer: override.answer || '',
        statute_reference: override.statuteReference,
        status: override.status || 'published',
        display_order: 1,
      }).then();
    }

    return true;
  },

  // --- Enhanced Service Management ---

  getAllServices(): AdminService[] {
    const current = this.getContentOverrides();
    const servicesObj = current.services || {};
    return Object.values(servicesObj)
      .filter(s => !s.deletedAt)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  getPublishedServices(): AdminService[] {
    return this.getAllServices().filter(s => s.status === 'published');
  },

  getServiceById(id: string): AdminService | undefined {
    const current = this.getContentOverrides();
    return current.services?.[id];
  },

  getDeletedServices(): AdminService[] {
    const current = this.getContentOverrides();
    return current.deletedServices || [];
  },

  async saveService(service: AdminService, isNew = false): Promise<{ success: boolean; service?: AdminService; error?: string }> {
    const session = this.getSession();
    const endpoint = isNew 
      ? '/api/admin/content/services' 
      : `/api/admin/content/services/${service.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
        },
        body: JSON.stringify(service)
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to save service' };
      }

      const saved: AdminService = data.service || service;
      const current = this.getContentOverrides();
      current.services = current.services || {};
      current.services[saved.id] = saved;
      localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));

      // Sync to Supabase if configured
      if (isSupabaseConfigured() && supabase) {
        supabase.from('content_services').upsert({
          id: saved.id,
          title: saved.title || '',
          short_description: saved.shortDescription || '',
          full_description: saved.fullDescription || '',
          statutory_framework: saved.statutoryFramework,
          target_clients: saved.targetClients,
          status: saved.status || 'published',
          display_order: saved.order || 1,
        }).then();
      }

      return { success: true, service: saved };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Network error saving service';
      return { success: false, error: errorMsg };
    }
  },

  async deleteService(id: string): Promise<{ success: boolean; error?: string }> {
    const session = this.getSession();
    try {
      const res = await fetch(`/api/admin/content/services/${id}`, {
        method: 'DELETE',
        headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to delete service' };
      }

      const current = this.getContentOverrides();
      if (current.services && current.services[id]) {
        const removed = { ...current.services[id], deletedAt: new Date().toISOString() };
        delete current.services[id];
        current.deletedServices = current.deletedServices || [];
        current.deletedServices = current.deletedServices.filter(s => s.id !== id);
        current.deletedServices.push(removed);
        localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async recoverService(id: string): Promise<{ success: boolean; service?: AdminService; error?: string }> {
    const session = this.getSession();
    try {
      const res = await fetch(`/api/admin/content/services/${id}/recover`, {
        method: 'POST',
        headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to recover service' };
      }

      const current = this.getContentOverrides();
      current.services = current.services || {};
      if (data.service) {
        current.services[id] = data.service;
      }
      current.deletedServices = (current.deletedServices || []).filter(s => s.id !== id);
      localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));

      return { success: true, service: data.service };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async reorderServices(orderedIds: string[]): Promise<{ success: boolean; services?: AdminService[]; error?: string }> {
    const session = this.getSession();
    try {
      const res = await fetch('/api/admin/content/services-reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
        },
        body: JSON.stringify({ orderedIds })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to reorder services' };
      }

      const current = this.getContentOverrides();
      current.services = current.services || {};
      orderedIds.forEach((id, idx) => {
        if (current.services![id]) {
          current.services![id].order = idx + 1;
        }
      });
      localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));

      return { success: true, services: data.services };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  // --- Enhanced FAQ Management ---

  getAllFaqs(): AdminFaq[] {
    const current = this.getContentOverrides();
    const faqsObj = current.faqs || {};
    return Object.values(faqsObj)
      .filter(f => !f.deletedAt)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  getPublishedFaqs(serviceId?: string): AdminFaq[] {
    return this.getAllFaqs()
      .filter(f => f.status === 'published')
      .filter(f => !serviceId || (Array.isArray(f.serviceIds) && f.serviceIds.includes(serviceId)));
  },

  getFaqById(id: string): AdminFaq | undefined {
    const current = this.getContentOverrides();
    return current.faqs?.[id];
  },

  getDeletedFaqs(): AdminFaq[] {
    const current = this.getContentOverrides();
    return current.deletedFaqs || [];
  },

  async saveFaq(faq: AdminFaq, isNew = false): Promise<{ success: boolean; faq?: AdminFaq; error?: string }> {
    const session = this.getSession();
    const endpoint = isNew 
      ? '/api/admin/content/faqs' 
      : `/api/admin/content/faqs/${faq.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
        },
        body: JSON.stringify(faq)
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to save FAQ' };
      }

      const saved: AdminFaq = data.faq || faq;
      const current = this.getContentOverrides();
      current.faqs = current.faqs || {};
      current.faqs[saved.id] = saved;
      localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));

      // Sync to Supabase if configured
      if (isSupabaseConfigured() && supabase) {
        supabase.from('content_faqs').upsert({
          id: saved.id,
          question: saved.question || '',
          answer: saved.answer || '',
          statute_reference: saved.statuteReference,
          status: saved.status || 'published',
          display_order: saved.order || 1,
        }).then();
      }

      return { success: true, faq: saved };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error saving FAQ' };
    }
  },

  async deleteFaq(id: string): Promise<{ success: boolean; error?: string }> {
    const session = this.getSession();
    try {
      const res = await fetch(`/api/admin/content/faqs/${id}`, {
        method: 'DELETE',
        headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to delete FAQ' };
      }

      const current = this.getContentOverrides();
      if (current.faqs && current.faqs[id]) {
        const removed = { ...current.faqs[id], deletedAt: new Date().toISOString() };
        delete current.faqs[id];
        current.deletedFaqs = current.deletedFaqs || [];
        current.deletedFaqs = current.deletedFaqs.filter(f => f.id !== id);
        current.deletedFaqs.push(removed);
        localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async recoverFaq(id: string): Promise<{ success: boolean; faq?: AdminFaq; error?: string }> {
    const session = this.getSession();
    try {
      const res = await fetch(`/api/admin/content/faqs/${id}/recover`, {
        method: 'POST',
        headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to recover FAQ' };
      }

      const current = this.getContentOverrides();
      current.faqs = current.faqs || {};
      if (data.faq) {
        current.faqs[id] = data.faq;
      }
      current.deletedFaqs = (current.deletedFaqs || []).filter(f => f.id !== id);
      localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));

      return { success: true, faq: data.faq };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async reorderFaqs(orderedIds: string[]): Promise<{ success: boolean; faqs?: AdminFaq[]; error?: string }> {
    const session = this.getSession();
    try {
      const res = await fetch('/api/admin/content/faqs-reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
        },
        body: JSON.stringify({ orderedIds })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to reorder FAQs' };
      }

      const current = this.getContentOverrides();
      current.faqs = current.faqs || {};
      orderedIds.forEach((id, idx) => {
        if (current.faqs![id]) {
          current.faqs![id].order = idx + 1;
        }
      });
      localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));

      return { success: true, faqs: data.faqs };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  getPosts(): AdminPost[] {
    const current = this.getContentOverrides();
    const postsObj = current.posts || {};
    return Object.values(postsObj).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getPostBySlug(slug: string): AdminPost | undefined {
    const current = this.getContentOverrides();
    return current.posts?.[slug.toLowerCase().trim()];
  },

  savePost(post: AdminPost): boolean {
    const cleanSlug = (post.slug || '').toLowerCase().trim();
    if (!cleanSlug) return false;

    const current = this.getContentOverrides();
    current.posts = current.posts || {};
    current.posts[cleanSlug] = {
      ...post,
      slug: cleanSlug,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
    } catch (e) {
      console.error('Failed to save post override:', e);
      return false;
    }

    const session = this.getSession();

    fetch(`/api/admin/content/posts/${cleanSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
      },
      body: JSON.stringify(post)
    }).catch(() => {});

    return true;
  },

  deletePost(slug: string): boolean {
    const cleanSlug = (slug || '').toLowerCase().trim();
    if (!cleanSlug) return false;

    const current = this.getContentOverrides();
    if (current.posts && current.posts[cleanSlug]) {
      delete current.posts[cleanSlug];
      try {
        localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
      } catch (e) {
        console.error('Failed to delete post:', e);
        return false;
      }
    }

    const session = this.getSession();

    fetch(`/api/admin/content/posts/${cleanSlug}`, {
      method: 'DELETE',
      headers: {
        ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
      }
    }).catch(() => {});

    return true;
  },

  resetContentOverrides(): boolean {
    try {
      localStorage.removeItem(CONTENT_KEY);
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
    } catch (e) {
      console.error('Failed to reset content overrides:', e);
      return false;
    }

    const session = this.getSession();
    fetch('/api/admin/content/reset', {
      method: 'POST',
      headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
    }).catch(() => {});

    return true;
  },

  // ---------------------------------------------------------------------------
  // 3. Settings Overrides Storage (Contact & Chambers)
  // ---------------------------------------------------------------------------

  getSettingsOverrides(): SettingsOverrides {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return {};
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load settings overrides:', e);
      return {};
    }
  },

  async fetchSettingsRemote(): Promise<SettingsOverrides> {
    // 1. Fetch from Shared Server API
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const mapped: SettingsOverrides = {
          primaryPhone: data.primaryPhone,
          secondaryPhone: data.secondaryPhone,
          email: data.email,
          primaryLocation: data.primaryLocation,
          googleMapsUrl: data.googleMapsUrl,
          whatsappLink: data.whatsappLink,
          openingHours: data.openingHours,
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(mapped));
        window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
        return mapped;
      }
    } catch {
      // Fall through to Supabase
    }

    // 2. Fetch from Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('practice_settings')
          .select('*')
          .eq('id', 'primary')
          .single();

        if (!error && data) {
          const mapped: SettingsOverrides = {
            primaryPhone: data.primary_phone,
            secondaryPhone: data.secondary_phone,
            email: data.email,
            primaryLocation: data.primary_location,
            googleMapsUrl: data.google_maps_url,
            whatsappLink: data.whatsapp_link,
            openingHours: data.opening_hours,
          };

          localStorage.setItem(SETTINGS_KEY, JSON.stringify(mapped));
          window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
          return mapped;
        }
      } catch {
        // Use local cache
      }
    }

    return this.getSettingsOverrides();
  },

  saveSettingsOverrides(settings: SettingsOverrides): boolean {
    try {
      const current = this.getSettingsOverrides();
      const updated = { ...current, ...settings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
    } catch (e) {
      console.error('Failed to save settings overrides:', e);
      return false;
    }

    const session = this.getSession();

    // Sync to Shared Server API
    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
      },
      body: JSON.stringify(settings)
    }).catch(() => {});

    // Sync to Supabase
    if (isSupabaseConfigured() && supabase) {
      supabase.from('practice_settings').upsert({
        id: 'primary',
        primary_phone: settings.primaryPhone || '+91 96263 50900',
        secondary_phone: settings.secondaryPhone,
        email: settings.email || 'cakavithasrj@gmail.com',
        primary_location: settings.primaryLocation || '19-12-46, 1st Floor, Near Bairagipetteda Arch, Tirupati, Andhra Pradesh 517501, India',
        google_maps_url: settings.googleMapsUrl || 'https://maps.app.goo.gl/p9ToGUtxqYDCghpF6',
        whatsapp_link: settings.whatsappLink || 'https://wa.me/919626350900',
        opening_hours: settings.openingHours || 'Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed / Prior Appointment Only',
      }).then();
    }

    return true;
  },

  resetSettingsOverrides(): boolean {
    try {
      localStorage.removeItem(SETTINGS_KEY);
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
    } catch (e) {
      console.error('Failed to reset settings overrides:', e);
      return false;
    }

    const session = this.getSession();
    fetch('/api/admin/settings/reset', {
      method: 'POST',
      headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
    }).catch(() => {});

    return true;
  },

  // ---------------------------------------------------------------------------
  // 4. Admin Authentication & Session Management
  // ---------------------------------------------------------------------------

  async authenticateAsync(usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
    const cleanIdentity = usernameOrEmail.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Authenticate with Shared Server API
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanIdentity,
          password: cleanPass
        })
      });

      const body = await res.json();
      if (res.ok && body.session) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(body.session));
        return { success: true, session: body.session };
      } else if (!res.ok) {
        return { success: false, error: body.error || 'Authentication rejected by practice server.' };
      }
    } catch {
      // Fall through to Supabase or local fallback
    }

    // 2. Supabase Cloud Auth Attempt
    if (isSupabaseConfigured() && supabase) {
      try {
        const emailToUse = cleanIdentity.includes('@') 
          ? cleanIdentity 
          : `${cleanIdentity}@kavithaca.in`;

        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailToUse,
          password: cleanPass,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.session && data.user) {
          const session: AdminSession = {
            token: data.session.access_token,
            user: {
              username: data.user.email || cleanIdentity,
              displayName: data.user.user_metadata?.full_name || 'Authorized Administrator',
              role: 'Managing Partner',
              lastLogin: new Date().toISOString(),
            },
            expiresAt: Date.now() + 60 * 60 * 1000,
          };

          sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
          return { success: true, session };
        }
      } catch (err) {
        console.warn('Supabase auth attempt:', err);
      }
    }

    // 3. Local fallback authentication (restricted to development/QA evaluation only)
    if (import.meta.env.DEV) {
      return this.authenticate(cleanIdentity, cleanPass);
    }

    return {
      success: false,
      error: 'Authentication failed. Please verify credentials with the practice server.'
    };
  },

  authenticate(_username: string, _password: string): { success: boolean; error?: string; session?: AdminSession } {
    // Direct client-side authentication is strictly disabled across all environments to prevent credential leakage in bundle
    return {
      success: false,
      error: 'Direct client-side authentication is disabled. Authentication must be verified securely via server-side endpoints.'
    };
  },

    createDevSession(): AdminSession | null {
    if (!import.meta.env.DEV) return null;
    const session: AdminSession = {
      token: `sess_dev_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      user: {
        username: 'kavitha',
        displayName: 'CA Kavitha Vijay',
        role: 'Managing Partner',
        lastLogin: new Date().toISOString()
      },
      expiresAt: Date.now() + 60 * 60 * 1000
    };
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    } catch {
      return null;
    }
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid practice email address.' };
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}${ADMIN_ROUTES.login}?reset=true`,
        });

        if (error) {
          return { success: false, message: error.message, error: error.message };
        }

        return { 
          success: true, 
          message: `Password reset instructions have been dispatched to ${cleanEmail}. Please inspect your inbox.` 
        };
      } catch (e) {
        return { success: false, message: (e as Error).message };
      }
    }

    return {
      success: true,
      message: `Password recovery request logged for ${cleanEmail}. In production, an authorized password reset link is securely dispatched to registered chambers accounts.`
    };
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const session = this.getSession();
    if (!session || !session.token) {
      return { success: false, error: 'Unauthorized: Active administrative session required.' };
    }

    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        this.logout();
        return {
          success: true,
          message: data.message || 'Password updated successfully. All existing sessions have been terminated. Please log in with your new password.'
        };
      }

      return {
        success: false,
        error: data?.error || `Failed to update password (HTTP ${res.status}).`
      };
    } catch (err) {
      return {
        success: false,
        error: (err as Error).message || 'Network error while attempting to update password.'
      };
    }
  },

  getSession(): AdminSession | null {
    try {
      const data = sessionStorage.getItem(SESSION_KEY);
      if (!data) return null;
      const session: AdminSession = JSON.parse(data);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  logout(): void {
    const session = this.getSession();
    try {
      sessionStorage.removeItem(SESSION_KEY);
      if (session) {
        fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${session.token}` }
        }).catch(() => {});
      }
      if (isSupabaseConfigured() && supabase) {
        supabase.auth.signOut().catch(() => {});
      }
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  }
};
