import { Server, Socket } from 'socket.io';
import http from 'http';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import BadRequestError from './errors/BadRequestError';

// 외부에서 io를 사용하기 위한 설정
let ioRef: Server;

export function setupWebSocket(server: http.Server) {
  console.log('🤖 hello! I`m websocket 🤖');

  const io = new Server(server, {
    path: '/chat',
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // 외부에서 io를 사용하기 위한 설정
  ioRef = io;

  io.use((socket: Socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      throw new BadRequestError('인증정보(JWT 토큰)가 없습니다.');
    }

    const cookies = cookie.parse(cookieHeader);
    const token = cookies['access-token'];
    if (!token) {
      throw new BadRequestError('로그인이 필요합니다.');
    }

    try {
      // JWT 검증 (비밀키는 환경변수 등에서 관리)
      const payload = jwt.verify(token, 'YOUR_SECRET_KEY');
      // socket에 원하는 값 저장 가능
      (socket as any).user = payload;
      next();
    } catch (err) {
      next(new Error('JWT 인증 실패'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Connecting 📈');

    // 연결 후 유저 id로 room 접속
    socket.join(String((socket as any).user.id));

    socket.on('disconnect', () => {
      // 연결되지 않는 경우, 표기 될 메세지
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
