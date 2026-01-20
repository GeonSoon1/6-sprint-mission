import * as articlesRepository from '@repository/articlesRepository';
import * as commentsRepository from '@repository/commentsRepository';
import * as productsRepository from '@repository/productsRepository';
import * as notificationRepository from '@repository/notificationsRepository';
import { CursorPaginationParams, CursorPaginationResult } from '@app-types/pagination';
import BadRequestError from '@lib/errors/BadRequestError';
import ForbiddenError from '@lib/errors/ForbiddenError';
import NotFoundError from '@lib/errors/NotFoundError';
import Comment from '@app-types/Comment';
import { notifyToUser } from '@/lib/websocket';

type CreateCommentData = Omit<
  Comment,
  'id' | 'productId' | 'articleId' | 'createdAt' | 'updatedAt'
> & {
  productId?: number;
  articleId?: number;
};

export async function createComment(data: CreateCommentData): Promise<Comment> {
  // notification 작업 추가
  const { articleId, productId, userId } = data;

  // 1) 대상 검증 및 알림 정보 생성
  const target = articleId
    ? await (async () => {
        const article = await articlesRepository.getArticle(articleId);
        if (!article) throw new NotFoundError('article', articleId);

        return {
          type: 'articleComment' as const,
          targetUserId: article.userId,
          targetName: article.content,
        };
      })()
    : await (async () => {
        const product = await productsRepository.getProduct(productId!);
        if (!product) throw new NotFoundError('product', productId!);
        return {
          type: 'productComment' as const,
          targetUserId: product.userId,
          targetName: product.name,
        };
      })();

  // 2) 댓글 생성
  const comment = await commentsRepository.createComment({
    ...data,
    articleId: articleId ?? null,
    productId: productId ?? null,
  });

  const originName = target.targetName;
  const cutName = originName.substring(0, 10);

  // 3) 알림 생성
  if (target.targetUserId !== userId) {
    if (target.type === 'articleComment') {
      await notificationRepository.createNotification({
        userId: target.targetUserId,
        type: target.type,
        articleId: articleId!,
        message: `게시글 "${cutName}"에 댓글이 생겼습니다`,
      });

      notifyToUser(target.targetUserId, 'comment', {
        articleId: articleId!,
        commentId: comment.id,
        message: `게시글 "${cutName}"에 댓글이 생겼습니다`,
      });
    }

    if (target.type === 'productComment') {
      await notificationRepository.createNotification({
        userId: target.targetUserId,
        type: target.type,
        productId: productId!,
        message: `상품 "${cutName}"에 댓글이 생겼습니다`,
      });

      notifyToUser(target.targetUserId, 'comment', {
        productId: productId!,
        commentId: comment.id,
        message: `상품 "${cutName}"에 댓글이 생겼습니다`,
      });
    }
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
  params: CursorPaginationParams
): Promise<CursorPaginationResult<Comment>> {
  const article = await articlesRepository.getArticle(articleId);
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const result = commentsRepository.getCommentList({ articleId }, params);
  return result;
}

export async function getCommentListByProductId(
  productId: number,
  params: CursorPaginationParams
): Promise<CursorPaginationResult<Comment>> {
  const product = await productsRepository.getProduct(productId);
  if (!product) {
    throw new NotFoundError('product', productId);
  }

  const result = commentsRepository.getCommentList({ productId }, params);
  return result;
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
