import { prisma } from '../utils/prisma';
import { verifyAccessToken } from '../utils/token';
import { ACCESS_TOKEN_COOKIE_NAME } from '../utils/constants';

export async function authenticate(req, res, next) {
  try {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

    if (!accessToken) {
      return res.status(401).json({ message: '로그인이 필요합니다. (토큰 없음)' });
    }
    const { userId } = verifyAccessToken(accessToken);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ message: '토큰 사용자가 존재하지 않습니다.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: '인증에 실패했습니다.(유효하지 않은 토큰)' });
  }
}
