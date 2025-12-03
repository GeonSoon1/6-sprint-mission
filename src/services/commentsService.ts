import { prisma } from '../utils/prisma';

async function createArticleComment(articleId, content, userId) {
  return prisma.comment.create({
    data: {
      content,
      articleId,
      userId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      articleId: true,
      user: {
        select: { nickname: true },
      },
    },
  });
}

async function createProductComment(productId, content, userId) {
  return prisma.comment.create({
    data: {
      content: content,
      productId,
      userId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      productId: true,
      user: {
        select: { nickname: true },
      },
    },
  });
}

async function findCommentsByArticleId({ articleId, limit, cursor }) {
  const findOptions = {
    where: { articleId: articleId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  };

  if (cursor) {
    findOptions.cursor = { id: cursor };
    findOptions.skip = 1;
  }

  const comments = await prisma.comment.findMany(findOptions);

  let nextCursor = null;
  if (comments.length > limit) {
    nextCursor = comments[limit - 1].id;
    comments.pop();
  }

  return { comments, nextCursor };
}

async function findCommentsByProductId({ productId, limit, cursor }) {
  const findOptions = {
    where: { productId: productId }, // 상품 ID로 필터링
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  };

  if (cursor) {
    findOptions.cursor = { id: cursor };
    findOptions.skip = 1;
  }

  const comments = await prisma.comment.findMany(findOptions);

  let nextCursor = null;
  if (comments.length > limit) {
    nextCursor = comments[limit - 1].id;
    comments.pop();
  }

  return { comments, nextCursor };
}

async function updateCommentInDb(commentId, content, userId) {
  const comment = await prisma.comment.findUniqueOrThrow({ where: { id: commentId } });

  if (comment.userId !== userId) {
    const error = new Error('수정 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
}

async function deleteCommentInDb(commentId, userId) {
  const comment = await prisma.comment.findUniqueOrThrow({ where: { id: commentId } });

  if (comment.userId !== userId) {
    const error = new Error('삭제 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return prisma.comment.delete({
    where: { id: commentId },
  });
}

export const commentsService = {
  createArticleComment,
  createProductComment,
  findCommentsByArticleId,
  findCommentsByProductId,
  updateCommentInDb,
  deleteCommentInDb,
};
