import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prismaclient';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';
import { verifyAccessToken } from '../lib/token';

export default async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 쿠키 안에 Access Token이 있는지 확인
  const isAccessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  if (!isAccessToken)
    return res.status(401).json({ message: 'Cannot found AccessToken' });

  // 쿠키 안에 Access Token이 있다면, 사용자 정보 가져오기
  try {
    const { userId } = verifyAccessToken(isAccessToken);
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) return res.status(400).json({ message: 'Cannot found User' });

    req.user = user;
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 다음 비지니스 로직 실행하기
  next();
}
