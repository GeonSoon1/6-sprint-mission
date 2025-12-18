import express from 'express';
import asyncHandler from '../lib/asyncHandler';
import * as u from '../controllers/mypage-controller';
import * as ul from '../controllers/mypageList-controller';
import * as ulk from '../controllers/mypageLikes-controller';
import authenticate from '../middleware/authenticate';

const userRoute = express.Router();

import { userDataValidation } from '../validators/common-dbcheck-validation';

import { getQueryValidation } from '../validators/common-query-validation';

import {
  userUpdateValidation,
  userUpdatePasswordValidation,
} from '../validators/user-validation';

import {
  productLikeListValidation,
  articleLikeListValidation,
} from '../validators/userLike-validation';

// ======= ======= ======= ======= =======
// =======  User 정보 확인/수정 기능  =======
// ======= ======= ======= ======= =======

userRoute.get('/', authenticate, userDataValidation, asyncHandler(u.userInfo));
userRoute.patch(
  '/',
  authenticate,
  userDataValidation,
  userUpdateValidation,
  asyncHandler(u.updateUserInfo)
);
userRoute.patch(
  '/password',
  authenticate,
  userDataValidation,
  userUpdatePasswordValidation,
  asyncHandler(u.updatePassword)
);

// ======= ======= ======= ======= =======
// === User 작성 product, article list  ===
// ======= ======= ======= ======= =======

userRoute.get(
  '/products',
  authenticate,
  userDataValidation,
  getQueryValidation,
  asyncHandler(ul.getUserCreatedProductsList)
);

userRoute.get(
  '/articles',
  authenticate,
  userDataValidation,
  getQueryValidation,
  asyncHandler(ul.getUserCreatedArticlesList)
);

// 댓글 보기는 시간 남으면 작업 하겠습니다..

// ======= ======= ======= ======= =======
// === User product, article like list ===
// ======= ======= ======= ======= =======
userRoute.get(
  '/products/like',
  authenticate,
  userDataValidation,
  productLikeListValidation,
  asyncHandler(ulk.getUserlikedProductsList)
);

userRoute.get(
  '/articles/like',
  authenticate,
  userDataValidation,
  articleLikeListValidation,
  asyncHandler(ulk.getUserlikedArticlesList)
);

export default userRoute;
