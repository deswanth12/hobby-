/**
 * server/assistant/assistantController.cjs
 * 
 * HTTP Controller for Kavitha & Associates Public Assistant Endpoints.
 * 
 * Endpoints:
 * - POST /api/public/assistant/chat   -> Public conversational endpoint
 * - GET  /api/public/assistant/status -> Readiness & indexing health status
 * - POST /api/admin/assistant/reindex -> Authenticated reindexing trigger
 */

const { processAssistantMessage } = require('./assistantService.cjs');
const { ingestKnowledge, loadIndex } = require('./knowledgeIngestionService.cjs');

async function handleAssistantChat(req, res, helpers) {
  const { parseJsonBody, sendJson, getClientIp } = helpers;
  const ip = getClientIp(req);

  try {
    const payload = await parseJsonBody(req);
    const result = await processAssistantMessage(payload, ip);

    if (result.headers) {
      for (const [k, v] of Object.entries(result.headers)) {
        res.setHeader(k, v);
      }
    }

    return sendJson(res, result.statusCode, result.body, req);
  } catch (err) {
    console.error('[Assistant] Controller error:', err);
    return sendJson(res, 500, {
      answer: 'An unexpected server error occurred while processing your question. Please try again or contact the firm directly.',
      citations: [{ title: 'Contact Us', url: '/contact' }],
      status: 'temporary_error',
      handoff: { available: true, label: 'Contact Chambers' },
      requestId: 'err_' + Date.now()
    }, req);
  }
}

function handleAssistantStatus(req, res, helpers) {
  const { sendJson } = helpers;
  const indexData = loadIndex();

  return sendJson(res, 200, {
    enabled: process.env.RAG_ENABLED !== 'false',
    provider: process.env.RAG_PROVIDER || 'local',
    totalChunks: indexData.totalChunks || 0,
    indexedAt: indexData.indexedAt || null,
    status: 'operational',
    version: '1.0'
  }, req);
}

async function handleAssistantReindex(req, res, helpers) {
  const { sendJson, authenticateRequest, readDb } = helpers;
  const db = readDb();
  const session = await authenticateRequest(req, db);

  if (!session) {
    return sendJson(res, 401, { error: 'Unauthorized: Administrative authentication required to reindex knowledge sources.' }, req);
  }

  const result = ingestKnowledge(true);
  return sendJson(res, 200, {
    success: true,
    message: 'Knowledge base successfully reindexed.',
    details: result
  }, req);
}

module.exports = {
  handleAssistantChat,
  handleAssistantStatus,
  handleAssistantReindex
};
