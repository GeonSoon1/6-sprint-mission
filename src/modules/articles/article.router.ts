import express from 'express';
import {
  validateCreateArticle,
  validateGetListArticle,
  validateUpdateArticle,
} from '../../middlewares/validates/validateArticle';
import { asyncHandler } from '../../libs/asyncHandler';
import { validateIdParam } from '../../middlewares/validates/validateId';
import { articleController } from './article.controller';
import {
  authorizeArticle,
  authorizeUser,
  verifyAccessToken,
} from '../../middlewares/auth';

const articleRouter = express.Router();

articleRouter
  .route('/')
  .post(
    verifyAccessToken,
    authorizeUser,
    validateCreateArticle,
    asyncHandler(articleController.create.bind(articleController)) // bind: this고정 : 클래스 메서드를 라우터에 바로 넣으면 this가 사라짐
  )
  .get(
    validateGetListArticle,
    asyncHandler(articleController.getArticles.bind(articleController))
  );
articleRouter
  .route('/:id')
  .get(
    validateIdParam,
    asyncHandler(articleController.getById.bind(articleController))
  )
  .patch(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    validateUpdateArticle,
    authorizeArticle,
    asyncHandler(articleController.update.bind(articleController))
  )
  .delete(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    authorizeArticle,
    asyncHandler(articleController.delete.bind(articleController))
  );

export default articleRouter;
