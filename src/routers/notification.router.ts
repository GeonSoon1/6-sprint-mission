import express from 'express';
import { withAsync } from '@lib/withAsync';
import { getNotifications, updateNotification } from '@/controllers/notification.controller';
import authenticate from '@middleware/authenticate';

const notificationRouter = express.Router();

notificationRouter.get('/', authenticate(), withAsync(getNotifications));

notificationRouter.patch('/:id/read', authenticate(), withAsync(updateNotification));

export default notificationRouter;
