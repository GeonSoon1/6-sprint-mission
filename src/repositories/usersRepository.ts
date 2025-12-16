import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

const findUserById = async (id: string, select?: Prisma.UserSelect) => {
  return prisma.user.findUnique({
    where: { id },
    select,
  });
};

const findUserByIdOrThrow = async (id: string) => {
  return prisma.user.findUniqueOrThrow({
    where: { id },
  });
};

const updateUser = async (id: string, data: Prisma.UserUpdateInput, select?: Prisma.UserSelect) => {
  return prisma.user.update({
    where: { id },
    data,
    select,
  });
};

const findProductsByUserId = async (userId: string, select: Prisma.ProductSelect) => {
  return prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select,
  });
};

const findLikedProductsByUserId = async (userId: string, select: Prisma.ProductSelect) => {
  return prisma.product.findMany({
    where: {
      likes: {
        some: { userId },
      },
    },
    orderBy: { createdAt: 'desc' },
    select,
  });
};

export const usersRepository = {
  findUserById,
  findUserByIdOrThrow,
  updateUser,
  findProductsByUserId,
  findLikedProductsByUserId,
};
