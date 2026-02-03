import * as authRepo from "../repositories/auth.repo.js";
import { hashPassword, verifyPassword } from "../lib/hash.js";
import { generateTokens } from "../lib/token.js";
import ConflictError from '../errors/ConflictError.js'
import BadRequestError from '../errors/BadRequestError.js'


export async function register(data) {
  const existingUser = await authRepo.getuserByEmail(data.email);
  if (existingUser) {
    throw new ConflictError('이미 가입된 이메일 입니다.')
  }
  const hashedPassword = await hashPassword(data.password);
  const user = await authRepo.register({
    email: data.email,
    password: hashedPassword,
    nickname: data.nickname,
  });
  return user;
}

export async function login(data) {
  const user = await authRepo.getuserByEmail(data.email)
  if (!user) {
    throw new BadRequestError('존재하지 않는 이메일 입니다.')
  }

  const isPasswordValid = await verifyPassword(data.password, user.password)
  if (!isPasswordValid) {
    throw new BadRequestError('비밀번호가 일치하지 않습니다.')
  }

  const { accessToken, refreshToken } = generateTokens(user.id)
  return { accessToken, refreshToken }
}
