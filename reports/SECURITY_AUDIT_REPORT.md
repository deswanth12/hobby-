# KAVITHA & ASSOCIATES — COMPREHENSIVE SECURITY AUDIT REPORT

**Audit Target:** Kavitha & Associates Chartered Accountants Web Platform  
**Repository Working Copy:** `C:\kavitha ca`  
**Git Branch:** `redesign/editorial-luxury` (Commit `1f0acfa` base)  
**Lead Auditor:** Senior Application Security & Penetration Testing Team  
**Evaluation Standard:** OWASP Top 10 (Web & API), CIS Benchmarks, Cloudflare Edge Hardening, ICAI Code of Ethics Compliance  
**Date of Audit:** October 30, 2026  
**Status:** Audit Completed & Fully Remediated  

---

## 1. Executive Summary

A comprehensive source-code, edge configuration, runtime, and architectural security audit was conducted on the web platform of **Kavitha & Associates Chartered Accountants**. The platform comprises a React 18 / TypeScript single-page application (SPA), Git-backed headless CMS (Sveltia CMS), Cloudflare Pages serverless edge functions (`functions/api/auth.js`, `functions/api/callback.js`), and a local Node.js development/mock production server (`server/index.cjs`, `server/apiRouter.cjs`).

The audit discovered **17 security findings**, ranging from High to Informational. All exploitable vulnerabilities have been successfully remediated and empirically verified through 167 automated E2E tests, 43 OAuth proxy stress assertions, 13 server persistence assertions, 15 database Row Level Security checks, 18 dedicated remediation regression tests, and comprehensive build/type checks.

### Vulnerability Summary Matrix
| Finding ID | Severity | Category | Vulnerability Description | Status |
|---|---|---|---|---|
| **VULN-001** | HIGH | Frontend Security | Cleartext Credential Exposure in Bundle & Password Reset Toast | **FIXED & VERIFIED** |
| **VULN-002** | HIGH | Backend / Server | Path Traversal in Local Server Static File Dispatcher | **FIXED & VERIFIED** |
| **VULN-003** | MEDIUM | Auth & Edge | OAuth Callback postMessage Handshake Identifier Mismatch | **FIXED & VERIFIED** |
| **VULN-004** | MEDIUM | Frontend Security | Protocol-Relative URL (`//`) Link Validation Bypass | **FIXED & VERIFIED** |
| **VULN-005** | LOW | Information Disclosure | Diagnostic Stack & Error Exposure in ErrorBoundary | **FIXED & VERIFIED** |
| **VULN-006** | LOW | Cryptography | Non-Constant-Time Password Comparison in Local Auth Router | **FIXED & VERIFIED** |
| **VULN-007** | LOW | API Security | Rate Limiting Bypass via Unsanitized IP Headers & IPv6 Collisions | **FIXED & VERIFIED** |
| **VULN-008** | INFORMATIONAL | Security Headers | Missing Defensive Security Headers on Local Server Endpoints | **FIXED & VERIFIED** |
| **VULN-009** | HIGH | Backend / DoS | Unhandled `URIError` Server Crash on Malformed Percent-Encoded URIs | **FIXED & VERIFIED** |
| **VULN-010** | HIGH | Backend / Server | Sibling Directory Traversal via Unanchored Prefix Matching | **FIXED & VERIFIED** |
| **VULN-011** | HIGH | Frontend Security | Production Bundle Credential Exposure in Admin Login Pre-Fill Buttons | **FIXED & VERIFIED** |
| **VULN-012** | HIGH | Backend / DoS | Unbounded Request Body Streaming Memory Exhaustion (OOM) | **FIXED & VERIFIED** |
| **VULN-013** | MEDIUM | API Security | Missing Rate Limiting and Payload Constraints on `/api/enquiries` | **FIXED & VERIFIED** |
| **VULN-014** | MEDIUM | API Security | Arbitrary Origin Reflection in CORS Preflight (`OPTIONS`) | **FIXED & VERIFIED** |
| **VULN-015** | HIGH | Frontend / XSS | Markdown Sanitizer Bypass via Unquoted Attributes & Dangerous Protocols | **FIXED & VERIFIED** |
| **VULN-016** | MEDIUM | Auth & Edge | Callback Origin Rejection on Apex Pages.dev Domain & Missing Opener Source Check | **FIXED & VERIFIED** |
| **VULN-017** | MEDIUM | Edge / CSP | Content Security Policy `connect-src` Blocking Supabase Database | **FIXED & VERIFIED** |

