import prisma from '../libs/prismaClient';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import {
  BadRequestError,
  ForbiddenError,
  IsSamePasswordError,
} from '../libs/error';
import { Prisma, User } from '@prisma/client';

async function hashingPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function filterSensitiveUserData(user: User) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

async function verifyPassword(inputPassword: string, savedPassword: string) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) throw new ForbiddenError();
}

async function isSamePassword(inputPassword: string, savedPassword: string) {
  const isSame = await bcrypt.compare(inputPassword, savedPassword);
  if (isSame) throw new IsSamePasswordError();
}

// : Promise<Partial<User>>
async function getUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new BadRequestError();
  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

async function createToken(user: { id: string }, type?: string) {
  const payload = { userId: user.id };
  const options: SignOptions = { expiresIn: type === 'refresh' ? '2w' : '1h' };
  return jwt.sign(payload, process.env.JWT_SECRET!, options);
}

async function refreshToken(userId: string, refreshToken: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.refreshToken !== refreshToken) throw new BadRequestError();
  const accessToken = await createToken(user);
  const newRefreshToken = await createToken(user, 'refresh');
  return { accessToken, newRefreshToken };
}

export default {
  hashingPassword,
  filterSensitiveUserData,
  verifyPassword,
  getUser,
  createToken,
  refreshToken,
  isSamePassword,
};
