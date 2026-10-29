-- =============================================================================
-- KAVITHA & ASSOCIATES — SUPABASE POSTGRESQL PRODUCTION SCHEMA & RLS MIGRATION
-- Firm: Kavitha & Associates (Chartered Accountants & Cost Accountants)
-- Location: Tirupati, Andhra Pradesh, India
-- Standard: Production Grade with Strict Row Level Security (RLS)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Staff & Partners mapped to auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'managing_partner')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for role lookup
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- -----------------------------------------------------------------------------
-- 2. ENQUIRIES TABLE (Client Inquiries & Consultation Requests)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  full_name TEXT NOT NULL,
  entity_type TEXT,
  organization TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  service_category TEXT NOT NULL,
  city TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'routine',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in-progress', 'closed')),
  follow_up_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_phone ON public.enquiries(phone);

-- -----------------------------------------------------------------------------
-- 3. CONTENT SERVICES TABLE (Practice Areas & Statutory Scopes)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  statutory_framework TEXT,
  target_clients TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  display_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_content_services_status ON public.content_services(status);

-- -----------------------------------------------------------------------------
-- 4. CONTENT FAQS TABLE (Statutory Answers & Regulatory Cites)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  statute_reference TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  display_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_content_faqs_status ON public.content_faqs(status);

-- -----------------------------------------------------------------------------
-- 5. PRACTICE SETTINGS TABLE (Official Chambers Channels)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.practice_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  primary_phone TEXT NOT NULL,
  secondary_phone TEXT,
  email TEXT NOT NULL,
  primary_location TEXT NOT NULL,
  google_maps_url TEXT NOT NULL,
  whatsapp_link TEXT NOT NULL,
  opening_hours TEXT NOT NULL DEFAULT 'Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed / Prior Appointment Only',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- -----------------------------------------------------------------------------
-- 6. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_profiles ON public.profiles;
CREATE TRIGGER trigger_set_updated_at_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_set_updated_at_enquiries ON public.enquiries;
CREATE TRIGGER trigger_set_updated_at_enquiries
BEFORE UPDATE ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_set_updated_at_services ON public.content_services;
CREATE TRIGGER trigger_set_updated_at_services
BEFORE UPDATE ON public.content_services
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_set_updated_at_faqs ON public.content_faqs;
CREATE TRIGGER trigger_set_updated_at_faqs
BEFORE UPDATE ON public.content_faqs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_set_updated_at_settings ON public.practice_settings;
CREATE TRIGGER trigger_set_updated_at_settings
BEFORE UPDATE ON public.practice_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- -----------------------------------------------------------------------------
-- 7. AUTOMATIC USER PROFILE PROVISIONING TRIGGER
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Authorized Administrator'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- =============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_settings ENABLE ROW LEVEL SECURITY;

-- Helper check function: Is current authenticated user a staff member?
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'managing_partner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- PROFILES RLS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = id OR public.is_staff());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- ENQUIRIES RLS (CRITICAL PRIVACY SAFEGUARD)
-- 1. Anonymous & public can ONLY INSERT (public contact form)
-- 2. Anonymous CANNOT SELECT, UPDATE, or DELETE (Zero data leakage)
-- 3. Only verified staff can view, update status, add notes, or delete
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "enquiries_insert_public" ON public.enquiries;
CREATE POLICY "enquiries_insert_public" ON public.enquiries
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(full_name) >= 2 AND
  char_length(phone) >= 8 AND
  char_length(message) >= 5
);

DROP POLICY IF EXISTS "enquiries_select_staff_only" ON public.enquiries;
CREATE POLICY "enquiries_select_staff_only" ON public.enquiries
FOR SELECT TO authenticated
USING (public.is_staff());

DROP POLICY IF EXISTS "enquiries_update_staff_only" ON public.enquiries;
CREATE POLICY "enquiries_update_staff_only" ON public.enquiries
FOR UPDATE TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "enquiries_delete_staff_only" ON public.enquiries;
CREATE POLICY "enquiries_delete_staff_only" ON public.enquiries
FOR DELETE TO authenticated
USING (public.is_staff());

