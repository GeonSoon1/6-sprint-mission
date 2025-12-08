import express from 'express';
import {
  validateCreateComment,
  validateGetListComment,
  validateUpdateComment,
} from '../middlewares/validates/validateComment';
import { asyncHandler } from '../libs/asyncHandler';
import {
  validateProductIdParam,
  validateArticleIdParam,
  validateIdParam,
} from '../middlewares/validates/validateId';
import {
  createArticleComment,
  createProductComment,
  deleteComment,
  getCommentsByArticleId,
  getCommentsByProductId,
  updateComment,
} from '../controllers/commentController';
import {
  authorizeComment,
  authorizeUser,
  verifyAccessToken,
} from '../middlewares/auth';

const commentRouter = express.Router();

commentRouter
  .route('/product/:productId')
  .post(
    verifyAccessToken,
    authorizeUser,
    validateProductIdParam,
    validateCreateComment,
    asyncHandler(createProductComment)
  )
  .get(
    validateProductIdParam,
    validateGetListComment,
    asyncHandler(getCommentsByProductId)
  );

commentRouter
  .route('/article/:articleId')
  .post(
    verifyAccessToken,
    authorizeUser,
    validateArticleIdParam,
    validateCreateComment,
    asyncHandler(createArticleComment)
  )
  .get(
    validateArticleIdParam,
    validateGetListComment,
    asyncHandler(getCommentsByArticleId)
  );

commentRouter
  .route('/:id')
  .patch(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    validateUpdateComment,
    authorizeComment,
    asyncHandler(updateComment)
  )
  .delete(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    authorizeComment,
    asyncHandler(deleteComment)
  );

export default commentRouter;
