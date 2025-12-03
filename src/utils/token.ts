import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants';

function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
  });
  return { accessToken, refreshToken };
}

function verifyAccessToken(token) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  return { userId: decoded.id };
}

function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  return { userId: decoded.id };
}

export function getUserIdFromToken(req) {
  const token = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
}

export { generateTokens, verifyAccessToken, verifyRefreshToken };
