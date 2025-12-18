import * as s from 'superstruct';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../libs/error';

const createArticleSchema = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.size(s.string(), 1, 500),
});

function validateCreateArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.validatedArticleCreate = s.create(req.body, createArticleSchema);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
}

const updateArticleSchema = s.partial(createArticleSchema);

function validateUpdateArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.validatedArticleUpdate = s.create(req.body, updateArticleSchema);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
}

const getArticleQuerySchema = s.object({
  page: s.optional(
    s.coerce(s.number(), s.string(), (v) => {
      const n = Number(v);
      return Number.isNaN(n) || n < 1 ? 1 : n; // NaN이거나 1보다 작으면 1 반환
    })
  ),
  limit: s.optional(
    s.coerce(s.number(), s.string(), (v) => {
      const n = Number(v);
      return Number.isNaN(n) || n < 1 ? 1 : n;
    })
  ),
  search: s.optional(s.size(s.string(), 0, 50)),
  skip: s.optional(
    s.coerce(s.number(), s.string(), (v) => {
      const n = Number(v);
      return Number.isNaN(n) || n < 1 ? 1 : n;
    })
  ),
  sort: s.optional(s.union([s.enums(['recent', 'oldest']), s.literal('')])),
});

function validateGetListArticle( // req = 재할당
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.validatedArticleQuery = s.create(req.query, getArticleQuerySchema);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
}

export {
  validateCreateArticle,
  validateUpdateArticle,
  validateGetListArticle,
  getArticleQuerySchema,
  updateArticleSchema,
  createArticleSchema,
};
