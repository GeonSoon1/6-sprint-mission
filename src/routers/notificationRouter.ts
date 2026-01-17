import express from 'express';
import { asyncHandler } from '../libs/asyncHandler';
import { verifyAccessToken, authorizeUser } from '../middlewares/auth';
import { notificationController } from '../controllers/notificationController';

const notificationRouter = express.Router();

// 알림 목록 조회
notificationRouter.get(
  '/',
  verifyAccessToken,
  authorizeUser,
  asyncHandler(notificationController.getMyNotifications.bind(notificationController))
);

// 안 읽은 알림 개수
notificationRouter.get(
  '/unread-count',
  verifyAccessToken,
  authorizeUser,
  asyncHandler(notificationController.getUnreadCount.bind(notificationController))
);

// 알림 읽음 처리 (id 파라미터 필요)
notificationRouter.patch(
  '/:id/read',
  verifyAccessToken,
  authorizeUser,
  asyncHandler(notificationController.readNotification.bind(notificationController))
);

export default notificationRouter;