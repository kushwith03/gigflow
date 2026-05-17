import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import Lead from './models/lead.model.js';
import { env } from './config/env.js';
import type { IUser } from './types/user.types.js';
import type { LeadStatus, LeadSource } from './types/lead.types.js';

dotenv.config();

const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Karan', 'Neha', 'Rohan', 'Pooja', 'Siddharth', 'Kavya', 'Aditya', 'Riya', 'Arjun', 'Meera', 'Varun', 'Nisha', 'Aakash', 'Simran', 'James', 'Emma', 'William', 'Olivia', 'Michael', 'Sophia', 'Alexander', 'Isabella', 'David', 'Mia'];
const lastNames = ['Sharma', 'Singh', 'Patel', 'Reddy', 'Malhotra', 'Gupta', 'Kumar', 'Jain', 'Shah', 'Agarwal', 'Verma', 'Yadav', 'Chauhan', 'Rao', 'Das', 'Nair', 'Menon', 'Pillai', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company.com', 'techcorp.in', 'startup.io', 'enterprise.net', 'globalbiz.com'];
const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
const sources: LeadSource[] = ['Website', 'Instagram', 'LinkedIn', 'Referral', 'Facebook Ads', 'Cold Email', 'WhatsApp'];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)] as T;
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateMockLeads = (count: number, adminId: mongoose.Types.ObjectId) => {
  const leads = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6); // Spread over last 6 months

  // Track emails to ensure uniqueness
  const emailSet = new Set<string>();

  while (leads.length < count) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomElement(domains)}`;
    
    // Ensure unique emails
    let counter = 1;
    while (emailSet.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@${getRandomElement(domains)}`;
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

  // Sort them by createdAt to make them look naturally inserted over time
  return leads.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

const seedData = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.info('Connecting to MongoDB for seeding...');

    // Clear existing data safely
    await User.deleteMany({});
    await Lead.deleteMany({});
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
      const mockLeads = generateMockLeads(55, adminId as mongoose.Types.ObjectId);
      await Lead.create(mockLeads);
      console.info(`Successfully seeded ${mockLeads.length} diverse leads.`);
    }

    console.info('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
