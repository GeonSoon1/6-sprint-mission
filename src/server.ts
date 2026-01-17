import express from 'express';
import cors from 'cors';
import productRouters from './routers/productRouter';
import articleRouters from './routers/articleRouter';
import commentRouters from './routers/commentRouter';
import {
  globalErrorHandler,
  defaultNotFoundHandler,
} from './middlewares/errorHandler/errorHandler';
import userRouter from './routers/userRouter';
import cookieParser from 'cookie-parser';
import { optionalAuth } from './middlewares/auth';
import { PORT } from './libs/constants';
import imageRouter from './routers/imageRouter';
import http from 'http';
import { setupSocket } from './socket';

const app = express();

const server = http.createServer(app);

setupSocket(server)

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

server.listen(PORT, () => {
  console.log('Server running');
});
