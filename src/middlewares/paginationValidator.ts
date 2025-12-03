const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

export const validatePagination = (req, res, next) => {
  const { offset = DEFAULT_OFFSET.toString(), limit = DEFAULT_LIMIT.toString() } = req.query;
  const _offset = parseInt(offset, 10);
  const _limit = parseInt(limit, 10);

  if (isNaN(_offset) || isNaN(_limit)) {
    const error = new Error('limit과 offset은 숫자여야 합니다.');
    error.status = 400;
    throw error;
  }

  if (_limit <= 0) {
    const error = new Error('limit 쿼리 파라미터는 0보다 큰 정수여야 합니다.');
    error.status = 400;
    throw error;
  }

  if (_offset < 0) {
    const error = new Error('offset 쿼리 파라미터는 0 이상의 정수여야 합니다.');
    error.status = 400;
    throw error;
  }

  req.paginationParams = {
    offset: _offset,
    limit: _limit,
  };

  next();
};
