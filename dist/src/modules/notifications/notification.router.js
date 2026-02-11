"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../libs/asyncHandler");
const auth_1 = require("../../middlewares/auth");
const notification_controller_1 = require("./notification.controller");
const validateId_1 = require("../../middlewares/validates/validateId");
const validateNotification_1 = require("../../middlewares/validates/validateNotification");
const notificationRouter = express_1.default.Router();
// 알림 목록 조회
notificationRouter.get('/', auth_1.verifyAccessToken, auth_1.authorizeUser, validateNotification_1.validateGetNotificationQuery, (0, asyncHandler_1.asyncHandler)(notification_controller_1.notificationController.getMyNotifications.bind(notification_controller_1.notificationController)));
// 안 읽은 알림 개수
notificationRouter.get('/unread-count', auth_1.verifyAccessToken, auth_1.authorizeUser, (0, asyncHandler_1.asyncHandler)(notification_controller_1.notificationController.getUnreadCount.bind(notification_controller_1.notificationController)));
// 알림 읽음 처리 (id 파라미터 필요)
notificationRouter.patch('/:notificationId/read', auth_1.verifyAccessToken, validateId_1.validateNotificationIdParam, auth_1.authorizeUser, (0, asyncHandler_1.asyncHandler)(notification_controller_1.notificationController.readNotification.bind(notification_controller_1.notificationController)));
exports.default = notificationRouter;
//# sourceMappingURL=notification.router.js.map