# V6.1 Application Security, Authentication & Infrastructure Audit
## Kavitha & Associates Chartered Accountants
**Audit Scope:** Public Client Application, Administrative Console Routing, Serverless OAuth Proxy, and Security Headers  
**Standards Referenced:** OWASP Top 10 (2021), CIS Benchmark Guidelines, Cloudflare Security Standards  
**Date of Audit:** November 4, 2026  
**Status:** Complete Security Evaluation & Threat Model Verification  

---

## 1. Executive Summary: Threat Model & Security Posture

The V6.0 application demonstrates a sound, defense-in-depth security architecture. A critical distinction is made between **route obscurity** and **cryptographic authentication**:
- **Route Obscurity:** The secret administrative route `/sec-ca-50e0e5eed471` is treated as a reconnaissance-reduction mechanism, **not** an authentication boundary.
- **Authentication:** Direct client-side password verification is disabled in the production bundle. Authentication is delegated to server-side cryptographic endpoints (`/api/auth`, `/api/callback` or Supabase Auth).
- **Transport & Frame Security:** Strict HSTS (`max-age=31536000`), `X-Frame-Options: SAMEORIGIN`, and `X-Content-Type-Options: nosniff` are applied across all production responses.

### 1.1 Security Matrix & Conformance Assessment

| Security Control | Implementation Mechanism | Threat Mitigated | Audit Status | Residual Risk / Action |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Route Obscurity** | `adminConfig.ts` with 12+ char entropy | Automated bot crawlers & vulnerability scrapers | **PASS** | Never treat route as auth secret. |
| **Administrative Auth** | Server-side OAuth + Supabase session | Unauthorized CMS modifications & data tampering | **PASS** | Client-side password auth is disabled. |
| **CSRF Defense** | 24-byte crypto random state in HttpOnly cookie | Cross-Site Request Forgery in OAuth callbacks | **PASS** | 10-minute expiry strictly enforced. |
| **Authorization Whitelist** | Server-side `ALLOWED_USERS` check | Unauthorized valid GitHub accounts gaining CMS access | **PASS** | Fails closed if env var is empty. |
| **PostMessage Channel** | Strict origin validation (`isOriginAllowed`) | Cross-window token interception by rogue iframes | **PASS** | Wildcard `*` targetOrigin is prohibited. |
| **Clickjacking** | `X-Frame-Options: SAMEORIGIN` & CSP `frame-ancestors` | UI redressing / iframe clickjacking | **PASS** | Header present in `_headers` and `vercel.json`. |
| **MIME Sniffing** | `X-Content-Type-Options: nosniff` | Drive-by executable payload execution | **PASS** | Header present across all routes. |
| **Content Security Policy** | Strict CSP header in deployment configs | Cross-Site Scripting (XSS) | **QUALIFIED** | Contains `'unsafe-inline'` and CDN domains. |
| **PII Data Minimization** | Zero PAN / Aadhaar collection policy | Data breach liability under DPDP Act 2023 | **PASS** | Explicit notice in ContactForm. |
| **Spam & Flooding** | Honeypot field (`#website_fax_hp`) + Velocity limits | Automated contact form spam bots | **PASS** | Validated in form pipeline. |

---

## 2. In-Depth Analysis: Administrative Portal Security Architecture

### 2.1 The Myth of "Security by Obscurity" Addressed
* **Observation:** The administrative console is mounted at an unadvertised URL path: `/sec-ca-50e0e5eed471`.
* **Security Evaluation:**
  - In earlier iterations, hidden URLs were casually referred to as "secure secret portals".
  - In V6.0, `src/config/adminConfig.ts` formally establishes the architectural boundary:
    ```typescript
    /**
     * Architectural boundary: VITE_ADMIN_SECRET_PATH is public client-side routing config.
     * It is NEVER treated as an authentication secret. Real security is enforced via
     * server-side cryptographic authentication and session authorization.
     */
    ```
  - Because `VITE_ADMIN_SECRET_PATH` is bundled into the client-side JavaScript, any determined attacker inspecting the client bundle can discover the route string. Therefore, the route string alone affords **zero security**.
  - **Verdict:** The implementation correctly treats this as route obscurity to reduce bot noise, while enforcing authentication at `AdminProtectedRoute.tsx`.

