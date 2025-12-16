import { RequestHandler } from 'express';
import { assert, Struct } from 'superstruct';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate =
  (schema: Struct<any>, type: ValidationTarget = 'body'): RequestHandler =>
  (req, res, next) => {
    assert(req[type], schema);
    next();
  };
