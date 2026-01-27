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
  async createNotification(userIds: User['id'][], data: Omit<NotificationDTO, 'userId'>) {
    const { title, content, type, link } = data;
    // createMany용 데이터 배열 생성(userId 직접 할당)
    const dataList: Prisma.NotificationCreateManyInput[] = userIds.map((userId) => ({
      title,
      content,
      type,
      link,
      userId,
    }));

    // DB 일괄 저장(createMany)
    await this.notificationRepository.createNotifications(dataList);

    // 실시간 전송
    try {
      const io = getIO();
      userIds.forEach((userId) => {
        io.to(userId).emit('notification', { message: '새로운 알림이 도착했습니다.' });
      });
    } catch (error) {
      console.error('알림 메시지 전송 실패 : ', error);
    }
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
