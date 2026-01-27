import { Router } from 'express';
import * as notificationController from '../controllers/notificationsController';
import { withAsync } from '../lib/withAsync';
import authenticate from '../middlewares/authenticate';

const router = Router();

router.use(authenticate());

router.get('/', withAsync(notificationController.getNotifications));
router.get('/unread-count', withAsync(notificationController.getUnreadCount));
router.patch('/:id/read', withAsync(notificationController.markAsRead));

export default router;
