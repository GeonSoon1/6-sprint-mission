import * as s from 'superstruct';
import isUuid from 'is-uuid';

const validateId = s.object({
  id: s.define('UUID', (value) => isUuid.v4(value)),
});

const validateProductId = s.object({
  productId: s.define('UUID', (value) => isUuid.v4(value)),
});

const validateArticleId = s.object({
  articleId: s.define('UUID', (value) => isUuid.v4(value)),
});

export const validateIdParam = (req, res, next) => {
  try {
    const _ = s.create(req.params, validateId);
    next();
  } catch (e) {
    next(e);
  }
};

export const validateProductIdParam = (req, res, next) => {
  try {
    const _ = s.create(req.params, validateProductId);
    next();
  } catch (e) {
    next(e);
  }
};

export const validateArticleIdParam = (req, res, next) => {
  try {
    const _ = s.create(req.params, validateArticleId);
    next();
  } catch (e) {
    next(e);
  }
};
