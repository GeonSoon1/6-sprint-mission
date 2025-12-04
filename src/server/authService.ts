import { Response } from 'express';
import prisma from '../lib/prismaclient';
import {
  NODE_ENV,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../lib/constants';

export async function checkUserEmail(email: string) {
  const findEmail = await prisma.user.findUnique({ where: { email } });
  if (findEmail) throw new Error('Email already exists is DB');

  return email;
}

export async function createTokenCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  // access token cookie 생성
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 1 * 60 * 60 * 1000, // 1hour
  });

  // refresh token cookie 생성
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7day
    path: '/auth/refresh',
  });
}

export function clearTokenCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
}
