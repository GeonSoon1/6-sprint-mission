import express from 'express';
import cors from 'cors';
import productRouters from './routers/productRouter.js';
import articleRouters from './routers/articleRouter.js';
import commentRouters from './routers/commentRouter.js';
import {
  globalErrorHandler,
  defaultNotFoundHandler,
} from './middlewares/errorHandler/errorHandler.js';
import userRouter from './routers/userRouter.js';
import cookieParser from 'cookie-parser';
import { optionalAuth } from './middlewares/auth.js';
import { PORT } from './libs/constants.js';
import imageRouter from './routers/imageRouter.js';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use(optionalAuth);
app.use('/products', productRouters);
app.use('/articles', articleRouters);
app.use('/comments', commentRouters);
app.use('/users', userRouter);
app.use('/images', imageRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log('Server running');
});
