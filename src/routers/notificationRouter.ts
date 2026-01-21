import { Router } from 'express';
import { container } from '@lib';
import { TYPES } from '@types';
import { NotificationController } from '@controllers';
import { isLoggedIn, asyncHandler } from '@middlewares';

// 컨트롤러 인스턴스 가져오기
const notificationController = container.get<NotificationController>(TYPES.NotificationController);

const router = Router();

router.route('/unread').get(isLoggedIn, asyncHandler(notificationController.getUnreadCount));

router
  .route('/')
  .get(isLoggedIn, asyncHandler(notificationController.getMyNotifications))
  .post(isLoggedIn, asyncHandler(notificationController.createNotification));

router.route('/:id/read').patch(isLoggedIn, asyncHandler(notificationController.readNotification));

export default router;
