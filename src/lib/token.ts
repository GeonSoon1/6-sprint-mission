import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants';

// 토큰 생성
function createTokens(userId: number) {
  const payload = { id: userId };
  const accessExpiresIn: object = { expiresIn: '1h' };
  const refreshExpiresIn: object = { expiresIn: '7d' };

  const accessToken = jwt.sign(
    payload,
    JWT_ACCESS_TOKEN_SECRET,
    accessExpiresIn
  );

  const refreshToken = jwt.sign(
    payload,
    JWT_REFRESH_TOKEN_SECRET,
    refreshExpiresIn
  );

  return { accessToken, refreshToken };
}

interface TokenPayloadId {
  id: number;
}

// 토큰 검증
function verifyAccessToken(token: string) {
  // Type assertion 형식
  const decodedUser = jwt.verify(
    token,
    JWT_ACCESS_TOKEN_SECRET
  ) as TokenPayloadId;

  return { userId: decodedUser.id };
}

// Refresh Token을 활용하여 토큰 재발급
function verifyRefreshToken(token: string) {
  // Type Guard 형식
  const decodedUser = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);

  if (typeof decodedUser === 'string') {
    throw new Error('Invalid token payload');
  }

  return { userId: decodedUser.id };
}

export { createTokens, verifyAccessToken, verifyRefreshToken };
