# KAVITHA & ASSOCIATES — RAG SYSTEM PRIVACY REPORT
## Zero-Persistence Architecture, PII Elimination & Regulatory Privacy Compliance

**Target:** Public-Facing Firm Information Assistant  
**Release Baseline:** V8.2 + Botanical Ledger Visual Enrichment  
**Evaluation Date:** November 11, 2026  
**Status:** COMPLIANT WITH R4 PRIVACY STANDARDS & DIGITAL PERSONAL DATA PROTECTION ACT (DPDPA 2023)  

---

### 1. Privacy Architecture Overview

The Kavitha & Associates Firm Assistant was built following a **Strict Zero-Trust Local-First & Zero-Persistence** privacy model. Unlike conventional SaaS conversational widgets that upload visitor conversations to external analytics pipelines, this assistant persists **zero chat transcripts**, **zero IP-to-visitor linkages**, and **zero tracking cookies**.

---

### 2. Core Privacy Guarantees

```
Visitor Browser
      │
      │ 1. Transmit ephemeral query in memory
      ▼
Vite / Node API Gateway (server/assistant/assistantController.cjs)
      │
      │ 2. In-memory validation & rate limiting
      │    (IP hashed in memory for 60s sliding window only; never written to disk)
      ▼
Retrieval Engine (server/assistant/retrievalService.cjs)
      │
      │ 3. Memory-only cosine similarity over public index
      ▼
Synthesis Engine (server/assistant/providers/localProvider.cjs)
      │
      │ 4. Grounded synthesis; zero external transmission
      ▼
HTTP Response (JSON)
      │
      │ 5. Session state stored purely in React useState (browser memory)
      │    Closing tab instantly wipes all conversation state.
      ▼
ZERO PERSISTENCE IN DATABASE, LOCALSTORAGE, OR COOKIES
```

---

### 3. Privacy Compliance Matrix

| Regulatory Requirement | Assistant Architecture | Compliance Status |
| :--- | :--- | :--- |
| **No Chat Transcript Logging** | Neither `data/practice_db.json` nor Supabase stores assistant conversations. Responses stream directly back to client. | **VERIFIED** |
| **No Cookie Creation** | Assistant creates zero session cookies, advertising cookies, or analytics tokens. | **VERIFIED** |
| **No Browser Storage Spillage** | Conversation history is held strictly in React component memory (`useState`). No `localStorage` or `sessionStorage` keys are written. | **VERIFIED** |
| **Client PII Quarantine** | PAN numbers, Aadhaar numbers, private phone numbers, and financial statements submitted in queries are purged in validator and rejected. | **VERIFIED** |
| **Partner & Staff Privacy** | Personal home address, individual bank accounts, and personal PAN/membership numbers are redacted. Only approved public chambers coordinates are referenced. | **VERIFIED** |
| **Draft Document Privacy** | Internal working drafts (e.g. `internal-audit-best-practices.md`) are quarantined from ingestion pipeline. | **VERIFIED** |

---

### 4. Third-Party Data Transmission Audit

- **Default Provider (`local`):** Zero external HTTP calls. All vectors, search tokens, and response formatting execute locally on the Node.js process.
- **External Provider Flags (`gemini`, `openai`):** Disabled by default. If enabled by the firm administrator via environment variables, only anonymized public query text is forwarded, with explicit disclaimers rendered in UI.
- **No Analytics Trackers:** No Google Analytics, Meta Pixel, Hotjar, or third-party telemetry scripts are attached to the assistant widget.

---

### 5. Verification Sign-Off

The privacy architecture enforces maximum respect for visitor confidentiality and client discretion under Rule 4 (R4) and Section 3.3.14 of the ICAI Code of Ethics (13th Edition).
