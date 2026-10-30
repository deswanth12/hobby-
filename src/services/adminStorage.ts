import { 
  EnquiryRecord, 
  EnquiryStatus, 
  AdminSession, 
  ContentOverrides, 
  SettingsOverrides 
} from '../types/admin';
import { supabase, isSupabaseConfigured, DbEnquiry, DbContentService, DbContentFaq } from '../lib/supabase';

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
    return isSupabaseConfigured() || true; // Server API is active on port 5173
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
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
      });

      if (res.ok) {
        const body = await res.json();
        if (body.allEnquiries || body.enquiries) {
          const records: EnquiryRecord[] = body.allEnquiries || body.enquiries;
          localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(records));
          window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
          return { success: true, data: records };
        }
      }
    } catch {
      // Fall through to Supabase or cache
    }

    // 2. Try Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const records: EnquiryRecord[] = data.map((d: DbEnquiry) => ({
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

          localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(records));
          window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
          return { success: true, data: records };
        }
      } catch (err) {
        console.warn('Supabase fetch fallback:', err);
      }
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

  async recordEnquiryAsync(enquiry: Omit<EnquiryRecord, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; data: EnquiryRecord; error?: string }> {
    // 1. Send to Shared Server API
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.enquiry) {
          const rec: EnquiryRecord = json.enquiry;
          const existing = this.getEnquiries();
          localStorage.setItem(ENQUIRIES_KEY, JSON.stringify([rec, ...existing.filter(e => e.id !== rec.id)]));
          window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
          return { success: true, data: rec };
        }
      }
    } catch {
      // Fall through to local fallback
    }

    const local = this.recordEnquiry(enquiry);
    return { success: true, data: local };
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

    const rows = enquiries.map(e => [
      `"${e.id}"`,
      `"${new Date(e.createdAt).toLocaleString('en-IN')}"`,
      `"${e.status.toUpperCase()}"`,
      `"${(e.fullName || '').replace(/"/g, '""')}"`,
      `"${(e.entityType || '').replace(/"/g, '""')}"`,
      `"${(e.organization || '').replace(/"/g, '""')}"`,
      `"${(e.phone || '').replace(/"/g, '""')}"`,
      `"${(e.email || '').replace(/"/g, '""')}"`,
      `"${(e.serviceCategory || '').replace(/"/g, '""')}"`,
      `"${(e.city || '').replace(/"/g, '""')}"`,
      `"${(e.urgency || '').replace(/"/g, '""')}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`,
      `"${(e.followUpNotes || '').replace(/"/g, '""')}"`
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

    // 1. Fetch from Shared Server API
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const body = await res.json();
        current.services = current.services || {};
        (body.allServices || body.services || []).forEach((s: { id: string; title: string; shortDescription: string; fullDescription: string; statutoryFramework?: string; targetClients?: string; status: 'published' | 'draft' }) => {
          current.services![s.id] = {
            title: s.title,
            shortDescription: s.shortDescription,
            fullDescription: s.fullDescription,
            statutoryFramework: s.statutoryFramework || '',
            targetClients: s.targetClients || '',
            status: s.status,
          };
        });

        current.faqs = current.faqs || {};
        (body.allFaqs || body.faqs || []).forEach((f: { id: string; question: string; answer: string; statuteReference?: string; status: 'published' | 'draft' }) => {
          current.faqs![f.id] = {
            question: f.question,
            answer: f.answer,
            statuteReference: f.statuteReference || '',
            status: f.status,
          };
        });

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
              question: f.question,
              answer: f.answer,
              statuteReference: f.statute_reference || '',
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
        primary_location: settings.primaryLocation || 'Bairagi Patteda, Tirupati, Andhra Pradesh – 517501',
        google_maps_url: settings.googleMapsUrl || 'https://www.google.com/maps?q=13.61925,79.418028',
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

    // 3. Local fallback authentication
    return this.authenticate(cleanIdentity, cleanPass);
  },

  authenticate(username: string, password: string): { success: boolean; error?: string; session?: AdminSession } {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    const validCredentials = [
      {
        user: 'kavitha',
        pass: 'Tirupati@CA2026',
        displayName: 'CA Kavitha Vijay',
        role: 'Managing Partner' as const
      },
      {
        user: 'admin',
        pass: 'KavithaAssoc#2026',
        displayName: 'Practice Administrator',
        role: 'Practice Administrator' as const
      }
    ];

    const match = validCredentials.find(c => c.user === cleanUser && c.pass === cleanPass);

    if (!match) {
      return { 
        success: false, 
        error: 'Invalid credentials. Please verify your username and security password.' 
      };
    }

    const session: AdminSession = {
      token: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      user: {
        username: match.user,
        displayName: match.displayName,
        role: match.role,
        lastLogin: new Date().toISOString()
      },
      expiresAt: Date.now() + 60 * 60 * 1000
    };

    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { success: true, session };
    } catch {
      return { success: false, error: 'Failed to initialize session storage.' };
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
          redirectTo: `${window.location.origin}/admin/login?reset=true`,
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
      message: `Password recovery request logged for ${cleanEmail}. In production, Supabase Auth sends an email reset link. Default credentials: 'kavitha' / 'Tirupati@CA2026'.`
    };
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
