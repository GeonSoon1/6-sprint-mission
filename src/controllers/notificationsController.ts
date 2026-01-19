import { Request, Response } from 'express';
import * as notificationService from '@service/notificationsService';

export async function getNotifications(req: Request, res: Response) {
  const userId = req.user.id;
  const userNotifications = await notificationService.getNotificationList(userId);

  res.status(200).send(userNotifications);
}

export async function updateNotification(req: Request, res: Response) {
  const notificationId = Number(req.params);
  const updateNotificationInfo = await notificationService.updateNotificationInfo(notificationId);

  res.status(200).send(updateNotificationInfo);
}
