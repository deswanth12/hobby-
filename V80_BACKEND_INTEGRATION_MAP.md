# V80 Backend Integration Map & Service Contracts

**Target Platform:** Kavitha & Associates — Chartered Accountants & Cost Accountants  
**Document Classification:** Architecture & Backend Integration Contract Specification  
**Version:** 8.0.0  
**Status:** Publication-Ready & Verified  
**Milestone:** M1 (Baseline Isolation & Backend Integration Layer)  
**Working Directory:** `C:\kavatha ca`  

---

## 1. Executive Summary & Integration Principles

The Kavitha & Associates web platform operates on a **dual-persistence hybrid architecture**:
1. **Cloud Database (Primary Production):** Supabase PostgreSQL database governed by 23 strict Row-Level Security (RLS) policies, automatic user profile provisioning triggers, and distributed coordination ledgers.
2. **Local Durable Store (Fail-Safe Fallback):** Local JSON ledger (`data/practice_db.json` in local development; mirrored to `/tmp/practice_db.json` in Vercel serverless containers) managed by `server/durableStorage.cjs` and `server/apiRouter.cjs`.
3. **Headless / Git-Backed CMS Content:** Published articles in `content/posts/*.md` and static website sections in `content/sections/*.json` are committed to GitHub and imported at build time via Vite's `import.meta.glob`.

### Strict Backend Preservation Mandate:
- **Zero Schema Migrations / Deletions:** Database schemas, table names, column names, triggers, and RLS policies must remain unaltered.
- **Fail-Visible Mutations:** Any failure in the durable cloud store returns HTTP 500/503 with exact error codes; no silent drops or false successes.
- **Zero Public Read Leakage:** Prospective client consultations (`public.enquiries`) are write-only for anonymous users. Under no circumstances may public clients read or list enquiries.
- **Triple-Layer Draft Quarantine:** Unpublished articles (`draft: true`) are quarantined across Database RLS, Server HTTP 404 router, and Client React components.

---

## 2. Environment Variables & Secret Management

| # | Variable Name | Execution Scope | Classification | Required? | Primary Purpose | Location / Default |
|:---|:---|:---|:---|:---|:---|:---|
| 1 | `VITE_ADMIN_SECRET_PATH` | Client Build-time | Non-Secret (Routing Slug) | **YES** | Configurable route slug mounting the admin console for scanner noise reduction. Must start with `/` and have $\ge 12$ chars. Fails closed (404) if invalid. **Never treated as an access control secret.** | `.env` (`/<configured-admin-slug>`) |
| 2 | `VITE_SUPABASE_URL` | Client Build-time | Public Endpoint URL | Optional / Recommended | Supabase project REST API endpoint for browser client. | `https://your-project.supabase.co` |
| 3 | `VITE_SUPABASE_ANON_KEY` | Client Build-time | Public Anonymous Key | Optional / Recommended | Supabase anon key for public inserts and published content reads. Governed by Postgres RLS. | `eyJhbGciOi...` |
| 4 | `SUPABASE_URL` | Server Runtime | Private URL | Optional / Recommended | Supabase URL for Node.js durable serverless backend (`server/durableStorage.cjs`). | Matches `VITE_SUPABASE_URL` |
| 5 | `SUPABASE_SERVICE_ROLE_KEY` | Server Runtime | **HIGH SECRET** | Recommended | Privileged key allowing backend to write enquiries, manage credentials, and handle revocations bypassing client RLS. | Supabase Dashboard Secret Key |
| 6 | `SESSION_SECRET` | Server Runtime | **HIGH SECRET** | **YES** | 256-bit cryptographic signing key for stateless HMAC-SHA256 JWT tokens (`ka_jwt.*`). Pinning prevents cross-restart logout. | 64-char hex string |
| 7 | `ADMIN_KAVITHA_PASSWORD` | Server Runtime | **HIGH SECRET** | **YES** | Managing Partner password. Hashed with PBKDF2-HMAC-SHA512 (100,000 iterations, 32-byte salt). | High-entropy string |
| 8 | `ADMIN_PASSWORD` | Server Runtime | **HIGH SECRET** | Optional | Secondary administrator password. | High-entropy string |
| 9 | `GITHUB_CLIENT_ID` | Server / Edge | Public OAuth ID | Optional (CMS) | GitHub OAuth App ID for Sveltia / Decap CMS login bridge. | From GitHub Developer Settings |
| 10 | `GITHUB_CLIENT_SECRET` | Server / Edge | **HIGH SECRET** | Optional (CMS) | GitHub OAuth Secret for server-to-server token exchange. | From GitHub Developer Settings |
| 11 | `ALLOWED_USERS` | Server / Edge | Policy (User List) | Optional (CMS) | Comma-separated list of GitHub usernames permitted to log into CMS. | e.g. `kavithavijay` |
| 12 | `ALLOWED_ORIGINS` | Server Runtime | Policy (Origin List) | Optional | Comma-separated list of custom domains permitted for CORS and Anti-CSRF checks. | e.g. `https://kavithaassociates.com` |
| 13 | `STRICT_DURABLE_STORAGE` | Server Runtime | Mode Flag | Optional | Enforces fail-closed behavior on database errors (mandatory cloud DB). | `true` or `false` |

