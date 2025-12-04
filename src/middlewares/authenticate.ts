import { prisma } from '../utils/prisma';
import { verifyAccessToken } from '../utils/token';
import { ACCESS_TOKEN_COOKIE_NAME } from '../utils/constants';
import { RequestHandler } from 'express';

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

    if (!accessToken) {
      res.status(401).json({ message: '로그인이 필요합니다. (토큰 없음)' });
      return;
    }

    const payload = verifyAccessToken(accessToken);

    if (typeof payload === 'string' || !payload.userId) {
      throw new Error('토큰 페이로드가 유효하지 않습니다.');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      res.status(401).json({ message: '토큰 사용자가 존재하지 않습니다.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: '인증에 실패했습니다.(유효하지 않은 토큰)' });
  }
};
