import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { handleApiRequest } = require('../server/apiRouter.cjs');

export default async function handler(req, res) {
  if (req.query && req.query.path) {
    const segments = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    req.url = `/api/${segments}`;
  } else if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return handleApiRequest(req, res);
}
