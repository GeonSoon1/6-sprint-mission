import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { PUBLIC_PATH, STATIC_PATH } from '@lib/constants';
import articlesRouter from '@/routers/article.router';
import productsRouter from '@/routers/product.router';
import commentsRouter from '@/routers/comment.router';
import imagesRouter from '@/routers/image.router';
import authRouter from '@/routers/auth.router';
import usersRouter from '@/routers/user.router';
import notificationRouter from '@/routers/notification.router';
import { defaultNotFoundHandler, globalErrorHandler } from '@/controllers/error.controller';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use('/articles', articlesRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/images', imagesRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/notifications', notificationRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

export default app;
