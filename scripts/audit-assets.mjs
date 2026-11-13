import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(getFiles(file));
    else if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
  });
  return results;
}

const files = getFiles('src');
const imgRegex = /src=["'](\/[^"']+\.(?:webp|png|jpg|svg))["']/g;
const missing = [];
const found = new Set();

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const assetPath = path.join('public', match[1]);
    found.add(match[1]);
    if (!fs.existsSync(assetPath)) {
      missing.push({ file: f, asset: match[1] });
    }
  }
});

console.log('Checked assets:', Array.from(found));
console.log('Missing assets count:', missing.length);
if (missing.length > 0) {
  console.log('Missing assets:', missing);
}
