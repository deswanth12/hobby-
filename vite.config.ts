import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { handleApiRequest } = require('./server/apiRouter.cjs');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'practice-api-server',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/api/')) {
            try {
              Object.keys(require.cache).forEach(k => {
                if (k.includes('/server/') || k.includes('\\server\\')) {
                  delete require.cache[k];
                }
              });
              const { handleApiRequest: freshHandler } = require('./server/apiRouter.cjs');
              freshHandler(req, res);
            } catch {
              handleApiRequest(req, res);
            }
          } else {
            next();
          }
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/api/')) {
            try {
              Object.keys(require.cache).forEach(k => {
                if (k.includes('/server/') || k.includes('\\server\\')) {
                  delete require.cache[k];
                }
              });
              const { handleApiRequest: freshHandler } = require('./server/apiRouter.cjs');
              freshHandler(req, res);
            } catch {
              handleApiRequest(req, res);
            }
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: ["**/reports/**", "**/backup/**", "**/tests/**", "**/tmp/**", "**/.temp*/**"],
    },
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
          }
          if (id.includes('src/components/knowledge-bank') || id.includes('src\\components\\knowledge-bank')) {
            return 'feature-calculators';
          }
        }
      }
    }
  },
});
