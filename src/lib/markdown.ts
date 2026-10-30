/**
 * src/lib/markdown.ts
 * 
 * Pure TypeScript markdown sanitization, link validation, and reading time utilities
 * for Kavitha & Associates editorial publications.
 * 
 * Enforces zero-trust defense against stored XSS, script injection, and unsafe protocols
 * without external runtime npm dependencies.
 */

const SAFE_URL_PATTERN = /^(https?:\/\/|\/(?!\/)|mailto:|tel:)/i;
const DANGEROUS_PROTOCOLS = /^(javascript:|data:|vbscript:|file:)/i;
const CONTROL_CHARS_PATTERN = /[\x00-\x1F\x7F]/;

/**
 * Validates whether a URL is safe for navigation or image rendering without script execution risk.
 */
export function isSafeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (CONTROL_CHARS_PATTERN.test(trimmed)) return false;
  if (DANGEROUS_PROTOCOLS.test(trimmed)) return false;
  if (trimmed.startsWith('//') || trimmed.startsWith('\\') || trimmed.startsWith('/\\') || /^\/\s*[\/\\]/.test(trimmed)) return false;

  try {
    const decoded = decodeURIComponent(trimmed);
    if (CONTROL_CHARS_PATTERN.test(decoded)) return false;
    if (decoded.startsWith('//') || decoded.startsWith('\\') || decoded.startsWith('/\\') || /^\/\s*[\/\\]/.test(decoded)) return false;
    if (DANGEROUS_PROTOCOLS.test(decoded)) return false;
  } catch {
    return false;
  }

  return SAFE_URL_PATTERN.test(trimmed);
}

/**
 * Sanitizes markdown source by neutralizing dangerous script/iframe/object tags,
 * event handlers, and javascript: pseudo-protocols.
 */
export function sanitizeMarkdown(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  let clean = raw;
  clean = clean.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  clean = clean.replace(/<script\b[^>]*\/?>(?:[\s\S]*?<\/script>)?/gi, '');
  clean = clean.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '');
  clean = clean.replace(/<iframe\b[^>]*\/?>(?:[\s\S]*?<\/iframe>)?/gi, '');
  clean = clean.replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '');
  clean = clean.replace(/<object\b[^>]*\/?>(?:[\s\S]*?<\/object>)?/gi, '');
  clean = clean.replace(/<embed\b[^>]*>/gi, '');
  clean = clean.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  clean = clean.replace(/<base\b[^>]*>/gi, '');
  clean = clean.replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, '');
  clean = clean.replace(/\bon[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');
  clean = clean.replace(/href\s*=\s*(?:['"](?:javascript|data|vbscript):[^'"]*['"]|(?:javascript|data|vbscript):[^\s>]+)/gi, 'href="#"');
  clean = clean.replace(/\[([^\]]+)\]\((?:javascript|data|vbscript):[^)]+\)/gi, '[$1](#)');
  return clean;
}

/**
 * Computes average reading time in minutes based on 200 words per minute.
 */
export function calculateReadingTime(text: string): number {
  if (!text || typeof text !== 'string') return 1;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
