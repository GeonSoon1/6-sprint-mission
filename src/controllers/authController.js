import bcrypt from 'bcrypt';
import prisma from '../lib/prismaClient';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  NODE_ENV,
} from '../lib/constants';
import { generateTokens, verifyRefreshToken } from '../lib/token';

export async function register(req, res) {
  const { email, nickname, password } = req.body;

  if (!email || !nickname || !password) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  const existedEmail = await prisma.user.findUnique({ where: { email } });
  const existedNickname = await prisma.user.findUnique({ where: { nickname } });

  if (existedEmail) {
    return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
  }

  if (existedNickname) {
    return res.status(409).json({ message: '이미 사용 중인 닉네임입니다.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, nickname, password: hashedPassword },
  });

  const { password: _, ...userWithoutPassword } = user;

  return res.status(201).json(userWithoutPassword);
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res
      .status(401)
      .json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res
      .status(401)
      .json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
  }

  const { accessToken, refreshToken } = generateTokens(user.id);

  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 60 * 60 * 1000,
  });

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/auth/refresh',
  });

  return res.status(200).json({ message: '로그인 성공' });
}

export async function refresh(req, res) {
  const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token이 없습니다.' });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.id
    );

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return res.status(200).json({ message: '토큰 재발급 완료' });
  } catch {
    return res
      .status(401)
      .json({ message: 'Refresh Token이 유효하지 않습니다.' });
  }
}

export function logout(req, res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  return res.status(200).json({ message: '로그아웃 완료' });
}

export async function getMe(req, res) {
  // authenticate 미들웨어에서 req.user 를 넣어줌
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  const { password, ...userWithoutPassword } = user;
  return res.status(200).json(userWithoutPassword);
}

export async function updateProfile(req, res) {
  const userId = req.user.id;
  const { email, nickname, image } = req.body;

  if (!email && !nickname && typeof image === 'undefined') {
    return res
      .status(400)
      .json({ message: '변경할 값을 하나 이상 입력해주세요.' });
  }

  // 이메일 중복 확인
  if (email && email !== req.user.email) {
    const existedEmail = await prisma.user.findUnique({ where: { email } });
    if (existedEmail && existedEmail.id !== userId) {
      return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }
  }

  // 닉네임 중복 확인
  if (nickname && nickname !== req.user.nickname) {
    const existedNickname = await prisma.user.findUnique({
      where: { nickname },
    });
    if (existedNickname && existedNickname.id !== userId) {
      return res.status(409).json({ message: '이미 사용 중인 닉네임입니다.' });
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(email && { email }),
      ...(nickname && { nickname }),
      ...(typeof image !== 'undefined' && { image }),
    },
  });

  const { password, ...userWithoutPassword } = updatedUser;
  return res.status(200).json(userWithoutPassword);
}

export async function changePassword(req, res) {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return res
      .status(401)
      .json({ message: '현재 비밀번호가 올바르지 않습니다.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // 비밀번호는 리스폰스로 노출하지 않음
  return res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
}
