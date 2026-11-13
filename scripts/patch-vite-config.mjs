import fs from 'fs';

let content = fs.readFileSync('vite.config.ts', 'utf8');
content = content.replace(
  'server: {\n    port: 5173,\n    host: true,\n  },',
  'server: {\n    port: 5173,\n    host: true,\n    watch: {\n      ignored: ["**/reports/**", "**/backup/**", "**/tests/**"],\n    },\n  },'
);
if (!content.includes('ignored: ["**/reports/**"')) {
  content = content.replace(
    'server: {\r\n    port: 5173,\r\n    host: true,\r\n  },',
    'server: {\r\n    port: 5173,\r\n    host: true,\r\n    watch: {\r\n      ignored: ["**/reports/**", "**/backup/**", "**/tests/**"],\r\n    },\r\n  },'
  );
}

fs.writeFileSync('vite.config.ts', content, 'utf8');
console.log('Successfully updated vite.config.ts');
