import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types/di';
import { NotificationService } from '../services/notificationService';

@injectable()
export class NotificationController {
  constructor(
    @inject(TYPES.NotificationService) private notificationService: NotificationService,
  ) {}

  getMyNotifications = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const notifications = await this.notificationService.getMyNotifications(userId);
    res.status(200).json(notifications);
  };

  createNotification = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = req.body;
    const newNotification = await this.notificationService.createNotification(userId, data);

    res.status(201).json(newNotification);
  };

  readNotification = async (req: Request, res: Response) => {
    const notificationId = req.params.id;
    const userId = req.user!.id;

    const updatedNotification = await this.notificationService.readNotification(
      notificationId,
      userId,
    );
    return res.status(200).json(updatedNotification);
  };
}
