import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs/articleStructs';

export function articleCreateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    assert(req.body, CreateArticle);
    next();
  } catch (err) {
    next(err);
  }
}

export function articleUpdateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    assert(req.body, PatchArticle);
    next();
  } catch (err) {
    next(err);
  }
}
