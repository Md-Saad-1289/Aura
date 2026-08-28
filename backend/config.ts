export const CONFIG = {
  PORT: process.env.PORT || '3000',
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb+srv://mdsaad1289:CxhvPcMnaJFLhBM6@cluster0.20jynkx.mongodb.net/aura',
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'dhptequpx',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '723835296947698',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '9fQaZxh79L2wjvDXuSU9shCtD1I',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
