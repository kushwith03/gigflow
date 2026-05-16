import { Router } from 'express';
import * as leadController from '../controllers/lead.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../validations/lead.validation';

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
