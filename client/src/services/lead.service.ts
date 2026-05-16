import { Lead, LeadFilters, LeadsResponse } from '@/types/lead';
import api from './api';

export const leadService = {
  getLeads: async (params: LeadFilters): Promise<LeadsResponse> => {
    const response = await api.get('/leads', { params });
    return response.data;
  },

  getLead: async (id: string): Promise<{ data: Lead }> => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  createLead: async (data: Partial<Lead>): Promise<{ data: Lead }> => {
    const response = await api.post('/leads', data);
    return response.data;
  },

  updateLead: async (id: string, data: Partial<Lead>): Promise<{ data: Lead }> => {
    const response = await api.patch(`/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },
};
