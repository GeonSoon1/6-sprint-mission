import http from 'http';
import { Server, Socket } from 'socket.io';
import { ACCESS_TOKEN_COOKIE_NAME } from './constants';
import * as authService from '../services/authService';

const USER_ROOM_PREFIX = 'user:';

let io: Server | null = null;

function parseCookies(cookieHeader?: string) {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) {
    return cookies;
  }
  cookieHeader.split(';').forEach((cookie) => {
    const [rawName, ...rest] = cookie.trim().split('=');
    if (!rawName) {
      return;
    }
    cookies[rawName] = decodeURIComponent(rest.join('='));
  });
  return cookies;
}

function getAccessTokenFromHandshake(socket: Socket) {
  const authToken = socket.handshake.auth?.accessToken;
  if (typeof authToken === 'string' && authToken.length > 0) {
    return authToken;
  }
  const cookies = parseCookies(socket.request.headers.cookie);
  return cookies[ACCESS_TOKEN_COOKIE_NAME];
}

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const accessToken = getAccessTokenFromHandshake(socket);
      const user = await authService.authenticate(accessToken);
      socket.data.userId = user.id;
      socket.join(`${USER_ROOM_PREFIX}${user.id}`);
      next();
    } catch (error) {
      next(error as Error);
    }
  });

  io.on('connection', () => {
    // No-op: room join handled in middleware
  });

  return io;
}

export function emitToUser(userId: number, event: string, payload: unknown) {
  if (!io) {
    return;
  }
  io.to(`${USER_ROOM_PREFIX}${userId}`).emit(event, payload);
}
