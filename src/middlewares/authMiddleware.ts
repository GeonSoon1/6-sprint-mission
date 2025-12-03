import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_COOKIE_NAME, JWT_ACCESS_TOKEN_SECRET } from '../utils/constants';

export function authMiddleware(req, res, next) {
  const token = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    req.user = decoded;
  } catch (error) {}
  next();
}
