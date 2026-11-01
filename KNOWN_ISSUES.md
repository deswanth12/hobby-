# Kavitha & Associates — Known Issues & Client Confirmations

**Date:** November 1, 2026  
**Auditor:** Senior Software Engineer & QA Automation Lead  
**Branch:** `audit/r9-deep-bug-edge-case`  
**Application Target:** Kavitha & Associates Chartered Accountants  

---

## 1. Defect Status Summary

* **Open P0 (Critical - Security / Data Loss / Blocker):** **0**
* **Open P1 (Major - Core Feature Broken):** **0**
* **Open P2 (Important - Workaround Available):** **0**
* **Open P3 (Minor Usability / Visual Polish):** **0**

All 14 defects identified during the R9 deep audit have been 100% resolved and verified locally on branch `audit/r9-deep-bug-edge-case`. There are **zero open software defects**.

---

## 2. Pending Client Confirmations (Non-Invention of Business Rules)

In strict accordance with our development protocol, we **never invent business rules or client credentials**. The following items are documented for confirmation by CA Kavitha Vijay prior to or shortly after launch:

| Item # | Area | Current Implementation | Action Needed from Client | Impact if Unchanged |
| :--- | :--- | :--- | :--- | :--- |
| **CC-01** | **ICAI Membership Number** | The website displays CA Kavitha Vijay's certified credentials (B.Com, CA, CMA AIR 49) without a specific 6-digit ICAI membership number. | Confirm whether CA Kavitha Vijay wishes to display her 6-digit ICAI registration number in the footer colophon. | None. ICAI permits displaying qualifications and partner designation without requiring the registration number in web footers. |
| **CC-02** | **Secondary Desk Route Allocation** | The site features two active telephone lines: Primary (`+91 96263 50900`) and Alternative (`+91 95421 53906`). | Confirm if line 2 should be explicitly labeled (e.g., *"Direct Chambers / Senior Associate Line"* vs. *"Alternative Line"*). | Both lines are active and click-to-call enabled. |
| **CC-03** | **Cloud Database Credentials (Supabase)** | The platform functions fully in self-contained mode using local storage and server disk persistence. | If multi-device centralized cloud sync is desired across multiple chamber PCs, provide Supabase Project URL and Anon Key. | System operates with 100% functionality in local persistence mode. |
| **CC-04** | **Google Business Profile Review Link** | The Google Maps URL points to the registered chambers coordinates in Bairagi Patteda, Tirupati. | If a dedicated Google Business Profile review link (`https://g.page/r/.../review`) is established, it can be added to the contact page. | Standard Google Maps direction links are fully functional. |

---

## 3. Accepted Operational Trade-offs

1. **Velocity Spam Check Threshold (1.5 Seconds):**
   * *Behavior:* Form submissions completed in under 1.5 seconds from initial page load are rejected as automated bot spam.
   * *Justification:* Legitimate human users require more than 1.5 seconds to review and submit the consultation form. This safeguard prevents headless browser spam without requiring annoying CAPTCHA puzzles.
2. **Client-Side Storage Fallback:**
   * *Behavior:* When backend API connectivity is unavailable, inquiries are stored locally in browser storage and can be exported as CSV or messaged directly via WhatsApp.
   * *Justification:* Prevents prospective client data loss during unstable cellular network conditions in regional areas.
3. **Draft Article 404 Quarantine:**
   * *Behavior:* When an article is in `draft: true` status, direct navigation to its slug intentionally returns the standard 404 page.
   * *Justification:* Prevents accidental indexing by search engines or public leakage of unfinalized statutory commentary.

---

## 4. Conclusion

There are zero blocking bugs. The application is clean, compliant, and ready for production deployment upon client signoff.