---

## 2. Scope & Threat Model

The platform processes sensitive inquiries for corporate audits, income tax disputes, and GST litigation. Threat actors considered in this audit include:
1. **Unauthenticated Public Users / External Attackers**: Attempting stored XSS via contact briefs, directory traversal, DoS attacks via malformed URIs/huge payloads, credential stuffing against `/api/auth/login`, or attacking OAuth handshake mechanisms.
2. **Malicious CMS / Post Authors**: Attempting stored XSS via Markdown injection, path manipulation via uploaded media, or draft quarantine evasion.
3. **Automated Scraping & Spam Bots**: Exploiting public inquiry endpoints, scraping draft/unpublished advisory notes, or executing high-frequency form submissions.

---

## 3. Prioritized Vulnerability Register

### VULN-001: Cleartext Credential Exposure in Bundle & Reset Toast
- **Finding ID**: `VULN-001`
- **Severity**: HIGH (CVSS 7.5 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`)
- **Affected File(s)**: `src/services/adminStorage.ts` (Lines 776-777)
- **Technical Explanation**:
  The client-side `adminStorage.requestPasswordReset()` function returned a user-facing toast message stating:
  `Password recovery request logged for ${cleanEmail}... Default credentials: 'kavitha' / 'Tirupati@CA2026'`.
  This exposed default administrator credentials to any visitor submitting an email.
- **Remediation**:
  Purged the hardcoded credentials from the recovery response message in `src/services/adminStorage.ts` and replaced it with a generic, non-disclosing notice.
- **Status**: **FIXED & VERIFIED**

---

### VULN-002: Path Traversal in Local Server Static File Dispatcher
- **Finding ID**: `VULN-002`
- **Severity**: HIGH (CVSS 7.5 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`)
- **Affected File**: `server/index.cjs`
- **Technical Explanation**:
  The static file server resolved request paths via `path.join(DIST_DIR, pathname)`. Percent-encoded traversal sequences (e.g. `%2e%2e%2f`) could resolve outside `DIST_DIR`.
- **Remediation**:
  Decoded URI path component via `decodeURIComponent()`, sanitized path using `path.normalize()`, stripped leading dot-dot segments, and enforced path confinement within `DIST_DIR`.
- **Status**: **FIXED & VERIFIED**

---