---

## 3. Database Schema & RLS Map (`supabase/schema.sql`)

### 3.1 Table Specifications

```sql
-- 1. PROFILES (Staff & Partners mapped to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'managing_partner')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ENQUIRIES (Consultation briefs & Intake submissions)
CREATE TABLE public.enquiries (
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

-- 3. CONTENT_SERVICES (Practice area scopes & statutory frameworks)
CREATE TABLE public.content_services (
  id TEXT PRIMARY KEY, -- Slug identifier
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  statutory_framework TEXT,
  target_clients TEXT,
  typical_scenarios JSONB DEFAULT '[]'::jsonb,
  sub_services JSONB DEFAULT '[]'::jsonb,
  icon_name TEXT DEFAULT 'Briefcase',
  seo JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id)
);

-- 4. CONTENT_FAQS (Statutory answers & citations)
CREATE TABLE public.content_faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  statute_reference TEXT,
  category TEXT,
  service_ids JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id)
);

-- 5. CONTENT_POSTS / POSTS (Blog articles & technical publications)
CREATE TABLE public.content_posts (
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

-- Compatible alias table for generic posts references
CREATE TABLE public.posts (
  LIKE public.content_posts INCLUDING ALL
);

-- 6. PRACTICE_SETTINGS (Official chambers channels & address)
CREATE TABLE public.practice_settings (
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

-- 7. DISTRIBUTED ADMINISTRATIVE & COORDINATION TABLES
CREATE TABLE public.admin_credentials (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  iterations INT NOT NULL DEFAULT 100000,
  algorithm TEXT NOT NULL DEFAULT 'pbkdf2-sha512',
  role TEXT NOT NULL DEFAULT 'admin',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.revoked_tokens (
  jti TEXT PRIMARY KEY,
  revoked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE public.user_revocation_epochs (
  username TEXT PRIMARY KEY,
  epoch_sec BIGINT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.login_rate_limits (
  rate_key TEXT PRIMARY KEY,
  attempts INT NOT NULL DEFAULT 0,
  lockout_until BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.slug_redirects (
  old_slug TEXT PRIMARY KEY,
  new_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.2 Row Level Security (RLS) Policy Matrix

| Table Name | Operation | Target Role | Security Filter / Check Expression | Business & Legal Purpose |
|:---|:---|:---|:---|:---|
| `profiles` | `SELECT` | `authenticated` | `auth.uid() = id OR public.is_staff()` | Self profile inspection and staff oversight |
| `profiles` | `UPDATE` | `authenticated` | `auth.uid() = id` (WITH CHECK `auth.uid() = id`) | User updates own profile |
| `enquiries` | `INSERT` | `anon, authenticated` | `char_length(full_name) >= 2 AND char_length(phone) >= 8 AND char_length(message) >= 5 AND status = 'new' AND follow_up_notes IS NULL` | Public intake form submission validation |
| `enquiries` | `SELECT` | `authenticated` | `public.is_staff()` | **Confidentiality:** Anonymous access blocked (0 leaks) |
| `enquiries` | `UPDATE` | `authenticated` | `public.is_staff()` | Only verified staff can update status or notes |
| `enquiries` | `DELETE` | `authenticated` | `public.is_staff()` | Only verified staff can delete records |
| `content_services` | `SELECT` | `anon, authenticated` | `status = 'published' AND deleted_at IS NULL` | Public views only approved published services |
| `content_services` | `ALL` | `authenticated` | `public.is_staff()` | Staff manages drafts, order, and descriptions |
| `content_faqs` | `SELECT` | `anon, authenticated` | `status = 'published' AND deleted_at IS NULL` | Public views only published FAQs |
| `content_faqs` | `ALL` | `authenticated` | `public.is_staff()` | Staff manages FAQs and service mappings |
| `content_posts` | `SELECT` | `anon, authenticated` | `draft = false AND deleted_at IS NULL` | Public views only published articles (draft quarantine) |
| `content_posts` | `ALL` | `authenticated` | `public.is_staff()` | Staff authors, updates, and deletes articles |
| `practice_settings`| `SELECT` | `anon, authenticated` | `true` | Public reads chambers phone, email, and location |
| `practice_settings`| `ALL` | `authenticated` | `public.is_staff()` | Only staff modifies chambers operational details |
| `admin_credentials`| `ALL` | `authenticated` | `public.is_staff()` | Anonymous blocked 100%; server handles via service_role |
| `revoked_tokens` | `ALL` | `authenticated` | `public.is_staff()` | Anonymous blocked 100% |
| `user_revocation_epochs` | `ALL` | `authenticated` | `public.is_staff()` | Anonymous blocked 100% |
| `login_rate_limits`| `ALL` | `authenticated` | `public.is_staff()` | Anonymous blocked 100% |
| `slug_redirects` | `SELECT` | `anon, authenticated` | `true` | Public routes resolve 301 redirects for renamed services |
| `slug_redirects` | `ALL` | `authenticated` | `public.is_staff()` | Staff modifies redirects |

---

## 4. Complete REST API Endpoint Specification

### 4.1 Public Endpoints

#### 1. System Health & Storage Engine
- **Method / Path:** `GET /api/health` (alias: `GET /api/status`)
- **Headers:** None
- **Response (200 OK):**
  ```json
  {
    "status": "connected",
    "engine": "shared-database",
    "database": "PostgreSQL / Shared Database Active",
    "synchronized": true,
    "storage": {
      "isDurable": true,
      "provider": "supabase",
      "storageTarget": "Supabase (xyz.supabase.co) [service_role]",
      "hasServiceRole": true,
      "strictMode": false
    },
    "totalEnquiries": 5,
    "timestamp": "2026-11-10T06:00:00.000Z"
  }
  ```

#### 2. Public Content (Services, FAQs, Redirects, Published Posts)
- **Method / Path:** `GET /api/content`
- **Headers:** Optional `Authorization: Bearer <token>`
- **Response (200 OK - Public):**
  ```json
  {
    "services": [ /* array of published, non-deleted AdminService objects */ ],
    "faqs": [ /* array of published, non-deleted AdminFaq objects */ ],
    "slugRedirects": { "old-slug": "new-slug" },
    "settings": { /* practice settings object */ },
    "posts": [ /* array of published, non-deleted AdminPost objects */ ]
  }
  ```
- **Response (200 OK - Authenticated Admin):**
  Contains additional properties: `allServices`, `deletedServices`, `allFaqs`, `deletedFaqs`, `allPosts`.

#### 3. Public Practice Settings
- **Method / Path:** `GET /api/settings`
- **Headers:** None
- **Response (200 OK):**
  ```json
  {
    "primaryPhone": "+91 96263 50900",
    "secondaryPhone": "+91 95421 53906",
    "email": "cakavithasrj@gmail.com",
    "primaryLocation": "19-12-46, 1st Floor, Near Bairagipetteda Arch, Tirupati, Andhra Pradesh 517501, India",
    "googleMapsUrl": "https://maps.app.goo.gl/p9ToGUtxqYDCghpF6",
    "whatsappLink": "https://wa.me/919626350900?text=...",
    "openingHours": "Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed / Prior Appointment Only",
    "updatedAt": "2026-10-29T15:27:17.521Z"
  }
  ```

#### 4. Consultation Intake Submission
- **Method / Path:** `POST /api/enquiries`
- **Headers:** `Content-Type: application/json`
- **Body Schema:**
  ```json
  {
    "fullName": "CA Client Name",
    "entityType": "Private Limited Company",
    "organization": "Enterprise Ltd",
    "phone": "+91 9876543210",
    "email": "contact@enterprise.com",
    "serviceCategory": "Audit & Assurance Services",
    "city": "Tirupati",
    "urgency": "Normal Statutory Cycle",
    "message": "Detailed consultation brief.",
    "website_fax_hp": "" 
  }
  ```
- **Validation Rules:**
  - `fullName`: 2–100 characters
  - `phone`: 8–20 characters, min 7 digits, regex `^[0-9+\s\-()]{8,20}$`
  - `message`: 5–3000 characters
  - `email`: optional, max 254 characters, standard email regex
  - `website_fax_hp`: honeypot field. If non-empty, returns fake 200 `{ success: true, message: "Enquiry registered." }`
  - Rate limit: max 20 submissions per IP per 10 minutes (returns 429)
  - Velocity guard: form submission taking < 1500ms is blocked on client
  - Deduplication: submissions with identical `phone + message` within 60s return the existing enquiry record
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "enquiry": {
      "id": "ENQ-MWA7L3Z0-146",
      "createdAt": "2026-11-10T06:00:00.000Z",
      "updatedAt": "2026-11-10T06:00:00.000Z",
      "fullName": "CA Client Name",
      "entityType": "Private Limited Company",
      "organization": "Enterprise Ltd",
      "phone": "+91 9876543210",
      "email": "contact@enterprise.com",
      "serviceCategory": "Audit & Assurance Services",
      "city": "Tirupati",
      "urgency": "Normal Statutory Cycle",
      "message": "Detailed consultation brief.",
      "status": "new",
      "followUpNotes": ""
    },
    "message": "Consultation inquiry registered successfully in practice database."
  }
  ```

