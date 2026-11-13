# KAVITHA & ASSOCIATES — RAG IMPLEMENTATION CHANGELOG
## Complete File Manifest, Integration Touchpoints & Configuration History

**Release Baseline:** V8.2 + Botanical Ledger Visual Enrichment + RAG Assistant  
**Date:** November 11, 2026  
**Status:** IMPLEMENTATION COMPLETE & VERIFIED  

---

### 1. New Backend Files (`server/assistant/`)

1. **`server/assistant/knowledgeRegistry.cjs`**
   - Authoritative catalog of 13 approved public sources.
   - Enforces explicit exclusion and quarantine of draft articles (`internal-audit-best-practices.md`).
2. **`server/assistant/embeddingService.cjs`**
   - 384-dimensional normalized vector generator using character n-gram hashing and cosine distance math.
3. **`server/assistant/knowledgeIngestionService.cjs`**
   - Build-time and runtime knowledge chunker producing `data/assistant_knowledge_index.json` (30 chunks, 0 drafts).
4. **`server/assistant/conversationValidator.cjs`**
   - Input length clamp (500 chars), HTML tag stripping, prompt injection heuristics, and PAN/Aadhaar PII filters.
5. **`server/assistant/assistantRateLimiter.cjs`**
   - Sliding-window in-memory IP rate limiter (20 requests / rolling minute).
6. **`server/assistant/retrievalService.cjs`**
   - Hybrid semantic (0.45) + lexical BM25 (0.55) retriever with 0.20 relevance cutoff threshold.
7. **`server/assistant/sourceCitationService.cjs`**
   - Internal canonical relative link generator formatting verified citations.
8. **`server/assistant/generationService.cjs`**
   - System prompt enforcement and post-generation safety sanitization.
9. **`server/assistant/providers/localProvider.cjs`**
   - Zero-cost, template-grounded synthesis provider running on local Node.js process.
10. **`server/assistant/providers/geminiProvider.cjs`**
    - Google Gemini 1.5 Flash adapter for optional cloud synthesis.
11. **`server/assistant/providers/openaiProvider.cjs`**
    - OpenAI GPT-4o-mini adapter for optional cloud synthesis.
12. **`server/assistant/assistantService.cjs`**
    - Core orchestrator linking validator, rate limiter, retriever, and synthesizer.
13. **`server/assistant/assistantController.cjs`**
    - HTTP endpoint handlers for `POST /api/public/assistant/chat`, `GET /api/public/assistant/status`, and `POST /api/admin/assistant/reindex`.

---

### 2. New Frontend Components (`src/v8/components/assistant/`)

1. **`AssistantTypingIndicator.tsx`**
   - Animated Botanical Ledger typing pulse with bronze accents.
2. **`SourceCitation.tsx`**
   - Clickable badge pills routing visitors to verified pages without reload.
3. **`SuggestedQuestions.tsx`**
   - Quick-action suggestion pills for fast inquiries (Services, Credentials, Chambers, Appointments).
4. **`AssistantDisclaimer.tsx`**
   - Statutory notice confirming assistant provides informational guidance only and not formal tax advice.
5. **`AssistantMessage.tsx`**
   - Markdown-aware message bubbles styled with Evergreen and Warm Ivory tokens.
6. **`AssistantInput.tsx`**
   - Accessible text input with character counter, send button, and keyboard shortcuts (`Enter` / `Esc`).
7. **`AssistantPanel.tsx`**
   - Full-featured conversational dialog box featuring Botanical Ledger header, official CA India emblem, message stream, and disclaimer.
8. **`AssistantLauncher.tsx`**
   - Floating action button pill (`Ask about our firm`) docked cleanly above the WhatsApp floating trigger.
9. **`FirmAssistantWidget.tsx`**
   - Top-level wrapper managing state, open/close transitions, and accessibility focus traps.
10. **`index.ts`**
    - Barrel export for assistant components.

---

### 3. Modified Existing Files

1. **`server/apiRouter.cjs`**
   - Registered `/api/public/assistant/chat`, `/api/public/assistant/status`, and `/api/admin/assistant/reindex`.
2. **`vite.config.ts`**
   - Updated custom API middleware to clear `require.cache` for `/server/` files during live development.
3. **`src/v8/components/layout/PublicLayout.tsx`**
   - Mounted `<FirmAssistantWidget />` globally across all public routes.
4. **`src/v8/components/about/LeadershipProfile.tsx`**
   - Upgraded partner portrait to resilient `<picture>` tag loading `ca-kavitha-vijay-official.webp` and `ca-kavitha-vijay-official.jpg`.
   - Embedded official CA India emblem in the practicing credential badge.
   - Cleaned up image error handling to prevent unwanted fallback triggers.
5. **`src/v8/pages/LeadershipPage.tsx`**
   - Upgraded partner portrait to `<picture>` element with WebP and JPEG sources.
6. **`src/v8/components/common/CrestMonogram.tsx`**
   - Upgraded compact variant to `<picture>` tag serving `ca-india-logo.webp` and `ca-india-logo.png`.

---

### 4. Test Suite Additions

1. **`tests/v8-assistant-rag.test.mjs`**
   - Complete 6-suite verification harness containing the 50-question golden evaluation set.
2. **`tests/test-about-preview.mjs`**
   - Headless Edge CDP script validating `/about` image render and capturing verified screenshot.
3. **`tests/test-leadership-preview.mjs`**
   - Headless Edge CDP script validating `/leadership` image render and capturing verified screenshot.
