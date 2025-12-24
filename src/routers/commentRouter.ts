import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  createProductComment,
  createArticleComment,
  getProductComments,
  getArticleComments,
  updateComment,
  deleteComment,
} from '../controllers/commentController';
import authenticate from '../middleware/authenticate';
import { validateComment } from '../middleware/validation';

const router = express.Router();

router
  .route('/product/:id')
  .get(asyncHandler(getProductComments))
  .post(authenticate, validateComment, asyncHandler(createProductComment));

router
  .route('/article/:id')
  .get(asyncHandler(getArticleComments))
  .post(authenticate, validateComment, asyncHandler(createArticleComment));

router
  .route('/:id')
  .patch(authenticate, validateComment, asyncHandler(updateComment))
  .delete(authenticate, asyncHandler(deleteComment));

export default router;
