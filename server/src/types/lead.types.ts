import { Document, Types } from 'mongoose';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'LinkedIn' | 'Referral' | 'Facebook Ads' | 'Cold Email' | 'WhatsApp';

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadFilter {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'latest' | 'oldest';
}
