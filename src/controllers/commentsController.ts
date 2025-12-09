import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import ForbiddenError from '../lib/errors/ForbiddenError';
import UnauthorizeError from '../lib/errors/UnauthorizeError';
import { Request, Response } from 'express';

export async function updateComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);
  const user = req.user;

  const existingComment = await prismaClient.comment.findUnique({ where: { id } });
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  if (!user) {
    throw new UnauthorizeError();
  }

  if (existingComment.authorId !== user.id) {
    throw new ForbiddenError('comment');
  }

  const updatedComment = await prismaClient.comment.update({
    where: { id },
    data: { content },
  });

  return res.send({ message: 'comment 수정됨', updatedComment });
}

export async function deleteComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const user = req.user;

  const existingComment = await prismaClient.comment.findUnique({ where: { id } });
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  if (!user) {
    throw new UnauthorizeError();
  }
  if (existingComment.authorId !== user.id) {
    throw new ForbiddenError('comment');
  }

  await prismaClient.comment.delete({ where: { id } });

  return res.status(204).send({ message: 'comment 삭제됨', existingComment });
}
