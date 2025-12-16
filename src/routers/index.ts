import { Router } from 'express';
import userRouter from './userRouter';
import authRouter from './authRouter';
import productRouter from './productRouter';
import articleRouter from './articleRouter';
import productCommentRouter from './productCommentRouter';
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
