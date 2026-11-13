# RAG Infrastructure Decision & Architecture Specification

**Project:** Kavitha & Associates, Chartered Accountants  
**Date:** November 10, 2026  
**Document Status:** Final Architecture Decision Record (ADR)  
**Author:** Lead Software Architect  

---

## 1. Context & Architectural Requirements

The Kavitha & Associates firm assistant requires:
1. Grounded factual responses strictly confined to approved firm information.
2. Complete isolation from client-side code (zero API key exposure to browser JavaScript).
3. Resilience against external outages, rate limits, and zero-connectivity environments.
4. Compliance with the project's strict database change restriction (no unauthorized schema modifications).
5. Seamless compatibility with the existing Node.js `/api/` routing structure.

---

## 2. Infrastructure Decision Matrix

| Dimension | Selected Technology | Alternative Evaluated | Decision Rationale |
| :--- | :--- | :--- | :--- |
| **Vector Storage** | **Local Server Index (`assistant_knowledge_index.json`)** | Supabase pgvector | **Adopt Local Server Index immediately.** Zero database migrations required; avoids modifying production database without client approval; ultra-low latency (< 5ms); perfectly sized for firm knowledge base (~50 chunks). Supabase pgvector migration is documented as a standby option. |
| **Retrieval Engine** | **Hybrid Vector + BM25 Lexical Retrieval** | Pure Keyword Search | Combines exact keyword matching (statutory names, section numbers, partner credentials) with cosine-similarity semantic vector matching. |
| **Embedding Engine** | **Pluggable Multi-Provider (Gemini / OpenAI / Local Semantic)** | Fixed Cloud Vendor | Provider abstraction allows using Google Gemini (`text-embedding-004`) when `AI_API_KEY` is provided, while defaulting to a high-precision deterministic 384-dimensional local semantic vectorizer for tests and offline operation. |
| **Generation Engine** | **Pluggable LLM Provider (Gemini / OpenAI / Deterministic Local)** | Direct Client-side API | Server-side execution only. Supports Gemini 1.5/2.0 Flash and GPT-4o-mini, with a deterministic local extraction engine for test verification and offline fallback. |
| **Rate Limiting** | **Sliding Window Token Bucket (In-Memory IP Bucket)** | External Redis | Zero external infrastructure required; handles up to 20 requests per minute per IP; fail-closed defense against scraping. |

---

## 3. Server Configuration Contracts

Environment variables configured on the server only (in `.env` or deployment dashboard, never exposed to client Vite bundle):

```bash
# RAG Configuration (Server-Side Only - Safe Defaults)
RAG_ENABLED=true
RAG_PROVIDER=local                # Options: 'gemini' | 'openai' | 'local'
AI_API_KEY=                       # Optional: Google Gemini or OpenAI API Key
AI_MODEL=gemini-1.5-flash         # Or 'gpt-4o-mini'
EMBEDDING_MODEL=text-embedding-004
RAG_TOP_K=5
RAG_RELEVANCE_THRESHOLD=0.45
RAG_RATE_LIMIT_PER_MIN=20
```

---

## 4. Module Directory Structure

The RAG backend is implemented under `server/assistant/`:

```
server/
  └── assistant/
        ├── assistantController.cjs      # HTTP handler for POST /api/public/assistant/chat
        ├── assistantService.cjs         # Core orchestration: validation -> retrieval -> prompt -> generation
        ├── retrievalService.cjs         # Hybrid search: semantic cosine similarity + BM25 ranking
        ├── embeddingService.cjs         # Embeddings generation (Live Gemini/OpenAI or Local Vectorizer)
        ├── generationService.cjs        # Prompt construction & LLM invocation with strict answer policies
        ├── knowledgeIngestionService.cjs# Content normalization, chunking, hashing, and indexing
        ├── knowledgeRegistry.cjs        # Approved public sources baseline & metadata definitions
        ├── sourceCitationService.cjs    # Canonical URL resolution & excerpt generation
        ├── conversationValidator.cjs    # Input sanitation, length bounds, PII & injection detection
        ├── assistantRateLimiter.cjs     # Per-IP sliding-window rate limiter
        └── providers/
              ├── index.cjs              # Provider factory
              ├── localProvider.cjs      # Deterministic local provider (zero API key required)
              ├── geminiProvider.cjs     # Google Gemini API provider
              └── openaiProvider.cjs     # OpenAI / compatible REST provider
```
