import bcrypt from 'bcrypt';
import type { User } from '@prisma/client';
import { HttpError } from '../lib/httpError';

import {
  findUserByEmail,
  findUserByNickname,
  findUserById,
  createUser,
  updateUserById,
} from '../repositories/authRepository';

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  NODE_ENV,
} from '../lib/constants';

import { generateTokens, verifyRefreshToken } from '../lib/token';

export type RegisterDto = {
  email: string;
  nickname: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type UpdateProfileDto = {
  email?: string;
  nickname?: string;
  image?: string;
};

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
};

export function buildAccessCookie(accessToken: string) {
  return {
    name: ACCESS_TOKEN_COOKIE_NAME,
    value: accessToken,
    options: {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    },
  } as const;
}

export function buildRefreshCookie(refreshToken: string) {
  return {
    name: REFRESH_TOKEN_COOKIE_NAME,
    value: refreshToken,
    options: {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    },
  } as const;
}

export async function registerService(dto: RegisterDto) {
  const { email, nickname, password } = dto;

  if (!email || !nickname || !password) {
    throw new HttpError(400, '모든 필드를 입력해주세요.');
  }

  const existedEmail = await findUserByEmail(email);
  if (existedEmail) throw new HttpError(409, '이미 사용 중인 이메일입니다.');

  const existedNickname = await findUserByNickname(nickname);
  if (existedNickname) throw new HttpError(409, '이미 사용 중인 닉네임입니다.');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({ email, nickname, password: hashedPassword });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function loginService(dto: LoginDto) {
  const { email, password } = dto;

  const user = await findUserByEmail(email);
  if (!user) throw new HttpError(401, '이메일 또는 비밀번호가 잘못되었습니다.');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    throw new HttpError(401, '이메일 또는 비밀번호가 잘못되었습니다.');

  const { accessToken, refreshToken } = generateTokens(user.id);

  return {
    cookies: [buildAccessCookie(accessToken), buildRefreshCookie(refreshToken)],
    body: { message: '로그인 성공' },
  };
}

export async function refreshService(refreshToken: string | undefined) {
  if (!refreshToken) throw new HttpError(401, 'Refresh Token이 없습니다.');

  let decoded: { id: string };
  try {
    decoded = verifyRefreshToken(refreshToken) as { id: string };
  } catch {
    throw new HttpError(401, 'Refresh Token이 유효하지 않습니다.');
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    decoded.id
  );

  return {
    cookies: [
      buildAccessCookie(accessToken),
      buildRefreshCookie(newRefreshToken),
    ],
    body: { message: '토큰 재발급 완료' },
  };
}

export function logoutService() {
  return {
    clearCookies: [
      ACCESS_TOKEN_COOKIE_NAME,
      REFRESH_TOKEN_COOKIE_NAME,
    ] as const,
    body: { message: '로그아웃 완료' },
  };
}

export function getMeService(user: User | undefined) {
  if (!user) throw new HttpError(401, '로그인이 필요합니다.');

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function updateProfileService(user: User, dto: UpdateProfileDto) {
  const userId = user.id;
  const { email, nickname, image } = dto;

  if (!email && !nickname && typeof image === 'undefined') {
    throw new HttpError(400, '변경할 값을 하나 이상 입력해주세요.');
  }

  if (email && email !== user.email) {
    const existedEmail = await findUserByEmail(email);
    if (existedEmail && existedEmail.id !== userId) {
      throw new HttpError(409, '이미 사용 중인 이메일입니다.');
    }
  }

  if (nickname && nickname !== user.nickname) {
    const existedNickname = await findUserByNickname(nickname);
    if (existedNickname && existedNickname.id !== userId) {
      throw new HttpError(409, '이미 사용 중인 닉네임입니다.');
    }
  }

  const updatedUser = await updateUserById(userId, {
    ...(email && { email }),
    ...(nickname && { nickname }),
    ...(typeof image !== 'undefined' && { image }),
  });

  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
}

export async function changePasswordService(
  userId: string,
  dto: ChangePasswordDto
) {
  const { currentPassword, newPassword } = dto;

  if (!currentPassword || !newPassword) {
    throw new HttpError(
      400,
      '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.'
    );
  }

  const user = await findUserById(userId);
  if (!user) throw new HttpError(404, '사용자를 찾을 수 없습니다.');

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw new HttpError(401, '현재 비밀번호가 올바르지 않습니다.');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updateUserById(userId, { password: hashedPassword });

  return { message: '비밀번호가 변경되었습니다.' };
}
