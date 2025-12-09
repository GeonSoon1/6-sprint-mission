import express from 'express';
import {
  validateCreateProduct,
  validateGetListProduct,
  validateUpdateProduct,
} from '../middlewares/validates/validateProduct';
import { asyncHandler } from '../libs/asyncHandler';
import { validateIdParam } from '../middlewares/validates/validateId';
import { productController } from '../controllers/productController';
import {
  authorizeProduct,
  authorizeUser,
  verifyAccessToken,
} from '../middlewares/auth';

const productRouter = express.Router();

productRouter
  .route('/')
  .post(
    verifyAccessToken,
    authorizeUser,
    validateCreateProduct,
    asyncHandler(productController.create.bind(productController))
  )
  .get(
    validateGetListProduct,
    asyncHandler(productController.getProducts.bind(productController))
  );
productRouter
  .route('/:id')
  .get(
    validateIdParam,
    asyncHandler(productController.getById.bind(productController))
  )
  .patch(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    validateUpdateProduct,
    authorizeProduct,
    asyncHandler(productController.update.bind(productController))
  )
  .delete(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    authorizeProduct,
    asyncHandler(productController.delete.bind(productController))
  );

export default productRouter;
