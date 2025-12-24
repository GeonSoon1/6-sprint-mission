import type { Request, Response, NextFunction } from 'express';
import type { CreateCommentDto } from '../services/commentService';

import {
  createProductCommentService,
  createArticleCommentService,
  getProductCommentsService,
  getArticleCommentsService,
  updateCommentService,
  deleteCommentService,
} from '../services/commentService';

export async function createProductComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const body = req.body as CreateCommentDto;

    const comment = await createProductCommentService(
      req.params.id,
      body,
      userId
    );
    return res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
}

export async function createArticleComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const body = req.body as CreateCommentDto;

    const comment = await createArticleCommentService(
      req.params.id,
      body,
      userId
    );
    return res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
}

export async function getProductComments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const comments = await getProductCommentsService(
      req.params.id,
      req.query as any
    );
    return res.json(comments);
  } catch (e) {
    next(e);
  }
}

export async function getArticleComments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const comments = await getArticleCommentsService(
      req.params.id,
      req.query as any
    );
    return res.json(comments);
  } catch (e) {
    next(e);
  }
}

export async function updateComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const body = req.body as CreateCommentDto;

    const updated = await updateCommentService(req.params.id, body, userId);
    return res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;

    await deleteCommentService(req.params.id, userId);
    return res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}
