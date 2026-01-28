import { Request, Response } from 'express';
import { create } from 'superstruct';
import { UpdateCommentBodyStruct } from '@/structs/comment.struct';
import { IdParamsStruct } from '@/structs/common.structs';
import * as commentsService from '@/service/comment.service';

export async function updateComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);
  const updatedComment = await commentsService.updateComment(id, req.user.id, content);
  res.send(updatedComment);
}

export async function deleteComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await commentsService.deleteComment(id, req.user.id);
  res.status(204).send();
}
