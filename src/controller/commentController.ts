import { Request, Response } from 'express';
import { assert } from 'superstruct';
import type { PatchCommentType } from '../structs/commentStructs';
import { PatchComment } from '../structs/commentStructs';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { AuthenticatedRequest } from '../types/auth';
import commentService from '../service/commentService';
import { CreateComment } from '../structs/commentStructs';

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

  async createArticleComment(req: Request, res: Response) {
    assert(req.body, CreateComment);

    const userId = req.user?.id;
    if (!userId) {
      throw new ForbiddenError('로그인이 필요합니다.');
    }
    const articleId = Number(req.params.id);
    const content = req.body.content;

    const comment = await commentService.createArticleComment(articleId, content, userId);
    res.status(201).send(comment);
  }

  async getArticleComment(req: Request, res: Response) {
    const articleId = Number(req.params.id);
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = String(req.query.limit ?? '10');

    const result = await commentService.getArticleComments(articleId, cursor, limit);

    res.send(result);
  }

  async createProductComment(req: Request, res: Response) {
    assert(req.body, CreateComment);

    const productId = Number(req.params.id);
    const { content } = req.body;

    const comment = await commentService.createProductComment(productId, content);
    res.status(201).send(comment);
  }

  async getProductComments(
    req: Request<{ id: string }, any, any, { cursor?: number; limit?: string }>,
    res: Response,
  ) {
    const productId = Number(req.params.id);
    const cursor = req.query.cursor;
    const limit = parseInt(req.query.limit || '10');

    const result = await commentService.getProductComments(productId, cursor, limit);
    res.send(result);
  }
}

export default new CommentController();
