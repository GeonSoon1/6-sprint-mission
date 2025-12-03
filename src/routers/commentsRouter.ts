import { Router } from 'express';
import * as commentsController from '../controllers/commentsController';
import { validateCursorPagination } from '../middlewares/validateCursorPagination';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { CreateCommentSchema, PatchCommentSchema } from '../validations/commentsSchema';

const router = Router({ mergeParams: true });

router.post(
  '/',
  authenticate,
  validate(CreateCommentSchema, 'body'),
  commentsController.createComment,
);

router.get('/', validateCursorPagination, commentsController.getComments);

router.patch(
  '/:commentId',
  authenticate,
  validate(PatchCommentSchema, 'body'),
  commentsController.patchComment,
);

router.delete('/:commentId', authenticate, commentsController.deleteComment);

export default router;
