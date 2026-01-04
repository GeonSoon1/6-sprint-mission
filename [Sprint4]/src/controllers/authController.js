import { authService } from '../services/authService.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';

export const refresh = async (req, res, next) => {
  try {
    // 1. 요청 쿠키에서 리프레시 토큰 가져오기(나중에 service로 옮길 수도 있음)
    const refreshToken = req.cookies['refresh-token'];

    if (!refreshToken) {
      const error = new Error('리프레시 토큰이 없습니다.');
      error.status = 401;
      throw error;
    }

    // 2. 새로운 액세스 토큰 발급
    const newAccessToken = await authService.refresh(refreshToken);

    // 3. 쿠키에 새로운 액세스 토큰 저장
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ message: '토큰이 성공적으로 갱신되었습니다.' });
  } catch (error) {
    next(error);
  }
};
