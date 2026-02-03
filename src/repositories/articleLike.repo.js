import { prisma } from "../lib/prisma.js";

export function createArticleLike(userId, articleId) {
  return prisma.articleLike.create({
    data: { userId, articleId },
  });
}

export function deleteArticleLike(userId, articleId) {
  return prisma.articleLike.delete({
    where: { userId_articleId: { userId, articleId } },
  });
}

export function findArticleLike(userId, articleId) {
  return prisma.articleLike.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
}

export function findLikedArticlesByUser(userId) {
  return prisma.articleLike.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      article: true,
    },
  });
}