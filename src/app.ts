import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { uploadPath, errorHandler } from '@middlewares';

import router from './routers';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(router);
app.use('/upload', express.static(uploadPath));
app.use(errorHandler);

export default app;
