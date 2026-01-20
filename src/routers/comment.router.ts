import express from 'express';
import { withAsync } from '@lib/withAsync';
import { updateComment, deleteComment } from '@/controllers/comment.controller';
import authenticate from '@middleware/authenticate';

const commentsRouter = express.Router();

commentsRouter.patch('/:id', authenticate(), withAsync(updateComment));
commentsRouter.delete('/:id', authenticate(), withAsync(deleteComment));

export default commentsRouter;
