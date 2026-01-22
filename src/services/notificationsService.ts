import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import * as notificationsRepository from '../repositories/notificationsRepository';
import { CursorPaginationParams, CursorPaginationResult } from '../types/pagination';
import { emitToUser } from '../lib/socket';
import Notification from '../types/notification';

type CreateNotificationData = Omit<Notification, 'id' | 'createdAt'>;

async function createAndEmit(data: CreateNotificationData) {
  const normalizedData = {
    ...data,
    articleId: data.articleId ?? null,
    productId: data.productId ?? null,
  };
  const notification = await notificationsRepository.createNotification(normalizedData);
  emitToUser(data.userId, 'notification', notification);
  return notification;
}

export async function getMyNotifications(
  userId: number,
  params: CursorPaginationParams,
): Promise<CursorPaginationResult<Notification>> {
  return notificationsRepository.getNotificationList(userId, params);
}

export async function getMyUnreadCount(userId: number) {
  const count = await notificationsRepository.getUnreadCount(userId);
  return count;
}

export async function markAsRead(id: number, userId: number): Promise<Notification> {
  const notification = await notificationsRepository.getNotification(id);
  if (!notification) {
    throw new NotFoundError('notification', id);
  }
  if (notification.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the notification');
  }
  if (notification.isRead) {
    return notification;
  }
  return notificationsRepository.updateNotification(id, { isRead: true });
}

export async function notifyPriceChange(
  userIds: number[],
  productId: number,
  productName: string,
  previousPrice: number,
  currentPrice: number,
) {
  if (userIds.length === 0) {
    return;
  }
  const direction = currentPrice > previousPrice ? '상승' : '하락';
  const content = `상품 "${productName}"의 가격이 ${direction}했습니다.`;
  await Promise.all(
    userIds.map((userId) =>
      createAndEmit({
        userId,
        type: 'PRICE_CHANGED',
        content,
        isRead: false,
        productId,
        articleId: null,
      }),
    ),
  );
}

export async function notifyArticleComment(
  userId: number,
  articleId: number,
  articleTitle: string,
) {
  const content = `내 게시글 "${articleTitle}"에 댓글이 달렸습니다.`;
  await createAndEmit({
    userId,
    type: 'NEW_COMMENT',
    content,
    isRead: false,
    articleId,
    productId: null,
  });
}
