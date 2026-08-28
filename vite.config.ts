import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { createExpressApp } from './backend/app';

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-plugin',
    configureServer(server) {
      const app = createExpressApp();
      server.middlewares.use(app);
    },
  };
}

export default defineConfig(() => {
  const isAdmin = process.env.VITE_APP_MODE === 'admin';
  const outDir = isAdmin ? 'dist-admin' : 'dist';

  return {
    plugins: [expressApiPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: outDir,
      emptyOutDir: true,
      sourcemap: false,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