-- -----------------------------------------------------------------------------
-- CONTENT SERVICES RLS
-- 1. Public can read published services
-- 2. Staff can read all (including drafts) and modify
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "services_read_published" ON public.content_services;
CREATE POLICY "services_read_published" ON public.content_services
FOR SELECT TO anon, authenticated
USING (status = 'published');

DROP POLICY IF EXISTS "services_read_all_staff" ON public.content_services;
CREATE POLICY "services_read_all_staff" ON public.content_services
FOR SELECT TO authenticated
USING (public.is_staff());

DROP POLICY IF EXISTS "services_modify_staff" ON public.content_services;
CREATE POLICY "services_modify_staff" ON public.content_services
FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

-- -----------------------------------------------------------------------------
-- CONTENT FAQS RLS
-- 1. Public can read published FAQs
-- 2. Staff can read all (including drafts) and modify
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "faqs_read_published" ON public.content_faqs;
CREATE POLICY "faqs_read_published" ON public.content_faqs
FOR SELECT TO anon, authenticated
USING (status = 'published');

DROP POLICY IF EXISTS "faqs_read_all_staff" ON public.content_faqs;
CREATE POLICY "faqs_read_all_staff" ON public.content_faqs
FOR SELECT TO authenticated
USING (public.is_staff());

DROP POLICY IF EXISTS "faqs_modify_staff" ON public.content_faqs;
CREATE POLICY "faqs_modify_staff" ON public.content_faqs
FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

-- -----------------------------------------------------------------------------
-- PRACTICE SETTINGS RLS
-- 1. Public can read settings (phone, email, chambers address)
-- 2. Only staff can modify
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "settings_read_public" ON public.practice_settings;
CREATE POLICY "settings_read_public" ON public.practice_settings
FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "settings_modify_staff" ON public.practice_settings;
CREATE POLICY "settings_modify_staff" ON public.practice_settings
FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

-- =============================================================================
-- 9. BASELINE SEED DATA
-- =============================================================================

-- Seed practice settings
INSERT INTO public.practice_settings (
  id, primary_phone, secondary_phone, email, primary_location, google_maps_url, whatsapp_link, opening_hours
) VALUES (
  'primary',
  '+91 96263 50900',
  '+91 95421 53906',
  'cakavithasrj@gmail.com',
  'Bairagi Patteda, Tirupati, Andhra Pradesh – 517501',
  'https://www.google.com/maps?q=13.61925,79.418028',
  'https://wa.me/919626350900?text=Hello%20CA%20KavithaVijay%20SRJ%2C%20I%20would%20like%20to%20enquire%20about%20your%20Chartered%20Accountancy%20services.',
  'Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed / Prior Appointment Only'
) ON CONFLICT (id) DO NOTHING;

