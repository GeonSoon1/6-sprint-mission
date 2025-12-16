import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
  CreateProductComment,
  PatchProductComment,
} from '../structs/commentStructs.js';
import {
  createProductComment,
  patchProductComment,
  getProductCommentList,
  getProductCommentDetail,
  deleteProductComment,
} from '../controllers/productCommentController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router
  .route('/')
  .post(
    validate(CreateProductComment),
    authenticate,
    asyncHandler(createProductComment),
  )
  .get(asyncHandler(getProductCommentList));

router
  .route('/:id')
  .patch(
    validate(PatchProductComment),
    authenticate,
    asyncHandler(patchProductComment),
  )
  .get(asyncHandler(getProductCommentDetail))
  .delete(authenticate, asyncHandler(deleteProductComment));

export default router;
