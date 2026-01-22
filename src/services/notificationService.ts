import { notificationRepository, CreateNotificationInput } from '../repositories/notificationRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { NotificationListQueryDTO } from '../types/dto';
import { emitNotificationToUser } from '../lib/socket';

export class NotificationService {
  async getNotificationList(userId: number, query: NotificationListQueryDTO) {
    const [list, totalCount] = await Promise.all([
      notificationRepository.findManyByUserId(userId, query),
      notificationRepository.countByUserId(userId),
    ]);

    return { list, totalCount };
  }

  async getUnreadCount(userId: number): Promise<number> {
    return notificationRepository.countUnreadByUserId(userId);
  }

  async markRead(id: number, userId: number) {
    const notification = await notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundError('notification', id);
    }
    if (notification.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the notification');
    }

    return notificationRepository.markRead(id);
  }

  async createNotification(data: CreateNotificationInput) {
    const notification = await notificationRepository.create(data);
    emitNotificationToUser(data.userId, notification);
    return notification;
  }

  async createNotificationsForUsers(userIds: number[], data: Omit<CreateNotificationInput, 'userId'>) {
    const uniqueUserIds = Array.from(new Set(userIds));
    if (uniqueUserIds.length === 0) {
      return [];
    }

    return Promise.all(
      uniqueUserIds.map((userId) =>
        this.createNotification({
          ...data,
          userId,
        }),
      ),
    );
  }
}

export const notificationService = new NotificationService();
