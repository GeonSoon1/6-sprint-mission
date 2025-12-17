import { EXPRESS } from '../libs/constants';
import productRouter from './productRouter';
import articleRouter from './articleRouter';
import commentRouter from './commentRouter';
import uploadRouter from './uploadRouter';
import userRouter from './userRouter';


export const RouterManager = EXPRESS.Router();



RouterManager.use('/products', productRouter);
RouterManager.use('/articles', articleRouter);
RouterManager.use('/comments', commentRouter);
RouterManager.use('/files', uploadRouter);
RouterManager.use('/user', userRouter);
