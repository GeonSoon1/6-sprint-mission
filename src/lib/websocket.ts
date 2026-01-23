import http from 'http';
import { Server } from 'socket.io';
import { SocketService } from '../services/socketService';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET as JWT_SECRET } from './constants';

export function setupWebSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.accessToken ||
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('❌ [Socket] 인증 토큰이 없습니다. (접속 거부)');
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      (socket as any).userId = decoded.id;
      next();
    } catch (err) {
      console.log('❌ [Socket] 유효하지 않은 토큰입니다.');
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as any).userId;

    socket.join(`user-${userId}`);
    console.log(`✅ [Socket] 유저 ${userId} 연결됨 (Socket ID: ${socket.id})`);

    socket.on('disconnect', () => {
      console.log(`📡 [Socket] 유저 ${userId} 연결 해제`);
    });
  });

  SocketService.getInstance().initialize(io);

  console.log('🚀 [Socket] 서버 초기화 및 다중 인증 설정 완료');
  return io;
}

export default setupWebSocket;
