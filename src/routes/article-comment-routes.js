// TODO) Article-Comment-Routes: URL 매핑
// &) Config Import
import express from 'express';

// &) Core Import
import asyncHandler from '../core/error/async-handler.js';

// &) Middleware Import
import { requireAuth } from '../middleware/auth.js';

// &) Validator Import
import validate from '../validator/validate.js';
import {
  CreateArticleComment,
  PatchArticleComment,
} from '../validator/article-comment-validator.js';

// &) Controller Import
import { articleCommentController } from '../controllers/article-comment-controller.js';

// ?) Express 라우터 생성
const router = express.Router();

// ?) 댓글 목록 조회
router.get('/:articleId', asyncHandler(articleCommentController.list));

// ?) 댓글 생성
router.post(
  '/',
  requireAuth,
  validate(CreateArticleComment),
  asyncHandler(articleCommentController.create)
);

// ?) 댓글 수정
router.patch(
  '/:id',
  requireAuth,
  validate(PatchArticleComment),
  asyncHandler(articleCommentController.update)
);

// ?) 댓글 삭제
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(articleCommentController.remove)
);

export default router;
