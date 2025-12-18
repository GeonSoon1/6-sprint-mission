import * as s from 'superstruct';
import { Request, Response, NextFunction } from 'express';

const createProductSchema = s.object({
  name: s.size(s.string(), 1, 30),
  description: s.size(s.string(), 1, 500),
  price: s.number(),
  tags: s.array(s.string()),
});

function validateCreateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.validatedProductCreate = s.create(req.body, createProductSchema);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
}

const updateProductSchema = s.partial(createProductSchema);

function validateUpdateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.validatedProductUpdate = s.create(req.body, updateProductSchema);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
}

const getProductQuerySchema = s.object({
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

function validateGetListProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.validatedProductQuery = s.create(req.query, getProductQuerySchema);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
}

export {
  validateCreateProduct,
  validateGetListProduct,
  validateUpdateProduct,
  createProductSchema,
  updateProductSchema,
  getProductQuerySchema,
};
