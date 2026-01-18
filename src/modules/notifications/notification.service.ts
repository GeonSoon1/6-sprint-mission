import { NotificationRepository } from '../notifications/notification.repository';
import { notifyUser } from '../../socket';

export class NotificationService {
  constructor(private repo: NotificationRepository) {}

  async create(userId: string, message: string) {
    // 1. DB에 알림 저장
    const notification = await this.repo.create(userId, message);

    // 2. 실시간 소켓 전송 (클라이언트에서 'notification' 이벤트로 받음)
    notifyUser(userId, 'notification', notification.message);

    return notification;
  }

  async getMyNotifications(user: { id: string }, query: any) {
    return this.repo.findByUserId({
      userId: user.id,
      cursor: query.cursor,
      limit: query.limit ? Number(query.limit) : 10,
    });
  }

  async getUnreadCount(user: { id: string }) {
    return this.repo.countUnread(user.id);
  }

  async readNotification(id: string, user: { id: string }) {
    return this.repo.updateRead(id, user.id);
  }
}