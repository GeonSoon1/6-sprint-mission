import { prismaClient } from '../lib/prismaClient.js';
import { Favorite } from '@prisma/client';
import { CreateFavoriteDTO } from '../types/dto.js';

export class FavoriteRepository {
  async findByProductIdAndUserId(productId: number, userId: number): Promise<Favorite | null> {
    return prismaClient.favorite.findFirst({
      where: { productId, userId },
    });
  }

  async create(data: CreateFavoriteDTO): Promise<Favorite> {
    return prismaClient.favorite.create({ data });
  }

  async delete(id: number): Promise<void> {
    await prismaClient.favorite.delete({ where: { id } });
  }
}

export const favoriteRepository = new FavoriteRepository();