### 2.2 Client-Side Authentication Hardening
* **Inspection of `src/services/adminStorage.ts` (Lines 1213–1219):**
  ```typescript
  authenticate(_username: string, _password: string): { success: boolean; error?: string; session?: AdminSession } {
    // Direct client-side authentication is strictly disabled across all environments to prevent credential leakage in bundle
    return {
      success: false,
      error: 'Direct client-side authentication is disabled. Authentication must be verified securely via server-side endpoints.'
    };
  }
  ```
* **Evaluation:** Earlier patterns that compared plain-text passwords in local storage or client JavaScript have been permanently eradicated. Calls to `authenticate()` fail immediately. All authentication must occur via `authenticateAsync()`, which dispatches to serverless endpoints or Supabase auth.

### 2.3 Test Session Quarantine (`createDevSession`)
* **Inspection of `src/services/adminStorage.ts` (Lines 1221–1239):**
  ```typescript
  createDevSession(): AdminSession | null {
    if (!import.meta.env.DEV) return null;
    const session: AdminSession = { ... };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }
  ```
* **Evaluation:** Headless QA test parameters (e.g. `?qa_auth=true`) are guarded by `import.meta.env.DEV`. In a production build (`vite build`), `import.meta.env.DEV` is compiled to `false`, causing Rollup tree-shaking to eliminate the branch or immediately return `null`. The dev backdoor **cannot be triggered in production**.

---

## 3. Serverless GitHub OAuth Proxy Security (`functions/api/`)

The CMS utilizes Cloudflare Pages Functions (`functions/api/auth.js` and `functions/api/callback.js`) to authenticate editorial staff.

### 3.1 Anti-CSRF Protection Flow
1. Staff member initiates login at `/sec-ca-50e0e5eed471/login`.
2. Browser issues GET to `/api/auth?provider=github`.
3. Server generates 24 cryptographically random bytes via Web Crypto API:
   ```javascript
   const stateBytes = new Uint8Array(24);
   crypto.getRandomValues(stateBytes);
   const state = Array.from(stateBytes, b => b.toString(16).padStart(2, '0')).join('');
   ```
4. Server sets an HTTP response header:
   ```http
   Set-Cookie: ka_oauth_state=<state>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600
   ```
5. User is redirected to `https://github.com/login/oauth/authorize?state=<state>`.
6. Upon return to `/api/callback`, the function validates that `url.searchParams.get('state') === cookies['ka_oauth_state']`. If mismatched or absent, the request is aborted with HTTP 403.
* **Verdict:** Robust state validation protects against OAuth Login CSRF.

### 3.2 Server-Side Token Exchange & Authorization Whitelist
- The GitHub client secret (`GITHUB_CLIENT_SECRET`) is stored strictly in Cloudflare server environment variables and is never exposed to the client.
- The server exchanges the authorization code directly with GitHub via server-to-server POST.
- The authenticated GitHub user profile is queried (`GET https://api.github.com/user`).
- **Fail-Closed Authorization Whitelist:**
  ```javascript
  const rawAllowed = env.ALLOWED_USERS || '';
  if (!rawAllowed.trim()) {
    return renderResponse(403, 'error', 'Access Denied: ALLOWED_USERS whitelist is not configured on server (fail-closed).');
  }
  if (!allowedList.includes(username)) {
    return renderResponse(403, 'error', `Access Denied: Account '${username}' is not authorized...`);
  }
  ```
  If `ALLOWED_USERS` is missing or empty, all access is denied. Any authenticated GitHub user not explicitly on the list receives HTTP 403.

### 3.3 PostMessage Token Delivery Hardening
- In `functions/api/callback.js` (Lines 133–158), the postMessage bridge delivers the token to the parent window opener.
- **Wildcard Prohibition:** The recipient target origin is strictly checked against a whitelist (`isOriginAllowed`):
  `['https://kavithaassociates.com', 'https://www.kavithaassociates.com', localhost]`.
