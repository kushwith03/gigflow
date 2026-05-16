import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import Lead from './models/lead.model.js';
import { env } from './config/env.js';
import type { IUser } from './types/user.types.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.info('Connecting to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Lead.deleteMany();
    console.info('Existing data cleared');

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

    const seededUsers = await User.create(users as Partial<IUser>[]);
    console.info('Users seeded successfully');

    const adminId = seededUsers.find((u: IUser) => u.role === 'admin')?._id;

    if (adminId) {
      const leads = [
        {
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          status: 'New',
          source: 'Website',
          createdBy: adminId,
        },
        {
          name: 'Priya Singh',
          email: 'priya@example.com',
          status: 'Qualified',
          source: 'Instagram',
          createdBy: adminId,
        },
        {
          name: 'Amit Patel',
          email: 'amit@example.com',
          status: 'Contacted',
          source: 'Referral',
          createdBy: adminId,
        },
        {
          name: 'Sneha Reddy',
          email: 'sneha@example.com',
          status: 'Lost',
          source: 'Website',
          createdBy: adminId,
        },
        {
          name: 'Vikram Malhotra',
          email: 'vikram@example.com',
          status: 'New',
          source: 'Instagram',
          createdBy: adminId,
        },
      ];

      await Lead.create(leads);
      console.info('Leads seeded successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
