import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
  CreateArticleComment,
  PatchArticleComment,
} from '../structs/commentStructs.js';
import {
  createArticleComment,
  patchArticleComment,
  deleteArticleComment,
  getArticleCommentList,
  getArticleComment,
} from '../controllers/articleCommentController.js';
import authenticate from '../middlewares/authenticate.js';
const router = express.Router();

router
  .route('/')
  .post(
    validate(CreateArticleComment),
    authenticate,
    asyncHandler(createArticleComment),
  )
  .get(asyncHandler(getArticleCommentList));

router
  .route('/:id')
  .patch(
    validate(PatchArticleComment),
    authenticate,
    asyncHandler(patchArticleComment),
  )
  .get(asyncHandler(getArticleComment))
  .delete(authenticate, asyncHandler(deleteArticleComment));

export default router;
