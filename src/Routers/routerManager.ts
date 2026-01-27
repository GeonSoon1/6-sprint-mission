import { EXPRESS } from '../libs/constants';
import productRouter from './productRouter';
import articleRouter from './articleRouter';
import commentRouter from './commentRouter';
import uploadRouter from './uploadRouter';
import userRouter from './userRouter';
import notificationRouter from './notificationRouter';

export const RouterManager = EXPRESS.Router();



RouterManager.use('/products', productRouter);
RouterManager.use('/articles', articleRouter);
RouterManager.use('/comments', commentRouter);
RouterManager.use('/files', uploadRouter);
RouterManager.use('/auth', userRouter);
RouterManager.use('/notifications', notificationRouter);