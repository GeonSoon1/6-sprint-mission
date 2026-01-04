import { Router } from 'express';
import { prisma } from '../lib/constants';
import { ArticleCommentRepository } from '../repositories/articleCommentRepository';
import { ArticleCommentService } from '../services/articleCommentService';
import { ArticleCommentController } from '../controllers/articleCommentController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { ArticleValidators, validate } from '../middlewares/validator';

const router = Router();
const articleCommentRepository = new ArticleCommentRepository(prisma);
const articleCommentService = new ArticleCommentService(
  articleCommentRepository,
);
const articleCommentController = new ArticleCommentController(
  articleCommentService,
);
const articleValidator = ArticleValidators();

router
  .route('/articles/:id/comments')
  .post(
    isLoggedIn,
    articleValidator.createCommentValidator,
    validate,
    asyncHandler(articleCommentController.createComment),
  )
  .get(asyncHandler(articleCommentController.getCommentsByArticleId));

router
  .route('/comments/:id')
  .patch(
    isLoggedIn,
    articleValidator.updateCommentValidator,
    validate,
    asyncHandler(articleCommentController.updateComment),
  )
  .delete(isLoggedIn, asyncHandler(articleCommentController.deleteComment));

export default router;
