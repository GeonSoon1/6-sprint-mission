import prisma from '../lib/prisma';
import { Notification, NotificationCreate } from '../types/notification';

class NotificationRepository {
  async createNotification(data: NotificationCreate): Promise<Notification> {
    const createdNotification = await prisma.notification.create({
      data,
    });
    return createdNotification;
  }

  async findUnreadByUserId(userId: number) {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return notifications;
  }

  async findByUserId(userId: number) {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return notifications;
  }

  async getUnreadCountByUserId(userId: number): Promise<number> {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
    return count;
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return updatedNotification;
  }

  async getNotification(notificationId: number): Promise<Notification | null> {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });
    return notification;
  }
}

export default new NotificationRepository();
