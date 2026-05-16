import Lead from '../models/lead.model';
import { ILead, ILeadFilter } from '../types/lead.types';
import { AppError } from '../utils/errors';

export const createLead = async (leadData: Partial<ILead>, userId: string) => {
  const existingLead = await Lead.findOne({ email: leadData.email });
  if (existingLead) {
    throw new AppError('Lead with this email already exists', 400);
  }

  const lead = await Lead.create({
    ...leadData,
    createdBy: userId,
  });

  return lead;
};

export const getLeads = async (filters: ILeadFilter) => {
  const { status, source, search, page = 1, limit = 10, sort = 'latest' } = filters;

  const query: any = {};

  if (status) query.status = status;
  if (source) query.source = source;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const sortOrder = sort === 'latest' ? -1 : 1;

  const [leads, total] = await Promise.all([
    Lead.find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email'),
    Lead.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    leads,
    pagination: {
      total,
      page,
      totalPages,
      limit,
    },
  };
};

export const getLeadById = async (id: string) => {
  const lead = await Lead.findById(id).populate('createdBy', 'name email');
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
  return lead;
};

export const updateLead = async (id: string, updateData: Partial<ILead>) => {
  const lead = await Lead.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  return lead;
};

export const deleteLead = async (id: string) => {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
  return lead;
};
