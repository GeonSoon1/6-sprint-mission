import { Server, Socket } from 'socket.io';
import http from 'http';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import BadRequestError from './errors/BadRequestError';
import { JWT_ACCESS_TOKEN_SECRET } from '@lib/constants';

// 외부에서 io를 사용하기 위한 설정
let ioRef: Server;

export function setupWebSocket(server: http.Server) {
  console.log('🤖 hello! I`m websocket 🤖');

  const io = new Server(server, {
    path: '/chat',
    cors: {
      // origin: 'http://localhost:3000',
      origin: '*', // 모든 origin 허용
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  // 외부에서 io를 사용하기 위한 설정
  ioRef = io;

  io.use((socket, next) => {
    const token = socket.handshake.auth.accessToken;
    if (!token) return next(new Error('로그인 필요'));

    try {
      const payload = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
      (socket as any).user = payload;
      next();
    } catch {
      next(new Error('JWT 인증 실패'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Connecting ☑️');

    // 연결 후 유저 id로 room 접속
    socket.join(String((socket as any).user.id));
    console.log('Joined rooms:', Array.from(socket.rooms));

    // 연결되지 않는 경우
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  io.on('error', (error) => {
    console.error('Socket.IO server error', error);
  });
}

export function notifyToUser(userId: number, event: string, payload: any) {
  ioRef.to(String(userId)).emit(event, payload);
}
