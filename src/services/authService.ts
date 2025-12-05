import { authRepository } from '../repositories/authRepository';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/token';
import { ErrorWithStatus } from '../utils/types';

const signUp = async (email: string, nickname: string, password: string) => {
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    const error: ErrorWithStatus = new Error('이미 존재하는 이메일입니다.');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    email,
    nickname,
    password: hashedPassword,
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const login = async (email: string, password: string) => {
  const user = await authRepository.findUserByEmail(email);
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

  await authRepository.updateUserToken(user.id, refreshToken);

  return { user, accessToken, refreshToken };
};

const refreshTokens = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  if (typeof payload === 'string' || !payload.userId) {
    const error: ErrorWithStatus = new Error('유효하지 않은 토큰입니다.');
    error.status = 401;
    throw error;
  }

  const userId = payload.userId;

  const user = await authRepository.findUserById(userId);
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

  await authRepository.updateUserToken(user.id, tokens.refreshToken);

  return tokens;
};

export const authService = {
  signUp,
  login,
  refreshTokens,
};
