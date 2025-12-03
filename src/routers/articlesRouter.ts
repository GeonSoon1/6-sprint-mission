import express from 'express';
import { validatePagination } from '../middlewares/paginationValidator';
import {
  createArticle,
  getArticles,
  getArticle,
  patchArticle,
  deleteArticle,
} from '../controllers/articlesController';
import * as likesController from '../controllers/likesController';
import commentsRouter from './commentsRouter';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { CreateArticleSchema, PatchArticleSchema } from '../validations/articlesSchema';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticate, validate(CreateArticleSchema, 'body'), createArticle);
router.get('/', validatePagination, authMiddleware, getArticles);

router.get('/:id', authMiddleware, getArticle);
router.patch('/:id', authenticate, validate(PatchArticleSchema, 'body'), patchArticle);
router.delete('/:id', authenticate, deleteArticle);

router.post('/:articleId/like', authenticate, likesController.changeArticleLike);

router.use('/:articleId/comments', commentsRouter);

export default router;
