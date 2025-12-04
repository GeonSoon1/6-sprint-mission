import { REPLCommand } from 'repl';
import { authService } from '../services/authService';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../utils/constants';
import { Response, RequestHandler } from 'express';

const setCookie = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60, // 1시간
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
  });
};

export const signUp: RequestHandler = async (req, res) => {
  const { email, nickname, password } = req.body;
  const user = await authService.signUp(email, nickname, password);
  res.status(201).json(user);
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(email, password);

  setCookie(res, accessToken, refreshToken);

  res.status(200).json({ message: '로그인 성공', user: { id: user.id, email: user.email } });
};

export const refresh: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshToken) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshTokens(
      refreshToken,
    );
    setCookie(res, accessToken, newRefreshToken);
    res.status(200).json({ message: '토큰 갱신 성공' });
  } catch (err) {
    res.status(401).json({ message: '인증 만료' });
  }
};

export const logout: RequestHandler = (req, res) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  res.status(200).json({ message: '로그아웃 성공' });
};
