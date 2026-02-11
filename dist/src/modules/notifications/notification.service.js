"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const socket_1 = require("../../socket");
class NotificationService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(userId, message) {
        // 1. DB에 알림 저장
        const notification = await this.repo.create(userId, message);
        // 2. 실시간 소켓 전송 (클라이언트에서 'notification' 이벤트로 받음)
        (0, socket_1.notifyUser)(userId, 'notification', notification.message);
        return notification;
    }
    async getMyNotifications(user, query) {
        return this.repo.findByUserId({
            userId: user.id,
            cursor: query.cursor,
            limit: query.limit ? Number(query.limit) : 10,
        });
    }
    async getUnreadCount(user) {
        return this.repo.countUnread(user.id);
    }
    async readNotification(id, user) {
        return this.repo.updateRead(id, user.id);
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map