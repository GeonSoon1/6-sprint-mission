import express from 'express';
import { authRouter } from './authRouter.js';
import userRouter from './userRouter.js';
import productRouter from './productRouter.js';
import articleRouter from './articleRouter.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/articles', articleRouter);

export default router;
