"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = exports.NotificationController = void 0;
const notification_service_1 = require("../notifications/notification.service");
const notification_repository_1 = require("../notifications/notification.repository");
class NotificationController {
    service;
    constructor(service) {
        this.service = service;
    }
    // 내 알림 목록 조회
    async getMyNotifications(req, res) {
        const user = req.user;
        const query = req.validatedNotificationQuery;
        const notifications = await this.service.getMyNotifications(user, query);
        res.json(notifications);
    }
    // 안 읽은 알림 개수 조회
    async getUnreadCount(req, res) {
        const user = req.user;
        const count = await this.service.getUnreadCount(user);
        res.json({ count });
    }
    // 알림 읽음 처리
    async readNotification(req, res) {
        const user = req.user;
        const params = req.validatedNotificationId;
        await this.service.readNotification(params.notificationId, user);
        res.json({ message: 'Notification read' });
    }
}
exports.NotificationController = NotificationController;
const notificationRepo = new notification_repository_1.NotificationRepository();
const notificationService = new notification_service_1.NotificationService(notificationRepo);
exports.notificationController = new NotificationController(notificationService);
//# sourceMappingURL=notification.controller.js.map