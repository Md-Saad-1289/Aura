import mongoose from 'mongoose';
import { CONFIG } from './config';

let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<boolean> {
  if (isConnected) return true;

  if (connectionPromise) {
    try {
      await connectionPromise;
      return true;
    } catch {
      return false;
    }
  }

  try {
    console.log('Connecting to MongoDB Atlas at aura cluster...');
    connectionPromise = mongoose.connect(CONFIG.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await connectionPromise;
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully [Database: aura]');
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    connectionPromise = null;
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
