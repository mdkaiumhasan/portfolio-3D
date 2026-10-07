import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function apiPlugin(): Plugin {
  return {
    name: 'api-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') {
          req.url = '/admin.html';
        }

        if (req.url?.startsWith('/api/auth')) {
          try {
            // @ts-ignore
            const { default: authHandler } = await import('./api/auth.js');
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              (req as any).body = body ? JSON.parse(body) : {};
              const mockRes = {
                setHeader: (k: string, v: string) => res.setHeader(k, v),
                status: (code: number) => {
                  res.statusCode = code;
                  return {
                    json: (data: any) => {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(data));
                    },
                    end: () => res.end()
                  };
                }
              };
              await authHandler(req, mockRes);
            });
            return;
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message }));
            return;
          }
        }

        if (req.url?.startsWith('/api/portfolio')) {
          try {
            // @ts-ignore
            const { default: portfolioHandler } = await import('./api/portfolio.js');
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              if (body) {
                try { (req as any).body = JSON.parse(body); } catch (_) { (req as any).body = body; }
              }
              const mockRes = {
                setHeader: (k: string, v: string) => res.setHeader(k, v),
                status: (code: number) => {
                  res.statusCode = code;
                  return {
                    json: (data: any) => {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(data));
                    },
                    end: () => res.end()
                  };
                }
              };
              await portfolioHandler(req, mockRes);
            });
            return;
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message }));
            return;
          }
        }

        if (req.url?.startsWith('/api/upload')) {
          try {
            // @ts-ignore
            const { default: uploadHandler } = await import('./api/upload.js');
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              if (body) {
                try { (req as any).body = JSON.parse(body); } catch (_) { (req as any).body = body; }
              }
              const mockRes = {
                setHeader: (k: string, v: string) => res.setHeader(k, v),
                status: (code: number) => {
                  res.statusCode = code;
                  return {
                    json: (data: any) => {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(data));
                    },
                    end: () => res.end()
                  };
                }
              };
              await uploadHandler(req, mockRes);
            });
            return;
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message }));
            return;
          }
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.pdf'],
  server: {
    port: 3000,
    open: false,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html')
      },
      output: {
        manualChunks: {
          three: ['three'],
          'react-vendor': ['react', 'react-dom'],
          'r3f-vendor': ['@react-three/fiber', '@react-three/drei']
        }
      }
    }
  }
});
