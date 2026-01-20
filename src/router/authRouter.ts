import express from 'express';
import { asyncHandler } from '../middleware/handlerFn';
import authController from '../controller/authController';

const authRouter = express.Router();

authRouter
  .post('/register', asyncHandler(authController.register))
  .post('/login', asyncHandler(authController.login))
  .post('/refresh', asyncHandler(authController.refreshTokens))
  .post('/logout', asyncHandler(authController.logout));

export default authRouter;
