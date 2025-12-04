import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import { CreateComment, PatchComment } from '../structs/commentStructs';

export function commentCreateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    assert(req.body, CreateComment);
    next();
  } catch (err) {
    next(err);
  }
}

export function commentUpdateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    assert(req.body, PatchComment);
    next();
  } catch (err) {
    next(err);
  }
}
