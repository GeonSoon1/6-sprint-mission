import { Server } from 'socket.io';
import http from 'http';
import { PORT } from '../lib/constants';
import { authenticateSocket } from './socketAuth';

let ioRef: Server | null = null;

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

  ioRef = io;

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    // room join 
    const user = socket.data.user;
    const userRoom = `user_${user.id}`;
    socket.join(userRoom);
    console.log(`User ${user.id} joined room: ${userRoom}`);
  

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  io.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
  return io;
}

export function notifyUser(userId: number, event: string, data: any) {
  if (!ioRef) {
    console.error('Socket.IO server is not initialized.');
    return;
  }

  const userRoom = `user_${userId}`;
  ioRef.to(userRoom).emit(event, data);
  console.log(`Notified user ${userId} in room ${userRoom} with event ${event}`);
}