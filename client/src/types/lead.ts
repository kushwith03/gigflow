export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'LinkedIn' | 'Facebook Ads' | 'Cold Email' | 'WhatsApp' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface LeadsResponse {
  success: boolean;
  message: string;
  data: Lead[];
  meta: Pagination;
}
