import { prismaClient } from '../lib/prismaClient.js';
import { Article, Like } from '@prisma/client';
import { CreateArticleDTO, UpdateArticleDTO, ArticleListQueryDTO } from '../types/dto.js';

export class ArticleRepository {
  async findById(id: number): Promise<(Article & { likes: Like[] }) | null> {
    return prismaClient.article.findUnique({
      where: { id },
      include: { likes: true },
    });
  }

  async findMany(query: ArticleListQueryDTO): Promise<(Article & { likes: Like[] })[]> {
    const where = {
      title: query.keyword ? { contains: query.keyword } : undefined,
    };

    return prismaClient.article.findMany({
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      orderBy: query.orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
      where,
      include: { likes: true },
    });
  }

  async count(query: ArticleListQueryDTO): Promise<number> {
    const where = {
      title: query.keyword ? { contains: query.keyword } : undefined,
    };

    return prismaClient.article.count({ where });
  }

  async create(data: CreateArticleDTO & { userId: number }): Promise<Article> {
    return prismaClient.article.create({ data });
  }

  async update(id: number, data: UpdateArticleDTO): Promise<Article> {
    return prismaClient.article.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prismaClient.article.delete({ where: { id } });
  }
}

export const articleRepository = new ArticleRepository();

