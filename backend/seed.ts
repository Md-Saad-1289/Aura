import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'manager', 'customer'], default: 'customer' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export async function seedDatabaseIfEmpty() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding database with default admin users...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const defaultUsers = [
        {
          name: 'Elena Rostova',
          email: 'admin@aura-luxury.com',
          password: hashedPassword,
          role: 'admin',
        },
        {
          name: 'Marcus Vance',
          email: 'manager@aura-luxury.com',
          password: hashedPassword,
          role: 'manager',
        },
        {
          name: 'Jane Doe',
          email: 'customer@aura-luxury.com',
          password: hashedPassword,
          role: 'customer',
        },
      ];
      
      await User.insertMany(defaultUsers);
      console.log('✅ Database seeded successfully');
    }
  } catch (error) {
    console.warn('⚠️ Database seeding skipped or already exists:', error);
  }
}
