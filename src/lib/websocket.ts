import http from 'http';
import { Server } from 'socket.io';

export function setupWebSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && typeof userId === 'string') {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} connected and joined room: user_${userId}`);
    } else {
      console.log('User connected without a valid userId');
    }

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

export default setupWebSocket;
