import { Request, Response } from 'express';
import { create } from 'superstruct';
import { authService } from '../services/authService.js';
import { LoginBodyStruct, RegisterBodyStruct } from '../structs/authStructs.js';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, NODE_ENV } from '../lib/constants.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export async function register(req: Request, res: Response): Promise<void> {
  const data = create(req.body, RegisterBodyStruct);
  const user = await authService.register(data);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response): Promise<void> {
  const data = create(req.body, LoginBodyStruct);
  const { accessToken, refreshToken } = await authService.login(data);
  setTokenCookies(res, accessToken, refreshToken);
  res.status(200).send();
}

export async function logout(_req: Request, res: Response): Promise<void> {
  clearTokenCookies(res);
  res.status(200).send();
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshToken) {
    throw new BadRequestError('Invalid refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshToken(refreshToken);
  setTokenCookies(res, accessToken, newRefreshToken);
  res.status(200).send();
}

function setTokenCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/auth/refresh',
  });
}

function clearTokenCookies(res: Response): void {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}
