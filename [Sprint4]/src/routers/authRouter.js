import { Router } from 'express';
import { refresh } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/refresh', refresh);

export { authRouter };
