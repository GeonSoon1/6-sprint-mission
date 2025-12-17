import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getMyArticles,
  toggleArticleLike,
} from '../controllers/articleController';
import { validateArticle } from '../middleware/validation';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router
  .route('/')
  .get(asyncHandler(getArticles))
  .post(authenticate, validateArticle, asyncHandler(createArticle));

// 내가 작성한 게시글
router.get('/me', authenticate, asyncHandler(getMyArticles));

// 게시글 좋아요 토글
router.post('/:id/like', authenticate, asyncHandler(toggleArticleLike));

router
  .route('/:id')
  .get(asyncHandler(getArticleById))
  .patch(authenticate, asyncHandler(updateArticle))
  .delete(authenticate, asyncHandler(deleteArticle));

export default router;
