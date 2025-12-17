import prisma from '../lib/prismaClient';

export function findArticlesWithLikes() {
  return prisma.article.findMany({
    include: { likes: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function findArticleByIdWithLikes(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: { likes: true },
  });
}

export function findArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
  });
}

export function createArticle(data: {
  title: string;
  content: string;
  userId: string;
}) {
  return prisma.article.create({ data });
}

export function updateArticle(
  id: string,
  data: {
    title?: string;
    content?: string;
  }
) {
  return prisma.article.update({
    where: { id },
    data,
  });
}

export function deleteArticle(id: string) {
  return prisma.article.delete({
    where: { id },
  });
}

export function findMyArticles(userId: string) {
  return prisma.article.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export function findArticleLike(userId: string, articleId: string) {
  return prisma.articleLike.findFirst({
    where: { userId, articleId },
  });
}

export function deleteArticleLike(likeId: string) {
  return prisma.articleLike.delete({
    where: { id: likeId },
  });
}

export function createArticleLike(userId: string, articleId: string) {
  return prisma.articleLike.create({
    data: { userId, articleId },
  });
}

export function countArticleLikes(articleId: string) {
  return prisma.articleLike.count({
    where: { articleId },
  });
}
