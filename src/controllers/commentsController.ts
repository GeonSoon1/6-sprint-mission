import { create } from 'superstruct';
import {
  CreateCommentBodyStruct,
  GetCommentListParamsStruct,
  UpdateCommentBodyStruct,
} from '../structs/commentsStruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { Request, Response } from 'express';
import { commentService } from '../service/commentService';
import BadRequestError from '../lib/errors/BadRequestError';

//article 댓글
export async function createArticleComment(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const user = req.user;

  const result = await commentService.createArticleComment(content, user, articleId);

  return res.status(201).send(result);
}

export async function getArticleCommentList(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const result = commentService.getArticleCommentList(articleId, cursor, limit);

  return res.send(result);
}

//product 댓글
export async function createProductComment(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const user = req.user;

  const result = await commentService.createProductComment(content, user, productId);

  return res.status(201).send(result);
}

export async function getProductCommentList(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const result = commentService.getProductCommentList(productId, cursor, limit);

  return res.send(result);
}

//그외 공통 부분(수정, 삭제)
export async function updateComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateCommentBodyStruct);
  const user = req.user;

  if (!data) {
    throw new BadRequestError('content is required');
  }

  const result = commentService.updateComment(id, user, data);

  return res.send({ message: 'comment 수정됨', result });
}

export async function deleteComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const user = req.user;

  const result = await commentService.deleteComment(id, user);

  return res.status(204).send({ message: 'comment 삭제됨', result });
}
