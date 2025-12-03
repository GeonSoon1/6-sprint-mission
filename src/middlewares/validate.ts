import { assert } from 'superstruct';

export const validate =
  (schema, type = 'body') =>
  (req, res, next) => {
    assert(req[type], schema);
    next();
  };
