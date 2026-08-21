import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  MONGODB_URL:
    process.env.MONGODB_URL ||
    'mongodb+srv://mdsaad1289:CxhvPcMnaJFLhBM6@cluster0.20jynkx.mongodb.net/aura',
  JWT_SECRET: process.env.JWT_SECRET || '9fE7&KpA!wQm2ZxR#C8T@D6JvB^N4LhY%S*U',
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'dhptequpx',
    API_KEY: process.env.CLOUDINARY_API_KEY || '723835296947698',
    API_SECRET: process.env.CLOUDINARY_API_SECRET || '9fQaZxh79L2wjvDXuSU9shCtD1I',
  },
};
