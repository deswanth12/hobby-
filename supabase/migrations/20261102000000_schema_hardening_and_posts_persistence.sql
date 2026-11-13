-- =============================================================================
-- Migration: 20261102000000_schema_hardening_and_posts_persistence.sql
-- Description: Adds created_at to content_services and content_faqs,
--              provisions content_posts table with RLS, and hardens
--              public read and enquiry insert policies to prevent soft-delete leaks.
-- =============================================================================

-- 1. Ensure created_at exists on content_services and content_faqs
ALTER TABLE IF EXISTS public.content_services
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE IF EXISTS public.content_faqs
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 2. Define content_posts table for durable blog articles
CREATE TABLE IF NOT EXISTS public.content_posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  author TEXT NOT NULL DEFAULT 'CA Kavitha Vijay',
  author_role TEXT NOT NULL DEFAULT 'Managing Partner',
  cover_image TEXT,
  cover_image_alt TEXT,
  draft BOOLEAN NOT NULL DEFAULT true,
  reading_time TEXT DEFAULT '5 min read',
  seo JSONB DEFAULT '{}'::jsonb,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_content_posts_draft ON public.content_posts(draft);
CREATE INDEX IF NOT EXISTS idx_content_posts_date ON public.content_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_content_posts_deleted ON public.content_posts(deleted_at);

-- Generic compatibility table
CREATE TABLE IF NOT EXISTS public.posts (
  LIKE public.content_posts INCLUDING ALL
);

-- 3. Harden Enquiries Public Insert Policy
DROP POLICY IF EXISTS "enquiries_insert_public" ON public.enquiries;
CREATE POLICY "enquiries_insert_public" ON public.enquiries
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(full_name) >= 2 AND
  char_length(phone) >= 8 AND
  char_length(message) >= 5 AND
  status = 'new' AND
  follow_up_notes IS NULL
);

-- 4. Harden Services Public Read Policy (Filter Soft-Deleted Services)
DROP POLICY IF EXISTS "services_read_published" ON public.content_services;
CREATE POLICY "services_read_published" ON public.content_services
FOR SELECT TO anon, authenticated
USING (status = 'published' AND deleted_at IS NULL);

-- 5. Harden FAQs Public Read Policy (Filter Soft-Deleted FAQs)
DROP POLICY IF EXISTS "faqs_read_published" ON public.content_faqs;
CREATE POLICY "faqs_read_published" ON public.content_faqs
FOR SELECT TO anon, authenticated
USING (status = 'published' AND deleted_at IS NULL);

-- 6. Content Posts RLS Policies
ALTER TABLE public.content_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_read_published" ON public.content_posts;
CREATE POLICY "posts_read_published" ON public.content_posts
FOR SELECT TO anon, authenticated
USING (draft = false AND deleted_at IS NULL);

DROP POLICY IF EXISTS "posts_read_all_staff" ON public.content_posts;
CREATE POLICY "posts_read_all_staff" ON public.content_posts
FOR SELECT TO authenticated
USING (public.is_staff());

DROP POLICY IF EXISTS "posts_modify_staff" ON public.content_posts;
CREATE POLICY "posts_modify_staff" ON public.content_posts
FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());
