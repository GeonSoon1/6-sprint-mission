import express from 'express';
import asyncHandler from '../lib/asyncHandler';
import * as a from '../controllers/article-controller';
import * as ac from '../controllers/articleComment-controller';
import * as al from '../controllers/articleLike-controller';

import {
  userDataValidation,
  articleDataValidation,
  articleCommentDataValidation,
} from '../validators/common-dbcheck-validation';

import {
  articleUserCheckValidation,
  artCommentUserCheckValidation,
} from '../validators/common-permission-validation';

import { getQueryValidation } from '../validators/common-query-validation';

import {
  articleCreateValidation,
  articleUpdateValidation,
} from '../validators/article-validation';

import {
  commentCreateValidation,
  commentUpdateValidation,
} from '../validators/comment-validation';

import {
  articleLikeUpValidation,
  articleLikeDownValidation,
} from '../validators/userLike-validation';

import authenticate from '../middleware/authenticate';

const articleRoute = express.Router();

// ======= ======= ======= ======= =======
// =======  article 자체 API 명령어  =======
// ======= ======= ======= ======= =======

articleRoute.post(
  '/',
  authenticate,
  articleCreateValidation,
  userDataValidation,
  asyncHandler(a.createArticle)
);
articleRoute.get('/', getQueryValidation, asyncHandler(a.getArticlesList));

articleRoute.get(
  '/:id',
  authenticate,
  userDataValidation,
  articleDataValidation,
  asyncHandler(a.getArticleInfo)
);

articleRoute.patch(
  '/:id',
  authenticate,
  articleUpdateValidation,
  userDataValidation,
  articleDataValidation,
  articleUserCheckValidation,
  asyncHandler(a.updateArticle)
);

articleRoute.delete(
  '/:id',
  authenticate,
  userDataValidation,
  articleDataValidation,
  articleUserCheckValidation,
  asyncHandler(a.deleteArticle)
);

// ======= ======= ======= ======= =======
// ======= article에 연결 된 comment =======
// ======= ======= ======= ======= =======

articleRoute.post(
  '/:articleId/comments',
  authenticate,
  userDataValidation,
  articleDataValidation,
  commentCreateValidation,
  asyncHandler(ac.createArticleComment)
);
articleRoute.get(
  '/:articleId/comments',
  articleDataValidation,
  asyncHandler(ac.getArticleCommentsList)
);

articleRoute.patch(
  '/:articleId/comments/:commentId',
  authenticate,
  commentUpdateValidation,
  userDataValidation,
  articleDataValidation,
  articleCommentDataValidation,
  artCommentUserCheckValidation,
  asyncHandler(ac.updateArticleComment)
);
articleRoute.delete(
  '/:articleId/comments/:commentId',
  authenticate,
  userDataValidation,
  articleDataValidation,
  articleCommentDataValidation,
  artCommentUserCheckValidation,
  asyncHandler(ac.deleteArticleComment)
);

// ======= ======= ======= ======= =======
// ====== article에 연결 된 likeCount ======
// ======= ======= ======= ======= =======

articleRoute.post(
  '/:id/likeCount',
  authenticate,
  userDataValidation,
  articleDataValidation,
  articleLikeUpValidation,
  asyncHandler(al.likeCountUp)
);
articleRoute.delete(
  '/:id/likeCount',
  authenticate,
  userDataValidation,
  articleDataValidation,
  articleLikeDownValidation,
  asyncHandler(al.likeCountDown)
);

export default articleRoute;
