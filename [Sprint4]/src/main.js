import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from './lib/constants.js';
import { uploadsPath } from './middlewares/imageUpload.js';
import { errorHandler } from './middlewares/errorController.js';
import router from './routers/index.js';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(router);
app.use('/uploads', express.static(uploadsPath));
app.use(errorHandler);

// listener
app.listen(PORT || 3000, () =>
  console.log(`Server listening on port ${PORT}!`),
);
