import path from 'path';
import express from 'express';
import { createExpressApp } from './server/app';
import { CONFIG } from './server/config';

const app = createExpressApp();
const port = CONFIG.PORT || 3000;

// Serve static frontend build from dist in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// For SPA routing, send index.html for non-API requests
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Aura Atelier Server running at http://0.0.0.0:${port}`);
  console.log(`🍃 Connected to MongoDB Atlas & Cloudinary`);
});
