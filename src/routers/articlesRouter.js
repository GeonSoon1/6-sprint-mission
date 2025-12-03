import express from 'express';
import { validatePagination } from '../middlewares/paginationValidator.js';
import {
  createArticle,
  getArticles,
  getArticle,
  patchArticle,
  deleteArticle,
} from '../controllers/articlesController.js';
import * as likesController from '../controllers/likesController.js';
import commentsRouter from './commentsRouter.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { CreateArticleSchema, PatchArticleSchema } from '../validations/articlesSchema.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, validate(CreateArticleSchema, 'body'), createArticle);
router.get('/', validatePagination, authMiddleware, getArticles);

router.get('/:id', authMiddleware, getArticle);
router.patch('/:id', authenticate, validate(PatchArticleSchema, 'body'), patchArticle);
router.delete('/:id', authenticate, deleteArticle);

router.post('/:articleId/like', authenticate, likesController.changeArticleLike);

router.use('/:articleId/comments', commentsRouter);

export default router;
