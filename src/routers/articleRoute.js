import express from 'express';
import asyncHandler from '../lib/asyncHandler.js';
import * as a from '../controllers/article-controllers.js';
import * as ac from '../controllers/articleComment-controllers.js';
import * as al from '../controllers/articleLike-controllers.js';

import {
  articleCreateValidation,
  articleUpdateValidation,
} from '../validators/article-validation.js';

import {
  commentCreateValidation,
  commentUpdateValidation,
} from '../validators/comment-validation.js';

import authenticate from '../../middleware/authenticate.js';

const articleRoute = express.Router();

// ======= ======= ======= ======= =======
// =======  article 자체 API 명령어  =======
// ======= ======= ======= ======= =======

articleRoute.post(
  '/',
  authenticate,
  articleCreateValidation,
  asyncHandler(a.createArticle)
);
articleRoute.get('/', asyncHandler(a.getArticlesList));

articleRoute.get('/:id', authenticate, asyncHandler(a.getArticleInfo));
articleRoute.patch(
  '/:id',
  authenticate,
  articleUpdateValidation,
  asyncHandler(a.updateArticle)
);
articleRoute.delete('/:id', authenticate, asyncHandler(a.deleteArticle));

// ======= ======= ======= ======= =======
// ======= article에 연결 된 comment =======
// ======= ======= ======= ======= =======

articleRoute.post(
  '/:articleId/comments',
  authenticate,
  commentCreateValidation,
  asyncHandler(ac.createArticleComment)
);
articleRoute.get(
  '/:articleId/comments',
  asyncHandler(ac.getArticleCommentsList)
);

articleRoute.patch(
  '/:articleId/comments/:commentId',
  authenticate,
  commentUpdateValidation,
  asyncHandler(ac.updateArticleComment)
);
articleRoute.delete(
  '/:articleId/comments/:commentId',
  authenticate,
  asyncHandler(ac.deleteArticleComment)
);

// ======= ======= ======= ======= =======
// ====== article에 연결 된 likeCount ======
// ======= ======= ======= ======= =======

articleRoute.post('/:id/likeCount', authenticate, asyncHandler(al.likeCountUp));
articleRoute.delete(
  '/:id/likeCount',
  authenticate,
  asyncHandler(al.likeCountDown)
);

export default articleRoute;
