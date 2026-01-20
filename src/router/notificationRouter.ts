import express from 'express';
import { asyncHandler } from '../middleware/handlerFn';
import notificationController from '../controller/notificationController';
import { authenticate } from '../middleware/authenticate';

const notificationRouter = express.Router();

notificationRouter.get('/', authenticate, asyncHandler(notificationController.getMyNotifications));
notificationRouter.get(
  '/unread-count',
  authenticate,
  asyncHandler(notificationController.getMyUnreadNotificationCount),
);
notificationRouter.patch(
  '/:id/read',
  authenticate,
  asyncHandler(notificationController.markNotificationAsRead),
);

export default notificationRouter;