- Delivering tokens to targetOrigin `'*'` is forbidden, preventing malicious third-party embeds or rogue windows from eavesdropping on the token.

---

## 4. HTTP Security Headers & Content Security Policy (CSP)

### 4.1 Deployed Security Headers
Configured identically in `public/_headers` (Cloudflare Pages) and `vercel.json` (Vercel):

```http
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 4.2 Content Security Policy (CSP) Evaluation
* **Active Policy:**
  ```text
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https://raw.githubusercontent.com https://avatars.githubusercontent.com https://*.google.com https://*.googleapis.com https://*.gstatic.com;
  connect-src 'self' https://api.github.com https://github.com https://*.supabase.co wss://*.supabase.co;
  frame-src 'self' https://www.google.com https://maps.google.com;
  frame-ancestors 'self';
  worker-src 'self' blob:;
  child-src 'self' blob:;
  ```

* **Vulnerabilities & Hardening Observations:**
  1. `'unsafe-inline'` in `script-src`:
     - Allows inline `<script>` tags, which diminishes protection against stored or reflected XSS attacks.
     - *Justification:* Used by Vite development and certain dynamic hydration mechanisms.
     - *Recommendation:* Transition in a future sprint to cryptographic script nonces (`'nonce-...'`) or sha256 hashes.
  2. Public CDNs in `script-src` (`https://unpkg.com https://cdn.jsdelivr.net`):
     - External script CDNs allow attackers who can execute JSONP or abuse known hosting gadgets to bypass CSP.
     - *Recommendation:* All runtime vendor packages are already bundled into `dist/assets/vendor-*.js`. These external CDN script sources should be removed from `script-src` in production.

---

## 5. Client Data Privacy & PII Handling (DPDP Act 2023 Conformance)

### 5.1 Zero-PII Ingestion Architecture
* Under the Indian **Digital Personal Data Protection Act, 2023 (DPDP Act)**, storing and processing sensitive financial identifiers (such as Permanent Account Number - PAN, Aadhaar, or financial balance sheets) imposes stringent statutory data fiduciary obligations.
* **Implementation Audit (`ContactForm.tsx`):**
  - The contact form collects solely basic contact fields:
    * Full Name
    * Corporate Email
    * Telephone Number
    * Primary Consultation Area
    * High-Level Narrative Message
  - An explicit advisory notice is displayed before the submit button:
    > *"We do not solicit or store PAN, Aadhaar numbers, or financial files through this website."*
  - The form formats the inquiry and offers direct routing to the partner's verified WhatsApp business channel or phone, eliminating the storage of sensitive financial records on intermediate cloud databases. **Status: PASS**.

### 5.2 Anti-Spam & Flooding Protection
* **Honeypot Trap:**
  - A hidden input `#website_fax_hp` is embedded:
    ```html
    <input id="website_fax_hp" name="website_fax" type="text" tabindex="-1" aria-hidden="true" style="position: absolute; left: -9999px; opacity: 0;" />
    ```
  - Legitimate human users never encounter or fill this field. Automated spam scripts scanning HTML forms invariably populate all fields. If `#website_fax_hp` contains any value upon submission, the form silently drops the request without triggering notifications.
* **Submission Velocity Throttling:**
  - Submissions are timestamp-checked to prevent rapid automated form spam.

---

## 6. Summary of Security Recommendations

1. **CSP Hardening:** Remove `https://unpkg.com` and `https://cdn.jsdelivr.net` from `script-src` in `public/_headers` and `vercel.json` since all production dependencies are locally bundled.
2. **Environment Variable Configuration:** Ensure `ALLOWED_USERS`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET` are securely stored in Cloudflare / Vercel dashboard environment secrets before launching the admin console.
3. **Session Timeout:** Verify that `sessionStorage` sessions automatically invalidate after 60 minutes of inactivity.
