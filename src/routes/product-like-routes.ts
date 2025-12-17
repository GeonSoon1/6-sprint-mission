// TODO) Product-Like-Routes: URL 매핑
import { Router } from 'express';
import asyncHandler from '../core/error/async-handler.js';
import { requireAuth } from '../middleware/auth.js';

import { productLikeController } from '../controllers/product-like-controller.js';

const router = Router();

// 1) 좋아요한 상품 조회
router.get('/me/likes', requireAuth, asyncHandler(productLikeController.list));

// 2) 상품 좋아요 등록
router.post('/:id/like', requireAuth, asyncHandler(productLikeController.like));

// 3) 상품 좋아요 취소
router.delete(
  '/:id/like',
  requireAuth,
  asyncHandler(productLikeController.unlike)
);

export default router;
