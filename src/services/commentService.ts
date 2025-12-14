import {
  findProductById,
  findArticleById,
  createProductComment,
  createArticleComment,
  findProductComments,
  findArticleComments,
  findCommentById,
  updateComment,
  deleteComment,
} from '../repositories/commentRepository';

export type CreateCommentDto = {
  content: string;
};

export type CursorQuery = {
  cursor?: string;
  limit?: number;
};

function normalizeLimit(limit: unknown, defaultValue = 10) {
  const n = Number(limit);
  if (!Number.isFinite(n) || n <= 0) return defaultValue;
  return Math.min(Math.floor(n), 50); // 너무 큰 요청 방지 (원하면 100으로)
}

export async function createProductCommentService(
  productId: string,
  data: CreateCommentDto,
  userId: string
) {
  const product = await findProductById(productId);
  if (!product) {
    const e: any = new Error('상품을 찾을 수 없습니다.');
    e.status = 404;
    throw e;
  }

  return createProductComment({
    content: data.content,
    productId,
    userId,
  });
}

export async function createArticleCommentService(
  articleId: string,
  data: CreateCommentDto,
  userId: string
) {
  const article = await findArticleById(articleId);
  if (!article) {
    const e: any = new Error('게시글을 찾을 수 없습니다.');
    e.status = 404;
    throw e;
  }

  return createArticleComment({
    content: data.content,
    articleId,
    userId,
  });
}

export async function getProductCommentsService(
  productId: string,
  query: CursorQuery
) {
  const limit = normalizeLimit(query.limit, 10);
  const cursor = typeof query.cursor === 'string' ? query.cursor : undefined;

  return findProductComments({ productId, limit, cursor });
}

export async function getArticleCommentsService(
  articleId: string,
  query: CursorQuery
) {
  const limit = normalizeLimit(query.limit, 10);
  const cursor = typeof query.cursor === 'string' ? query.cursor : undefined;

  return findArticleComments({ articleId, limit, cursor });
}

export async function updateCommentService(
  commentId: string,
  data: CreateCommentDto,
  userId: string
) {
  const comment = await findCommentById(commentId);

  if (!comment) {
    const e: any = new Error('댓글을 찾을 수 없습니다.');
    e.status = 404;
    throw e;
  }

  if (comment.userId !== userId) {
    const e: any = new Error('댓글을 수정할 권한이 없습니다.');
    e.status = 403;
    throw e;
  }

  return updateComment(commentId, data.content);
}

export async function deleteCommentService(commentId: string, userId: string) {
  const comment = await findCommentById(commentId);

  if (!comment) {
    const e: any = new Error('댓글을 찾을 수 없습니다.');
    e.status = 404;
    throw e;
  }

  if (comment.userId !== userId) {
    const e: any = new Error('댓글을 삭제할 권한이 없습니다.');
    e.status = 403;
    throw e;
  }

  await deleteComment(commentId);
}
