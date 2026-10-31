import fs from 'fs';

const path = 'src/config/adminConfig.ts';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('articles: ADMIN_SECRET_PATH')) {
  code = code.replace(
    /settings:\s*ADMIN_SECRET_PATH \? `\$\{ADMIN_SECRET_PATH\}\/settings` : '\/--unconfigured-portal--\/settings',/,
    "articles: ADMIN_SECRET_PATH ? `${ADMIN_SECRET_PATH}/articles` : '/--unconfigured-portal--/articles',\n  settings: ADMIN_SECRET_PATH ? `${ADMIN_SECRET_PATH}/settings` : '/--unconfigured-portal--/settings',"
  );
  fs.writeFileSync(path, code, 'utf8');
  console.log('Added articles route to adminConfig.ts');
} else {
  console.log('Already present');
}
