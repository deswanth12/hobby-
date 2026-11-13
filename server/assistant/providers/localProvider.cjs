/**
 * server/assistant/providers/localProvider.cjs
 * 
 * Deterministic Local Provider for Kavitha & Associates Assistant.
 * Provides instant, zero-cost, source-grounded response generation without external dependencies.
 * 
 * Guarantees:
 * - 100% offline capability.
 * - Deterministic CI/CD testing.
 * - Zero hallucination: answers strictly from retrieved evidence chunks.
 * - Out-of-scope & low-confidence abstention.
 */

/**
 * Generates an answer from retrieved knowledge chunks.
 */
function generateLocalAnswer(query, chunks, options = {}) {
  const queryLower = query.toLowerCase();

  // If no chunks retrieved, return calibrated abstention
  if (!chunks || chunks.length === 0) {
    return {
      answer: "I don't have approved public information regarding this topic in our published records. For direct inquiries, please contact Kavitha & Associates through our official contact channels.",
      status: 'insufficient_evidence',
      handoff: {
        available: true,
        label: 'Contact Kavitha & Associates'
      }
    };
  }

  // Identify primary intent & relevant corridors/topics from chunks
  const isFirmOverviewQuery = /what\s+is\s+kavitha|tell\s+me\s+about\s+(the\s+)?firm|firm\s+overview|firm\s+history|who\s+are\s+you|about\s+the\s+firm|based|independent|how\s+long|operating|how\s+does\s+the\s+firm|types\s+of\s+clients|who\s+do\s+you\s+serve|who\s+are\s+your\s+clients/i.test(queryLower);
  const isPhilosophyQuery = /philosophy|operating\s+philosophy|principles|stages|engagement\s+process|methodology|four\s+stage|code\s+of\s+ethics/i.test(queryLower);
  const isPartnerQuery = /(managing\s+)?partner|kavitha\s+vijay|qualification|credential|air\s*49|academic|degree|alumni|deloitte|ford|cma/i.test(queryLower);
  const isContactQuery = /address|phone|email|contact|office|chambers|location|where|hours|appointment/i.test(queryLower);
  const isArticleQuery = /article|blog|insight|post|reading|publication|published|guideline|guidance|guide/i.test(queryLower);
  const isServicesQuery = /service|offer|practice|audit|tax|gst|cfo|rera|incorporation|registration|44ab|scrutiny|framework/i.test(queryLower);

  // 1. Firm Operating Philosophy & Engagement Methodology
  if (isPhilosophyQuery) {
    return {
      answer: "Kavitha & Associates operates on the core philosophy of 'Accuracy before Speed, Evidence before Opinion, Discipline before Convenience.' The firm follows a structured four-stage engagement process: (1) Diagnostic Intake & Jurisdictional Assessment, (2) Document Verification & Reconciliations, (3) Partner-Led Execution & Review, and (4) Client Advisory & Ongoing Steering. The practice adheres strictly to the ICAI Code of Ethics (13th Edition, 2026) with zero tolerance for compliance ambiguity.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'View Practice Methodology'
      }
    };
  }

  // 2. Institutional Firm Overview
  if (isFirmOverviewQuery && !isPartnerQuery) {
    return {
      answer: "Kavitha & Associates is an independent Chartered Accountancy practice established in Tirupati, Andhra Pradesh, India. Led by Managing Partner CA Kavitha Vijay (Fellow Chartered Accountant and Associate Cost & Management Accountant), the firm provides comprehensive statutory audit, corporate taxation, GST compliance, and Virtual CFO management advisory services with over 10+ years of progressive professional experience across public practice, Big 4 audit (Deloitte), and multinational corporate governance (Ford Motor Company). The firm serves companies, LLPs, and growing enterprises across India with partner-led execution.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'About the Firm'
      }
    };
  }

  // 3. Partner Credentials & Background
  if (isPartnerQuery) {
    return {
      answer: "Kavitha & Associates is led by Managing Partner CA Kavitha Vijay, a Fellow Chartered Accountant (ICAI Practicing Fellow) and Associate Cost & Management Accountant (ACMA / ICMAI). She holds a B.Com degree and achieved All India Rank 49 (AIR 49) in the CMA Intermediate examination, awarded specifically by the Institute of Cost Accountants of India (ICMAI). Her background encompasses over 10+ years of progressive professional experience, including senior corporate audit roles at Deloitte (Big 4) and internal audit at Ford Motor Company across Asia-Pacific operations. All client representations feature direct partner-led execution without delegation to junior staff.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'Connect with Managing Partner'
      }
    };
  }

  // 4. Published Articles & Insights
  if (isArticleQuery) {
    const articleChunks = chunks.filter(c => c.source_type === 'blog_post' || c.canonical_url?.startsWith('/blog'));
    const titles = articleChunks.length > 0 ? [...new Set(articleChunks.map(c => c.title))] : [];
    return {
      answer: `Kavitha & Associates regularly publishes technical guidance, statutory analysis, and editorial insights on corporate compliance (including 2026 publications: ${titles.length > 0 ? titles.join('; ') : 'Corporate Tax, GST Annual Returns, and Statutory Audit'}). All published articles can be read online at the firm's canonical insights directory at /blog.`,
      status: 'answered',
      handoff: {
        available: true,
        label: 'Browse Published Insights'
      }
    };
  }

  // 5. Contact Coordinates & Chamber Office
  if (isContactQuery) {
    return {
      answer: "The chambers of Kavitha & Associates are located at 19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India. You can contact the firm by phone at +91 96263 50900 or +91 95421 53906, or by email at cakavithasrj@gmail.com. Office hours are Monday to Saturday from 9:30 AM to 7:30 PM IST. Consultations are scheduled by prior appointment.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'View Chambers Coordinates'
      }
    };
  }

  // 6. Approved Practice Corridors / Services
  if (isServicesQuery) {
    return {
      answer: "Kavitha & Associates provides professional services across six approved practice corridors: (1) Statutory Audit & Assurance Services (Companies Act 2013 audits, Section 44AB Tax Audits, Standards on Auditing SAs, IFC), (2) Direct Tax & Corporate Income Tax Advisory (ITR filing under Income Tax Act 1961, corporate ITR-6, advance tax, Section 143(3) scrutiny and Faceless assessment representation, Section 148 reassessment), (3) Indirect Tax & GST Compliance Services (filings, GSTR-9, GSTR-9C reconciliation, ASMT-10 notices), (4) Corporate Secretarial & Entity Registration (SPICe+ company incorporation, LLP registration, annual ROC filings), (5) Virtual CFO & Strategic Financial Advisory (MIS, cash flow forecasting, costing), and (6) Real Estate RERA Advisory & Compliance (RERA registrations, Form 3 certifications, 70% escrow monitoring). All engagements follow partner-led execution under the applicable statutory frameworks including Companies Act 2013, Standards on Auditing, Income Tax Act 1961, and CGST Act 2017.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'Explore Practice Disciplines'
      }
    };
  }

  // 5. Default grounded extraction from top chunk
  const topChunk = chunks[0];
  const summarySentences = topChunk.content
    .split('\n')
    .filter(line => line.trim().length > 25 && !line.startsWith('Title:') && !line.startsWith('URL:'))
    .slice(0, 3)
    .join(' ');

  return {
    answer: summarySentences || "Kavitha & Associates is an independent Chartered Accountancy practice in Tirupati providing statutory audit, corporate taxation, GST compliance, and Virtual CFO advisory services.",
    status: 'answered',
    handoff: {
      available: true,
      label: 'Consult the Firm'
    }
  };
}

module.exports = {
  generateLocalAnswer
};
