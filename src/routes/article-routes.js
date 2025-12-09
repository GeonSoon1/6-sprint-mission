// TODO) Article-Routes: URL 매핑
// &) Config Import
import express from 'express';

// &) Core Import
import asyncHandler from '../core/error/async-handler.js';

// &) Middleware Import
import { requireAuth } from '../middleware/auth.js';

// &) Validator Import
import validate from '../validator/validate.js';
import { CreateArticle, PatchArticle } from '../validator/article-validator.js';

// &) Controller Import
import { articleController } from '../controllers/article-controller.js';

// ?) Express 라우터 생성
const router = express.Router();

// ?) 게시글 목록 조회
router.get('/', asyncHandler(articleController.list));

// ?) 게시글 조회
router.get('/:id', asyncHandler(articleController.detail));

// ?) 게시글 생성
router.post(
  '/',
  requireAuth,
  validate(CreateArticle),
  asyncHandler(articleController.create)
);

// ?) 게시글 수정
router.patch(
  '/:id',
  requireAuth,
  validate(PatchArticle),
  asyncHandler(articleController.update)
);

// ?) 게시글 삭제
router.delete('/:id', requireAuth, asyncHandler(articleController.remove));

export default router;
