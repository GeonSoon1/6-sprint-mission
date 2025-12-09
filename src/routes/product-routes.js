// TODO) Product-Routes: URL 매핑
// &) Config Import
import express from 'express';

// &) Core Import
import asyncHandler from '../core/error/async-handler.js';

// &) Middleware Import
import { requireAuth } from '../middleware/auth.js';

// &) Validator Import
import validate from '../validator/validate.js';
import { CreateProduct, PatchProduct } from '../validator/product-validator.js';
import { PurchaseProduct } from '../validator/purchase-validator.js';

// &) Controller Import
import { productController } from '../controllers/product-controller.js';

// ?) Express 라우터 생성
const router = express.Router();

// ?) 상품 목록 조회
router.get('/', asyncHandler(productController.list));

// ?) 상품 조회
router.get('/:id', asyncHandler(productController.detail));

// ?) 상품 생성
router.post(
  '/',
  requireAuth,
  validate(CreateProduct),
  asyncHandler(productController.create)
);

// ?) 상품 수정
router.patch(
  '/:id',
  requireAuth,
  validate(PatchProduct),
  asyncHandler(productController.update)
);

// ?) 상품 삭제
router.delete('/:id', requireAuth, asyncHandler(productController.remove));

// ?) 상품 구매
router.post(
  '/purchase',
  requireAuth,
  validate(PurchaseProduct),
  asyncHandler(productController.purchase)
);

export default router;
