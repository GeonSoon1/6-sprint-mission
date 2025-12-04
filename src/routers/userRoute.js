import express from 'express';
import asyncHandler from '../lib/asyncHandler.js';
import * as u from '../controllers/mypage-controllers.js';
import * as ul from '../controllers/mypageList-controllers.js';
import * as ulk from '../controllers/mypageLikes-controllers.js';
import authenticate from '../middleware/authenticate.js';

const userRoute = express.Router();

// ======= ======= ======= ======= =======
// =======  User 정보 확인/수정 기능  =======
// ======= ======= ======= ======= =======

userRoute.get('/', authenticate, asyncHandler(u.userInfo));
userRoute.patch('/', authenticate, asyncHandler(u.updateUserInfo));
userRoute.patch('/password', authenticate, asyncHandler(u.updatePassword));

// ======= ======= ======= ======= =======
// === User 작성 product, article list  ===
// ======= ======= ======= ======= =======

userRoute.get(
  '/products',
  authenticate,
  asyncHandler(ul.getUserCreatedProductsList)
);

userRoute.get(
  '/articles',
  authenticate,
  asyncHandler(ul.getUserCreatedArticlesList)
);

// 댓글 보기는 시간 남으면 작업 하겠습니다..

// ======= ======= ======= ======= =======
// === User product, article like list ===
// ======= ======= ======= ======= =======
userRoute.get(
  '/products/like',
  authenticate,
  asyncHandler(ulk.getUserlikedProductsList)
);

userRoute.get(
  '/articles/like',
  authenticate,
  asyncHandler(ulk.getUserlikedArticlesList)
);

export default userRoute;
