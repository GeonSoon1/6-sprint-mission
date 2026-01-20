import type { Prisma, PrismaClient, User, Notification } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { TYPES } from '@types';

@injectable()
export class NotificationRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}
  // 알림생성
  async createNotification(data: Prisma.NotificationCreateInput) {
    return this.prisma.notification.create({ data });
  }
  // 알림 목록 조회
  async findNotification(options: Prisma.NotificationFindManyArgs) {
    return this.prisma.notification.findMany(options);
  }

  // 알림 상세 조회
  async findNotificationById(id: Notification['id']) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  // 안읽은 알림개수 조회
  async countUnreadByUserId(userId: User['id']) {
    return this.prisma.notification.count({ where: { userId, readAt: null } });
  }

  // 읽음 처리(수정)
  async updateNotification(id: Notification['id'], data: Prisma.NotificationUpdateInput) {
    return this.prisma.notification.update({ where: { id }, data });
  }
}
