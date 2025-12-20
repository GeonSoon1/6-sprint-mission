import { Router } from 'express';
import { ArticleController } from '../controllers/article.controller';
import { CommentController } from '../controllers/comment.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';
import {
  validateArticleCreate,
  validateArticleUpdate,
  validateCommentCreate,
} from '../middlewares/validation.middleware';

const router = Router();
const articleController = new ArticleController();
const commentController = new CommentController();

router
  .route('/')
  .get(articleController.getArticles)
  .post(authenticate, validateArticleCreate, articleController.createArticle);

router
  .route('/:id')
  .get(optionalAuthenticate, articleController.getArticle)
  .patch(authenticate, validateArticleUpdate, articleController.updateArticle)
  .delete(authenticate, articleController.deleteArticle);

router.post('/:id/like', authenticate, articleController.toggleLike);

// Article Comments
router
  .route('/:articleId/comments')
  .get(commentController.getArticleComments)
  .post(authenticate, validateCommentCreate, commentController.createArticleComment);

router
  .route('/comments/:id')
  .patch(authenticate, validateCommentCreate, commentController.updateArticleComment)
  .delete(authenticate, commentController.deleteArticleComment);

export default router;
