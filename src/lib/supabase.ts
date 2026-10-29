import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase (must be public anon key, NEVER service role key)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here' &&
    supabaseUrl.startsWith('https://')
  );
};

// Database TypeScript interfaces
export interface DbProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'managing_partner';
  created_at: string;
  updated_at: string;
}

export interface DbEnquiry {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  entity_type?: string;
  organization?: string;
  phone: string;
  email?: string;
  service_category: string;
  city: string;
  urgency: 'routine' | 'statutory-deadline';
  message: string;
  status: 'new' | 'contacted' | 'in-progress' | 'closed';
  follow_up_notes?: string;
}

export interface DbContentService {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  statutory_framework?: string;
  target_clients?: string;
  status: 'published' | 'draft';
  display_order: number;
  updated_at: string;
  updated_by?: string;
}

export interface DbContentFaq {
  id: string;
  question: string;
  answer: string;
  statute_reference?: string;
  category?: string;
  status: 'published' | 'draft';
  display_order: number;
  updated_at: string;
  updated_by?: string;
}

export interface DbPracticeSettings {
  id: string;
  primary_phone: string;
  secondary_phone?: string;
  email: string;
  primary_location: string;
  google_maps_url: string;
  whatsapp_link: string;
  opening_hours: string;
  updated_at: string;
  updated_by?: string;
}

/**
 * Singleton Supabase Client:
 * Configured with standard browser persistence and auth auto-refresh.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let clientInstance: SupabaseClient<any, 'public', any> | null = null;

if (isSupabaseConfigured()) {
  clientInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
} else {
  if (import.meta.env.DEV) {
    console.info(
      '%c[Kavitha & Associates] Supabase keys not configured in .env. Running in Local Persistence Mode.',
      'color: #0F3E2E; font-weight: bold;'
    );
  }
}

export const supabase = clientInstance;
