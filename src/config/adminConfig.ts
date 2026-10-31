/**
 * Administrative Console Routing Configuration
 *
 * Secure Entrypoint Architecture:
 * 1. Requires explicit configuration per environment via VITE_ADMIN_SECRET_PATH.
 * 2. Zero predictable defaults: The hardcoded default '/4464654646464654' is strictly retired.
 * 3. Enforces high entropy (minimum 12 random characters following leading slash).
 * 4. Fails closed: If unset or invalid, the administrative portal routes are NOT mounted,
 *    and all requests return a generic 404 (NotFoundPage).
 * 5. Architectural boundary: VITE_ADMIN_SECRET_PATH is public client-side routing config.
 *    It is NEVER treated as an authentication secret. Real security is enforced via
 *    server-side cryptographic authentication and session authorization.
 */

const BANNED_PATTERNS = [
  '4464654646464654', // Retired development default
  'admin',
  'login',
  'portal',
  'cpanel',
  'dashboard',
  'root',
  'kavitha',
  'superuser',
  'console',
  'manager'
];

/**
 * Validates the administrative secret path according to strict security criteria:
 * - Must be a non-empty string starting with '/'
 * - Must contain at least 12 characters after the slash
 * - Must not match or contain any banned predictable words or retired defaults
 *
 * @param path - Raw environment variable value
 * @returns Normalized secret path or null if invalid/unconfigured
 */
export const validateAdminSecretPath = (path: string | undefined | null): string | null => {
  if (!path || typeof path !== 'string') return null;
  const trimmed = path.trim();
  if (!trimmed.startsWith('/') || trimmed.length < 13) return null;

  const rawSlug = trimmed.slice(1).toLowerCase().replace(/\/+$/, '');
  if (!rawSlug || rawSlug.length < 12) return null;

  for (const banned of BANNED_PATTERNS) {
    if (rawSlug === banned || rawSlug.includes(banned)) {
      return null;
    }
  }

  return `/${rawSlug}`;
};

/**
 * Resolves the configured secret path from the environment.
 * Zero fallback to predictable defaults. Returns null if unconfigured or invalid.
 */
export const getAdminSecretPath = (): string | null => {
  const envPath = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_SECRET_PATH) ||
    (typeof process !== 'undefined' && process.env?.VITE_ADMIN_SECRET_PATH);
  return validateAdminSecretPath(envPath);
};

export const ADMIN_SECRET_PATH: string | null = getAdminSecretPath();
export const IS_ADMIN_CONFIGURED: boolean = ADMIN_SECRET_PATH !== null;

// Safe contract for route references; if unconfigured, routes route to unmatchable non-routable path
export const ADMIN_ROUTES = {
  root: ADMIN_SECRET_PATH || '/--unconfigured-portal--',
  login: ADMIN_SECRET_PATH ? `${ADMIN_SECRET_PATH}/login` : '/--unconfigured-portal--/login',
  enquiries: ADMIN_SECRET_PATH ? `${ADMIN_SECRET_PATH}/enquiries` : '/--unconfigured-portal--/enquiries',
  content: ADMIN_SECRET_PATH ? `${ADMIN_SECRET_PATH}/content` : '/--unconfigured-portal--/content',
  articles: ADMIN_SECRET_PATH ? `${ADMIN_SECRET_PATH}/articles` : '/--unconfigured-portal--/articles',
  settings: ADMIN_SECRET_PATH ? `${ADMIN_SECRET_PATH}/settings` : '/--unconfigured-portal--/settings',
} as const;
