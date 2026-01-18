import prisma from '../../libs/prismaClient';

export class NotificationRepository {
  async create(userId: string, message: string) {
    return prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
  }
  async findByUserId(query: { userId: string; cursor?: string; limit?: number }) {
    const { userId, cursor, limit = 10 } = query;
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
    });
  }
  async countUnread(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
  async updateRead(id: string, userId: string) {
    // 본인의 알림인지 확인하고 업데이트
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }
}