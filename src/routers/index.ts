import { Router } from 'express';
import authRouter from './authRouter';
import userRouter from './userRouter';
import productRouter from './productRouter';
import productCommentRouter from './productCommentRouter';
import articleRouter from './articleRouter';
import articleCommentRouter from './articleCommentRouter';

const router = Router();

router.get('/', (req, res) => {
  res.send('ok');
});

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/articles', articleRouter);

router.use(productCommentRouter);
router.use(articleCommentRouter);

export default router;
