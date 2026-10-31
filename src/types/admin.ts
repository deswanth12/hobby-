export type EnquiryStatus = 'new' | 'contacted' | 'in-progress' | 'closed' | 'in-review';

export type EnquiryUrgency = 
  | 'Normal Statutory Cycle'
  | 'Urgent / Approaching Deadline'
  | 'Statutory Notice Received'
  | 'Immediate Incorporation';

export interface EnquiryRecord {
  id: string;
  fullName: string;
  entityType: string;
  organization: string;
  phone: string;
  email: string;
  serviceCategory: string;
  city: string;
  urgency: string;
  message: string;
  createdAt: string;
  status: EnquiryStatus;
  followUpNotes?: string;
  updatedAt?: string;
}

export interface AdminUser {
  username: string;
  displayName: string;
  role: 'Managing Partner' | 'Practice Administrator' | 'Audit Associate';
  lastLogin: string;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  expiresAt: number;
}

export interface AdminPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  authorRole: string;
  coverImage?: string;
  coverImageAlt?: string;
  excerpt: string;
  tags: string[];
  draft: boolean;
  content: string;
  readingTime?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
  updatedAt?: string;
}

export interface ContentOverrides {
  services?: Record<string, {
    title?: string;
    shortDescription?: string;
    fullDescription?: string;
    statutoryFramework?: string;
    targetClients?: string;
    status?: 'published' | 'draft';
  }>;
  faqs?: Record<string, {
    question?: string;
    answer?: string;
    statuteReference?: string;
    status?: 'published' | 'draft';
  }>;
  posts?: Record<string, AdminPost>;
}

export interface SettingsOverrides {
  primaryPhone?: string;
  secondaryPhone?: string;
  email?: string;
  primaryLocation?: string;
  streetAddress?: string;
  locality?: string;
  postalCode?: string;
  googleMapsUrl?: string;
  whatsappNumber?: string;
  whatsappLink?: string;
  openingHours?: string;
}
