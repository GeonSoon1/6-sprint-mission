import { Request, Response } from 'express';
import { assert } from 'superstruct';
import type { PatchCommentType } from '../structs/commentStructs';
import { PatchComment } from '../structs/commentStructs';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { AuthenticatedRequest } from '../types/auth';
import commentService from '../service/commentService';

class CommentController {
  async updateComment(
    req: AuthenticatedRequest<{ id: number }, any, PatchCommentType>,
    res: Response,
  ) {
    assert(req.body, PatchComment);

    const id = Number(req.params.id);
    const { content } = req.body;
    const loginUser = req.user;

    if (!content || content.trim() === '') {
      throw new ForbiddenError('댓글 내용을 입력해주세요.');
    }

    const updated = await commentService.updateComment(id, content, loginUser.id);
    res.send(updated);
  }
  async deleteComment(req: AuthenticatedRequest<{ id: number }>, res: Response) {
    const id = Number(req.params.id);
    const loginUser = req.user;

    await commentService.deleteComment(id, loginUser.id);
    res.status(204).send();
  }
}

export default new CommentController();
