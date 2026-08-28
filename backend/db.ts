import mongoose from 'mongoose';
import { CONFIG } from './config';

let connectionAttempted = false;

export async function connectDB(): Promise<boolean> {
  if (connectionAttempted) {
    return mongoose.connection.readyState === 1;
  }
  connectionAttempted = true;

  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(CONFIG.MONGODB_URL, {
      retryWrites: true,
      w: 'majority',
    });
    console.log('✅ MongoDB Atlas connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
}

export function getDB() {
  return mongoose.connection.db;
}
