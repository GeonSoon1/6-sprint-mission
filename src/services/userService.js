import prisma from '../libs/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  BadRequestError,
  ForbiddenError,
  SamePasswordError,
} from '../libs/error.js';

async function hashingPassword(password) {
  return bcrypt.hash(password, 10);
}

async function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

async function verifyPassword(inputPassword, savedPassword) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) throw new ForbiddenError();
}

async function samePassword(inputPassword, savedPassword) {
  const isSame = await bcrypt.compare(inputPassword, savedPassword);
  if (isSame) throw new SamePasswordError();
}

async function getUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new BadRequestError();
  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

async function createToken(user, type) {
  const payload = { userId: user.id };
  const options = { expiresIn: type === 'refresh' ? '2w' : '1h' };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

async function refreshToken(userId, refreshToken) {
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
  samePassword,
};
