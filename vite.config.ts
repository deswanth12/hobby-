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
              delete require.cache[require.resolve('./server/apiRouter.cjs')];
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
              delete require.cache[require.resolve('./server/apiRouter.cjs')];
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
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-supabase': ['@supabase/supabase-js'],
        }
      }
    }
  },
});
