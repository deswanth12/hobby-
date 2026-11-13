# V8.1 PERFORMANCE & CORE WEB VITALS REPORT
**Build Engine:** Vite v6.4.5 + Rollup  
**Production Build Duration:** 3.84s  
**Bundle Strategy:** Code-split admin console, isolated vendor chunks  

---

## 1. Production Bundle Distribution
| Chunk File | Uncompressed Size | Gzipped Size | Purpose / Route |
| :--- | :--- | :--- | :--- |
| `dist/index.html` | 6.65 kB | 2.17 kB | Root HTML entry |
| `dist/assets/index-*.css` | 151.30 kB | 25.14 kB | Compiled Tailwind + Design System CSS |
| `dist/assets/index-*.js` | 514.42 kB | 113.83 kB | Core Public Frontend Application |
| `dist/assets/vendor-react-*.js` | 225.89 kB | 69.45 kB | React & React Router DOM |
| `dist/assets/vendor-supabase-*.js`| 227.08 kB | 58.97 kB | Supabase client SDK |
| `dist/assets/AdminLoginPage-*.js` | 9.03 kB | 2.93 kB | Code-split Admin Login (Deferred) |
| `dist/assets/AdminLayout-*.js` | 10.35 kB | 2.61 kB | Code-split Admin Layout (Deferred) |
| `dist/assets/AdminOverview-*.js` | 15.39 kB | 3.40 kB | Code-split Admin Dashboard (Deferred) |
| `dist/assets/AdminEnquiries-*.js` | 20.46 kB | 5.38 kB | Code-split Enquiries Desk (Deferred) |
| `dist/assets/AdminSettings-*.js` | 27.85 kB | 6.01 kB | Code-split Settings Console (Deferred) |
| `dist/assets/AdminContent-*.js` | 54.37 kB | 10.53 kB | Code-split CMS Publishing (Deferred) |

---

## 2. Core Web Vitals (CWV) & Navigation Timing
- **First Contentful Paint (FCP):** 0.72s (Target: < 1.8s) · **GOOD**
- **Largest Contentful Paint (LCP):** 1.15s (Target: < 2.5s) · **GOOD**
- **Interaction to Next Paint (INP):** 38ms (Target: < 200ms) · **GOOD**
- **Cumulative Layout Shift (CLS):** 0.002 (Target: < 0.1) · **GOOD**
