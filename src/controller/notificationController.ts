import { ExpressRequest, ExpressResponse } from '../libs/constants';
import { CustomError } from '../libs/Handler/errorHandler';
import { notificationService } from '../services/notificationService';

export default class NotificationController {

    // GET /notifications
    GetNotifications = async (req: ExpressRequest, res: ExpressResponse) => {
        const userId = req.user?.userId; // 미들웨어에서 userId 가져오기
        if (!userId) throw new CustomError(401, "Unauthorized");

        const notifications = await notificationService.getNotifications(userId);
        res.status(200).send(notifications);
    };

    // GET /notifications/count
    GetUnreadCount = async (req: ExpressRequest, res: ExpressResponse) => {
        const userId = req.user?.userId;
        if (!userId) throw new CustomError(401, "Unauthorized");

        const result = await notificationService.getUnreadCount(userId);
        res.status(200).send(result);
    };

    // PATCH /notifications/:id/read
    ReadNotification = async (req: ExpressRequest, res: ExpressResponse) => {
        const { id } = req.params;
        if (!id) throw new CustomError(400, "Missing notification ID");
        const notificationId = parseInt(id, 10);
        if (!notificationId) throw new CustomError(400, "Invalid notification ID");

        const userId = req.user?.userId;
        if (!userId) throw new CustomError(401, "Unauthorized");

        const result = await notificationService.readNotification(userId, notificationId);
        res.status(200).send(result);
    };
}