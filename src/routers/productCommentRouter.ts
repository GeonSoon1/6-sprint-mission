import { Router } from 'express';
import { prisma } from '../lib/constants';
import { ProductCommentRepository } from '../repositories/productCommentRepository';
import { ProductCommentService } from '../services/productCommentService';
import { ProductCommentController } from '../controllers/productCommentController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { ProductValidators, validate } from '../middlewares/validator';

const router = Router();
const productCommentRepository = new ProductCommentRepository(prisma);
const productCommentService = new ProductCommentService(
  productCommentRepository,
);
const productCommentController = new ProductCommentController(
  productCommentService,
);
const productValidator = ProductValidators();

router
  .route('/comments/:id')
  .patch(
    isLoggedIn,
    productValidator.updateCommentValidator,
    validate,
    asyncHandler(productCommentController.updateComment),
  )
  .delete(isLoggedIn, asyncHandler(productCommentController.deleteComment));

router
  .route('/products/:id/comments')
  .post(
    isLoggedIn,
    productValidator.createCommentValidator,
    validate,
    asyncHandler(productCommentController.createComment),
  )
  .get(asyncHandler(productCommentController.getCommentsByProductId));

export default router;
