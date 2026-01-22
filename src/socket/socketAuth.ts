import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET } from '../lib/constants';

interface DecodedToken {
  id: number;
}

export function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
  try {
    const accesstoken = socket.handshake.auth.accessToken;

    if (!accesstoken) {
      return next(new Error('제공된 토큰이 없습니다.'));
    }

    const decoded = jwt.verify(accesstoken, JWT_ACCESS_TOKEN_SECRET) as DecodedToken;
    socket.data.user = { id: decoded.id };
    next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid token'));
  }
}
