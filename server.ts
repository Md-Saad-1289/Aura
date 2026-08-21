import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import express from 'express';
import { createExpressApp } from './backend/app';
import { CONFIG } from './backend/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = createExpressApp();
const port = Number(process.env.PORT) || Number(CONFIG.PORT) || 3000;

// Serve static frontend build from dist in production if it exists
const distPath = path.resolve(__dirname, 'dist');
const distExists = fs.existsSync(distPath);

if (distExists) {
  app.use(express.static(distPath));

  // For SPA routing, send index.html for non-API requests
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/healthz') {
      return next();
    }
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Aura Atelier Server running at http://0.0.0.0:${port}`);
  console.log(`🍃 Connected to MongoDB Atlas & Cloudinary`);
});

