// TODO) Product-Like-Routes: URL 매핑
// &) Config Import
import { Router } from 'express';

// &) Core Import
import asyncHandler from '../core/error/async-handler.js';

// &) Middleware Import
import { requireAuth } from '../middleware/auth.js';

// &) Controller Import
import { productLikeController } from '../controllers/product-like-controller.js';

// ?) Express 라우터 생성
const router = Router();

// ?) 좋아요한 상품 조회
router.get('/me/likes', requireAuth, asyncHandler(productLikeController.list));

// ?) 상품 좋아요 등록
router.post('/:id/like', requireAuth, asyncHandler(productLikeController.like));

// ?) 상품 좋아요 취소
router.delete(
  '/:id/like',
  requireAuth,
  asyncHandler(productLikeController.unlike)
);

export default router;
