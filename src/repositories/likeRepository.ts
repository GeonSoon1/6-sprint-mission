import { prismaClient } from '../lib/prismaClient.js';
import { Like } from '@prisma/client';
import { CreateLikeDTO } from '../types/dto.js';

export class LikeRepository {
  async findByArticleIdAndUserId(articleId: number, userId: number): Promise<Like | null> {
    return prismaClient.like.findFirst({
      where: { articleId, userId },
    });
  }

  async create(data: CreateLikeDTO): Promise<Like> {
    return prismaClient.like.create({ data });
  }

  async delete(id: number): Promise<void> {
    await prismaClient.like.delete({ where: { id } });
  }
}

export const likeRepository = new LikeRepository();


