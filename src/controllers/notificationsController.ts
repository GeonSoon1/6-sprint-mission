import { Request, Response } from 'express';
import * as notificationService from '../services/notificationService';
import BadRequestError from '../lib/errors/BadRequestError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new UnauthorizedError('인증되지 않은 사용자입니다.');

  const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  if (cursor !== undefined && isNaN(cursor)) {
    throw new BadRequestError('cursor는 숫자여야 합니다.');
  }

  const result = await notificationService.getNotifications(userId, cursor, limit);
  res.status(200).json(result);
};

export const getUnreadCount = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new UnauthorizedError('인증되지 않은 사용자입니다.');

  const count = await notificationService.getUnreadCount(userId);
  res.status(200).json({ count });
};

export const markAsRead = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new UnauthorizedError('인증되지 않은 사용자입니다.');

  const notificationId = Number(req.params.id);

  if (isNaN(notificationId)) {
    throw new BadRequestError('유효하지 않은 알림 ID입니다.');
  }

  const result = await notificationService.markAsRead(notificationId, userId);
  res.status(200).json(result);
};
