import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({
    data,
  });
};

const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const updateUserToken = async (id: string, refreshToken: string) => {
  return prisma.user.update({
    where: { id },
    data: { refreshToken },
  });
};

export const authRepository = {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserToken,
};
