/**
 * server/assistant/conversationValidator.cjs
 * 
 * Input Sanitization, Prompt Injection Defense & Scope Classification.
 * 
 * Rules:
 * 1. Strict length bounds (1 - 1000 characters).
 * 2. HTML and script stripping to prevent injection/XSS.
 * 3. Adversarial / Prompt Injection detection (jailbreaks, prompt disclosures).
 * 4. PII & Confidential Data requests refusal (PAN, Aadhaar, private records, client files).
 * 5. Out-of-Scope Classification (tax calculations, financial advice, off-topic tasks).
 */

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_ITEMS = 10;

// Prompt injection & jailbreak indicators
const ADVERSARIAL_PATTERNS = [
  /ignore\s+.*?\b(instructions|rules|prompts|guidelines|safety)\b/i,
  /disregard\s+.*?\b(instructions|rules|prompts|guidelines|safety)\b/i,
  /reveal\s+.*?\b(system\s*prompt|developer\s*instructions|hidden\s*instructions|private\s*keys)\b/i,
  /print\s+.*?\b(instructions|system\s*prompt|keys|secrets|prompts)\b/i,
  /what\s+are\s+your\s+(hidden\s+)?(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+(DAN|jailbroken|unrestricted)/i,
  /pretend\s+to\s+be\s+(an\s+unrestricted|a\s+hacker|DAN)/i,
  /bypass\s+.*?\b(safety|filter|guardrails?|restrictions?)\b/i,
  /\bunredact\b/i,
  /reveal\s+.*?\bprivate\s+cv\b/i
];

// Sensitive PII & confidential records queries
const SENSITIVE_QUERY_PATTERNS = [
  /(give|tell|show|reveal|what\s+is)\s+.*?\b(pan|aadhaar|aadhar|membership\s+number)\b/i,
  /\b(partner'?s?\s+pan|partner'?s?\s+aadhaar|personal\s+pan|personal\s+aadhaar)\b/i,
  /(who\s+are|list|give\s+me|show\s+me|tell\s+me)\s+.*?\b(clients?|clientele)\b/i,
  /\b(client\s+names?|client\s+lists?|private\s+clients?|confidential\s+clients?)\b/i,
  /\b(bank\s+statements?|internal\s+emails?|admin\s+passwords?|confidential\s+fee|fee\s+ledgers?)\b/i,
  /\b(unredacted\s+.*?(membership|details|pan|aadhaar)|unredacted\s+icai)\b/i
];

// Out-of-scope advice or computation requests
const OUT_OF_SCOPE_PATTERNS = [
  /calculate\s+.*?\b(tax|gst|salary|tds|refund|deduction|payable|liability)\b/i,
  /how\s+much\s+tax\s+(will|do)\s+i\s+(owe|pay)/i,
  /\b(evade\s+tax|tax\s+evasion|hide\s+cash|dodge\s+tax|black\s+money|launder\s+money)\b/i,
  /how\s+(can\s+i|to|do\s+i)\s+.*?\b(evade|dodge|avoid\s+paying|hide)\b/i,
  /(recommend|suggest)\s+.*?\b(stock|crypto|bitcoin|mutual\s+fund|share|investment)\b/i,
  /(which|what)\s+.*?\b(stock|crypto|shares?|coins?)\b.*?\b(buy|invest)/i,
  /invest\s+in\s+.*?(stock|crypto|bitcoin|mutual\s+fund|market)/i,
  /write\s+(a\s+)?python\s+(script|code)/i,
  /write\s+(a\s+)?(script|program|code|essay)/i,
  /who\s+won\s+the\s+(world\s+cup|match|election)/i,
  /what\s+is\s+the\s+capital\s+of/i
];

/**
 * Sanitizes input text, removing scripts, tags, and zero-width characters.
 */
function sanitizeInput(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // strip zero-width characters
    .trim();
}

/**
 * Validates chat request structure and checks for adversarial or out-of-scope intent.
 */
function validateChatRequest(payload) {
  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      error: 'Invalid request payload. Expected JSON object with message string.'
    };
  }

  const rawMessage = payload.message;
  if (!rawMessage || typeof rawMessage !== 'string') {
    return {
      isValid: false,
      error: 'The message field is required and must be a non-empty string.'
    };
  }

  const cleanMessage = sanitizeInput(rawMessage);

  if (cleanMessage.length < 1) {
    return {
      isValid: false,
      error: 'Message cannot be empty.'
    };
  }

  if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Message exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`
    };
  }

  // Validate history
  const cleanHistory = [];
  if (Array.isArray(payload.history)) {
    const historySlice = payload.history.slice(-MAX_HISTORY_ITEMS);
    for (const h of historySlice) {
      if (h && typeof h === 'object' && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string') {
        cleanHistory.push({
          role: h.role,
          content: sanitizeInput(h.content).slice(0, MAX_MESSAGE_LENGTH)
        });
      }
    }
  }

  // 1. Adversarial / Prompt Injection check
  for (const pattern of ADVERSARIAL_PATTERNS) {
    if (pattern.test(cleanMessage)) {
      return {
        isValid: true,
        isAdversarial: true,
        category: 'prompt_injection',
        cleanMessage,
        cleanHistory
      };
    }
  }

  // 2. Sensitive PII / Private documents check
  for (const pattern of SENSITIVE_QUERY_PATTERNS) {
    if (pattern.test(cleanMessage)) {
      return {
        isValid: true,
        isSensitive: true,
        category: 'sensitive_data_request',
        cleanMessage,
        cleanHistory
      };
    }
  }

  // 3. Out-of-scope calculation / advice check
  for (const pattern of OUT_OF_SCOPE_PATTERNS) {
    if (pattern.test(cleanMessage)) {
      return {
        isValid: true,
        isOutOfScope: true,
        category: 'out_of_scope_advice',
        cleanMessage,
        cleanHistory
      };
    }
  }

  return {
    isValid: true,
    isAdversarial: false,
    isSensitive: false,
    isOutOfScope: false,
    cleanMessage,
    cleanHistory
  };
}

module.exports = {
  validateChatRequest,
  sanitizeInput,
  MAX_MESSAGE_LENGTH,
  MAX_HISTORY_ITEMS
};
