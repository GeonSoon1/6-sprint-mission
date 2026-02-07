// TODO) Socket.IO: 실시간 알림용 서버
import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { authService, type TokenPayload } from '../services/auth-service.js';

let io: Server | null = null;

export const SOCKET_EVENT_NOTIFICATION = 'notification';

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const header = socket.handshake.headers.authorization;
    const bearerToken =
      typeof header === 'string' ? header.split(' ')[1] : null;
    const token = socket.handshake.auth?.token || bearerToken;

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    try {
      const decoded = authService.verifyAccessToken(token) as TokenPayload;
      socket.data.userId = decoded.id;
      return next();
    } catch {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId as number | undefined;
    if (userId) {
      socket.join(`user:${userId}`);
    }
  });

  return io;
}

export function emitToUser<T>(userId: number, event: string, payload: T) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}
