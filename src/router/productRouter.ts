import express from 'express';
import { asyncHandler } from '../middleware/handlerFn';
import productController from '../controller/productController';
import { authenticate } from '../middleware/authenticate';
import likeController from '../controller/likeController';

const productRouter = express.Router();

productRouter
  .get('/', authenticate, asyncHandler(productController.getProducts))
  .post('/', authenticate, asyncHandler(productController.createProduct))
  .get('/:id', authenticate, asyncHandler(productController.getProductById))
  .patch('/:id', authenticate, asyncHandler(productController.updateProduct))
  .delete('/:id', authenticate, asyncHandler(productController.deleteProduct))
  .post('/:id/comments', authenticate, asyncHandler(productController.createComment))
  .get('/:id/comments', authenticate, asyncHandler(productController.getComment))
  .post('/:id/like', authenticate, asyncHandler(likeController.toggleLike));

export default productRouter;
