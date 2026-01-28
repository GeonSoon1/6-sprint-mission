import { Request, Response } from 'express';
import notificationService from '../service/notificationService';
import { AuthenticatedRequest } from '../types/auth';

class NotificationController {
  // 내 알림 목록 조회
  async getMyNotifications(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.id;
    const notifications = await notificationService.getNotifications(userId);
    res.send(notifications);
  }

  // 내 안 읽은 알림 갯수 조회
  async getMyUnreadNotificationCount(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.id;
    const count = await notificationService.getUnreadNotificationCount(userId);
    res.send({ unreadCount: count });
  }

  // 알림 읽음 처리
  async markNotificationAsRead(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id);
    const updatedNotification = await notificationService.markNotificationAsRead(
      notificationId,
      userId,
    );
    res.send(updatedNotification);
  }
}

export default new NotificationController();
