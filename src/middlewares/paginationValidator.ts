import { RequestHandler } from 'express';
import { ErrorWithStatus } from '../utils/types';

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

export const validatePagination: RequestHandler = async (req, res, next) => {
  const { offset = DEFAULT_OFFSET.toString(), limit = DEFAULT_LIMIT.toString() } = req.query;
  const _offset = parseInt(offset as string, 10);
  const _limit = parseInt(limit as string, 10);

  if (isNaN(_offset) || isNaN(_limit)) {
    const error: ErrorWithStatus = new Error('limit과 offset은 숫자여야 합니다.');
    error.status = 400;
    throw error;
  }

  if (_limit <= 0) {
    const error: ErrorWithStatus = new Error('limit 쿼리 파라미터는 0보다 큰 정수여야 합니다.');
    error.status = 400;
    throw error;
  }

  if (_offset < 0) {
    const error: ErrorWithStatus = new Error('offset 쿼리 파라미터는 0 이상의 정수여야 합니다.');
    error.status = 400;
    throw error;
  }

  req.paginationParams = {
    offset: _offset,
    limit: _limit,
  };

  next();
};
