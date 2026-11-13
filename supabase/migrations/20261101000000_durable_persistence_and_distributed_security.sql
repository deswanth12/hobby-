-- =============================================================================
-- KAVITHA & ASSOCIATES — DURABLE PERSISTENCE & DISTRIBUTED SECURITY MIGRATION
-- Migration: 20261101000000_durable_persistence_and_distributed_security.sql
-- =============================================================================

-- 1. Enhance content_services for full feature parity
ALTER TABLE IF EXISTS public.content_services
  ADD COLUMN IF NOT EXISTS typical_scenarios JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sub_services JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS icon_name TEXT DEFAULT 'Briefcase',
  ADD COLUMN IF NOT EXISTS seo JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Enhance content_faqs for multi-service mapping and soft-delete
ALTER TABLE IF EXISTS public.content_faqs
  ADD COLUMN IF NOT EXISTS service_ids JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 3. Distributed Admin Credentials Table (replaces /tmp for password changes)
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  iterations INT NOT NULL DEFAULT 100000,
  algorithm TEXT NOT NULL DEFAULT 'pbkdf2-sha512',
  role TEXT NOT NULL DEFAULT 'admin',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Distributed Revoked Tokens Table (replaces /tmp for session invalidation)
CREATE TABLE IF NOT EXISTS public.revoked_tokens (
  jti TEXT PRIMARY KEY,
  revoked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- 5. Distributed User Revocation Epochs Table (for instant user-wide revocation)
CREATE TABLE IF NOT EXISTS public.user_revocation_epochs (
  username TEXT PRIMARY KEY,
  epoch_sec BIGINT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Distributed Login Rate Limits Table (shared across all serverless instances)
CREATE TABLE IF NOT EXISTS public.login_rate_limits (
  rate_key TEXT PRIMARY KEY,
  attempts INT NOT NULL DEFAULT 0,
  lockout_until BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Distributed Slug Redirects Table (for renamed services)
CREATE TABLE IF NOT EXISTS public.slug_redirects (
  old_slug TEXT PRIMARY KEY,
  new_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) FOR NEW DISTRIBUTED SECURITY TABLES
-- -----------------------------------------------------------------------------

ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revoked_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_revocation_epochs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slug_redirects ENABLE ROW LEVEL SECURITY;

-- Staff check helper reuse
-- Note: Service role automatically bypasses RLS in Supabase.
-- For authenticated client sessions:

DROP POLICY IF EXISTS "admin_credentials_staff_only" ON public.admin_credentials;
CREATE POLICY "admin_credentials_staff_only" ON public.admin_credentials
FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "revoked_tokens_staff_only" ON public.revoked_tokens;
CREATE POLICY "revoked_tokens_staff_only" ON public.revoked_tokens
FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "user_revocation_epochs_staff_only" ON public.user_revocation_epochs;
CREATE POLICY "user_revocation_epochs_staff_only" ON public.user_revocation_epochs
FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "login_rate_limits_staff_only" ON public.login_rate_limits;
CREATE POLICY "login_rate_limits_staff_only" ON public.login_rate_limits
FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "slug_redirects_read_public" ON public.slug_redirects;
CREATE POLICY "slug_redirects_read_public" ON public.slug_redirects
FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "slug_redirects_modify_staff" ON public.slug_redirects;
CREATE POLICY "slug_redirects_modify_staff" ON public.slug_redirects
FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());
