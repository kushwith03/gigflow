import api from './api';

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const leadService = {
  getLeads: async (params: LeadFilters) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },

  getLead: async (id: string) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  createLead: async (data: any) => {
    const response = await api.post('/leads', data);
    return response.data;
  },

  updateLead: async (id: string, data: any) => {
    const response = await api.patch(`/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: string) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },
};
