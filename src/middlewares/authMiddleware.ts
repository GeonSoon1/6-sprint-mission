import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_COOKIE_NAME, JWT_ACCESS_TOKEN_SECRET } from '../utils/constants';
import { RequestHandler } from 'express';
import { prisma } from '../utils/prisma';

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const token = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);

    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      const userId = (decoded as any).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        req.user = user;
      }
    }
  } catch (error) {}
  next();
};
