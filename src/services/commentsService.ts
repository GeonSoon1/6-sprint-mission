import { commentsRepository } from '../repositories/commentsRepository';
import { Prisma } from '@prisma/client';
import { ErrorWithStatus } from '../utils/types';

interface FindCommentsArgs {
  articleId?: string;
  productId?: string;
  limit: number;
  cursor?: string;
}

const createArticleComment = async (articleId: string, content: string, userId: string) => {
  return commentsRepository.createComment(
    {
      content,
      article: { connect: { id: articleId } },
      user: { connect: { id: userId } },
    },
    {
      id: true,
      content: true,
      createdAt: true,
      articleId: true,
      user: { select: { nickname: true } },
    },
  );
};

const createProductComment = async (productId: string, content: string, userId: string) => {
  return commentsRepository.createComment(
    {
      content,
      product: { connect: { id: productId } },
      user: { connect: { id: userId } },
    },
    {
      id: true,
      content: true,
      createdAt: true,
      productId: true,
      user: { select: { nickname: true } },
    },
  );
};

const findCommentsByArticleId = async ({ articleId, limit, cursor }: FindCommentsArgs) => {
  const findOptions: Prisma.CommentFindManyArgs = {
    where: { articleId },
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

  const comments = await commentsRepository.findComments(findOptions);

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
      user: { select: { nickname: true } },
    },
  };

  if (cursor) {
    findOptions.cursor = { id: cursor };
    findOptions.skip = 1;
  }

  const comments = await commentsRepository.findComments(findOptions);

  let nextCursor: string | null = null;
  if (comments.length > limit) {
    nextCursor = comments[limit - 1].id;
    comments.pop();
  }

  return { comments, nextCursor };
};

const updateCommentInDb = async (commentId: string, content: string, userId: string) => {
  const comment = await commentsRepository.findCommentById(commentId, { userId: true });

  if (comment.userId !== userId) {
    const error: ErrorWithStatus = new Error('수정 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return commentsRepository.updateComment(commentId, content);
};

const deleteCommentInDb = async (commentId: string, userId: string) => {
  const comment = await commentsRepository.findCommentById(commentId, { userId: true });

  if (comment.userId !== userId) {
    const error: ErrorWithStatus = new Error('삭제 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return commentsRepository.deleteComment(commentId);
};

export const commentsService = {
  createArticleComment,
  createProductComment,
  findCommentsByArticleId,
  findCommentsByProductId,
  updateCommentInDb,
  deleteCommentInDb,
};
