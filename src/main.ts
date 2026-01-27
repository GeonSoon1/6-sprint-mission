import 'reflect-metadata';
import http from 'http';
import { PORT, initSocket } from '@lib';
import app from './app';

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
