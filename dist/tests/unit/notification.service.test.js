"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const notification_service_1 = require("../../src/modules/notifications/notification.service");
const notification_repository_1 = require("../../src/modules/notifications/notification.repository");
const socketUtils = __importStar(require("../../src/socket"));
jest.mock('../../src/modules/notifications/notification.repository');
jest.mock('../../src/socket');
describe('NotificationService Unit Test', () => {
    let notificationService;
    let notificationRepository;
    beforeEach(() => {
        notificationRepository =
            new notification_repository_1.NotificationRepository();
        notificationService = new notification_service_1.NotificationService(notificationRepository);
        jest.clearAllMocks();
    });
    test('create - 알림 생성 및 소켓 전송', async () => {
        const userId = 'user-uuid';
        const message = 'test message';
        const createdNotification = {
            id: 'noti-id',
            userId,
            message,
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        notificationRepository.create.mockResolvedValue(createdNotification);
        const notifyUserSpy = jest.spyOn(socketUtils, 'notifyUser');
        const result = await notificationService.create(userId, message);
        expect(notificationRepository.create).toHaveBeenCalledWith(userId, message);
        expect(notifyUserSpy).toHaveBeenCalledWith(userId, 'notification', message);
        expect(result).toEqual(createdNotification);
    });
    test('getMyNotifications - 알림 목록 조회', async () => {
        const userId = 'user-uuid';
        const query = { cursor: 'cursor-id', limit: '20' };
        const notifications = [{ id: '1' }, { id: '2' }];
        notificationRepository.findByUserId.mockResolvedValue(notifications);
        const result = await notificationService.getMyNotifications({ id: userId }, query);
        expect(notificationRepository.findByUserId).toHaveBeenCalledWith({
            userId,
            cursor: 'cursor-id',
            limit: 20,
        });
        expect(result).toEqual(notifications);
    });
    test('getMyNotifications - limit 기본값 테스트', async () => {
        const userId = 'user-uuid';
        const query = {};
        notificationRepository.findByUserId.mockResolvedValue([]);
        await notificationService.getMyNotifications({ id: userId }, query);
        expect(notificationRepository.findByUserId).toHaveBeenCalledWith({
            userId,
            cursor: undefined,
            limit: 10,
        });
    });
    test('getUnreadCount - 읽지 않은 알림 개수 조회', async () => {
        const userId = 'user-uuid';
        notificationRepository.countUnread.mockResolvedValue(5);
        const result = await notificationService.getUnreadCount({ id: userId });
        expect(notificationRepository.countUnread).toHaveBeenCalledWith(userId);
        expect(result).toBe(5);
    });
    test('readNotification - 알림 읽음 처리', async () => {
        const userId = 'user-uuid';
        const notificationId = 'noti-id';
        notificationRepository.updateRead.mockResolvedValue({ count: 1 });
        const result = await notificationService.readNotification(notificationId, {
            id: userId,
        });
        expect(notificationRepository.updateRead).toHaveBeenCalledWith(notificationId, userId);
    });
});
//# sourceMappingURL=notification.service.test.js.map