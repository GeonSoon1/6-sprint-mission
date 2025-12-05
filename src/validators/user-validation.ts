import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import { CreateUser } from '../structs/userStructs';

export function userCreateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    assert(req.body, CreateUser);
    next();
  } catch (err) {
    next(err);
  }
}
