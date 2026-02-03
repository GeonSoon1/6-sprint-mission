import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { uploadPath, errorHandler, upload } from '@middlewares';

import router from './routers';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(router);
app.use('/upload', express.static(uploadPath));
app.use(errorHandler);

app.post('/test/upload', upload.single('file'), (req, res) => {
  console.log('업로드 된 파일 정보: ', req.file);
  res.json({ url: (req.file as any)?.location || '실패 또는 로컬 저장' });
});

export default app;
