import { prisma } from '../utils/prisma';

async function createArticleInDb(title, content, userId) {
  return prisma.article.create({
    data: {
      title: title,
      content: content,
      userId,
    },
  });
}

async function findArticles({ sort, search, offset, limit }, userId) {
  const orderBy = sort === 'resent' ? { createdAt: 'desc' } : { createdAt: 'asc' };

  const where = {};
  if (search) {
    where.OR = [{ title: { contains: search } }, { content: { contains: search } }];
  }

  const selectOption = {
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
    prisma.article.findMany({
      select: selectOption,
      where,
      orderBy,
      skip: offset,
      take: limit,
    }),
    prisma.article.count({
      where,
    }),
  ]);

  const articlesWithLike = articles.map((article) => {
    const isLiked = article.likes ? article.likes.length > 0 : false;
    const { likes, ...rest } = article;
    return {
      ...rest,
      isLiked,
    };
  });

  return { articles: articlesWithLike, totalArticles };
}

async function findArticleById(id, userId) {
  const selectOption = {
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

  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
    select: selectOption,
  });

  const isLiked = article.likes ? article.likes.length > 0 : false;
  const { likes, ...rest } = article;

  return { ...rest, isLiked };
}

async function updateArticleInDb(id, updateData, userId) {
  const article = await prisma.article.findUniqueOrThrow({ where: { id } });

  if (article.userId !== userId) {
    const error = new Error('수정 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return prisma.article.update({
    where: { id },
    data: updateData,
  });
}

async function deleteArticleInDb(id, userId) {
  const article = await prisma.article.findUniqueOrThrow({ where: { id } });

  if (article.userId !== userId) {
    const error = new Error('삭제 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return prisma.article.delete({
    where: { id },
  });
}

export const articlesService = {
  createArticleInDb,
  findArticles,
  findArticleById,
  updateArticleInDb,
  deleteArticleInDb,
};
