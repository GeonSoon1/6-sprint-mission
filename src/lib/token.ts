import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants';

interface UserJwtPayload extends JwtPayload {
  id: number;
}

export function generateTokens(userId: number) {
  const payload = { id: userId };
  const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
  });
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as UserJwtPayload;
  return { userId: decoded.id };
}

export function verifyRefreshToken(token: string) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as UserJwtPayload;
  return { userId: decoded.id };
}
