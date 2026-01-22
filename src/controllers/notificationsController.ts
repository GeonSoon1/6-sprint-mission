import { Request, Response } from 'express';
import { create } from 'superstruct';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { notificationService } from '../services/notificationService.js';
import { GetNotificationListParamsStruct } from '../structs/notificationsStructs.js';
import { IdParamsStruct } from '../structs/commonStructs.js';

export async function getNotificationList(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const query = create(req.query, GetNotificationListParamsStruct);
  const result = await notificationService.getNotificationList(req.user.id, query);
  res.send(result);
}

export async function getUnreadNotificationCount(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const count = await notificationService.getUnreadCount(req.user.id);
  res.send({ count });
}

export async function markNotificationRead(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const notification = await notificationService.markRead(id, req.user.id);
  res.send(notification);
}
