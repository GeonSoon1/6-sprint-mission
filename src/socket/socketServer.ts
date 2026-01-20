import { Server } from 'socket.io';
import http from 'http';
import { PORT } from '../lib/constants';

export function initializeSocketServer(server: http.Server) {
  const io = new Server(server, {
    path: '/socket',
    cors: {
      //origin: '*',
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });
  console.log(`Socket.IO server initialized on port ${PORT}`);

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
}
