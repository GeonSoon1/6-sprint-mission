import * as s from 'superstruct';
import isUuid from 'is-uuid';

const createCommentSchema = s.object({
  content: s.size(s.string(), 1, 500),
});

function validateCreateComment(req, res, next) {
  try {
    s.assert(req.body, createCommentSchema);
    next();
  } catch (e) {
    next(e);
  }
}

const updateCommentSchema = s.partial(createCommentSchema);

function validateUpdateComment(req, res, next) {
  try {
    s.assert(req.body, updateCommentSchema);
    next();
  } catch (e) {
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
  take: s.optional(
    s.coerce(s.number(), s.string(), (v) => {
      const n = Number(v);
      return Number.isNaN(n) || n < 1 ? 1 : n;
    })
  ),
});

function validateGetListComment(req, res, next) {
  try {
    const _ = s.create(req.query, getListCommentSchema);
    next();
  } catch (e) {
    next(e);
  }
}

export { validateCreateComment, validateUpdateComment, validateGetListComment };
