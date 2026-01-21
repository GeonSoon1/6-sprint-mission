import { Prisma, User, Notification } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { TYPES } from '@types';
import { NotificationRepository } from '@repositories';
import { NotFoundError, ForbiddenError, getIO } from '@lib';
import { NotificationDTO } from '@dto';

@injectable()
export class NotificationService {
  constructor(
    @inject(TYPES.NotificationRepository) private notificationRepository: NotificationRepository,
  ) {}

  // 알림생성
  async createNotification(userId: User['id'], data: NotificationDTO) {
    const { title, content, type, link } = data;
    // DB 저장
    const dataToNotification: Prisma.NotificationCreateInput = {
      title,
      content,
      type,
      link,
      user: { connect: { id: userId } },
    };
    const newNotification =
      await this.notificationRepository.createNotification(dataToNotification);

    // 실시간 전송
    try {
      const io = getIO();
      // 'notification'이라는 이벤트 이름으로 보냅니다. 클라이언트도 이걸 리스팅해야 함!
      io.to(userId).emit('notification', newNotification);
    } catch (error) {
      console.error('Socket emission failed: ', error);
    }
    return newNotification;
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
  async readNotification(id: Notification['id'], userId: User['id']) {
    const notification = await this.notificationRepository.findNotificationById(id);
    if (!notification) {
      throw new NotFoundError('알림을 찾을 수 없습니다.');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError('권한이 없습니다.');
    }

    return await this.notificationRepository.updateNotification(id, { readAt: new Date() });
  }

  // 안읽은 알림 숫자 확인
  async getUnreadCount(userId: User['id']) {
    return this.notificationRepository.countUnreadByUserId(userId);
  }
}
