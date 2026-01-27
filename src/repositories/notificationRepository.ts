import { prismaClient } from '../lib/prismaClient';
import { NotificationType, Prisma } from '@prisma/client';

export async function findManyByUserId(
  userId: number,
  cursorId: number | undefined,
  limit: number = 10,
) {
  return await prismaClient.notification.findMany({
    where: { userId },
    take: limit,
    skip: cursorId ? 1 : 0,
    cursor: cursorId ? { id: cursorId } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      sender: { select: { nickname: true } },
      product: { select: { name: true } },
      article: { select: { title: true } },
    },
  });
}

export async function countUnread(userId: number) {
  return prismaClient.notification.count({
    where: { userId, isRead: false },
  });
}

export async function updateReadStatus(id: number, userId: number) {
  return prismaClient.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });
}

export async function create(data: {
  userId: number;
  type: NotificationType;
  content?: string;
  senderId?: number;
  productId?: number;
  articleId?: number;
}) {
  return prismaClient.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      content: data.content || '',
      senderId: data.senderId,
      productId: data.productId,
      articleId: data.articleId,
      isRead: false,
    },
  });
}

export async function createMany(data: Prisma.NotificationCreateManyInput[]) {
  return prismaClient.notification.createMany({
    data,
    skipDuplicates: true,
  });
}
