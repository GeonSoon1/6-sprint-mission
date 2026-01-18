import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { NotificationRepository } from '../repogitories/notificationRepogitory';

export class NotificationController {
  constructor(private service: NotificationService) {}

  // 내 알림 목록 조회
  async getMyNotifications(req: Request, res: Response) {
    const user = req.user!;
    const query = req.validatedNotificationQuery;

    const notifications = await this.service.getMyNotifications(
      user,
      query
    );
    res.json(notifications);
  }

  // 안 읽은 알림 개수 조회
  async getUnreadCount(req: Request, res: Response) {
    const user = req.user!;
    const count = await this.service.getUnreadCount(user);
    res.json({ count });
  }

  // 알림 읽음 처리
  async readNotification(req: Request, res: Response) {
    const user = req.user!;
    const params = req.validatedNotificationId;
    
    await this.service.readNotification(params.notificationId, user);
    res.json({ message: 'Notification read' });
  }
}

const notificationRepo = new NotificationRepository();
const notificationService = new NotificationService(notificationRepo);
export const notificationController = new NotificationController(notificationService);