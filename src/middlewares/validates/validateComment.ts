import * as s from 'superstruct';
import isUuid from 'is-uuid';
import { Request, Response, NextFunction } from 'express';

const createCommentSchema = s.object({
  content: s.size(s.string(), 1, 500),
});

function validateCreateComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.validatedCommentCreate = s.create(req.body, createCommentSchema);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
}

const updateCommentSchema = s.partial(createCommentSchema);

function validateUpdateComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.validatedCommentUpdate = s.create(req.body, updateCommentSchema);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
}

const cursorSchema = s.refine(
  s.optional(
    s.coerce(s.string(), s.string(), (v) => (v === '' ? undefined : v))
  ),
  'UUID',
  (value) => value === undefined || isUuid.v4(value)
);

const getListCommentSchema = s.object({
  cursor: cursorSchema,
  limit: s.optional(
    s.coerce(s.number(), s.string(), (v) => {
      const n = Number(v);
      return Number.isNaN(n) || n < 1 ? 1 : n;
    })
  ),
});

function validateGetListComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.validatedCommentGetList = s.create(req.query, getListCommentSchema);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
}

export {
  validateCreateComment,
  validateUpdateComment,
  validateGetListComment,
  createCommentSchema,
  updateCommentSchema,
  getListCommentSchema,
};
