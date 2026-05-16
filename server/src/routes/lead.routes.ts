import { Router } from 'express';
import * as leadController from '../controllers/lead.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../validations/lead.validation.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .post(validate(createLeadSchema), leadController.createLead)
  .get(validate(leadQuerySchema), leadController.getLeads);

router
  .route('/:id')
  .get(leadController.getLead)
  .patch(validate(updateLeadSchema), leadController.updateLead)
  .delete(authorize('admin'), leadController.deleteLead);

export default router;
