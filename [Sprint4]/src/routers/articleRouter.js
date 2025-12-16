import express from 'express';
import articleCommRouter from './articleCommentRouter.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { CreateArticle, PatchArticle } from '../structs/articleStructs.js';
import {
  createArticle,
  patchArticle,
  getArticle,
  getArticleList,
  deleteArticle,
} from '../controllers/articleController.js';
import authenticate from '../middlewares/authenticate.js';
import { likeController } from '../controllers/likeController.js';

const router = express.Router();

// articleComment
router.use('/comments', articleCommRouter);

router
  .route('/')
  .post(
    validate(CreateArticle),
    // '/:articleId/like',
    authenticate,
    // likeController.handleToggleArticleLike,
    asyncHandler(createArticle),
  )
  .get(asyncHandler(getArticleList));

router
  .route('/:articleId/like')
  .post(authenticate, asyncHandler(likeController.handleToggleArticleLike));

router
  .route('/:id')
  .get(asyncHandler(getArticle))
  .patch(validate(PatchArticle), authenticate, asyncHandler(patchArticle))
  .delete(authenticate, asyncHandler(deleteArticle));

export default router;
