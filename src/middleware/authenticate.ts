import { prismaClient } from '../lib/prismaClient';
import { verifyAccessToken } from '../lib/token';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';
import { NextFunction, Request, Response } from 'express';

async function authenticate(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { userId } = verifyAccessToken(accessToken);
    const user = await prismaClient.user.findUnique({ where: { id: userId } });
    req.user = user;
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export default authenticate;
