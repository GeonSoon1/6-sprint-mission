import NotFoundError from '@lib/errors/NotFoundError';
import * as notificationsRepository from '@repository/notificationsRepository';

export async function getNotificationList(userId: number) {
  const notificationList = await notificationsRepository.getNotificationList(userId);

  return notificationList;
}

export async function updateNotificationInfo(notificationId: number) {
  const getNotification = await notificationsRepository.getNotification(notificationId);
  if (!getNotification) throw new NotFoundError('notification', notificationId);

  const updateNotification = await notificationsRepository.patchNotification(notificationId);
  return updateNotification;
}