---

### 4.2 Authentication & Session Endpoints

#### 5. Admin Authentication (Login)
- **Method / Path:** `POST /api/auth/login`
- **Body Schema:** `{ "username": "kavitha", "password": "..." }`
- **Features:** 5 failed attempts trigger 15-minute security lockout; PBKDF2-HMAC-SHA512 password verification; stateless JWT session token signed with `SESSION_SECRET`; sets `ka_admin_session` cookie (`HttpOnly; SameSite=Strict; Path=/; Max-Age=3600; Secure`).
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "session": {
      "token": "ka_jwt.<claimsB64>.<sig>",
      "user": {
        "username": "kavitha",
        "displayName": "CA Kavitha Vijay",
        "role": "Managing Partner",
        "lastLogin": "2026-11-10T06:00:00.000Z"
      },
      "expiresAt": 1793702169000
    }
  }
  ```

#### 6. Admin Authentication (Logout)
- **Method / Path:** `POST /api/auth/logout`
- **Headers:** `Authorization: Bearer <token>` or cookie
- **Features:** Adds token `jti` to `revoked_tokens` table; clears `ka_admin_session` cookie (`Max-Age=0`).
- **Response (200 OK):** `{ "success": true, "message": "Session terminated and revoked in persistent ledger." }`

#### 7. Session Verification
- **Method / Path:** `GET /api/auth/session`
- **Headers:** `Authorization: Bearer <token>` or cookie
- **Response (200 OK):** `{ "success": true, "session": { ... } }`
- **Response (401 Unauthorized):** `{ "success": false, "error": "Unauthorized or expired session." }`

#### 8. GitHub OAuth: Initiate Authorization
- **Method / Path:** `GET /api/auth`
- **Query Parameters:** `?provider=github&scope=repo`
- **Features:** Validates provider; generates 24-byte crypto random state; sets `ka_oauth_state` cookie (`HttpOnly; SameSite=Lax; Path=/; Max-Age=600`); redirects to GitHub OAuth authorize endpoint.
- **Response (302 Found):** `Location: https://github.com/login/oauth/authorize?client_id=...&redirect_uri=...&scope=repo&state=...`

