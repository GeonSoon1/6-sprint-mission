import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { verifyAccessToken } from './token';
import { ACCESS_TOKEN_COOKIE_NAME } from './constants';

type CookieMap = Record<string, string>;

let ioInstance: SocketIOServer | null = null;
const userSockets = new Map<number, Set<string>>();

function parseCookies(cookieHeader?: string): CookieMap {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce<CookieMap>((acc, part) => {
    const trimmed = part.trim();
    if (!trimmed) {
      return acc;
    }
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex < 0) {
      return acc;
    }
    const key = trimmed.slice(0, separatorIndex);
    const value = decodeURIComponent(trimmed.slice(separatorIndex + 1));
    acc[key] = value;
    return acc;
  }, {});
}

export function initializeSocketServer(server: http.Server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const tokenFromAuth = socket.handshake.auth?.accessToken;
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const tokenFromCookie = cookies[ACCESS_TOKEN_COOKIE_NAME];
      const accessToken = tokenFromAuth || tokenFromCookie;

      if (!accessToken) {
        return next(new Error('Unauthorized'));
      }

      const { id } = verifyAccessToken(accessToken);
      socket.data.userId = id;
      return next();
    } catch (error) {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId as number;
    const existingSockets = userSockets.get(userId) ?? new Set<string>();
    existingSockets.add(socket.id);
    userSockets.set(userId, existingSockets);

    socket.on('disconnect', () => {
      const sockets = userSockets.get(userId);
      if (!sockets) {
        return;
      }
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        userSockets.delete(userId);
      }
    });
  });

  ioInstance = io;
  return io;
}

export function emitNotificationToUser(userId: number, payload: unknown) {
  emitToUser(userId, 'notification', payload);
}

export function emitToUser(userId: number, event: string, payload: unknown) {
  if (!ioInstance) {
    return;
  }
  const sockets = userSockets.get(userId);
  if (!sockets || sockets.size === 0) {
    return;
  }
  sockets.forEach((socketId) => {
    ioInstance?.to(socketId).emit(event, payload);
  });
}
