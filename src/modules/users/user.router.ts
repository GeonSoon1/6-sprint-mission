import express from 'express';
import { userController } from './user.controller';
import { asyncHandler } from '../../libs/asyncHandler';
import {
  authorizeUser,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../middlewares/auth';
import {
  validateCreateUser,
  validateLoginUser,
  validateUpdateUser,
} from '../../middlewares/validates/validateUser';
import {
  validateArticleIdParam,
  validateProductIdParam,
} from '../../middlewares/validates/validateId';

const userRouter = express.Router();

userRouter.post(
  '/registration',
  validateCreateUser,
  asyncHandler(userController.createUser.bind(userController))
);
userRouter.post(
  '/login',
  validateLoginUser,
  asyncHandler(userController.loginUser.bind(userController))
);
userRouter.post(
  '/token/refresh',
  verifyRefreshToken,
  asyncHandler(userController.newRefreshToken.bind(userController))
);
userRouter.post(
  '/logout',
  verifyAccessToken,
  asyncHandler(userController.logOutUser.bind(userController))
);
userRouter.get(
  '/user/profile',
  verifyAccessToken,
  authorizeUser,
  asyncHandler(userController.getUserProfile.bind(userController))
);
userRouter.patch(
  '/user/update',
  verifyAccessToken,
  authorizeUser,
  validateUpdateUser,
  asyncHandler(userController.updateUserProfile.bind(userController))
);
userRouter.get(
  '/user/products',
  verifyAccessToken,
  authorizeUser,
  asyncHandler(userController.getUserProducts.bind(userController))
);
userRouter.get(
  '/user/articles',
  verifyAccessToken,
  authorizeUser,
  asyncHandler(userController.getUserArticles.bind(userController))
);
userRouter.post(
  '/products/:productId/',
  verifyAccessToken,
  authorizeUser,
  validateProductIdParam,
  asyncHandler(userController.likeProductButton.bind(userController))
);
userRouter.post(
  '/articles/:articleId/',
  verifyAccessToken,
  authorizeUser,
  validateArticleIdParam,
  asyncHandler(userController.likeArticleButton.bind(userController))
);
userRouter.get(
  '/products/like',
  verifyAccessToken,
  authorizeUser,
  asyncHandler(userController.likeProductList.bind(userController))
);
userRouter.get(
  '/articles/like',
  verifyAccessToken,
  authorizeUser,
  asyncHandler(userController.likeArticleList.bind(userController))
);
export default userRouter;
