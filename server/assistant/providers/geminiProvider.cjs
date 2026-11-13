/**
 * server/assistant/providers/geminiProvider.cjs
 * 
 * Google Gemini Provider for Kavitha & Associates Assistant.
 * Uses official Gemini REST API (gemini-1.5-flash / gemini-2.0-flash) server-side.
 * Never leaks API key to the client.
 */

const { generateLocalAnswer } = require('./localProvider.cjs');

async function generateGeminiAnswer(query, chunks, systemPrompt, history = []) {
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'gemini-1.5-flash';

  if (!apiKey) {
    return generateLocalAnswer(query, chunks);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Assemble context strictly from retrieved chunks
    const contextText = chunks.map((c, i) => `[Source ${i + 1}: ${c.title} (${c.canonical_url})]\n${c.content}`).join('\n\n');

    const promptText = `
${systemPrompt}

APPROVED RETRIEVED KNOWLEDGE BASE:
${contextText}

USER QUESTION:
${query}

INSTRUCTIONS:
Answer the question accurately using ONLY the approved retrieved knowledge above. If the information is not present, state that approved public information is unavailable and advise contacting the firm. Do not invent facts. Include mention of the relevant service or page.
`.trim();

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          ...history.map(h => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }]
          })),
          {
            role: 'user',
            parts: [{ text: promptText }]
          }
        ],
        generationConfig: {
          temperature: 0.2, // low temperature for grounded facts
          maxOutputTokens: 500,
          topP: 0.8
        }
      }),
      signal: AbortSignal.timeout(8000)
    });

    if (response.ok) {
      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText && generatedText.trim()) {
        return {
          answer: generatedText.trim(),
          status: 'answered',
          handoff: {
            available: true,
            label: 'Contact Kavitha & Associates'
          }
        };
      }
    }
  } catch (err) {
    console.warn('[Assistant] Gemini API call failed or timed out. Falling back to local provider:', err.message);
  }

  // Graceful fallback to deterministic local provider
  return generateLocalAnswer(query, chunks);
}

module.exports = {
  generateGeminiAnswer
};
