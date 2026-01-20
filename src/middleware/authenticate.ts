import prisma from '../lib/prisma';
import { verifyAccessToken } from '../lib/token';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import { Request, Response, NextFunction } from 'express';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const { userId } = verifyAccessToken(accessToken);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedError('유효하지 않은 토큰입니다.');
    }
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}
