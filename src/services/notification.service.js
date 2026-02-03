import ForbiddenError from "../errors/ForbiddenError.js";
import NotFoundError from "../errors/NotFoundError.js";
import * as notificationRepo from "../repositories/notification.repo.js";

export async function getMyNotifications(userId, { take = 20, skip = 0 } = {}) {
  return notificationRepo.findMyNotifications(userId, take, skip);
}

export async function getUnreadCount(userId) {
  const count = await notificationRepo.countUnread(userId);
  return { count };
}

export async function readNotification(notificationId, userId) {
  const n = await notificationRepo.findById(notificationId);
  if (!n) throw new NotFoundError("알림이 존재하지 않습니다.");
  if (n.userId !== userId) throw new ForbiddenError("본인 알림만 처리할 수 있습니다.");
  return notificationRepo.markAsRead(notificationId);
}
