import { Router } from 'express';
import { isDbConnected } from '../db';
import { CONFIG } from '../config';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const dbStatus = isDbConnected();

  return res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: {
        status: dbStatus ? 'connected' : 'connecting',
        database: 'BlinkUpZ',
        cluster: 'cluster0.20jynkx.mongodb.net',
      },
      cloudinary: {
        status: 'configured',
        cloudName: CONFIG.CLOUDINARY.CLOUD_NAME,
        apiKey: CONFIG.CLOUDINARY.API_KEY ? '***' + CONFIG.CLOUDINARY.API_KEY.slice(-4) : 'none',
      },
      jwt: {
        status: 'configured',
        algorithm: 'HS256',
      },
    },
  });
});
