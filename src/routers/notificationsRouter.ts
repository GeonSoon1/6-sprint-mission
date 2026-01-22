import express from 'express';
import { withAsync } from '../lib/withAsync';
import authenticate from '../middlewares/authenticate';
import {
  getNotificationList,
  getUnreadNotificationCount,
  markNotificationRead,
} from '../controllers/notificationsController';

const notificationsRouter = express.Router();

notificationsRouter.get('/', authenticate(), withAsync(getNotificationList));
notificationsRouter.get('/unread-count', authenticate(), withAsync(getUnreadNotificationCount));
notificationsRouter.patch('/:id/read', authenticate(), withAsync(markNotificationRead));

export default notificationsRouter;