#### 9. GitHub OAuth: Callback & Token Exchange
- **Method / Path:** `GET /api/callback`
- **Query Parameters:** `?code=...&state=...`
- **Features:** Validates state cookie against query state (anti-CSRF); exchanges code for GitHub access token; verifies user profile against `ALLOWED_USERS` whitelist (fail-closed); delivers token to opener via postMessage handshake HTML bridge.
- **Response (200 OK):** HTML page with postMessage handshake.

---

### 4.3 Administrative Management Endpoints (Requires Active Session)

| Endpoint | Method | Payload / Query | Response Summary |
|:---|:---|:---|:---|
| `/api/admin/auth/change-password` | `POST` | `{ currentPassword, newPassword }` | Updates PBKDF2 hash, advances revocation epoch, invalidates existing sessions. |
| `/api/admin/auth/revoke-all` | `POST` | None | Advances revocation epoch for all users, globally invalidating all active sessions. |
| `/api/admin/enquiries` | `GET` | `?search=&status=&urgency=&page=1&limit=8` | Paginated and filtered consultation inquiries from database. |
| `/api/admin/enquiries/:id` | `PATCH` | `{ status: "contacted", followUpNotes: "..." }` | Updates enquiry record status in database. |
| `/api/admin/enquiries/:id` | `DELETE` | None | Permanently removes enquiry record from database. |
| `/api/admin/content/services-reorder` | `PUT` | `{ orderedIds: ["income-tax", "gst", ...] }` | Updates `display_order` for services catalog. |
| `/api/admin/content/services` | `POST` | Full `AdminService` object | Creates new practice area service. |
| `/api/admin/content/services/:id` | `PUT` | Updated service fields | Modifies existing service scope, SEO, or title. |
| `/api/admin/content/services/:id` | `DELETE` | None | Soft-deletes service (`deleted_at = NOW()`), archiving it to recovery store. |
| `/api/admin/content/services/:id/recover` | `POST` | None | Restores soft-deleted service (`deleted_at = NULL`). |
| `/api/admin/content/faqs-reorder` | `PUT` | `{ orderedIds: ["faq-1", "faq-2", ...] }` | Updates `display_order` for FAQs catalog. |
| `/api/admin/content/faqs` | `POST` | Full `AdminFaq` object | Creates new statutory FAQ. |
| `/api/admin/content/faqs/:id` | `PUT` | Updated FAQ fields | Modifies existing question, answer, or statute reference. |
| `/api/admin/content/faqs/:id` | `DELETE` | None | Soft-deletes FAQ (`deleted_at = NOW()`). |
| `/api/admin/content/faqs/:id/recover` | `POST` | None | Restores soft-deleted FAQ (`deleted_at = NULL`). |
| `/api/admin/content/posts/:slug` | `PUT` / `POST` | `AdminPost` object | Saves or updates article in `content_posts` database. |
| `/api/admin/content/posts/:slug` | `DELETE` | None | Soft-deletes article from database (`deleted_at = NOW()`). |
| `/api/admin/content/reset` | `POST` | None | Resets services, FAQs, and redirects to baseline. |
| `/api/admin/settings` | `PUT` | `SettingsOverrides` object | Updates chambers telephone, email, and location. |
| `/api/admin/settings/reset` | `POST` | None | Resets practice settings to statutory baseline. |

