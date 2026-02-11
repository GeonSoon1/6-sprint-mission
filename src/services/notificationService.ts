import notificationRepository from '../repositories/notificationRepository';
import { CustomError } from '../libs/Handler/errorHandler';

class NotificationService {
    async getNotifications(userId: number) {
        return await notificationRepository.findAll(userId);
    }

    async getUnreadCount(userId: number) {
        const count = await notificationRepository.countUnread(userId);
        return { count };
    }

    async readNotification(userId: number, notificationId: number) {
        const notification = await notificationRepository.findById(notificationId);

        if (!notification) {
            throw new CustomError(404, 'Notification not found');
        }

        if (notification.userId !== userId) {
            throw new CustomError(403, 'Forbidden: Not your notification');
        }

        if (notification.isRead) {
            return notification;
        }

        return await notificationRepository.markAsRead(notificationId);
    }
}

export const notificationService = new NotificationService();