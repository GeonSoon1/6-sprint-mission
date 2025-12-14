import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  updateComment,
  deleteComment,
  createProductComment,
  getProductCommentList,
  createArticleComment,
  getArticleCommentList,
} from '../controllers/commentsController';
import authenticate from '../middleware/authenticate';

const commentsRouter = express.Router();

commentsRouter.post('/:id/comments', authenticate, withAsync(createArticleComment));
commentsRouter.get('/:id/comments', withAsync(getArticleCommentList));
commentsRouter.post('/:id/comments', authenticate, withAsync(createProductComment));
commentsRouter.get('/:id/comments', withAsync(getProductCommentList));
commentsRouter.patch('/:id', authenticate, withAsync(updateComment));
commentsRouter.delete('/:id', authenticate, withAsync(deleteComment));

export default commentsRouter;
