import express from 'express';
import {
  validateCreateArticle,
  validateGetListArticle,
  validateUpdateArticle,
} from '../middlewares/validates/validateArticle';
import { asyncHandler } from '../libs/asyncHandler';
import { validateIdParam } from '../middlewares/validates/validateId';
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  updateArticle,
} from '../controllers/articleController';
import {
  authorizeArticle,
  authorizeUser,
  verifyAccessToken,
} from '../middlewares/auth';

const articleRouter = express.Router();

articleRouter
  .route('/')
  .post(
    verifyAccessToken,
    authorizeUser,
    validateCreateArticle,
    asyncHandler(createArticle)
  )
  .get(validateGetListArticle, asyncHandler(getArticles));
articleRouter
  .route('/:id')
  .get(validateIdParam, asyncHandler(getArticleById))
  .patch(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    validateUpdateArticle,
    authorizeArticle,
    asyncHandler(updateArticle)
  )
  .delete(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    authorizeArticle,
    asyncHandler(deleteArticle)
  );

export default articleRouter;
