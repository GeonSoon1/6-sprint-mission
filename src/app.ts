import express, { Request, Response } from 'express';
// import cookieParser from 'cookie-parser';

// import cors from 'cors';
// import errorHandler from './middleware/errorhandler.js';
import { PORT } from './lib/constants';

// import imgRouter from './routers/imgRoute.js';
// import authRoute from './routers/authRoute.js';
// import productRoute from './routers/productRoute.js';
// import articleRoute from './routers/articleRoute.js';
// import userRoute from './routers/userRoute.js';

const app = express();

// app.use(cors());
app.use(express.json());

// 쿠키 작업
// app.use(cookieParser());

// 이미지 Multer 먼저 실행
// app.use('/files', imgRouter);
// app.use('/files', express.static('files'));

// 각각 route 작업
// app.use('/auth', authRoute);
// app.use('/products', productRoute);
// app.use('/articles', articleRoute);
// app.use('/mypage', userRoute);

// comment CRUD 작업은 product, article에서 직접 작업 진행
// app.use('/comments', commentRoute);

// app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  console.log('start app🚀');
});

app.listen(PORT, () => {
  console.log('localhost 3000🚀');
});
