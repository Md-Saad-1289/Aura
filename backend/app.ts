import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import { seedDatabaseIfEmpty } from './seed';
import { authRouter } from './routes/auth';
import { productsRouter } from './routes/products';
import { categoriesRouter } from './routes/categories';
import { ordersRouter } from './routes/orders';
import { couponsRouter } from './routes/coupons';
import { reviewsRouter } from './routes/reviews';
import { usersRouter } from './routes/users';
import { settingsRouter } from './routes/settings';
import { uploadRouter } from './routes/upload';
import { healthRouter } from './routes/health';

export function createExpressApp() {
  const app = express();

  // Permissive CORS for cross-origin deployments (Render Frontend & Admin apps)
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Initialize DB and Seed
  connectDB()
    .then((connected) => {
      if (connected) {
        seedDatabaseIfEmpty();
      }
    })
    .catch((err) => {
      console.warn('Initial DB connect attempt in background:', err);
    });

  // Root & Health Check endpoints for Render
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      name: 'Aura Luxury Ecommerce API',
      version: '1.0.0',
      database: 'MongoDB Atlas',
      endpoints: {
        health: '/api/health',
        products: '/api/products',
        categories: '/api/categories',
        orders: '/api/orders',
        auth: '/api/auth',
      },
    });
  });

  app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
  });

  // Mount API routes
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/coupons', couponsRouter);
  app.use('/api/reviews', reviewsRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/upload', uploadRouter);

  return app;
}
