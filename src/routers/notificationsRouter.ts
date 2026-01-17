import express from 'express';
import { withAsync } from '../lib/withAsync';
import authenticate from '../middlewares/authenticate';
import {
  getMyNotifications,
  getMyUnreadCount,
  readNotification,
} from '../controllers/notificationsController';

const notificationsRouter = express.Router();

notificationsRouter.get('/', authenticate(), withAsync(getMyNotifications));
notificationsRouter.get('/unread-count', authenticate(), withAsync(getMyUnreadCount));
notificationsRouter.patch('/:id/read', authenticate(), withAsync(readNotification));

export default notificationsRouter;
