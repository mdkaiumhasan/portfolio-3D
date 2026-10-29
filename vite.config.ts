import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const API_ROUTES: Record<string, string> = {
  '/api/auth': './api/auth.js',
  '/api/portfolio': './api/portfolio.js',
  '/api/upload': './api/upload.js',
  '/api/generate-blog': './api/generate-blog.js',
  '/api/messages': './api/messages.js'
};

function apiPlugin(): Plugin {
  return {
    name: 'api-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url || '/';
        const pathname = rawUrl.split('?')[0];

        if (pathname === '/admin' || pathname === '/admin/') {
          req.url = rawUrl.replace(/^\/admin\/?/, '/admin.html');
          return next();
        }

        const matchedRoute = Object.keys(API_ROUTES).find(
          (route) => pathname === route || pathname.startsWith(`${route}/`)
        );

        if (matchedRoute) {
          try {
            const modulePath = API_ROUTES[matchedRoute];
            // @ts-ignore - Dynamic import of ESM serverless functions
            const { default: routeHandler } = await import(/* @vite-ignore */ modulePath);
            const chunks: Buffer[] = [];
            req.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
            req.on('end', async () => {
              const rawBody = Buffer.concat(chunks).toString('utf8');
              if (rawBody) {
                try {
                  (req as any).body = JSON.parse(rawBody);
                } catch {
                  (req as any).body = rawBody;
                }
              } else {
                (req as any).body = {};
              }

              const mockRes = {
                setHeader: (k: string, v: string) => res.setHeader(k, v),
                status: (code: number) => {
                  res.statusCode = code;
                  return {
                    json: (data: unknown) => {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(data));
                    },
                    end: () => res.end()
                  };
                }
              };

              await routeHandler(req, mockRes);
            });
            return;
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: e.message || 'Local API handler error' }));
            return;
          }
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return {
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
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@react-three') || id.includes('three-stdlib') || id.includes('maath')) {
                return 'r3f-vendor';
              }
              if (id.includes('/three/') || id.includes('\\three\\')) {
                return 'three';
              }
              if (id.includes('/react/') || id.includes('\\react\\') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'react-vendor';
              }
            }
            return undefined;
          }
        }
      }
    }
  };
});
