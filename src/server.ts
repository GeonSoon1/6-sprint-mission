import express from 'express';
import cors from 'cors';
import productRouters from './modules/products/product.router';
import articleRouters from './modules/articles/article.router';
import commentRouters from './modules/comments/comment.router';
import {
  globalErrorHandler,
  defaultNotFoundHandler,
} from './middlewares/errorHandler/errorHandler';
import userRouter from './modules/users/user.router';
import cookieParser from 'cookie-parser';
import { optionalAuth } from './middlewares/auth';
import { PORT, STATIC_PATH } from './libs/constants';
import imageRouter from './modules/images/image.router';
import http from 'http';
import { setupSocket } from './socket';
import notificationRouter from './modules/notifications/notification.router';

const app = express();

const server = http.createServer(app);

setupSocket(server)

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

server.listen(PORT, () => {
  console.log('Server running');
});
