import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model';
import { env } from './config/env';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing users
    await User.deleteMany();
    console.log('🗑️ Existing users cleared');

    const users = [
      {
        name: 'Admin User',
        email: 'admin@gigflow.com',
        password: 'password123',
        role: 'admin',
      },
      {
        name: 'Sales User',
        email: 'sales@gigflow.com',
        password: 'password123',
        role: 'sales',
      },
    ];

    await User.create(users);
    console.log('✅ Users seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
