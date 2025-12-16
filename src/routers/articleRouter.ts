import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { pagination } from '../middlewares/pagination';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate, ArticleValidators } from '../middlewares/validator';

import { ArticleRepository } from '../repositories/articleRepository';
import { ArticleService } from '../services/articleService';
import { ArticleController } from '../controllers/articleController';

import { LikeRepository } from '../repositories/likeRepository';
import { LikeService } from '../services/likeService';
import { LikeController } from '../controllers/likeController';

import { ProductRepository } from '../repositories/productRepository';

const router = Router();

const prisma = new PrismaClient();
const articleRepository = new ArticleRepository(prisma);
const productRepository = new ProductRepository(prisma);
const articleService = new ArticleService(articleRepository);
const articleController = new ArticleController(articleService);

const likeRepository = new LikeRepository(prisma);
const likeService = new LikeService(
  likeRepository,
  productRepository,
  articleRepository,
);
const likeController = new LikeController(likeService);

const articleValidator = ArticleValidators();

router
  .route('/')
  .post(
    isLoggedIn,
    articleValidator.createValidator,
    validate,
    asyncHandler(articleController.createArticle),
  )
  .get(pagination, asyncHandler(articleController.getArticles));

router
  .route('/:id')
  .patch(
    isLoggedIn,
    articleValidator.validateId,
    articleValidator.updateValidator,
    validate,
    asyncHandler(articleController.updateArticle),
  )
  .get(
    isLoggedIn,
    articleValidator.validateId,
    validate,
    asyncHandler(articleController.getArticleById),
  )
  .delete(
    isLoggedIn,
    articleValidator.validateId,
    validate,
    asyncHandler(articleController.deleteArticle),
  );

router
  .route('/:id/like')
  .post(
    isLoggedIn,
    articleValidator.validateArticleId,
    validate,
    asyncHandler(likeController.toggleArticleLike),
  );

export default router;
