// TODO) Product-Comment-Routes: URL 매핑
// &) Config Import
import express from 'express';

// &) Core Import
import asyncHandler from '../core/error/async-handler.js';

// &) Middleware Import
import { requireAuth } from '../middleware/auth.js';

// &) Validator Import
import validate from '../validator/validate.js';
import {
  CreateProductComment,
  PatchProductComment,
} from '../validator/product-comment-validator.js';

// &) Controller Import
import { productCommentController } from '../controllers/product-comment-controller.js';

// ?) Express 라우터 생성
const router = express.Router();

// ?) 상품 댓글 목록 조회
router.get('/:productId', asyncHandler(productCommentController.list));

// ?) 상품 댓글 생성
router.post(
  '/',
  requireAuth,
  validate(CreateProductComment),
  asyncHandler(productCommentController.create)
);

// ?) 상품 댓글 수정
router.patch(
  '/:id',
  requireAuth,
  validate(PatchProductComment),
  asyncHandler(productCommentController.update)
);

// ?) 상품 댓글 삭제
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(productCommentController.remove)
);

export default router;
