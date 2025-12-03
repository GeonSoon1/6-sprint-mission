import { prisma } from '../utils/prisma';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/token';

interface ErrorWithStatus extends Error {
  status?: number;
}

async function signUp(email: string, nickname: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error: ErrorWithStatus = new Error('이미 존재하는 이메일입니다.');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error: ErrorWithStatus = new Error('존재하지 않는 이메일입니다.');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error: ErrorWithStatus = new Error('비밀번호가 일치하지 않습니다.');
    error.status = 401;
    throw error;
  }

  const { accessToken, refreshToken } = generateTokens(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { user, accessToken, refreshToken };
}

async function refreshTokens(refreshToken: string) {
  const { userId } = verifyRefreshToken(refreshToken);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error: ErrorWithStatus = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }

  if (user.refreshToken !== refreshToken) {
    const error: ErrorWithStatus = new Error('유효하지 않은 Refresh Token입니다.');
    error.status = 401;
    throw error;
  }

  const tokens = generateTokens(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return tokens;
}

export const authService = {
  signUp,
  login,
  refreshTokens,
};
