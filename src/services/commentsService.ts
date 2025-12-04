import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';
import { ErrorWithStatus } from '../utils/types';

interface FindCommentsArgs {
  articleId?: string;
  productId?: string;
  limit: number;
  cursor?: string;
}

const createArticleComment = async (articleId: string, content: string, userId: string) => {
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
};

const createProductComment = async (productId: string, content: string, userId: string) => {
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
};

const findCommentsByArticleId = async ({ articleId, limit, cursor }: FindCommentsArgs) => {
  const findOptions: Prisma.CommentFindManyArgs = {
    where: { articleId: articleId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { nickname: true } },
    },
  };

  if (cursor) {
    findOptions.cursor = { id: cursor };
    findOptions.skip = 1;
  }

  const comments = await prisma.comment.findMany(findOptions);

  let nextCursor: string | null = null;
  if (comments.length > limit) {
    nextCursor = comments[limit - 1].id;
    comments.pop();
  }

  return { comments, nextCursor };
};

const findCommentsByProductId = async ({ productId, limit, cursor }: FindCommentsArgs) => {
  const findOptions: Prisma.CommentFindManyArgs = {
    where: { productId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: { nickname: true },
      },
    },
  };

  if (cursor) {
    findOptions.cursor = { id: cursor };
    findOptions.skip = 1;
  }

  const comments = await prisma.comment.findMany(findOptions);

  let nextCursor: string | null = null;
  if (comments.length > limit) {
    nextCursor = comments[limit - 1].id;
    comments.pop();
  }

  return { comments, nextCursor };
};

const updateCommentInDb = async (commentId: string, content: string, userId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId },
    select: { userId: true },
  });

  if (comment.userId !== userId) {
    const error: ErrorWithStatus = new Error('수정 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
};

const deleteCommentInDb = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId },
    select: { userId: true },
  });

  if (comment.userId !== userId) {
    const error: ErrorWithStatus = new Error('삭제 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return prisma.comment.delete({
    where: { id: commentId },
  });
};

export const commentsService = {
  createArticleComment,
  createProductComment,
  findCommentsByArticleId,
  findCommentsByProductId,
  updateCommentInDb,
  deleteCommentInDb,
};
