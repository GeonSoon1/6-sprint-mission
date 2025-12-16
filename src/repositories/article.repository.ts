import prisma from '../utils/prisma';
import { Article, ArticleLike } from '@prisma/client';
import { CreateArticleDto, UpdateArticleDto } from '../dtos/article.dto';

export class ArticleRepository {
  async create(userId: number, data: CreateArticleDto): Promise<Article> {
    return prisma.article.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findById(id: number) {
    return prisma.article.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
  }

  async findMany(params: {
    skip: number;
    take: number;
    keyword?: string;
    orderBy?: 'recent';
  }) {
    const { skip, take, keyword, orderBy } = params;

    const where = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' as const } },
            { content: { contains: keyword, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take,
        orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : undefined,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    return { articles, total };
  }

  async update(id: number, data: UpdateArticleDto): Promise<Article> {
    return prisma.article.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.article.delete({
      where: { id },
    });
  }

  async createLike(userId: number, articleId: number): Promise<ArticleLike> {
    return prisma.articleLike.create({
      data: {
        userId,
        articleId,
      },
    });
  }

  async deleteLike(userId: number, articleId: number): Promise<void> {
    await prisma.articleLike.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }

  async findLike(userId: number, articleId: number): Promise<ArticleLike | null> {
    return prisma.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }
}
