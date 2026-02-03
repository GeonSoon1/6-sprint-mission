import { prisma } from "../lib/prisma.js";

export function createNotification(data) {
  return prisma.notification.create({ data });
}

export function createManyNotifications(rows) {
  return prisma.notification.createMany({ data: rows });
}

export function findMyNotifications(userId, take, skip) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
    skip,
  });
}

export function countUnread(userId) {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

export function findById(id) {
  return prisma.notification.findUnique({
    where: { id },
  });
}

export function markAsRead(id) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}
