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

  app.use(cors());
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
