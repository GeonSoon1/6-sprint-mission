import { Request, Response } from 'express';
import { NotificationService } from '../notifications/notification.service';
export declare class NotificationController {
    private service;
    constructor(service: NotificationService);
    getMyNotifications(req: Request, res: Response): Promise<void>;
    getUnreadCount(req: Request, res: Response): Promise<void>;
    readNotification(req: Request, res: Response): Promise<void>;
}
export declare const notificationController: NotificationController;
//# sourceMappingURL=notification.controller.d.ts.map