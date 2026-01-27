import { Favorite } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';

export async function createFavorite(data: Omit<Favorite, 'id' | 'createdAt' | 'updatedAt'>) {
  return await prismaClient.favorite.create({
    data,
  });
}

export async function getFavorite(productId: number, userId: number) {
  return await prismaClient.favorite.findFirst({
    where: { productId, userId },
  });
}

export async function deleteFavorite(id: number) {
  return await prismaClient.favorite.delete({
    where: { id },
  });
}

export async function findAllByProductId(productId: number) {
  return await prismaClient.favorite.findMany({
    where: { productId },
    select: { userId: true },
  });
}
