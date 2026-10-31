import fs from 'fs';

let code = fs.readFileSync('server/apiRouter.cjs', 'utf8');

const target = `  // 1. Health & Database Mode Endpoint`;
const gscHandler = `  // Google Search Console Site Verification
  if (pathname === '/google66e0145809155f23.html' || pathname === '/api/google66e0145809155f23.html') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end('google-site-verification: google66e0145809155f23.html');
  }

  // 1. Health & Database Mode Endpoint`;

if (!code.includes('google-site-verification: google66e0145809155f23.html')) {
  code = code.replace(target, gscHandler);
  fs.writeFileSync('server/apiRouter.cjs', code, 'utf8');
  console.log('Successfully added GSC handler to apiRouter.cjs');
}
