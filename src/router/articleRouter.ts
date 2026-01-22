import express from 'express';
import { asyncHandler } from '../middleware/handlerFn';
import articleController from '../controller/articleController';
import { authenticate } from '../middleware/authenticate';
import likeController from '../controller/likeController';
import commentController from '../controller/commentController';

const articleRouter = express.Router();

articleRouter
  .get('/', authenticate, asyncHandler(articleController.getArticles))
  .post('/', authenticate, asyncHandler(articleController.createArticle))
  .get('/:id', authenticate, asyncHandler(articleController.getArticleById))
  .patch('/:id', authenticate, asyncHandler(articleController.updateArticle))
  .delete('/:id', authenticate, asyncHandler(articleController.deleteArticle))
  .post('/:id/comments', authenticate, asyncHandler(commentController.createArticleComment))
  .get('/:id/comments', authenticate, asyncHandler(commentController.getArticleComment))
  .post('/:id/like', authenticate, asyncHandler(likeController.toggleLike));

export default articleRouter;
