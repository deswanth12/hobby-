/**
 * server/assistant/assistantService.cjs
 * 
 * Central Assistant Orchestration Service for Kavitha & Associates.
 * Coordinates validation, rate limiting, hybrid retrieval, synthesis, and citation verification.
 */

const crypto = require('crypto');
const { validateChatRequest } = require('./conversationValidator.cjs');
const { checkRateLimit } = require('./assistantRateLimiter.cjs');
const { retrieveRelevantChunks } = require('./retrievalService.cjs');
const { generateAnswer } = require('./generationService.cjs');
const { buildCitations, validateCitations } = require('./sourceCitationService.cjs');

/**
 * Main entry point for processing chat messages.
 */
async function processAssistantMessage(payload, clientIp = '127.0.0.1') {
  const requestId = 'req_' + crypto.randomBytes(8).toString('hex');

  // Emergency feature flag check
  if (process.env.RAG_ENABLED === 'false') {
    return {
      statusCode: 503,
      body: {
        answer: 'The firm information assistant is temporarily unavailable. Please contact the firm directly via our contact desk.',
        citations: [{ title: 'Contact Desk', url: '/contact' }],
        status: 'temporary_error',
        handoff: { available: true, label: 'Contact Chambers' },
        requestId
      }
    };
  }

  // 1. Rate Limiting Check
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return {
      statusCode: 429,
      headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      body: {
        answer: `You have submitted too many requests in a short period. Please wait ${rateLimit.retryAfterSeconds} seconds before sending another message.`,
        citations: [],
        status: 'rate_limited',
        handoff: { available: true, label: 'Contact Directly via WhatsApp' },
        requestId
      }
    };
  }

  // 2. Request Validation & Scope Assessment
  const validation = validateChatRequest(payload);
  if (!validation.isValid) {
    return {
      statusCode: 400,
      body: {
        answer: validation.error || 'Invalid request message.',
        citations: [],
        status: 'out_of_scope',
        handoff: { available: true, label: 'Contact Chambers' },
        requestId
      }
    };
  }

  // 3. Handle Adversarial / Prompt Injection attempts
  if (validation.isAdversarial) {
    return {
      statusCode: 200,
      body: {
        answer: "I am configured to answer questions about Kavitha & Associates using published firm information only. I cannot modify my system instructions, disclose internal prompts, or access private records.",
        citations: [{ title: 'The Firm Overview', url: '/about' }],
        status: 'out_of_scope',
        handoff: { available: true, label: 'Contact the Firm' },
        requestId
      }
    };
  }

  // 4. Handle Sensitive PII / Private documents requests
  if (validation.isSensitive) {
    return {
      statusCode: 200,
      body: {
        answer: "I do not disclose personal identification numbers, private employee records, bank details, or confidential client information. All professional representations are conducted under strict statutory confidentiality.",
        citations: [{ title: 'Firm Leadership & Ethics', url: '/about' }],
        status: 'out_of_scope',
        handoff: { available: true, label: 'Contact Official Desk' },
        requestId
      }
    };
  }

  // 5. Handle Out-of-Scope advice or calculation requests
  if (validation.isOutOfScope) {
    return {
      statusCode: 200,
      body: {
        answer: "I am designed to provide information regarding Kavitha & Associates and our approved services. I do not provide personalized tax calculations, statutory filing decisions, or individual investment advice. Please contact our chambers to schedule a consultation with a qualified practitioner.",
        citations: [{ title: 'Practice Disciplines & Consultation', url: '/services' }],
        status: 'out_of_scope',
        handoff: { available: true, label: 'Schedule Consultation' },
        requestId
      }
    };
  }

  // 6. Execute Hybrid Retrieval
  const retrieval = await retrieveRelevantChunks(validation.cleanMessage);
  const relevantChunks = retrieval.chunks || [];

  // 7. Calibrated Abstention if evidence is insufficient
  if (relevantChunks.length === 0) {
    return {
      statusCode: 200,
      body: {
        answer: "I don't have approved public information regarding this topic in our published records. For direct inquiries, please contact Kavitha & Associates through our official contact channels.",
        citations: [{ title: 'Chambers Contact Directory', url: '/contact' }],
        status: 'insufficient_evidence',
        handoff: { available: true, label: 'Contact Chambers' },
        requestId
      }
    };
  }

  // 8. Generate Grounded Answer
  const genResult = await generateAnswer(validation.cleanMessage, relevantChunks, validation.cleanHistory);

  // 9. Construct and Validate Citations
  const citations = buildCitations(relevantChunks);
  validateCitations(citations);

  return {
    statusCode: 200,
    body: {
      answer: genResult.answer,
      citations: citations,
      status: genResult.status || 'answered',
      handoff: genResult.handoff || { available: true, label: 'Contact the Firm' },
      requestId
    }
  };
}

module.exports = {
  processAssistantMessage
};