-- Seed service disciplines
INSERT INTO public.content_services (
  id, title, short_description, full_description, statutory_framework, target_clients, status, display_order
) VALUES
(
  'income-tax',
  'Income Tax Services',
  'Strategic direct tax planning, corporate filing, scrutiny representation, and appellate support.',
  'Comprehensive direct tax services from routine return preparation to complex dispute resolution before appellate authorities, structured to protect financial compliance.',
  'Income Tax Act, 1961 & CBDT Guidelines',
  'Companies, LLPs, High-Net-Worth Individuals, Trusts',
  'published',
  1
),
(
  'gst',
  'GST Services',
  'End-to-end Indirect Tax management, periodic filings, audit reconciliation, and departmental representation.',
  'Specialized GST counsel including return preparation (GSTR-1, 3B, 9/9C), input tax credit optimization, refund processing, and departmental notice defense.',
  'CGST Act, 2017 & State GST Regulations',
  'Manufacturers, Traders, Service Providers, Exporters',
  'published',
  2
),
(
  'corporate-business',
  'Corporate & Business Services',
  'Entity incorporation, MCA/ROC filings, restructuring, loan syndication, and Virtual CFO support.',
  'End-to-end secretarial and corporate governance assistance under Company Law, including annual filings, director disclosures, and strategic restructuring advisory.',
  'Companies Act, 2013 & MCA Mandates',
  'Private Limited Companies, Section 8 Entities, LLPs',
  'published',
  3
),
(
  'rera-compliance',
  'RERA Compliance & Certification',
  'Specialized advisory for builders and developers, quarterly compliance, and mandatory CA certificates.',
  'Statutory escrow account audits, quarterly project progress disclosures, Form 3 CA certifications, and registration support under Real Estate Regulatory authorities.',
  'Real Estate (Regulation and Development) Act, 2016',
  'Real Estate Developers, Builders, Promoters',
  'published',
  4
),
(
  'advisory-consulting',
  'Advisory & Consulting',
  'Internal controls, fraud review, business process enhancement, and forward financial planning.',
  'Operational reviews, standard operating procedure audits, cash flow planning, and financial due diligence designed to build institutional strength in growing firms.',
  'ICAI Technical Standards & Industry Best Practices',
  'Growing Enterprises, Family Businesses, Healthcare & Hospitality',
  'published',
  5
),
(
  'audit-assurance',
  'Audit & Assurance (Statutory Focus)',
  'Statutory Company Audits, Tax Audits under Section 44AB, Internal Audits, and Special Bank Audits.',
  'Independent, objective examination of books of accounts in strict adherence to Standards on Auditing (SAs) issued by ICAI, ensuring true and fair view reporting.',
  'Companies Act 2013, Section 139–143 & SAs by ICAI',
  'Public & Private Corporates, Banks, Statutory Boards',
  'published',
  6
)
ON CONFLICT (id) DO NOTHING;

-- Seed core FAQs
INSERT INTO public.content_faqs (
  id, question, answer, statute_reference, category, status, display_order
) VALUES
(
  'statutory-audit-mandate',
  'Which businesses are legally required to undergo a Statutory Audit in India?',
  'Under Section 139 of the Companies Act, 2013, every incorporated company (Private Limited, Public Limited, or One Person Company) must appoint an independent statutory auditor and have its annual accounts audited, regardless of turnover or capital. For non-corporate entities (proprietorships, firms, LLPs), audit requirements are triggered by turnover thresholds under Section 44AB of the Income Tax Act, 1961.',
  'Companies Act, 2013 — Section 139; Income Tax Act, 1961 — Section 44AB',
  'Audit & Assurance',
  'published',
  1
),
(
  'tax-audit-thresholds',
  'What are the turnover limits for a Tax Audit under Section 44AB?',
  'For businesses carrying on business operations, Tax Audit under Section 44AB is generally mandatory if total sales, turnover, or gross receipts exceed ₹1 Crore in the financial year. However, if cash receipts and cash payments do not exceed 5% of aggregate transactions (digital transaction incentive), the turnover threshold is increased to ₹10 Crores. For professionals, the threshold is ₹50 Lakhs gross receipts.',
  'Income Tax Act, 1961 — Section 44AB & Budget amendments',
  'Income Tax',
  'published',
  2
),
(
  'gst-annual-return-audit',
  'When is GST Annual Return (GSTR-9) and Reconciliation (GSTR-9C) mandatory?',
  'GSTR-9 is mandatory for registered regular taxpayers whose aggregate annual turnover exceeds ₹2 Crores. The self-certified reconciliation statement in Form GSTR-9C is mandatory for taxpayers whose aggregate turnover exceeds ₹5 Crores in the financial year.',
  'CGST Act, 2017 — Section 44 & CGST Rules 80',
  'GST Compliance',
  'published',
  3
),
(
  'rera-quarterly-ca-certificates',
  'Why do real estate developers require CA Certificates under RERA?',
  'Under Section 4(2)(l)(D) of RERA 2016, 70% of amounts realized for real estate projects must be deposited in a scheduled bank separate account (Escrow). Withdrawals require three certificates: from the Project Engineer, Architect, and a Practicing Chartered Accountant (Form 3) certifying that withdrawal is in proportion to the percentage of project completion.',
  'Real Estate (Regulation and Development) Act, 2016 — Section 4(2)(l)(D)',
  'Corporate & RERA',
  'published',
  4
)
ON CONFLICT (id) DO NOTHING;
