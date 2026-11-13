# RAG Architecture Discovery & Systems Audit

**Project:** Kavitha & Associates, Chartered Accountants  
**Date:** November 10, 2026  
**Auditor:** Senior Software Architect & Security Lead  
**Baseline Version:** V8.2 + Botanical Ledger Visual Enrichment  
**Scope:** Architectural Audit for RAG-Powered Firm Information Assistant  

---

## 1. Executive Summary

This architecture audit establishes the exact runtime environment, backend mechanics, database status, and content access layers of the Kavitha & Associates portal. 

The audit confirms that the portal operates on a hybrid architecture:
1. **Frontend:** React 18 SPA built with Vite, TypeScript, Tailwind CSS, and strict Botanical Ledger tokens.
2. **Backend:** Pure Node.js HTTP server (`server/index.cjs` / `server/apiRouter.cjs`) handling `/api/*` routes in production, and simultaneously mounted as live middleware in `vite.config.ts` for local development.
3. **Data Persistence:** Local JSON persistence mode (`data/practice_db.json` / `server/db.cjs` / `durableStorage.cjs`) with fallback support for remote Supabase PostgreSQL.
4. **Current RAG / Vector State:** **Zero** existing vector embeddings, **no** pgvector extension enabled, and **no** semantic search mechanisms currently in place.

---

## 2. Detailed Technical Audit Findings

### Question 1: Which backend currently handles API requests?
- **Finding:** A lightweight, pure Node.js server (`server/index.cjs`) using `http.createServer()` with zero external server framework dependencies (no Express).
- **Request Dispatcher:** `server/apiRouter.cjs` exports `handleApiRequest(req, res)`.
- **Development Integration:** `vite.config.ts` intercepts `/api/*` requests in development via Vite server middleware, executing `server/apiRouter.cjs` directly with cache busting.
- **Suitability:** Highly suitable for mounting a modular server-side assistant endpoint (`POST /api/public/assistant/chat`).

### Question 2: How does the existing CMS expose published content?
- **Finding:** The CMS content is distributed across three unified layers:
  1. `data/practice_db.json`: Stores services, FAQs, settings, and enquiries.
  2. `src/data/firmData.ts`: Holds verified immutable firm baseline credentials, partner profile, and corridor footprints.
  3. `src/services/blogService.ts`: Manages regulatory articles stored as Markdown in `content/posts/`.
- **Draft Quarantine:** Strict triple-layer draft quarantine is active. For example, `internal-audit-best-practices` is marked `draft: true` and is strictly quarantined from public retrieval.
- **Suitability:** Knowledge ingestion must read directly from verified published sources only (`draft === false && status === 'published' && !deletedAt`).

### Question 3: Is Supabase already configured?
- **Finding:** Supabase client bindings exist in `@supabase/supabase-js`, and migrations exist under `supabase/migrations/`.
- **Current Runtime Status:** `.env` does **not** contain live Supabase keys (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are unset or commented). The system executes in **Local Persistence Mode**, falling back securely to `data/practice_db.json`.

### Question 4: Is pgvector available and enabled?
- **Finding:** **No.** Inspection of `supabase/schema.sql` and migrations confirms `pgvector` (`CREATE EXTENSION IF NOT EXISTS vector;`) is **not enabled**.
- **Constraint Compliance:** Per Section 3 and 8 database change restrictions, schema migrations require explicit proposal, security review, and client authorization. Therefore, Phase 1 must implement a modular vector search provider with an in-memory / local vector index that requires **zero** unauthorized database schema changes.

### Question 5: Are embeddings or semantic search already implemented?
- **Finding:** **No.** The existing codebase only performs substring filtering and tag matching. No vector embeddings, chunking pipelines, or semantic similarity engines exist.

### Question 6: Is there an existing secure API endpoint suitable for AI integration?
- **Finding:** **Yes.** `server/apiRouter.cjs` already implements:
  - Strict Origin Allowlist (`isOriginAllowed` verifying canonical domains and localhost).
  - Client IP extraction (`getClientIp` handling `cf-connecting-ip` and reverse proxies).
  - Rate limiting (`checkRateLimit`).
  - Request body limits (`MAX_BODY_SIZE = 1MB`).
  - Output sanitization and secure headers (`CSP`, `X-Content-Type-Options`, `X-Frame-Options`).
- **Endpoint Route:** `POST /api/public/assistant/chat` can be cleanly integrated into `apiRouter.cjs`.

### Question 7: What is the current deployment environment?
- **Finding:** Primary production targets are Cloudflare Pages (static SPA build) and Vercel/Node.js serverless functions.
- **Execution Constraints:** Serverless execution requires bounded timeouts (< 10 seconds), zero long-running daemon dependencies, and bounded memory footprints.

### Question 8: Which AI providers are compatible with the architecture?
- **Finding:** Any provider offering server-side REST APIs callable via Node.js native `fetch` / `https`:
  1. **Google Gemini API** (`gemini-1.5-flash` / `gemini-2.0-flash` with `text-embedding-004`).
  2. **OpenAI / OpenRouter API** (`gpt-4o-mini` with `text-embedding-3-small`).
  3. **Local Deterministic Fallback Engine:** Pure JavaScript BM25 lexical matcher + semantic cosine-similarity reranker operating over pre-computed embeddings or high-entropy semantic vectors, requiring zero external API keys and guaranteeing 100% test reliability offline.

---

## 3. Database Change Restriction & Migration Proposal

In compliance with the project guidelines:
> *"Do not modify production data or database schemas without explicit approval. Do not silently create a new external database or paid service."*

### Proposal for Future Supabase pgvector Migration (Pending Approval)
If the firm later requests migrating vector storage from the local server index to PostgreSQL Supabase, the following non-breaking migration is proposed:

```sql
-- PROPOSED MIGRATION: 20261111000000_enable_assistant_pgvector.sql
-- Status: PROPOSAL ONLY - NOT APPLIED

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create knowledge chunks table
CREATE TABLE IF NOT EXISTS assistant_knowledge_chunks (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    source_type TEXT NOT NULL,
    title TEXT NOT NULL,
    canonical_url TEXT NOT NULL,
    content TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    token_count INTEGER NOT NULL,
    embedding vector(768),
    publication_status TEXT NOT NULL DEFAULT 'published',
    approval_status TEXT NOT NULL DEFAULT 'approved',
    visibility TEXT NOT NULL DEFAULT 'public',
    published_at TIMESTAMPTZ,
    last_indexed_at TIMESTAMPTZ DEFAULT NOW(),
    source_version TEXT NOT NULL DEFAULT '1.0'
);

-- 3. HNSW index for high-speed cosine distance similarity
CREATE INDEX IF NOT EXISTS idx_assistant_chunks_embedding 
ON assistant_knowledge_chunks USING hnsw (embedding vector_cosine_ops);

-- 4. Row Level Security: Public can only SELECT approved, published items
ALTER TABLE assistant_knowledge_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of approved published chunks"
ON assistant_knowledge_chunks FOR SELECT
TO anon, authenticated
USING (publication_status = 'published' AND approval_status = 'approved' AND visibility = 'public');

-- ROLLBACK INSTRUCTIONS:
-- DROP TABLE IF EXISTS assistant_knowledge_chunks CASCADE;
-- DROP EXTENSION IF EXISTS vector CASCADE;
```

**Architectural Decision for Immediate Implementation:**  
Until explicit client approval for the database migration is provided, the assistant will use a **self-contained server-side vector and lexical index** (`data/assistant_knowledge_index.json` managed by `server/assistant/knowledgeRegistry.cjs`), ensuring **zero database migrations, zero external paid services, and zero schema modifications**.
