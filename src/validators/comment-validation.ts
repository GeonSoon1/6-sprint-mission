import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import { CreateComment, PatchComment } from '../structs/commentStructs';
import prisma from '../lib/prismaclient';

export async function commentCreateValidation(
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
