import { Product } from '@prisma/client';
import { PagePaginationParams, PagePaginationResult } from '../types/pagination';
import * as usersRepository from '../repositories/usersRepository';
import * as productsRepository from '../repositories/productsRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import User from '../types/User';

type UpdateUserData = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

export async function getUser(userId: number): Promise<User> {
  const user = await usersRepository.getUser(userId);
  if (!user) {
    throw new NotFoundError('user', userId);
  }

  return user;
}

export async function updateUser(userId: number, data: Partial<UpdateUserData>): Promise<User> {
  const userExists = await usersRepository.userExists(userId);
  if (!userExists) {
    throw new NotFoundError('user', userId);
  }

  const updatedUser = await usersRepository.updateUser(userId, data);
  return updatedUser;
}

export async function getMyProductList(
  userId: number,
  params: PagePaginationParams,
): Promise<PagePaginationResult<Product>> {
  const userExists = await usersRepository.userExists(userId);
  if (!userExists) {
    throw new NotFoundError('user', userId);
  }

  const result = await productsRepository.getProductListWithFavorites(params, { userId });
  return result;
}

export async function getMyFavoriteList(
  userId: number,
  params: PagePaginationParams,
): Promise<PagePaginationResult<Product>> {
  const userExists = await usersRepository.userExists(userId);
  if (!userExists) {
    throw new NotFoundError('user', userId);
  }

  const result = await productsRepository.getFavoriteProductListByOwnerId(userId, params);
  return result;
}
