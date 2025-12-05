import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import errorHandler from './middleware/errorhandler';
import { PORT } from './lib/constants';

import imgRouter from './routers/imgRoute';
import authRoute from './routers/authRoute';
// import productRoute from './routers/productRoute.js';
// import articleRoute from './routers/articleRoute.js';
import userRoute from './routers/userRoute';

const app = express();

app.use(cors());
app.use(express.json());

// 쿠키 작업
app.use(cookieParser());

// 이미지 Multer 먼저 실행
app.use('/files', imgRouter);
// app.use('/files', express.static('files'));

// 각각 route 작업
app.use('/auth', authRoute);
// app.use('/products', productRoute);
// app.use('/articles', articleRoute);
app.use('/mypage', userRoute);

app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  console.log('start app🚀');
});

app.listen(PORT, () => {
  console.log('localhost 3000🚀');
});