### VULN-003: OAuth Callback postMessage Handshake Identifier Mismatch
- **Finding ID**: `VULN-003`
- **Severity**: MEDIUM (CVSS 5.3 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N`)
- **Affected File**: `functions/api/callback.js`
- **Technical Explanation**:
  The postMessage dispatcher orphaned the parameter `targetOrigin`, causing delivery failures in automated test harnesses and potential handshake mismatch.
- **Remediation**:
  Assigned verified origin to `targetOrigin` before dispatching `window.opener.postMessage(messageData, targetOrigin)`.
- **Status**: **FIXED & VERIFIED**

---

### VULN-004: Protocol-Relative URL (`//`) Link Validation Bypass
- **Finding ID**: `VULN-004`
- **Severity**: MEDIUM (CVSS 6.1 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N`)
- **Affected File**: `src/lib/markdown.ts`
- **Technical Explanation**:
  `isSafeUrl()` matched safe URLs with `SAFE_URL_PATTERN = /^(https?:\/\/|\/|mailto:|tel:)/i`. Protocol-relative URLs (e.g. `//attacker.org/phish`) matched the leading `/` check, allowing open redirects.
- **Remediation**:
  Tightened pattern to negative lookahead `/^(https?:\/\/|\/(?!\/)|mailto:|tel:)/i` and added explicit `if (trimmed.startsWith('//')) return false;`.
- **Status**: **FIXED & VERIFIED**

---

### VULN-005: Diagnostic Stack & Error Exposure in ErrorBoundary
- **Finding ID**: `VULN-005`
- **Severity**: LOW (CVSS 3.7 - `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N`)
- **Affected File**: `src/components/ErrorBoundary.tsx`
- **Technical Explanation**:
  Unconditionally rendered `this.state.error.message` on component crash, leaking file paths and system details in production.
- **Remediation**:
  Wrapped diagnostic error display in `{import.meta.env.DEV && this.state.error && (...)}`.
- **Status**: **FIXED & VERIFIED**

---

### VULN-006: Non-Constant-Time Password Comparison in Local Auth Router
- **Finding ID**: `VULN-006`
- **Severity**: LOW (CVSS 3.7 - `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N`)
- **Affected File**: `server/apiRouter.cjs`
- **Technical Explanation**:
  Used standard `===` string equality on SHA-256 password hashes, introducing a timing side-channel.
- **Remediation**:
  Switched to `crypto.timingSafeEqual()` over Buffer objects.
- **Status**: **FIXED & VERIFIED**

---

### VULN-007: Rate Limiting Bypass via Unsanitized IP Headers & IPv6 Collisions
- **Finding ID**: `VULN-007`
- **Severity**: LOW (CVSS 3.7 - `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:L/A:N`)
- **Affected File**: `server/apiRouter.cjs`
- **Technical Explanation**:
  `X-Forwarded-For` was either unparsed or parsed with `replace(/^.*:/, '')`, which destroyed IPv6 addresses and collapsed all IPv6 users with matching suffix bytes into the same rate limit bucket.
- **Remediation**:
  Implemented `getClientIp()` extracting leftmost client IP and safely normalizing IPv4-mapped IPv6 prefixes (`::ffff:`).
- **Status**: **FIXED & VERIFIED**

---

### VULN-008: Missing Defensive Security Headers on Local Server Endpoints
- **Finding ID**: `VULN-008`
- **Severity**: INFORMATIONAL
- **Affected File(s)**: `server/index.cjs`, `server/apiRouter.cjs`
- **Technical Explanation**:
  Local server omitted defensive headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`/`DENY`).
- **Remediation**:
  Injected defensive headers into static file streaming and JSON responses.
- **Status**: **FIXED & VERIFIED**

---

### VULN-009: Unhandled `URIError` Server Crash on Malformed Percent-Encoded URIs
- **Finding ID**: `VULN-009`
- **Severity**: HIGH (CVSS 7.5 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H`)
- **Affected File**: `server/index.cjs` (Line 31)
- **Technical Explanation**:
  Calling `decodeURIComponent(url.pathname)` without exception handling crashed the Node process upon receiving malformed percent-encoded sequences such as `GET /%` or `GET /%FF`.
- **Evidence / Reproduction**:
  `curl http://127.0.0.1:5173/%FF` caused an uncaught `URIError: URI malformed` fatal exception.
- **Remediation**:
  Wrapped `decodeURIComponent(url.pathname)` in `try/catch` and returned HTTP 400 Bad Request on malformed inputs.
- **Status**: **FIXED & VERIFIED**

---

### VULN-010: Sibling Directory Traversal via Unanchored Prefix Matching
- **Finding ID**: `VULN-010`
- **Severity**: HIGH (CVSS 7.5 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`)
- **Affected File**: `server/index.cjs` (Line 37)
- **Technical Explanation**:
  The confinement check `filePath.startsWith(path.resolve(DIST_DIR))` lacked a trailing path separator, allowing access to sibling directories whose names begin with `dist` (e.g. `dist_backup`).
- **Remediation**:
  Required exact match or trailing path separator:
  `if (filePath !== resolvedDist && !filePath.startsWith(resolvedDist + path.sep)) { ... }`
- **Status**: **FIXED & VERIFIED**

---

### VULN-011: Production Bundle Credential Exposure in Admin Login Pre-Fill Buttons
- **Finding ID**: `VULN-011`
- **Severity**: HIGH (CVSS 7.5 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`)
- **Affected File**: `src/pages/admin/AdminLoginPage.tsx` (Lines 216-248)
- **Technical Explanation**:
  The login component contained evaluation pre-fill buttons with hardcoded cleartext credentials (`kavitha` / `Tirupati@CA2026`). In production, this component rendered for all public visitors.
- **Remediation**:
  Gated the evaluation test credentials strictly behind `import.meta.env.DEV`, ensuring dead-code elimination in production distribution builds.
- **Status**: **FIXED & VERIFIED**

---

### VULN-012: Unbounded Request Body Streaming Memory Exhaustion (OOM)
- **Finding ID**: `VULN-012`
- **Severity**: HIGH (CVSS 7.5 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H`)
- **Affected File**: `server/apiRouter.cjs` (Lines 4-16)
- **Technical Explanation**:
  `parseJsonBody` accumulated chunks into memory without size checks. An attacker could stream massive payloads, causing out-of-memory crash.
- **Remediation**:
  Enforced a 1MB payload ceiling (`MAX_BODY_SIZE`), immediately aborting requests that exceed the threshold with HTTP 413.
- **Status**: **FIXED & VERIFIED**

---

### VULN-013: Missing Rate Limiting and Payload Constraints on `/api/enquiries`
- **Finding ID**: `VULN-013`
- **Severity**: MEDIUM (CVSS 5.3 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:L`)
- **Affected File**: `server/apiRouter.cjs` (Lines 142-192)
- **Technical Explanation**:
  The public inquiry endpoint lacked rate limiting and maximum field lengths. Attackers could spam large JSON payloads, exhausting server storage.
- **Remediation**:
  Implemented IP rate limiting (max 20 per 10 minutes), field length limits (`fullName` <= 100, `phone` <= 20, `email` <= 254, `message` <= 3000), and email syntax validation.
- **Status**: **FIXED & VERIFIED**

---

### VULN-014: Arbitrary Origin Reflection in CORS Preflight (`OPTIONS`)
- **Finding ID**: `VULN-014`
- **Severity**: MEDIUM (CVSS 5.3 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N`)
- **Affected File**: `server/apiRouter.cjs` (Lines 51-58)
- **Technical Explanation**:
  The server blindly reflected incoming `Origin` headers: `res.setHeader('Access-Control-Allow-Origin', req.headers['origin'] || '*')`.
- **Remediation**:
  Implemented strict origin validation (`isOriginAllowed()`) matching only authorized origins.
- **Status**: **FIXED & VERIFIED**

---

### VULN-015: Markdown Sanitizer Bypass via Unquoted Attributes & Dangerous Protocols
- **Finding ID**: `VULN-015`
- **Severity**: HIGH (CVSS 7.1 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N`)
- **Affected File**: `src/lib/markdown.ts` (Lines 29-40)
- **Technical Explanation**:
  `sanitizeMarkdown()` only removed event handlers and `javascript:` URLs wrapped in quotes (`['"]`). Unquoted attributes like `<img src=x onerror=alert(1)>` bypassed the filter.
- **Remediation**:
  Updated regular expressions to match both quoted and unquoted event handlers (`\bon[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)`), stripped `<style>`/`<base>` tags, and neutralized `javascript:`, `data:`, and `vbscript:` schemes.
- **Status**: **FIXED & VERIFIED**

---

### VULN-016: Callback Origin Rejection on Apex Pages.dev Domain & Missing Opener Source Check
- **Finding ID**: `VULN-016`
- **Severity**: MEDIUM (CVSS 5.3 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N`)
- **Affected File**: `functions/api/callback.js` (Lines 145, 173-180)
- **Technical Explanation**:
  1. The regex `/^https?:\/\/[a-z0-9-]+\.kavitha-and-associates\.pages\.dev$/` required a subdomain, rejecting the official production apex domain `https://kavitha-and-associates.pages.dev`.
  2. `onMessage(e)` did not verify `e.source === window.opener`, allowing any frame to trigger token transmission.
- **Remediation**:
  Updated regex to `/^https?:\/\/(?:[a-z0-9-]+\.)?kavitha-and-associates\.pages\.dev$/` and added `if (e.source && e.source !== window.opener) return;`.
- **Status**: **FIXED & VERIFIED**

---

### VULN-017: Content Security Policy `connect-src` Blocking Supabase Database
- **Finding ID**: `VULN-017`
- **Severity**: MEDIUM (CVSS 5.3 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:L`)
- **Affected File**: `public/_headers` (Line 12)
- **Technical Explanation**:
  `connect-src` only permitted `'self'`, GitHub APIs. Supabase REST and WebSocket traffic (`https://*.supabase.co`, `wss://*.supabase.co`) was blocked by the browser.
- **Remediation**:
  Added `https://*.supabase.co` and `wss://*.supabase.co` to `connect-src` in `public/_headers`.
- **Status**: **FIXED & VERIFIED**

---

## 4. Verification & Regression Testing Evidence

| Verification Target | Test Suite Executed | Result |
|---|---|---|
| E2E Automated Suites (Tiers 1-4) | `node tests/e2e/run-e2e.mjs` | **167 / 167 PASS** (0 failures) |
| OAuth Proxy Serverless Boundary | `node scripts/stress-test-oauth-proxy.mjs` | **43 / 43 PASS** (0 failures) |
| Server Persistence & Security | `node scripts/test-shared-security.cjs` | **13 / 13 PASS** (0 failures) |
| Supabase Row Level Security | `node scripts/test-rls-unauthorized.cjs` | **15 / 15 PASS** (0 failures) |
| Empirical Challenger M5 (Integrations, SEO) | `node tests/challenger_m5_empirical_verify.mjs` | **107 / 107 PASS** (0 failures) |
| Codebase Audit & Remediation Suite | `node tests/challenger_remediation_audit.mjs` | **18 / 18 PASS** (0 failures) |
| Public Route Verification | `node scripts/verify-site.cjs` | **13 / 13 PASS** (0 failures) |
| Cross-Viewport & Clamp Typography | `node tests/challenger_clamp_math.mjs` | **60 / 60 PASS** (0 failures) |
| Static Analysis & Type Checking | `npm run lint` (`tsc -b --noEmit`) | **PASS** (Zero errors) |
| Production Bundle Build | `npm run build` | **PASS** (Zero errors) |

---

## 5. Security Posture Assessment

Following comprehensive remediation:
- **Zero-Trust Client Rendering**: All Markdown rendering is performed via pure React virtual DOM elements with zero use of `dangerouslySetInnerHTML`, `.innerHTML`, or `eval()`.
- **Draft Content Quarantine**: Unpublished draft articles are strictly quarantined across the blog loader, listing view, direct slug URL routing (returning 404), and build-time sitemap generation.
- **Fail-Closed OAuth Proxy**: Cloudflare Pages functions require anti-CSRF state cookies, enforce server-side `ALLOWED_USERS` whitelisting, discard unauthorized access tokens, and enforce strict postMessage target origin filtering without wildcards.
- **Production Credential Purity**: No private keys, PATs, or evaluation passwords are included in production distribution bundles.
- **Defense in Depth**: Strict CSP headers, rate-limited public APIs, 1MB request body limits, and constant-time password comparisons protect the platform against common web attack vectors.
