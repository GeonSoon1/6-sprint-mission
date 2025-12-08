import express from 'express';
import {
  validateCreateProduct,
  validateGetListProduct,
  validateUpdateProduct,
} from '../middlewares/validates/validateProduct';
import { asyncHandler } from '../libs/asyncHandler';
import { validateIdParam } from '../middlewares/validates/validateId';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController';
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
    asyncHandler(createProduct)
  )
  .get(validateGetListProduct, asyncHandler(getProducts));
productRouter
  .route('/:id')
  .get(validateIdParam, asyncHandler(getProductById))
  .patch(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    validateUpdateProduct,
    authorizeProduct,
    asyncHandler(updateProduct)
  )
  .delete(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    authorizeProduct,
    asyncHandler(deleteProduct)
  );

export default productRouter;
