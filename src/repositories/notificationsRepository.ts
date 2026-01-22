import { Notification } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
import { CursorPaginationParams } from '../types/pagination';

export async function createNotification(
  data: Omit<Notification, 'id' | 'createdAt'>,
) {
  return prismaClient.notification.create({
    data,
  });
}

export async function getNotification(id: number) {
  return prismaClient.notification.findUnique({
    where: { id },
  });
}

export async function getNotificationList(
  userId: number,
  { cursor, limit }: CursorPaginationParams,
) {
  const take = limit + 1;
  const notificationsWithCursor = await prismaClient.notification.findMany({
    where: { userId },
    orderBy: { id: 'desc' },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take,
  });

  const list = notificationsWithCursor.slice(0, limit);
  const nextCursor =
    notificationsWithCursor.length > limit ? notificationsWithCursor[limit].id : null;

  return {
    list,
    nextCursor,
  };
}

export async function getUnreadCount(userId: number) {
  return prismaClient.notification.count({
    where: { userId, isRead: false },
  });
}

export async function updateNotification(id: number, data: Partial<Notification>) {
  return prismaClient.notification.update({
    where: { id },
    data,
  });
}
