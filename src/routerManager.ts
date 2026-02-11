import { EXPRESS } from './libs/constants';
import productRouter from './product/productRouter';
import articleRouter from './article/articleRouter';
import commentRouter from './comment/commentRouter';
import uploadRouter from './upload/uploadRouter';
import userRouter from './user/userRouter';
import notificationRouter from './notification/notificationRouter';

export const RouterManager = EXPRESS.Router();



RouterManager.use('/products', productRouter);
RouterManager.use('/articles', articleRouter);
RouterManager.use('/comments', commentRouter);
RouterManager.use('/files', uploadRouter);
RouterManager.use('/auth', userRouter);
RouterManager.use('/notifications', notificationRouter);