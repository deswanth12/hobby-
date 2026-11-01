import fs from 'fs';
import path from 'path';

const dirs = ['C:/kavatha ca/server', 'C:/kavatha ca/src', 'C:/kavatha ca/api'];
const envs = new Set();

function scan(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scan(full);
    } else if (f.endsWith('.js') || f.endsWith('.cjs') || f.endsWith('.ts') || f.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/(?:process\.env|import\.meta\.env)\.([A-Za-z0-9_]+)/g);
      for (const m of matches) {
        envs.add(m[1]);
      }
    }
  }
}

for (const d of dirs) scan(d);

console.log('Environment variables found in application code:');
for (const e of Array.from(envs).sort()) {
  console.log(`  - ${e}`);
}
