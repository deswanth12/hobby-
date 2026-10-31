import fs from 'fs';

let content = fs.readFileSync('server/apiRouter.cjs', 'utf8');
const isCRLF = content.includes('\r\n');
const nl = isCRLF ? '\r\n' : '\n';

const oldPattern = 'return (u.username === username || u.username === username.split(\'@\')[0]);';

const newLines = [
  'const uName = u.username.toLowerCase();',
  '      const input = username.toLowerCase();',
  '      const inputPrefix = input.split(\'@\')[0];',
  '      if (uName === \'kavitha\') {',
  '        return (',
  '          input === \'kavitha\' || ',
  '          inputPrefix === \'kavitha\' || ',
  '          input === \'cakavithasrj@gmail.com\' || ',
  '          inputPrefix === \'cakavithasrj\'',
  '        );',
  '      }',
  '      if (uName === \'admin\') {',
  '        return input === \'admin\' || inputPrefix === \'admin\';',
  '      }',
  '      return uName === input || uName === inputPrefix;'
].join(nl + '      ');

if (content.includes(oldPattern)) {
  content = content.replace(oldPattern, newLines);
  fs.writeFileSync('server/apiRouter.cjs', content, 'utf8');
  console.log('Successfully replaced login username pattern.');
} else {
  console.error('Pattern not found.');
}
