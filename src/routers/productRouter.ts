import { Router } from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { pagination } from '../middlewares/pagination';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validator } from '../middlewares/validator';

import { CreateProductDTO, UpdateProductDTO, ProductIdParamDTO } from '../dto';
import { ProductController, LikeController } from '../controllers';

import { container } from '../lib/inversify.config';
import { TYPES } from '../types/di';

const productController = container.get<ProductController>(TYPES.ProductController);
const likeController = container.get<LikeController>(TYPES.LikeController);

const router = Router();

router
  .route('/')
  .post(
    isLoggedIn,
    validator({ body: CreateProductDTO }),
    asyncHandler(productController.createProduct),
  )
  .get(pagination, asyncHandler(productController.getProducts));

router
  .route('/:id')
  .get(validator({ params: ProductIdParamDTO }), asyncHandler(productController.getProductById))
  .patch(
    isLoggedIn,
    validator({ params: ProductIdParamDTO, body: UpdateProductDTO }),
    asyncHandler(productController.updateProduct),
  )
  .delete(
    isLoggedIn,
    validator({ params: ProductIdParamDTO }),
    asyncHandler(productController.deleteProduct),
  );

router
  .route('/:id/like')
  .post(
    isLoggedIn,
    validator({ params: ProductIdParamDTO }),
    asyncHandler(likeController.toggleProductLike),
  );

export default router;
