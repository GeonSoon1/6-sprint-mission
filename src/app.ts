import express from 'express';
import cors from 'cors';
import http from 'http';
import { initializeSocketServer } from './socket/socketServer';
import cookieParser from 'cookie-parser';
import productRouter from './router/productRouter';
import articleRouter from './router/articleRouter';
import { defaultNotFoundHandler, errorHandler } from './middleware/errorHandler';
import commentRouter from './router/commentRouter';
import uploadRouter from './router/uploadRouter';
import userRouter from './router/userRouter';
import authRouter from './router/authRouter';
import notificationRouter from './router/notificationRouter';

const app = express();

const server = http.createServer(app);
initializeSocketServer(server);
app.use(express.static('public'));

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, this is the API server.');
});

//product
app.use('/products', productRouter);

//article
app.use('/articles', articleRouter);

//comment
app.use('/comments', commentRouter);

//image
app.use('/files', express.static('uploads'));
app.use('/files', uploadRouter);

//auth
app.use('/auth', authRouter);

//user
app.use('/user', userRouter);

//notification
app.use('/notifications', notificationRouter);

app.use(defaultNotFoundHandler);
app.use(errorHandler);

export default server;
