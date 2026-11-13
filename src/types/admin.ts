export type EnquiryStatus = 'new' | 'contacted' | 'in-progress' | 'closed' | 'in-review';

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

export interface AdminService {
  id: string; // URL slug identifier
  title: string;
  shortDescription: string;
  fullDescription: string;
  statutoryFramework?: string;
  targetClients?: string;
  typicalScenarios?: string[];
  services?: string[]; // Deliverable sub-services
  iconName?: string;
  status: 'published' | 'draft';
  order?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface AdminFaq {
  id: string;
  question: string;
  answer: string;
  statuteReference?: string;
  category: string;
  serviceIds?: string[]; // IDs of services this FAQ is linked to
  status: 'published' | 'draft';
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface ContentOverrides {
  services?: Record<string, AdminService>;
  faqs?: Record<string, AdminFaq>;
  posts?: Record<string, AdminPost>;
  deletedServices?: AdminService[];
  deletedFaqs?: AdminFaq[];
  slugRedirects?: Record<string, string>;
  servicesOrder?: string[];
  faqsOrder?: string[];
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
