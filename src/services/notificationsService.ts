import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import * as notificationsRepository from '../repositories/notificationsRepository';
import { CursorPaginationParams, CursorPaginationResult } from '../types/pagination';
import Notification from '../types/Notification';
import { emitToUser } from '../lib/socket';

type CreateNotificationData = Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>;

async function createAndEmit(data: CreateNotificationData) {
  const notification = await notificationsRepository.createNotification(data);
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
  return notificationsRepository.updateNotification(id, { isRead: true, readAt: new Date() });
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
  const content = `Price changed for "${productName}" from ${previousPrice} to ${currentPrice}.`;
  await Promise.all(
    userIds.map((userId) =>
      createAndEmit({
        userId,
        type: 'PRODUCT_PRICE_CHANGE',
        content,
        isRead: false,
        readAt: null,
        productId,
        articleId: null,
        commentId: null,
      }),
    ),
  );
}

export async function notifyArticleComment(
  userId: number,
  articleId: number,
  commentId: number,
  articleTitle: string,
) {
  const content = `New comment on your article "${articleTitle}".`;
  await createAndEmit({
    userId,
    type: 'ARTICLE_COMMENT',
    content,
    isRead: false,
    readAt: null,
    articleId,
    commentId,
    productId: null,
  });
}
