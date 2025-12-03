import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants.js';
import { TokenPayload, TokenPair } from '../types/index.js';

export function generateTokens(userId: number): TokenPair {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET as string, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET as string, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET as string) as TokenPayload;
  return { id: decoded.id };
}

export function verifyRefreshToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET as string) as TokenPayload;
  return { id: decoded.id };
}


