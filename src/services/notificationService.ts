import { Prisma, User, Notification } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types/di';
import { NotificationRepository } from '../repositories/notificationRepository';
import { NotFoundError, ForbiddenError } from '../lib/errors';
import { NotificationDTO } from '../dto';

@injectable()
export class NotificationService {
  constructor(
    @inject(TYPES.NotificationRepository) private notificationRepository: NotificationRepository,
  ) {}

  // 알림생성
  async createNotification(userId: User['id'], data: NotificationDTO) {
    const { title, content, type, link } = data;
    const dataToNotification: Prisma.NotificationCreateInput = {
      title,
      content,
      type,
      link,
      user: { connect: { id: userId } },
    };
    return await this.notificationRepository.createNotification(dataToNotification);
  }

  // 내 알림 목록 조회
  async getMyNotifications(userId: User['id']) {
    const notificationList = await this.notificationRepository.findNotification({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    const notificationCount = notificationList.length;
    return { notificationList, notificationCount };
  }

  // 알림 읽음 처리
  async readNotification(userId: User['id'], id: string) {
    const notification = await this.notificationRepository.findNotificationById(id);
    if (!notification) {
      throw new NotFoundError('알림을 찾을 수 없습니다.');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError('권한이 없습니다.');
    }

    return await this.notificationRepository.updateNotification(id, { readAt: new Date() });
  }
}
