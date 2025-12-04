import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../structs/productStructs.js';

export function productCreateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    assert(req.body, CreateProduct);
    next();
  } catch (err) {
    next(err);
  }
}

export function productUpdateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    assert(req.body, PatchProduct);
    next();
  } catch (err) {
    next(err);
  }
}
