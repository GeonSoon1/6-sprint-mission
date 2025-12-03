import { prismaClient } from '../lib/prismaClient.js';
import { Comment } from '@prisma/client';
import { CreateCommentDTO, UpdateCommentDTO, CommentListQueryDTO } from '../types/dto.js';

export class CommentRepository {
  async findById(id: number): Promise<Comment | null> {
    return prismaClient.comment.findUnique({ where: { id } });
  }

  async findByProductId(productId: number, query: CommentListQueryDTO): Promise<Comment[]> {
    return prismaClient.comment.findMany({
      cursor: query.cursor ? { id: query.cursor } : undefined,
      take: query.limit + 1,
      where: { productId },
    });
  }

  async findByArticleId(articleId: number, query: CommentListQueryDTO): Promise<Comment[]> {
    return prismaClient.comment.findMany({
      cursor: query.cursor ? { id: query.cursor } : undefined,
      take: query.limit + 1,
      where: { articleId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateCommentDTO & { userId: number; productId?: number; articleId?: number }): Promise<Comment> {
    return prismaClient.comment.create({ data });
  }

  async update(id: number, data: UpdateCommentDTO): Promise<Comment> {
    return prismaClient.comment.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prismaClient.comment.delete({ where: { id } });
  }
}

export const commentRepository = new CommentRepository();

