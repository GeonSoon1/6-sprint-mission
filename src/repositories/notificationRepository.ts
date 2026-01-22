import { Notification } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
import { NotificationListQueryDTO } from '../types/dto';
import type { NotificationType } from '../types/notification';

export interface CreateNotificationInput {
  userId: number;
  type: NotificationType;
  content: string;
  productId?: number | null;
  articleId?: number | null;
}

export class NotificationRepository {
  async findById(id: number): Promise<Notification | null> {
    return prismaClient.notification.findUnique({ where: { id } });
  }

  async findManyByUserId(userId: number, query: NotificationListQueryDTO): Promise<Notification[]> {
    return prismaClient.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    });
  }

  async countByUserId(userId: number): Promise<number> {
    return prismaClient.notification.count({ where: { userId } });
  }

  async countUnreadByUserId(userId: number): Promise<number> {
    return prismaClient.notification.count({ where: { userId, isRead: false } });
  }

  async create(data: CreateNotificationInput): Promise<Notification> {
    return prismaClient.notification.create({ data });
  }

  async markRead(id: number): Promise<Notification> {
    return prismaClient.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}

export const notificationRepository = new NotificationRepository();
