import { Request, Response } from 'express';
import { create } from 'superstruct';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import * as notificationsService from '../services/notificationsService';
import { GetNotificationListParamsStruct } from '../structs/notificationsStructs';
import { IdParamsStruct } from '../structs/commonStructs';

export async function getNotificationList(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const query = create(req.query, GetNotificationListParamsStruct);
  const result = await notificationsService.getMyNotifications(req.user.id, query);
  res.send(result);
}

export async function getUnreadNotificationCount(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const count = await notificationsService.getMyUnreadCount(req.user.id);
  res.send({ count });
}

export async function markNotificationRead(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const notification = await notificationsService.markAsRead(id, req.user.id);
  res.send(notification);
}
