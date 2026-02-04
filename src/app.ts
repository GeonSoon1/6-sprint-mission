import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import productRouters from './modules/products/product.router';
import articleRouters from './modules/articles/article.router';
import commentRouters from './modules/comments/comment.router';
import userRouter from './modules/users/user.router';
import imageRouter from './modules/images/image.router';
import notificationRouter from './modules/notifications/notification.router';
import { globalErrorHandler, defaultNotFoundHandler } from './middlewares/errorHandler/errorHandler';
import { optionalAuth } from './middlewares/auth';
import { STATIC_PATH } from './libs/constants';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use(STATIC_PATH, express.static('src/public'));

app.use(optionalAuth);
app.use('/products', productRouters);
app.use('/articles', articleRouters);
app.use('/comments', commentRouters);
app.use('/users', userRouter);
app.use('/images', imageRouter);
app.use('/notifications', notificationRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

export default app;