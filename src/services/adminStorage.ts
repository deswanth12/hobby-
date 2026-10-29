import { 
  EnquiryRecord, 
  EnquiryStatus, 
  AdminSession, 
  ContentOverrides, 
  SettingsOverrides 
} from '../types/admin';

const ENQUIRIES_KEY = 'ka_admin_enquiries_v1';
const CONTENT_KEY = 'ka_admin_content_v1';
const SETTINGS_KEY = 'ka_admin_settings_v1';
const SESSION_KEY = 'ka_admin_session_v1';
const RATE_LIMIT_KEY = 'ka_admin_login_attempts_v1';

// Custom event name for instant reactive updates across public components
export const FIRM_DATA_UPDATE_EVENT = 'ka_firm_data_updated';

// ---------------------------------------------------------------------------
// 1. Enquiries Storage Service
// ---------------------------------------------------------------------------

export const adminStorage = {
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
    return newRecord;
  },

  updateEnquiryStatus(id: string, status: EnquiryStatus, followUpNotes?: string): boolean {
    const existing = this.getEnquiries();
    const index = existing.findIndex(e => e.id === id);
    if (index === -1) return false;

    existing[index] = {
      ...existing[index],
      status,
      followUpNotes: followUpNotes !== undefined ? followUpNotes : existing[index].followUpNotes,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
      return true;
    } catch (e) {
      console.error('Failed to update enquiry status:', e);
      return false;
    }
  },

  deleteEnquiry(id: string): boolean {
    const existing = this.getEnquiries();
    const filtered = existing.filter(e => e.id !== id);
    try {
      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
      return true;
    } catch (e) {
      console.error('Failed to delete enquiry:', e);
      return false;
    }
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

  saveServiceOverride(serviceId: string, override: {
    title?: string;
    shortDescription?: string;
    fullDescription?: string;
    statutoryFramework?: string;
    targetClients?: string;
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
      return true;
    } catch (e) {
      console.error('Failed to save service override:', e);
      return false;
    }
  },

  saveFAQOverride(faqId: string, override: {
    question?: string;
    answer?: string;
    statuteReference?: string;
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
      return true;
    } catch (e) {
      console.error('Failed to save FAQ override:', e);
      return false;
    }
  },

  resetContentOverrides(): boolean {
    try {
      localStorage.removeItem(CONTENT_KEY);
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
      return true;
    } catch (e) {
      console.error('Failed to reset content overrides:', e);
      return false;
    }
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

  saveSettingsOverrides(settings: SettingsOverrides): boolean {
    try {
      const current = this.getSettingsOverrides();
      const updated = { ...current, ...settings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
      return true;
    } catch (e) {
      console.error('Failed to save settings overrides:', e);
      return false;
    }
  },

  resetSettingsOverrides(): boolean {
    try {
      localStorage.removeItem(SETTINGS_KEY);
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
      return true;
    } catch (e) {
      console.error('Failed to reset settings overrides:', e);
      return false;
    }
  },

  // ---------------------------------------------------------------------------
  // 4. Admin Authentication & Session Management
  // ---------------------------------------------------------------------------

  // Check rate limiting (max 5 failed attempts in 15 minutes)
  isRateLimited(): { limited: boolean; remainingMs?: number } {
    try {
      const data = sessionStorage.getItem(RATE_LIMIT_KEY);
      if (!data) return { limited: false };
      const { lockoutUntil } = JSON.parse(data);
      if (lockoutUntil && Date.now() < lockoutUntil) {
        return { limited: true, remainingMs: lockoutUntil - Date.now() };
      }
      return { limited: false };
    } catch {
      return { limited: false };
    }
  },

  recordFailedLoginAttempt(): number {
    try {
      const data = sessionStorage.getItem(RATE_LIMIT_KEY);
      let attempts = 0;
      if (data) {
        const parsed = JSON.parse(data);
        attempts = parsed.attempts || 0;
      }
      attempts += 1;
      const lockoutUntil = attempts >= 5 ? Date.now() + 15 * 60 * 1000 : null;
      sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ attempts, lockoutUntil }));
      return attempts;
    } catch {
      return 1;
    }
  },

  resetFailedAttempts(): void {
    sessionStorage.removeItem(RATE_LIMIT_KEY);
  },

  /**
   * Prototype Authentication:
   * Supports authorized practice login with verified credentials for demonstration.
   * In full production backend, replaced with server-side bcrypt / JWT endpoints.
   */
  authenticate(username: string, password: string): { success: boolean; error?: string; session?: AdminSession } {
    const rateCheck = this.isRateLimited();
    if (rateCheck.limited) {
      const mins = Math.ceil((rateCheck.remainingMs || 0) / 60000);
      return { 
        success: false, 
        error: `Too many failed login attempts. Portal locked for security. Please try again in ${mins} minute(s).` 
      };
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Verification against authorized practice admin profiles
    const validCredentials = [
      {
        user: 'kavitha',
        pass: 'Tirupati@CA2026',
        displayName: 'CA KavithaVijay SRJ',
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
      const attempts = this.recordFailedLoginAttempt();
      const remaining = Math.max(0, 5 - attempts);
      return { 
        success: false, 
        error: `Invalid credentials. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining before security lockout)` 
      };
    }

    // Success: Generate secure random session token
    this.resetFailedAttempts();

    const session: AdminSession = {
      token: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      user: {
        username: match.user,
        displayName: match.displayName,
        role: match.role,
        lastLogin: new Date().toISOString()
      },
      expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour session lifetime
    };

    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { success: true, session };
    } catch (e) {
      return { success: false, error: 'Failed to initialize session storage.' };
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
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  }
};
