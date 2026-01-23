import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { AuthPayload, NotificationData } from '../types/notification';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error('❌ 환경변수 JWT_ACCESS_TOKEN_SECRET이 설정되지 않았습니다!');
  }
  return secret;
};

export class SocketService {
  private static instance: SocketService;
  private io: Server | null = null;
  private readonly JWT_SECRET = getJwtSecret();

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(io: Server): void {
    if (this.io) return;
    this.io = io;

    this.io.use((socket, next) => {
      const token = socket.handshake.auth.accessToken;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(token, this.JWT_SECRET) as AuthPayload;
        socket.data.userId = decoded.id;

        next();
      } catch (err) {
        return next(new Error('Invalid token'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.userId;

      if (userId) {
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`✅ [Socket] 유저 ${userId}번 연결됨 (Room: ${roomName})`);
      }

      socket.on('disconnect', () => {
        console.log(`❌ [Socket] 유저 ${userId}번 나감`);
      });
    });
  }

  public emitToUser(userId: number, event: string, data: NotificationData): void {
    if (!this.io) {
      console.error('Socket.IO가 초기화 안 됐다.');
      return;
    }

    this.io.to(`user_${userId}`).emit(event, data);
  }
}
