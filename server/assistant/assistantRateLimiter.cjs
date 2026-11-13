/**
 * server/assistant/assistantRateLimiter.cjs
 * 
 * Sliding-Window In-Memory Rate Limiter for Kavitha & Associates Assistant.
 * Restricts public assistant calls to a maximum of 20 requests per minute per IP.
 */

const WINDOW_MS = 60 * 1000; // 1 minute window
const DEFAULT_LIMIT = 20;

const ipRequestMap = new Map();

// Periodic garbage collection of expired IP timestamps
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of ipRequestMap.entries()) {
    const valid = timestamps.filter(t => (now - t) < WINDOW_MS);
    if (valid.length === 0) {
      ipRequestMap.delete(ip);
    } else {
      ipRequestMap.set(ip, valid);
    }
  }
}, 60 * 1000).unref();

/**
 * Checks whether an IP address is within its allowed rate limit quota.
 */
function checkRateLimit(ip) {
  const limit = parseInt(process.env.RAG_RATE_LIMIT_PER_MIN || DEFAULT_LIMIT, 10);
  const now = Date.now();
  const safeIp = ip || 'anonymous-client';

  let timestamps = ipRequestMap.get(safeIp) || [];
  // Filter timestamps within current window
  timestamps = timestamps.filter(t => (now - t) < WINDOW_MS);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds)
    };
  }

  timestamps.push(now);
  ipRequestMap.set(safeIp, timestamps);

  return {
    allowed: true,
    remaining: limit - timestamps.length,
    retryAfterSeconds: 0
  };
}

/**
 * Resets rate limiter memory (useful for test suites).
 */
function resetRateLimiter() {
  ipRequestMap.clear();
}

module.exports = {
  checkRateLimit,
  resetRateLimiter,
  WINDOW_MS,
  DEFAULT_LIMIT
};
