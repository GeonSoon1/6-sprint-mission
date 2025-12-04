import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_COOKIE_NAME, JWT_ACCESS_TOKEN_SECRET } from '../utils/constants';
import { RequestHandler } from 'express';

export const authMiddleware: RequestHandler = (req, res, next) => {
  const token = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);

    if (typeof decoded === 'object' && decoded !== null) {
      req.user = decoded;
    }
  } catch (error) {}
  next();
};
