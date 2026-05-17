import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import Lead from './models/lead.model.js';
import { env } from './config/env.js';
import type { IUser } from './types/user.types.js';
import type { LeadStatus, LeadSource } from './types/lead.types.js';

dotenv.config();

/**
 * PRODUCTION-QUALITY SEED DATA GENERATOR
 * This script populates the database with a diverse, realistic dataset 
 * for demonstration purposes, ensuring multiple pages of pagination.
 */

const firstNames = [
  'Arjun', 'Priya', 'Siddharth', 'Ananya', 'Rohan', 'Kavya', 'Aditya', 'Meera', 'Vikram', 'Ishani', 
  'James', 'Emma', 'Liam', 'Olivia', 'Michael', 'Sophia', 'Alexander', 'Isabella', 'David', 'Mia',
  'Aarav', 'Saanvi', 'Vivaan', 'Zoya', 'Kabir', 'Myra', 'Ishaan', 'Aadhya', 'Reyansh', 'Diya',
  'William', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Daniel', 'Abigail'
];

const lastNames = [
  'Sharma', 'Singh', 'Patel', 'Reddy', 'Malhotra', 'Gupta', 'Kumar', 'Jain', 'Shah', 'Agarwal',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Verma', 'Yadav', 'Chauhan', 'Rao', 'Das', 'Nair', 'Menon', 'Pillai', 'Bakshi', 'Mehta',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson'
];

const domains = [
  'techcorp.in', 'global-solutions.com', 'innovate.io', 'bluechip.net', 'startupfoundry.com', 
  'enterprise.org', 'digitalpulse.in', 'apex-systems.com', 'horizon-biz.com', 'quantum-labs.io'
];

const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
const sources: LeadSource[] = ['Website', 'Instagram', 'LinkedIn', 'Referral', 'Facebook Ads', 'Cold Email'];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)] as T;

const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateMockLeads = (count: number, adminId: mongoose.Types.ObjectId) => {
  const leads = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  const emailSet = new Set<string>();

  while (leads.length < count) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const domain = getRandomElement(domains);
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
    
    // Ensure uniqueness
    let counter = 1;
    while (emailSet.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@${domain}`;
      counter++;
    }
    emailSet.add(email);

    leads.push({
      name: `${firstName} ${lastName}`,
      email,
      status: getRandomElement(statuses),
      source: getRandomElement(sources),
      createdBy: adminId,
      createdAt: getRandomDate(startDate, endDate),
    });
  }

  // Sort by date to simulate real growth
  return leads.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

const seedData = async () => {
  try {
    console.info('🚀 Starting database seeding...');
    await mongoose.connect(env.MONGODB_URI);
    console.info('📡 Connected to MongoDB');

    // Clean current data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.info('🧹 Existing data cleared');

    // Seed Admin & Sales Users
    const users = [
      {
        name: 'System Admin',
        email: 'admin@gigflow.com',
        password: 'password123',
        role: 'admin',
      },
      {
        name: 'Sales Representative',
        email: 'sales@gigflow.com',
        password: 'password123',
        role: 'sales',
      },
    ];

    const seededUsers = await User.create(users as Partial<IUser>[]);
    console.info('👤 Users seeded successfully (Admin + Sales)');

    const adminId = seededUsers.find((u: IUser) => u.role === 'admin')?._id;

    if (adminId) {
      // Generate 65 leads to ensure 6+ pages of pagination (at 10 per page)
      const leadCount = 65;
      const mockLeads = generateMockLeads(leadCount, adminId as mongoose.Types.ObjectId);
      await Lead.create(mockLeads);
      console.info(`📊 Seeded ${leadCount} realistic leads across multiple pages.`);
    }

    console.info('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    // Graceful closure for Render/Production environments
    await mongoose.connection.close();
    console.info('🔌 MongoDB connection closed');
  }
};

seedData();
