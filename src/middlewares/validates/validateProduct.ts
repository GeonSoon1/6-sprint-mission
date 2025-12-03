import * as s from 'superstruct';

const createProductSchema = s.object({
  name: s.size(s.string(), 1, 30),
  description: s.size(s.string(), 1, 500),
  price: s.number(),
  tags: s.array(s.string()),
});

function validateCreateProduct(req, res, next) {
  try {
    s.assert(req.body, createProductSchema);
    next();
  } catch (e) {
    next(e);
  }
}

const updateProductSchema = s.partial(createProductSchema);

function validateUpdateProduct(req, res, next) {
  try {
    s.assert(req.body, updateProductSchema);
    next();
  } catch (e) {
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

function validateGetListProduct(req, res, next) {
  try {
    const _ = s.create(req.query, getProductQuerySchema);
    next();
  } catch (e) {
    next(e);
  }
}

export { validateCreateProduct, validateGetListProduct, validateUpdateProduct };