---

## 5. Client Integration Adapter Layer

To ensure complete compatibility with existing backend contracts, the frontend rebuild MUST interface through the established client adapters:

### 5.1 `src/context/FirmDataContext.tsx`
- **Hook:** `useFirmData() -> { data: FirmProfile, reload: () => void, isModified: boolean }`
- **Data Model:** Contains `data.contact`, `data.serviceCategories`, `data.faqs`, `data.partner`, `data.firmMilestones`.
- **Auto-Sync:** On mount, automatically calls `adminStorage.fetchContentRemote()` and `adminStorage.fetchSettingsRemote()`.
- **Reactive Updates:** Listens to `ka_firm_data_updated` custom event and `storage` event to update components across tabs without manual page reload.

### 5.2 `src/services/blogService.ts`
- **Methods:**
  - `BlogService.getAllPosts(false)`: Fetches strictly published articles.
  - `BlogService.getPostBySlug(slug, false)`: Fetches single published article, returning `undefined` if draft.
  - `BlogService.getRelatedPosts(slug, limit = 3)`: Returns related published articles based on common tags.
  - `BlogService.getAllTags()`: Returns all unique tags across published articles.
- **Draft Isolation:** Enforces zero-trust draft quarantine; unauthenticated visitors never receive drafts.

### 5.3 `src/services/adminStorage.ts`
- **Methods for Intake:** `adminStorage.recordEnquiryAsync(formData)` handles validation, server transmission, local caching, and Supabase cloud persistence.
- **Methods for Overrides:** `adminStorage.getContentOverrides()`, `adminStorage.saveService()`, `adminStorage.saveFaq()`.
- **Methods for Session:** `adminStorage.authenticateAsync()`, `adminStorage.getSession()`, `adminStorage.isAuthenticated()`, `adminStorage.logout()`, `adminStorage.changePassword()`.

### 5.4 `src/config/adminConfig.ts` & `AdminProtectedRoute.tsx`
- **Configurable Route Mount:** Admin portal mounts at `ADMIN_ROUTES.root` (`VITE_ADMIN_SECRET_PATH`) for operational noise reduction, while `/admin` and `/admin/*` serve 404. All access control is strictly enforced independently on the server via PBKDF2 authentication, cryptographic JWT validation, and Supabase RLS.
- **Protection:** All admin routes wrapped in `AdminProtectedRoute`, which verifies the HMAC-SHA256 session token against `/api/auth/session`.
