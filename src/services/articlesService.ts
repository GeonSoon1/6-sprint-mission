import { articlesRepository } from '../repositories/articlesRepository';
import { Prisma } from '@prisma/client';
import { ErrorWithStatus } from '../utils/types';

interface FindArticlesQuery {
  sort?: string;
  search?: string;
  offset?: number;
  limit?: number;
}

const createArticleInDb = async (title: string, content: string, userId: string) => {
  return articlesRepository.createArticle({
    title,
    content,
    user: {
      connect: { id: userId },
    },
  });
};

const findArticles = async (
  { sort, search, offset, limit }: FindArticlesQuery,
  userId: string | undefined,
) => {
  const orderBy: Prisma.ArticleOrderByWithRelationInput =
    sort === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };

  const where: Prisma.ArticleWhereInput = {};
  if (search) {
    where.OR = [{ title: { contains: search } }, { content: { contains: search } }];
  }

  const selectOption: Prisma.ArticleSelect = {
    id: true,
    title: true,
    content: true,
    createdAt: true,
  };

  if (userId) {
    selectOption.likes = {
      where: { userId },
      select: { id: true },
    };
  }

  const [articles, totalArticles] = await Promise.all([
    articlesRepository.findArticles({
      select: selectOption,
      where,
      orderBy,
      skip: offset,
      take: limit,
    }),
    articlesRepository.countArticles(where),
  ]);

  const articlesWithLike = articles.map((article) => {
    const articleData = article as any;
    const isLiked = articleData.likes ? articleData.likes.length > 0 : false;
    const { likes, ...rest } = articleData;

    return {
      ...rest,
      isLiked,
    };
  });

  return { articles: articlesWithLike, totalArticles };
};

const findArticleById = async (id: string, userId: string | undefined) => {
  const selectOption: Prisma.ArticleSelect = {
    id: true,
    title: true,
    content: true,
    createdAt: true,
    user: {
      select: {
        id: true,
        nickname: true,
        email: true,
      },
    },
  };

  if (userId) {
    selectOption.likes = {
      where: { userId },
      select: { id: true },
    };
  }

  const article = await articlesRepository.findArticleById(id, selectOption);

  const articleData = article as any;
  const isLiked = articleData.likes ? articleData.likes.length > 0 : false;
  const { likes, ...rest } = articleData;

  return { ...rest, isLiked };
};

const updateArticleInDb = async (
  id: string,
  updateData: Prisma.ArticleUpdateInput,
  userId: string,
) => {
  const article = await articlesRepository.findArticleById(id, { userId: true });

  if (article.userId !== userId) {
    const error: ErrorWithStatus = new Error('수정 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return articlesRepository.updateArticle(id, updateData);
};

const deleteArticleInDb = async (id: string, userId: string) => {
  const article = await articlesRepository.findArticleById(id, { userId: true });

  if (article.userId !== userId) {
    const error: ErrorWithStatus = new Error('삭제 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return articlesRepository.deleteArticle(id);
};

export const articlesService = {
  createArticleInDb,
  findArticles,
  findArticleById,
  updateArticleInDb,
  deleteArticleInDb,
};
