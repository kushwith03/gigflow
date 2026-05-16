import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { loginSchema, registerSchema } from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', protect, authController.getMe);

export default router;
