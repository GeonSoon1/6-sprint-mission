import type { Request, Response, NextFunction } from 'express';
import {
  registerService,
  loginService,
  refreshService,
  logoutService,
  getMeService,
  updateProfileService,
  changePasswordService,
  RegisterDto,
  LoginDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from '../services/authService';
import { HttpError } from '../lib/httpError';
import { REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body as RegisterDto;
    const user = await registerService(body);
    return res.status(201).json(user);
  } catch (e) {
    next(e);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as LoginDto;
    const result = await loginService(body);

    for (const c of result.cookies) {
      res.cookie(c.name, c.value, c.options);
    }

    return res.status(200).json(result.body);
  } catch (e) {
    next(e);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] as
      | string
      | undefined;
    const result = await refreshService(token);

    for (const c of result.cookies) {
      res.cookie(c.name, c.value, c.options);
    }

    return res.status(200).json(result.body);
  } catch (e) {
    next(e);
  }
}

export function logout(req: Request, res: Response) {
  const result = logoutService();
  for (const name of result.clearCookies) {
    res.clearCookie(name);
  }
  return res.status(200).json(result.body);
}

export function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const me = getMeService(req.user);
    return res.status(200).json(me);
  } catch (e) {
    next(e);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) throw new HttpError(401, '로그인이 필요합니다.');

    const body = req.body as UpdateProfileDto;
    const updated = await updateProfileService(req.user, body);
    return res.status(200).json(updated);
  } catch (e) {
    next(e);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) throw new HttpError(401, '로그인이 필요합니다.');

    const body = req.body as ChangePasswordDto;
    const result = await changePasswordService(req.user.id, body);
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
}
