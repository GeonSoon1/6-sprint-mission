import { Router } from 'express';
import { asyncHandler, isLoggedIn, validator } from '@middlewares';
import {
  CreateArticleCommentDTO,
  UpdateArticleCommentDTO,
  ArticleIdParamDTO,
  ArticleCommentParamDTO,
} from '@dto';
import { ArticleCommentController } from '@controllers';

import { container } from '@lib';
import { TYPES } from '@types';

const articleCommentController = container.get<ArticleCommentController>(
  TYPES.ArticleCommentController,
);

const router = Router();

router
  .route('/articles/:articleId/comments')
  .post(
    isLoggedIn,
    validator({ params: ArticleCommentParamDTO, body: CreateArticleCommentDTO }),
    asyncHandler(articleCommentController.createComment),
  )
  .get(asyncHandler(articleCommentController.getCommentsByArticleId));

router
  .route('/comments/:id')
  .patch(
    isLoggedIn,
    validator({ params: ArticleIdParamDTO, body: UpdateArticleCommentDTO }),
    asyncHandler(articleCommentController.updateComment),
  )
  .delete(isLoggedIn, asyncHandler(articleCommentController.deleteComment));

export default router;
