import { prismaClient } from '../lib/prismaClient';
import { CursorPaginationParams } from '../types/pagination';
import Notification from '../types/notification';

type NotificationCreateData = Omit<Notification, 'id' | 'createdAt'>;
type NotificationDelegate = {
  create: (args: { data: NotificationCreateData }) => Promise<Notification>;
  findUnique: (args: { where: { id: number } }) => Promise<Notification | null>;
  findMany: (args: Record<string, unknown>) => Promise<Notification[]>;
  count: (args: Record<string, unknown>) => Promise<number>;
  update: (args: { where: { id: number }; data: Partial<Notification> }) => Promise<Notification>;
};

const notificationClient = (prismaClient as unknown as { notification: NotificationDelegate })
  .notification;

export async function createNotification(
  data: NotificationCreateData,
) {
  return notificationClient.create({
    data,
  });
}

export async function getNotification(id: number) {
  return notificationClient.findUnique({
    where: { id },
  });
}

export async function getNotificationList(
  userId: number,
  { cursor, limit }: CursorPaginationParams,
) {
  const take = limit + 1;
  const notificationsWithCursor = await notificationClient.findMany({
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
  return notificationClient.count({
    where: { userId, isRead: false },
  });
}

export async function updateNotification(id: number, data: Partial<Notification>) {
  return notificationClient.update({
    where: { id },
    data,
  });
}
