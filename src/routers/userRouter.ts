import express from 'express';
import {
  createUser,
  getUserProducts,
  getUserProfile,
  likeArticleButton,
  likeArticleList,
  likeProductButton,
  likeProductList,
  loginUser,
  logOutUser,
  newRefreshToken,
  updateUserProfile,
} from '../controllers/userController';
import { asyncHandler } from '../libs/asyncHandler';
import {
  authorizeUser,
  verifyAccessToken,
  verifyRefreshToken,
} from '../middlewares/auth';
import {
  validateCreateUser,
  validateLoginUser,
  validateUpdateUser,
} from '../middlewares/validates/validateUser';
import {
  validateArticleIdParam,
  validateProductIdParam,
} from '../middlewares/validates/validateId';

const userRouter = express.Router();

userRouter.post('/registration', validateCreateUser, asyncHandler(createUser));
userRouter.post('/login', validateLoginUser, asyncHandler(loginUser));
userRouter.post(
  '/token/refresh',
  verifyRefreshToken,
  asyncHandler(newRefreshToken)
);
userRouter.post('/logout', verifyAccessToken, asyncHandler(logOutUser));
userRouter.get(
  '/user/profile',
  verifyAccessToken,
  authorizeUser,
  asyncHandler(getUserProfile)
);
userRouter.patch(
  '/user/update',
  verifyAccessToken,
  authorizeUser,
  validateUpdateUser,
  asyncHandler(updateUserProfile)
);
userRouter.get(
  '/user/products',
  verifyAccessToken,
  authorizeUser,
  asyncHandler(getUserProducts)
);
userRouter.post(
  '/products/:productId/',
  verifyAccessToken,
  authorizeUser,
  validateProductIdParam,
  asyncHandler(likeProductButton)
);
userRouter.post(
  '/articles/:articleId/',
  verifyAccessToken,
  authorizeUser,
  validateArticleIdParam,
  asyncHandler(likeArticleButton)
);
userRouter.get(
  '/products/like',
  verifyAccessToken,
  authorizeUser,
  asyncHandler(likeProductList)
);
userRouter.get(
  '/articles/like',
  verifyAccessToken,
  authorizeUser,
  asyncHandler(likeArticleList)
);
export default userRouter;
