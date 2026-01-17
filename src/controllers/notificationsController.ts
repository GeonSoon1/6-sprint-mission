import { Request, Response } from 'express';
import { create } from 'superstruct';
import { CursorParamsStruct, IdParamsStruct } from '../structs/commonStructs';
import * as notificationsService from '../services/notificationsService';

export async function getMyNotifications(req: Request, res: Response) {
  const { cursor, limit } = create(req.query, CursorParamsStruct);
  const result = await notificationsService.getMyNotifications(req.user.id, { cursor, limit });
  res.send(result);
}

export async function getMyUnreadCount(req: Request, res: Response) {
  const count = await notificationsService.getMyUnreadCount(req.user.id);
  res.send({ count });
}

export async function readNotification(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const notification = await notificationsService.markAsRead(id, req.user.id);
  res.send(notification);
}
