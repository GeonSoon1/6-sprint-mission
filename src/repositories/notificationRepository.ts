import type { Prisma, PrismaClient } from '@prisma/client';
import { TYPES } from '../types/di';
import { injectable, inject } from 'inversify';

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
  async findNotificationById(id: string) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  // 읽음 처리(수정)
  async updateNotification(id: string, data: Prisma.NotificationUpdateInput) {
    return this.prisma.notification.update({ where: { id }, data });
  }
}
