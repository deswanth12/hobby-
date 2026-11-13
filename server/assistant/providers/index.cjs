/**
 * server/assistant/providers/index.cjs
 * 
 * Provider Factory for Kavitha & Associates Assistant.
 * Decouples business logic from specific AI vendors.
 */

const { generateLocalAnswer } = require('./localProvider.cjs');
const { generateGeminiAnswer } = require('./geminiProvider.cjs');
const { generateOpenAIAnswer } = require('./openaiProvider.cjs');

function getProvider() {
  const providerType = (process.env.RAG_PROVIDER || 'local').toLowerCase().trim();
  const hasKey = Boolean(process.env.AI_API_KEY);

  if (providerType === 'gemini' && hasKey) {
    return { name: 'gemini', generateAnswer: generateGeminiAnswer };
  }

  if (providerType === 'openai' && hasKey) {
    return { name: 'openai', generateAnswer: generateOpenAIAnswer };
  }

  return { name: 'local', generateAnswer: (q, c) => Promise.resolve(generateLocalAnswer(q, c)) };
}

module.exports = {
  getProvider
};
