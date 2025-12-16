import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { validator } from '../middlewares/validator';
import { CreateArticleCommentParamDTO, UpdateArticleCommentParamDTO } from '../dto';
import { ArticleCommentController } from '../controllers';

import { container } from '../lib/inversify.config';
import { TYPES } from '../types/di';

const articleCommentController = container.get<ArticleCommentController>(
  TYPES.ArticleCommentController,
);

const router = Router();

router
  .route('/articles/:id/comments')
  .post(
    isLoggedIn,
    validator({ params: CreateArticleCommentParamDTO }),
    asyncHandler(articleCommentController.createComment),
  )
  .get(asyncHandler(articleCommentController.getCommentsByArticleId));

router
  .route('/comments/:id')
  .patch(
    isLoggedIn,
    validator({ params: UpdateArticleCommentParamDTO }),
    asyncHandler(articleCommentController.updateComment),
  )
  .delete(isLoggedIn, asyncHandler(articleCommentController.deleteComment));

export default router;
