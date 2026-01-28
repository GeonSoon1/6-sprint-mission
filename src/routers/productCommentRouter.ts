import { Router } from 'express';
import { asyncHandler, isLoggedIn, validator } from '@middlewares';
import { CreateProductCommentParamDTO, UpdateProductCommentParamDTO } from '@dto';
import { ProductCommentController } from '@controllers';

import { container } from '../lib/inversify.config';
import { TYPES } from '../types/di';

const productCommentController = container.get<ProductCommentController>(
  TYPES.ProductCommentController,
);

const router = Router();

router
  .route('/comments/:id')
  .patch(
    isLoggedIn,
    validator({ params: UpdateProductCommentParamDTO }),
    asyncHandler(productCommentController.updateComment),
  )
  .delete(isLoggedIn, asyncHandler(productCommentController.deleteComment));

router
  .route('/products/:id/comments')
  .post(
    isLoggedIn,
    validator({ params: CreateProductCommentParamDTO }),
    asyncHandler(productCommentController.createComment),
  )
  .get(asyncHandler(productCommentController.getCommentsByProductId));

export default router;
