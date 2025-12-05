import { usersRepository } from '../repositories/usersRepository';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { ErrorWithStatus } from '../utils/types';

const getUserById = async (userId: string) => {
  const user = await usersRepository.findUserById(userId, {
    id: true,
    email: true,
    nickname: true,
    image: true,
    createdAt: true,
    updatedAt: true,
  });

  if (!user) {
    const error: ErrorWithStatus = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }

  return user;
};

const updateUser = async (userId: string, updateData: Prisma.UserUpdateInput) => {
  const user = await usersRepository.updateUser(userId, updateData, {
    id: true,
    email: true,
    nickname: true,
    image: true,
    createdAt: true,
    updatedAt: true,
  });
  return user;
};

const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await usersRepository.findUserByIdOrThrow(userId);

  const passwordCheck = await bcrypt.compare(currentPassword, user.password);

  if (!passwordCheck) {
    const error: ErrorWithStatus = new Error('현재 비밀번호가 일치하지 않습니다.');
    error.status = 401;
    throw error;
  }

  if (currentPassword === newPassword) {
    const error: ErrorWithStatus = new Error(
      '새 비밀번호는 기존 비밀번호와 다르게 설정해야 합니다.',
    );
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await usersRepository.updateUser(userId, { password: hashedPassword });

  return { message: '비밀번호가 성공적으로 변경되었습니다.' };
};

const getUserProducts = async (userId: string) => {
  const products = await usersRepository.findProductsByUserId(userId, {
    id: true,
    name: true,
    price: true,
    createdAt: true,
  });

  return products;
};

const getUserLikedProducts = async (userId: string) => {
  const products = await usersRepository.findLikedProductsByUserId(userId, {
    id: true,
    name: true,
    price: true,
    createdAt: true,
  });

  return products;
};

export const usersService = {
  getUserById,
  updateUser,
  changePassword,
  getUserProducts,
  getUserLikedProducts,
};
