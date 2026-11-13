/**
 * server/assistant/providers/openaiProvider.cjs
 * 
 * OpenAI / OpenRouter Provider for Kavitha & Associates Assistant.
 * Uses official chat completions endpoint server-side.
 */

const { generateLocalAnswer } = require('./localProvider.cjs');

async function generateOpenAIAnswer(query, chunks, systemPrompt, history = []) {
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    return generateLocalAnswer(query, chunks);
  }

  try {
    const url = 'https://api.openai.com/v1/chat/completions';
    const contextText = chunks.map((c, i) => `[Source ${i + 1}: ${c.title} (${c.canonical_url})]\n${c.content}`).join('\n\n');

    const messages = [
      { role: 'system', content: `${systemPrompt}\n\nAPPROVED RETRIEVED KNOWLEDGE BASE:\n${contextText}` },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: query }
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.2,
        max_tokens: 500
      }),
      signal: AbortSignal.timeout(8000)
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (text && text.trim()) {
        return {
          answer: text.trim(),
          status: 'answered',
          handoff: {
            available: true,
            label: 'Contact Kavitha & Associates'
          }
        };
      }
    }
  } catch (err) {
    console.warn('[Assistant] OpenAI API call failed or timed out. Falling back to local provider:', err.message);
  }

  return generateLocalAnswer(query, chunks);
}

module.exports = {
  generateOpenAIAnswer
};
