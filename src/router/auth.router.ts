import express from 'express';
import authControl from '../controller/auth.control';
import withTryCatch from '../lib/withTryCatch';
import authenticateUser from '../middleware/authenticate.user';

const authRouter = express.Router();

authRouter.post('/register', withTryCatch(authControl.register));
authRouter.post('/login', withTryCatch(authControl.login));
authRouter.post('/logout', authenticateUser, withTryCatch(authControl.logout));

// 토큰 재발행
authRouter.get('/tokens/view', withTryCatch(authControl.viewTokens)); // 토큰 확인: 부가 기능
authRouter.post('/tokens/refresh', withTryCatch(authControl.issueTokens));

// 알림
authRouter.get('/notifications', authenticateUser, withTryCatch(authControl.getNotifications)); // 알림 목록 조회
authRouter.get(
  '/notifications/:id',
  authenticateUser,
  withTryCatch(authControl.countUnreadNotifications)
); // 알림 조회
authRouter.patch(
  '/notifications/:id',
  authenticateUser,
  withTryCatch(authControl.patchNotification)
); // 알림 수정 (단방향: 읽음으로)

export default authRouter;
