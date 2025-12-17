import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  toggleProductLike,
  getLikedProducts,
} from '../controllers/productController';
import { validateProduct } from '../middleware/validation';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router
  .route('/')
  .get(asyncHandler(getProducts))
  .post(authenticate, validateProduct, asyncHandler(createProduct));

// 내가 등록한 상품
router.get('/me', authenticate, asyncHandler(getMyProducts));

// 내가 좋아요한 상품 목록
router.get('/likes', authenticate, asyncHandler(getLikedProducts));

// 좋아요
router.post('/:id/like', authenticate, asyncHandler(toggleProductLike));

router
  .route('/:id')
  .get(asyncHandler(getProductById))
  .patch(authenticate, asyncHandler(updateProduct))
  .delete(authenticate, asyncHandler(deleteProduct));

export default router;
