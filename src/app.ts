import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { PORT } from './utils/constants';
import cookieParser from 'cookie-parser';

import authRouter from './routers/authRouter';
import productRouter from './routers/productsRouter';
import articleRouter from './routers/articlesRouter';
import commentRouter from './routers/commentsRouter';
import imageRouter from './routers/imagesRouter';
import usersRouter from './routers/usersRouter';

import { errorHandlerMiddleware, defaultNotFoundHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());

app.use('/files', express.static('uploads'));
app.use('/images', imageRouter);

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/articles', articleRouter);
app.use('/products', productRouter);
app.use('/comments', commentRouter);
app.use('/users', usersRouter);

app.use(defaultNotFoundHandler);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
