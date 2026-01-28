import express from 'express';
import {
  validateCreateComment,
  validateGetListComment,
  validateUpdateComment,
} from '../../middlewares/validates/validateComment';
import { asyncHandler } from '../../libs/asyncHandler';
import {
  validateProductIdParam,
  validateArticleIdParam,
  validateIdParam,
} from '../../middlewares/validates/validateId';
import { commentController } from './comment.controller';
import {
  authorizeComment,
  authorizeUser,
  verifyAccessToken,
} from '../../middlewares/auth';

const commentRouter = express.Router();

commentRouter
  .route('/product/:productId')
  .post(
    verifyAccessToken,
    authorizeUser,
    validateProductIdParam,
    validateCreateComment,
    asyncHandler(commentController.createProductComment.bind(commentController))
  )
  .get(
    validateProductIdParam,
    validateGetListComment,
    asyncHandler(
      commentController.getCommentsByProductId.bind(commentController)
    )
  );

commentRouter
  .route('/article/:articleId')
  .post(
    verifyAccessToken,
    authorizeUser,
    validateArticleIdParam,
    validateCreateComment,
    asyncHandler(commentController.createArticleComment.bind(commentController))
  )
  .get(
    validateArticleIdParam,
    validateGetListComment,
    asyncHandler(commentController.getCommentsByArticle.bind(commentController))
  );

commentRouter
  .route('/:id')
  .patch(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    validateUpdateComment,
    authorizeComment,
    asyncHandler(commentController.update.bind(commentController))
  )
  .delete(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    authorizeComment,
    asyncHandler(commentController.delete.bind(commentController))
  );

export default commentRouter;
