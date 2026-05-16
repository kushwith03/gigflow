import { Request, Response } from 'express';
import { asyncHandler } from '../utils/errors';
import { sendResponse } from '../utils/response';
import * as leadService from '../services/lead.service';
import { ILeadFilter } from '../types/lead.types';

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id as string;
  const lead = await leadService.createLead(req.body, userId);

  sendResponse(res, {
    statusCode: 201,
    message: 'Lead created successfully',
    data: lead,
  });
});

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const result = await leadService.getLeads(req.query as unknown as ILeadFilter);

  sendResponse(res, {
    message: 'Leads fetched successfully',
    data: result.leads,
    meta: result.pagination,
  });
});

export const getLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.getLeadById(req.params.id);

  sendResponse(res, {
    data: lead,
  });
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.updateLead(req.params.id, req.body);

  sendResponse(res, {
    message: 'Lead updated successfully',
    data: lead,
  });
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  await leadService.deleteLead(req.params.id);

  sendResponse(res, {
    message: 'Lead deleted successfully',
  });
});
