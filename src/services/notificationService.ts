import { NotificationType } from '@prisma/client';
import * as notificationRepository from '../repositories/notificationRepository';
import * as favoriteRepository from '../repositories/favoritesRepository';
import { SocketService } from './socketService';

export async function getNotifications(
  userId: number,
  cursorId: number | undefined,
  limit: number = 10,
) {
  const notifications = await notificationRepository.findManyByUserId(userId, cursorId, limit);

  const lastItem = notifications[notifications.length - 1];
  const nextCursorId = notifications.length === limit && lastItem ? lastItem.id : null;

  return {
    list: notifications,
    nextCursorId,
  };
}

export async function getUnreadCount(userId: number) {
  return await notificationRepository.countUnread(userId);
}

export async function markAsRead(id: number, userId: number) {
  const result = await notificationRepository.updateReadStatus(id, userId);

  if (result.count === 0) {
    throw new Error('존재하지 않거나 접근 권한이 없습니다.');
  }

  return { success: true };
}

export async function notifyPriceChange(productId: number, productName: string, newPrice: number) {
  const favorites = await favoriteRepository.findAllByProductId(productId);
  if (favorites.length === 0) return;

  const userIds = favorites.map((f) => f.userId);
  const message = `[${productName}]의 가격이 ${newPrice.toLocaleString()}원으로 변경되었습니다!`;

  await notificationRepository.createMany(
    userIds.map((userId) => ({
      type: NotificationType.PRICE_CHANGE,
      userId: userId,
      productId: productId,
      content: message,
    })),
  );

  const socketService = SocketService.getInstance();
  userIds.forEach((userId) => {
    socketService.emitToUser(userId, 'notification', {
      type: NotificationType.PRICE_CHANGE,
      content: message,
      productId,
      createdAt: new Date(),
    });
  });
}

export async function notifyNewComment(
  userId: number,
  senderId: number,
  content: string,
  articleId?: number,
  productId?: number,
) {
  const message = `새로운 댓글이 달렸습니다: ${content.substring(0, 10)}...`;

  const newNoti = await notificationRepository.create({
    userId,
    type: NotificationType.COMMENT,
    content: message,
    senderId,
    articleId,
    productId,
  });

  SocketService.getInstance().emitToUser(userId, 'notification', {
    id: newNoti.id,
    type: NotificationType.COMMENT,
    content: message,
    articleId,
    productId,
    createdAt: newNoti.createdAt,
  });
}
