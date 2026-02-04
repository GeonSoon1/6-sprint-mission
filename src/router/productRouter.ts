import express from 'express';
import { asyncHandler } from '../middleware/handlerFn';
import productController from '../controller/productController';
import { authenticate } from '../middleware/authenticate';
import likeController from '../controller/likeController';
import commentController from '../controller/commentController';

const productRouter = express.Router();

productRouter
  .get('/', asyncHandler(productController.getProducts))
  .post('/', authenticate, asyncHandler(productController.createProduct))
  .get('/:id', asyncHandler(productController.getProductById))
  .patch('/:id', authenticate, asyncHandler(productController.updateProduct))
  .delete('/:id', authenticate, asyncHandler(productController.deleteProduct))
  .post('/:id/comments', authenticate, asyncHandler(commentController.createProductComment))
  .get('/:id/comments', authenticate, asyncHandler(commentController.getProductComments))
  .post('/:id/like', authenticate, asyncHandler(likeController.toggleLike));

export default productRouter;
