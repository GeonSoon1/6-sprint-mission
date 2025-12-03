import jwt from 'jsonwebtoken';
import { Request } from 'express';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from './constants';

function generateTokens(userId: string) {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
  });
  return { accessToken, refreshToken };
}

function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }
  return { userId: decoded.id };
}

function verifyRefreshToken(token: string) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }
  return { userId: decoded.id };
}

export function getUserIdFromToken(req: Request) {
  const token = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload');
    }

    return decoded.id;
  } catch (error) {
    return null;
  }
}

export { generateTokens, verifyAccessToken, verifyRefreshToken };
