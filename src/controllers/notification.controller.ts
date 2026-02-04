import { Request, Response } from 'express';
import { create } from 'superstruct';
import { IdParamsStruct } from '@/structs/common.structs';
import * as notificationService from '@/service/notification.service';

export async function getNotifications(req: Request, res: Response) {
  const userId = req.user.id;
  const userNotifications = await notificationService.getNotificationList(userId);

  res.status(200).send(userNotifications);
}

export async function updateNotification(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const updateNotificationInfo = await notificationService.updateNotificationInfo(id);

  res.status(200).send(updateNotificationInfo);
}
