import * as s from 'superstruct';
import isUuid from 'is-uuid';
import { Request, Response, NextFunction } from 'express';

export const validateId = s.object({
  id: s.define('UUID', (value: unknown) => {
    // value 파라미터 unknown 주고 string이 아닐 경우 false 맞을 경우 검사를 직접 지정해줌
    if (typeof value !== 'string') return false;
    return isUuid.v4(value);
  }),
});

export const validateProductId = s.object({
  productId: s.define('UUID', (value: unknown) => {
    if (typeof value !== 'string') return false;
    return isUuid.v4(value);
  }),
});

export const validateArticleId = s.object({
  articleId: s.define('UUID', (value: unknown) => {
    if (typeof value !== 'string') return false;
    return isUuid.v4(value);
  }),
});

export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.validatedId = s.create(req.params, validateId);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
};

export const validateProductIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.validatedProductId = s.create(req.params, validateProductId);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
};

export const validateArticleIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.validatedArticleId = s.create(req.params, validateArticleId);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
};
