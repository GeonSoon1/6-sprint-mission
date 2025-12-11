import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../structs/productStructs';
import prisma from '../lib/prismaclient';
import { OrderType, OrderByMap } from '../types/express/common.types';

export async function productCreateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 입력 값 검증
    assert(req.body, CreateProduct);

    next();
  } catch (err) {
    next(err);
  }
}

export async function productUpdateValidation(
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
