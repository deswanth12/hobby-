/**
 * Cloudflare Pages Functions Execution Helper
 * Executes Pages Function modules in an emulated Cloudflare Pages edge runtime environment.
 */

import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';

/**
 * Loads a Cloudflare Pages Function dynamically.
 */
export async function loadPagesFunction(functionRelativePath) {
  const fullPath = path.resolve(functionRelativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Pages Function file not found: ${fullPath}`);
  }
  const fileUrl = pathToFileURL(fullPath).href;
  const module = await import(fileUrl);
  return module;
}

/**
 * Invokes a Pages Function with a simulated context.
 * context = { request, env, params, next, data }
 */
export async function invokeFunction(handler, requestUrl, options = {}) {
  const method = options.method || 'GET';
  const headers = new Headers(options.headers || {});
  
  if (options.cookies) {
    const cookieHeader = Object.entries(options.cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
    headers.set('Cookie', cookieHeader);
  }

  const req = new Request(requestUrl, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const env = options.env || {
    GITHUB_CLIENT_ID: 'mock_client_id_123',
    GITHUB_CLIENT_SECRET: 'mock_client_secret_xyz',
    ALLOWED_USERS: 'deswanth12,cakavitha,admin-user',
  };

  const context = {
    request: req,
    env,
    params: options.params || {},
    data: {},
    waitUntil: (p) => p,
  };

  // Mock global fetch if provided in options
  const originalFetch = globalThis.fetch;
  if (options.mockFetch) {
    globalThis.fetch = options.mockFetch;
  }

  try {
    const response = await handler(context);
    return response;
  } finally {
    if (options.mockFetch) {
      globalThis.fetch = originalFetch;
    }
  }
}
