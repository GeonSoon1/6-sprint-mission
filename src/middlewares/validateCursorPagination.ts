import isUUID from 'is-uuid';

export const validateCursorPagination = (req, res, next) => {
  const { cursor, limit } = req.query;

  let _limit = 10;
  if (limit !== undefined) {
    _limit = parseInt(limit);
    if (isNaN(_limit) || _limit <= 0) {
      const error = new Error('limit 쿼리 파라미터는 0보다 큰 정수여야 합니다.');
      error.status = 400;
      throw error;
    }
  }

  if (cursor && !isUUID.v4(cursor)) {
    const error = new Error('cursor 쿼리 파라미터는 올바른 UUID여야 합니다.');
    error.status = 400;
    throw error;
  }

  req.paginationParams = {
    cursor: cursor || null,
    limit: _limit,
  };

  next();
};
