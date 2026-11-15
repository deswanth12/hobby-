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

const DEFAULT_WHATSAPP_URL = 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates), I would like to schedule a statutory consultation.');
const DEFAULT_PHONE_URL = 'tel:+919626350900';
const DEFAULT_PHONE_DISPLAY = '+91 96263 50900';

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
        handoff: {
          available: true,
          label: 'Contact Chambers',
          whatsappUrl: DEFAULT_WHATSAPP_URL,
          phoneUrl: DEFAULT_PHONE_URL,
          phoneDisplay: DEFAULT_PHONE_DISPLAY
        },
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
        handoff: {
          available: true,
          label: 'Contact Directly via WhatsApp',
          whatsappUrl: DEFAULT_WHATSAPP_URL,
          phoneUrl: DEFAULT_PHONE_URL,
          phoneDisplay: DEFAULT_PHONE_DISPLAY
        },
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
        handoff: {
          available: true,
          label: 'Contact Chambers',
          whatsappUrl: DEFAULT_WHATSAPP_URL,
          phoneUrl: DEFAULT_PHONE_URL,
          phoneDisplay: DEFAULT_PHONE_DISPLAY
        },
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
        handoff: {
          available: true,
          label: 'Contact the Firm',
          whatsappUrl: DEFAULT_WHATSAPP_URL,
          phoneUrl: DEFAULT_PHONE_URL,
          phoneDisplay: DEFAULT_PHONE_DISPLAY
        },
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
        handoff: {
          available: true,
          label: 'Contact Official Desk',
          whatsappUrl: DEFAULT_WHATSAPP_URL,
          phoneUrl: DEFAULT_PHONE_URL,
          phoneDisplay: DEFAULT_PHONE_DISPLAY
        },
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
        handoff: {
          available: true,
          label: 'Schedule Consultation',
          whatsappUrl: DEFAULT_WHATSAPP_URL,
          phoneUrl: DEFAULT_PHONE_URL,
          phoneDisplay: DEFAULT_PHONE_DISPLAY
        },
        requestId
      }
    };
  }

  // 5b. Handle Pure Greetings & Capabilities Inquiries (R1 & ICAI Chambers Tone)
  const cleanMsg = validation.cleanMessage.trim().toLowerCase();
  
  // Expanded natural greetings regex matching standalone greetings or greetings addressed to partner/team/chambers
  const isGreetingPattern = /^(hi|hello|hey|namaste|namaskar(am)?|vanakkam|good\s+(morning|afternoon|evening|day)|greetings|howdy)\s*(ca(\s+kavitha(\s+vijay)?)?|kavitha(\s+vijay)?(\s*(&|and)?\s*associates)?|associates|team|there|sir|madam|all|everyone|chambers)?[!.? ]*$/i.test(cleanMsg);

  // Natural capability inquiries
  const isCapabilityInquiry = /^(how\s+can\s+you\s+(help|assist)(\s+me)?|can\s+you\s+help(\s+me)?|can\s+someone\s+help(\s+me)?|what\s+can\s+you\s+do|what\s+can\s+the\s+assistant\s+do|what\s+can\s+you\s+help\s+(me\s+)?with|what\s+are\s+your\s+capabilities|how\s+does\s+this\s+assistant\s+work|help\s*me|help|i\s+need\s+(some\s+)?(help|information|assistance)|i\s+have\s+a\s+question|may\s+i\s+ask(\s+a\s+question)?)[!.? ]*$/i.test(cleanMsg);

  // Conversational openings (greeting + general help inquiry without specific corridor topic)
  const isOpeningGreetingWithHelp = /^(hi|hello|hey|namaste|namaskar(am)?|vanakkam|good\s+(morning|afternoon|evening|day)|greetings)\b.*(can\s+you\s+help|how\s+can\s+you\s+help|what\s+can\s+you\s+do|i\s+have\s+a\s+question|need\s+(some\s+)?(help|information|assistance)|assist\s+me)/i.test(cleanMsg);

  const hasSpecificPracticeTopic = /(direct\s+tax|income\s+tax|itr|gst|indirect\s+tax|audit|companies\s+act|mca|roc|incorporat|llp|rera|cfo|cash\s+flow|mis|office|address|phone|email|fee|notice|143|148|44ab)/i.test(cleanMsg);

  if (isGreetingPattern || ((isCapabilityInquiry || isOpeningGreetingWithHelp) && !hasSpecificPracticeTopic)) {
    return {
      statusCode: 200,
      body: {
        answer: "Welcome to Kavitha & Associates, Chartered Accountants (Tirupati Chambers). Operating in strict accordance with the ICAI Code of Ethics, I can provide verified statutory information across our core practice areas: (1) Direct Tax & Corporate ITR (Income Tax Act 1961), (2) Indirect Tax & GST Compliance (CGST Act 2017), (3) Companies Act 2013 & MCA Corporate Governance, (4) Statutory Audit & Assurance Services, (5) Real Estate RERA Advisory & CA Certifications, and (6) Virtual CFO & Management Advisory.\n\nHow may our chambers assist you today? You may choose from the suggested statutory inquiries or ask any question about our practice disciplines.",
        citations: [
          { title: 'Practice Disciplines & Consultation', url: '/services' },
          { title: 'Firm Leadership & Credentials', url: '/about' },
          { title: 'Chambers Coordinates & Contact Desk', url: '/contact' }
        ],
        status: 'answered',
        handoff: {
          available: true,
          label: 'Schedule Consultation',
          whatsappUrl: DEFAULT_WHATSAPP_URL,
          phoneUrl: DEFAULT_PHONE_URL,
          phoneDisplay: DEFAULT_PHONE_DISPLAY
        },
        requestId
      }
    };
  }

  // 5c. Handle Conversational Closures & Politeness (Thanks / Goodbye)
  const isThanks = /^(ok(ay)?\s*,?\s*|great\s*,?\s*|perfect\s*,?\s*)?(thank(s|\s+you)(\s+(so\s+much|very\s+much|a\s+lot|a\s+bunch|team|all|again|for\s+(the|your)\s+(help|time|guidance|information|assistance)|ca\s+kavitha|kavitha))?|many\s+thanks|much\s+appreciated|appreciate\s+(it|your\s+help))[!.? ]*$/i.test(cleanMsg);
  if (isThanks) {
    return {
      statusCode: 200,
      body: {
        answer: "You are most welcome. Should you require further statutory guidance or wish to schedule a consultation across Direct Tax, GST, Statutory Audit, Corporate Law, RERA, or Virtual CFO advisory, please feel free to ask or connect directly with our Tirupati chambers consultation desk.",
        citations: [
          { title: 'Chambers Contact Directory', url: '/contact' },
          { title: 'Practice Disciplines & Consultation', url: '/services' }
        ],
        status: 'answered',
        handoff: {
          available: true,
          label: 'Schedule Consultation',
          whatsappUrl: DEFAULT_WHATSAPP_URL,
          phoneUrl: DEFAULT_PHONE_URL,
          phoneDisplay: DEFAULT_PHONE_DISPLAY
        },
        requestId
      }
    };
  }

  const isGoodbye = /^(bye(\s+bye|\s+for\s+now)?|goodbye|see\s+you(\s+(soon|later|tomorrow))?|good\s+night|have\s+a\s+(good|nice|great|pleasant)\s+(day|evening|weekend)|take\s+care)[!.? ]*$/i.test(cleanMsg);
  if (isGoodbye) {
    return {
      statusCode: 200,
      body: {
        answer: "Thank you for contacting Kavitha & Associates. Our Tirupati chambers desk is available Monday to Saturday (9:30 AM – 7:30 PM IST) for direct consultations via WhatsApp or phone. Have a productive day.",
        citations: [
          { title: 'Chambers Coordinates & Contact Desk', url: '/contact' }
        ],
        status: 'answered',
        handoff: {
          available: true,
          label: 'Contact Chambers',
          whatsappUrl: DEFAULT_WHATSAPP_URL,
          phoneUrl: DEFAULT_PHONE_URL,
          phoneDisplay: DEFAULT_PHONE_DISPLAY
        },
        requestId
      }
    };
  }

  // 5d. Handle Direct Consultation & Human Handoff Inquiries
  const isHumanOrConsultation = /^(can\s+(i|we)\s+|how\s+(can\s+i|do\s+i|to)\s+|i\s+(want|need|would\s+like)\s+to\s+|please\s+)?(speak|talk|call|connect(\s+me)?|reach|meet|chat)(\s+(with|to))?\s*(a\s+)?(human|person|someone|representative|advisor|agent|ca(\s+kavitha(\s+vijay)?)?|chambers|you)?[!.? ]*$/i.test(cleanMsg)
    || /^(can\s+(i|we)\s+|how\s+(can\s+i|do\s+i|to)\s+|i\s+(want|need|would\s+like)\s+to\s+|please\s+)?(schedule|book)\s+(an?\s+)?(consultation|appointment|meeting)[!.? ]*$/i.test(cleanMsg)
    || /^(human(\s+agent|\s+representative)?|talk\s+to\s+(a\s+)?human)[!.? ]*$/i.test(cleanMsg);

  if (isHumanOrConsultation) {
    return {
      statusCode: 200,
      body: {
        answer: "To consult directly with Managing Partner CA Kavitha Vijay or our professional team, you can connect with our Tirupati chambers via WhatsApp or direct phone. The chambers are located at 19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India. Office hours are Monday to Saturday from 9:30 AM to 7:30 PM IST. Direct consultations are scheduled by prior appointment.",
        citations: [
          { title: 'Chambers Coordinates & Contact Desk', url: '/contact' },
          { title: 'Firm Leadership & Credentials', url: '/about' }
        ],
        status: 'answered',
        handoff: {
          available: true,
          label: 'Schedule Consultation',
          whatsappUrl: DEFAULT_WHATSAPP_URL,
          phoneUrl: DEFAULT_PHONE_URL,
          phoneDisplay: DEFAULT_PHONE_DISPLAY
        },
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
        handoff: {
          available: true,
          label: 'Contact Chambers',
          whatsappUrl: DEFAULT_WHATSAPP_URL,
          phoneUrl: DEFAULT_PHONE_URL,
          phoneDisplay: DEFAULT_PHONE_DISPLAY
        },
        requestId
      }
    };
  }

  // 8. Generate Grounded Answer
  const genResult = await generateAnswer(validation.cleanMessage, relevantChunks, validation.cleanHistory);

  // 9. Construct and Validate Citations
  const citations = buildCitations(relevantChunks);
  validateCitations(citations);

  const finalHandoff = Object.assign(
    {
      available: true,
      label: 'Contact the Firm',
      whatsappUrl: DEFAULT_WHATSAPP_URL,
      phoneUrl: DEFAULT_PHONE_URL,
      phoneDisplay: DEFAULT_PHONE_DISPLAY
    },
    genResult.handoff || {}
  );

  return {
    statusCode: 200,
    body: {
      answer: genResult.answer,
      citations: citations,
      status: genResult.status || 'answered',
      handoff: finalHandoff,
      requestId
    }
  };
}

module.exports = {
  processAssistantMessage
};
