import express from 'express';
import { validatePagination } from '../middlewares/paginationValidator';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  patchProduct,
} from '../controllers/productsController';
import * as likesController from '../controllers/likesController';
import commentsRouter from './commentsRouter';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { CreateProductSchema, PatchProductSchema } from '../validations/productsSchema';

const router = express.Router();

router.post('/', authenticate, validate(CreateProductSchema, 'body'), createProduct);
router.get('/', validatePagination, getProducts);
router.post('/:productId/like', authenticate, likesController.changeProductLike);
router.get('/:id', getProduct);
router.patch('/:id', authenticate, validate(PatchProductSchema, 'body'), patchProduct);
router.delete('/:id', authenticate, deleteProduct);

router.use('/:productId/comments', commentsRouter);

export default router;
