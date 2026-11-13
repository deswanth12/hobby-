import fs from 'fs';

let lines = fs.readFileSync('src/components/Navbar.tsx', 'utf8').split(/\r?\n/);
let output = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('Knowledge Bank')) {
    // If next line is just '<Link', skip next line as well
    if (i + 1 < lines.length && lines[i + 1].trim() === '<Link') {
      i++;
    }
    continue;
  }
  if (line.trim() === '<Link' && i + 1 < lines.length && lines[i + 1].includes('to="/contact"')) {
    // dangling <Link right before <Link to="/contact"
    continue;
  }
  output.push(line);
}

fs.writeFileSync('src/components/Navbar.tsx', output.join('\r\n'), 'utf8');
console.log('Fixed Navbar lines');
