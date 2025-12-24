import prisma from '../lib/prismaClient';

export function findProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export function findArticleById(id: string) {
  return prisma.article.findUnique({ where: { id } });
}

export function createProductComment(data: {
  content: string;
  productId: string;
  userId: string;
}) {
  return prisma.comment.create({
    data: {
      content: data.content,
      productId: data.productId,
      userId: data.userId,
    },
  });
}

export function createArticleComment(data: {
  content: string;
  articleId: string;
  userId: string;
}) {
  return prisma.comment.create({
    data: {
      content: data.content,
      articleId: data.articleId,
      userId: data.userId,
    },
  });
}

export function findCommentById(id: string) {
  return prisma.comment.findUnique({ where: { id } });
}

export function updateComment(id: string, content: string) {
  return prisma.comment.update({
    where: { id },
    data: { content },
  });
}

export function deleteComment(id: string) {
  return prisma.comment.delete({ where: { id } });
}

export function findProductComments(params: {
  productId: string;
  limit: number;
  cursor?: string;
}) {
  const { productId, limit, cursor } = params;

  return prisma.comment.findMany({
    where: { productId },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export function findArticleComments(params: {
  articleId: string;
  limit: number;
  cursor?: string;
}) {
  const { articleId, limit, cursor } = params;

  return prisma.comment.findMany({
    where: { articleId },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}
