import { Router } from 'express';
import { signup, login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateDTO } from '../middlewares/validate.middleware';
import { signupSchema, loginSchema } from '../dto/auth.dto';

const router = Router();

router.post('/signup', validateDTO(signupSchema), signup);
router.post('/login', validateDTO(loginSchema), login);
router.get('/me', authenticate, getMe);

export default router;
