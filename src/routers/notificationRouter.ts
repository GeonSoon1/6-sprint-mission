import { Router } from 'express';
import { container } from '../lib/inversify.config';
import { TYPES } from '../types/di';
import { NotificationController } from '../controllers/notificationController';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { asyncHandler } from '../middlewares/asyncHandler';

// 컨트롤러 인스턴스 가져오기
const notificationController = container.get<NotificationController>(TYPES.NotificationController);

const router = Router();

router
  .route('/')
  .get(isLoggedIn, asyncHandler(notificationController.getMyNotifications))
  .post(isLoggedIn, asyncHandler(notificationController.createNotification));

router.route('/:id/read').patch(isLoggedIn, asyncHandler(notificationController.readNotification));

export default router;
