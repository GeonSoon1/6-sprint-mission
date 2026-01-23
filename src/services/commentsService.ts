import * as articlesRepository from '../repositories/articlesRepository';
import * as commentsRepository from '../repositories/commentsRepository';
import * as productsRepository from '../repositories/productsRepository';
import { CursorPaginationParams, CursorPaginationResult } from '../types/pagination';
import BadRequestError from '../lib/errors/BadRequestError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import Comment, { CreateCommentData } from '../types/Comment';
import * as notificationService from './notificationService';

export async function createComment(data: CreateCommentData): Promise<Comment> {
  if (!data.articleId && !data.productId) {
    throw new BadRequestError('Either articleId or productId must be provided');
  }

  let receiverId: number | undefined;

  if (data.articleId) {
    const article = await articlesRepository.getArticle(data.articleId);
    if (!article) throw new NotFoundError('article', data.articleId);
    receiverId = article.userId;
  }

  if (data.productId) {
    const product = await productsRepository.getProduct(data.productId);
    if (!product) throw new NotFoundError('product', data.productId);
    receiverId = product.userId;
  }

  const comment = await commentsRepository.createComment({
    ...data,
    articleId: data.articleId ?? null,
    productId: data.productId ?? null,
  });

  if (receiverId && receiverId !== data.userId) {
    notificationService
      .notifyNewComment(receiverId, data.userId, data.content, data.articleId, data.productId)
      .catch((err) => console.error('알림 발송 실패:', err));
  }

  return comment;
}

export async function getComment(id: number): Promise<Comment | null> {
  const comment = await commentsRepository.getComment(id);
  if (!comment) {
    throw new NotFoundError('comment', id);
  }
  return comment;
}

export async function getCommentListByArticleId(
  articleId: number,
  params: CursorPaginationParams,
): Promise<CursorPaginationResult<Comment>> {
  const article = await articlesRepository.getArticle(articleId);
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  return commentsRepository.getCommentList({ articleId }, params);
}

export async function getCommentListByProductId(
  productId: number,
  params: CursorPaginationParams,
): Promise<CursorPaginationResult<Comment>> {
  const product = await productsRepository.getProduct(productId);
  if (!product) {
    throw new NotFoundError('product', productId);
  }

  return commentsRepository.getCommentList({ productId }, params);
}

export async function updateComment(id: number, userId: number, content: string): Promise<Comment> {
  const comment = await commentsRepository.getComment(id);
  if (!comment) {
    throw new NotFoundError('comment', id);
  }

  if (comment.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the comment');
  }

  return commentsRepository.updateComment(id, { content });
}

export async function deleteComment(id: number, userId: number): Promise<void> {
  const comment = await commentsRepository.getComment(id);
  if (!comment) {
    throw new NotFoundError('comment', id);
  }

  if (comment.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the comment');
  }

  await commentsRepository.deleteComment(id);
}
