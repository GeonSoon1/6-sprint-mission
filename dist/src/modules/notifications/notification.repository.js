"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const prismaClient_1 = __importDefault(require("../../libs/prismaClient"));
class NotificationRepository {
    async create(userId, message) {
        return prismaClient_1.default.notification.create({
            data: {
                userId,
                message,
            },
        });
    }
    async findByUserId(query) {
        const { userId, cursor, limit = 10 } = query;
        return prismaClient_1.default.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: cursor ? 1 : 0,
            ...(cursor && { cursor: { id: cursor } }),
        });
    }
    async countUnread(userId) {
        return prismaClient_1.default.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
    }
    async updateRead(id, userId) {
        // 본인의 알림인지 확인하고 업데이트
        return prismaClient_1.default.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=notification.repository.js.map