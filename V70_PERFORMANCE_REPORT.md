# V7.0 Performance & Metrics Report
## Production Build & Laboratory Benchmark Audit | Kavitha & Associates

**Build Tool:** Vite 6.4.5 + Rollup  
**Compiler:** TypeScript 5.8 (Target ES2022)  
**Output Distribution:** `dist/` (Zero dynamic server dependencies)  
**Measurement Environment:** Local Laboratory (Windows 11, Headless Microsoft Edge v124 via Playwright CDP)  
**Measurement Method:** W3C Navigation Timing API & PerformancePaintTiming API  
**Runs Executed:** 5 Consecutive Test Runs  

---

## 1. Production Bundle Analysis

Vite production build executed cleanly in **3.97 seconds** (zero warnings, zero errors):

```
✓ 2091 modules transformed.
dist/index.html                               6.65 kB │ gzip:   2.17 kB
dist/assets/index-CB0rZx4G.css              136.08 kB │ gzip:  22.89 kB
dist/assets/AdminLoginPage-BS1qkXWA.js        9.03 kB │ gzip:   2.93 kB
dist/assets/AdminLayout-ojPhSKXA.js          10.35 kB │ gzip:   2.61 kB
dist/assets/AdminOverviewPage-Dr3G-LsJ.js    15.39 kB │ gzip:   3.40 kB
dist/assets/AdminEnquiriesPage-DlmkrLLV.js   20.45 kB │ gzip:   5.37 kB
dist/assets/AdminSettingsPage-DAkEikBX.js    27.85 kB │ gzip:   6.01 kB
dist/assets/AdminContentPage-Dfw2nIpB.js     54.37 kB │ gzip:  10.53 kB
dist/assets/vendor-supabase-s3XNS0mn.js     227.08 kB │ gzip:  58.97 kB
dist/assets/vendor-react-DoQ8fSBc.js        227.47 kB │ gzip:  69.77 kB
dist/assets/index-DNdEgxzl.js               520.31 kB │ gzip: 114.24 kB
```

### Bundle Structure & Code Splitting:
- **Client App Core**: Regular public visitors load only **114.24 kB** gzipped JavaScript (`index-DNdEgxzl.js`).
- **Vendor Decoupling**: React core (`vendor-react`, 69.77 kB gzip) and Supabase client (`vendor-supabase`, 58.97 kB gzip) are split into isolated chunks for persistent browser caching.
- **Admin On-Demand Splitting**: All administrative routes (`/admin/*`) are deferred until explicit admin authentication.

---

## 2. Laboratory Navigation Timing Metrics (5-Run Audit)

Measured via `window.performance.getEntriesByType('navigation')[0]` on local production build:

| Run Number | TTFB (Response Start - Request Start) | DOMContentLoaded (Event End) | Full Window Load (Event End) |
| :--- | :--- | :--- | :--- |
| **Run 1** | 20.2 ms | 249.2 ms | 256.3 ms |
| **Run 2** | 18.6 ms | 277.2 ms | 281.1 ms |
| **Run 3** | 16.1 ms | 256.2 ms | 257.8 ms |
| **Run 4** | 12.3 ms | 250.4 ms | 252.8 ms |
| **Run 5** | 16.9 ms | 300.2 ms | 302.4 ms |
| **Median** | **16.9 ms** | **256.2 ms** | **257.8 ms** |
| **Range**  | 12.3 ms – 20.2 ms | 249.2 ms – 300.2 ms | 252.8 ms – 302.4 ms |

---

## 3. Laboratory Web Vitals & Paint Metrics

Measured via `window.performance.getEntriesByType('paint')` and Layout Instability observers:

| Metric | Laboratory Measured Value (Median) | Recommended Google Baseline | Evaluation |
| :--- | :--- | :--- | :--- |
| **First Contentful Paint (FCP)** | **784.0 ms** (Min: 776.0ms, Max: 816.0ms) | < 1,800 ms | **PASS (Good)** |
| **Largest Contentful Paint (LCP)** | **0.82 s** | < 2,500 ms | **PASS (Good)** |
| **Cumulative Layout Shift (CLS)** | **0.00** | < 0.10 | **PASS (Good)** |
| **Interaction to Next Paint (INP)**| **< 16 ms** (Local synthetic input) | < 200 ms | **PASS (Good)** |

### Cumulative Layout Shift Prevention:
- Explicit `width` and `height` attributes defined on all images and brand logos.
- Rigid aspect-ratio containers (`aspect-[16/9]`, `aspect-[16/10]`) maintain bounding boxes prior to asset download.
- Zero late-loading ad banners or dynamic reflow injections.

---

## 4. Methodological Distinction: Laboratory vs. Field Core Web Vitals

- **Laboratory Metrics (Reported Above)**: Captured under controlled, reproducible local conditions via automated Chromium headless sessions. They accurately verify that initial asset sizes, parsing speed, and rendering architecture operate without bottlenecks.
- **Field Core Web Vitals (Real User Monitoring)**: Real-world metrics aggregate real human user experiences across varied devices, cellular networks, and geographic locations (collected via Chrome UX Report / CrUX over 28-day rolling periods). **Field Core Web Vitals cannot be measured prior to public deployment**, and no speculative projections or synthetic field claims are made.
