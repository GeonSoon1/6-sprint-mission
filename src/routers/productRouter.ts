import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { isLoggedIn } from '../middlewares/isLoggedIn';
import { pagination } from '../middlewares/pagination';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate, ProductValidators } from '../middlewares/validator';

import { ProductRepository } from '../repositories/productRepository';
import { ProductService } from '../services/productService';
import { ProductController } from '../controllers/productController';

import { LikeRepository } from '../repositories/likeRepository';
import { LikeService } from '../services/likeService';
import { LikeController } from '../controllers/likeController';

import { ArticleRepository } from '../repositories/articleRepository';

const router = Router();

const prisma = new PrismaClient();

const articleRepository = new ArticleRepository(prisma);

const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const likeRepository = new LikeRepository(prisma);
const likeService = new LikeService(
  likeRepository,
  productRepository,
  articleRepository,
);
const likeController = new LikeController(likeService);
const productValidator = ProductValidators();

router
  .route('/')
  .post(
    isLoggedIn,
    productValidator.createValidator,
    validate,
    asyncHandler(productController.createProduct),
  )
  .get(pagination, asyncHandler(productController.getProducts));

router
  .route('/:id')
  .get(
    productValidator.validateId,
    validate,
    asyncHandler(productController.getProductById),
  )
  .patch(
    isLoggedIn,
    productValidator.validateId,
    productValidator.updateValidator,
    validate,
    asyncHandler(productController.updateProduct),
  )
  .delete(
    isLoggedIn,
    productValidator.validateId,
    validate,
    asyncHandler(productController.deleteProduct),
  );

router
  .route('/:id/like')
  .post(
    isLoggedIn,
    productValidator.validateId,
    validate,
    asyncHandler(likeController.toggleProductLike),
  );

export default router;
