import express from 'express';
import { asyncHandler } from '../middleware/handlerFn';
import UserController from '../controller/userController';
import { authenticate } from '../middleware/authenticate';

const userRouter = express.Router();

userRouter
  .get('/me', authenticate, asyncHandler(UserController.getMe))
  .patch('/me', authenticate, asyncHandler(UserController.updateMe))
  .patch('/me/password', authenticate, asyncHandler(UserController.updateMyPassword))
  .get('/me/products', authenticate, asyncHandler(UserController.getMyProduct))
  .get('/me/likes', authenticate, asyncHandler(UserController.getLikedProducts));

export default userRouter;
