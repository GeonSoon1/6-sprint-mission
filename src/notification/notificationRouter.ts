import { Router } from 'express';
import NotificationController from './notificationController';
import auth from '../middlewares/auth';

const router = Router();
const controller = new NotificationController();


router.get('/', auth.softVerifyAccessToken, controller.GetNotifications);
router.get('/count', auth.softVerifyAccessToken, controller.GetUnreadCount);
router.patch('/:id/read', auth.verifyAccessToken, controller.ReadNotification);

export default router;