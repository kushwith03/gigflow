import { z } from 'zod';

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name is too short'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
    source: z.enum(['Website', 'Instagram', 'Referral'], { required_error: 'Source is required' }),
  }),
});

export const updateLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
    source: z.enum(['Website', 'Instagram', 'Referral']).optional(),
  }),
});

export const leadQuerySchema = z.object({
  query: z.object({
    status: z.string().optional(),
    source: z.string().optional(),
    search: z.string().optional(),
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    sort: z.enum(['latest', 'oldest']).optional().default('latest'),
  }),
});
