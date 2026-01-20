import 'reflect-metadata';
import http from 'http';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT, initSocket } from '@lib';
import { uploadPath, errorHandler } from '@middlewares';

import router from './routers';

const app = express();
const httpServer = http.createServer(app);
initSocket(httpServer);

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(router);
app.use('/upload', express.static(uploadPath));
app.use(errorHandler);

// app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
