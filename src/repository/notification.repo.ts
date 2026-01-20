import { prismaClient } from '@lib/prismaClient';

export type NotificationType = 'priceChange' | 'productComment' | 'articleComment';

export async function createNotification(data: {
  userId: number;
  type: NotificationType;
  articleId?: number;
  productId?: number;
  message: string;
}) {
  const { userId, type, message, articleId, productId } = data;

  return await prismaClient.notification.create({
    data: {
      type,
      message,
      userId,
      articleId: articleId ?? null,
      productId: productId ?? null,
    },
  });
}

export async function getNotificationList(userId: number) {
  const [notifications, unReadTotal] = await prismaClient.$transaction([
    prismaClient.notification.findMany({
      where: { userId },
    }),
    prismaClient.notification.count({
      where: { userId, isRead: false },
    }),
  ]);
  return { notifications, unReadTotal };
}

export async function getNotification(notificationId: number) {
  return await prismaClient.notification.findUnique({ where: { id: notificationId } });
}

export async function patchNotification(notificationId: number) {
  return await prismaClient.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}
