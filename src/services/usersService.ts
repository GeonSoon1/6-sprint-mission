import { prisma } from '../utils/prisma';
import bcrypt from 'bcrypt';

async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    const error = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }

  return user;
}

async function updateUser(userId, updateData) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      nickname: updateData.nickname,
      image: updateData.image,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const passwordCheck = await bcrypt.compare(currentPassword, user.password);

  if (!passwordCheck) {
    const error = new Error('현재 비밀번호가 일치하지 않습니다.');
    error.status = 401;
    throw error;
  }

  if (currentPassword === newPassword) {
    const error = new Error('새 비밀번호는 기존 비밀번호와 다르게 설정해야 합니다.');
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: '비밀번호가 성공적으로 변경되었습니다.' };
}

async function getUserProducts(userId) {
  const products = await prisma.product.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
  });

  return products;
}

async function getUserLikedProducts(userId) {
  const products = await prisma.product.findMany({
    where: {
      likes: {
        some: {
          userId,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
  });

  return products;
}

export const usersService = {
  getUserById,
  updateUser,
  changePassword,
  getUserProducts,
  getUserLikedProducts,
};
