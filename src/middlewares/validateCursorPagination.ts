import isUUID from 'is-uuid';
import { Request, Response, NextFunction } from 'express';
import { ErrorWithStatus } from '../utils/types';

export const validateCursorPagination = (req: Request, res: Response, next: NextFunction) => {
  const { cursor, limit } = req.query;

  let _limit = 10;

  if (typeof limit === 'string') {
    const parsedLimit = parseInt(limit);

    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      const error: ErrorWithStatus = new Error('limit 쿼리 파라미터는 0보다 큰 정수여야 합니다.');
      error.status = 400;
      throw error;
    }
    _limit = parsedLimit;
  }

  if (cursor) {
    if (typeof cursor === 'string' && !isUUID.v4(cursor)) {
      const error: ErrorWithStatus = new Error('cursor 쿼리 파라미터는 올바른 UUID여야 합니다.');
      error.status = 400;
      throw error;
    }
  }

  req.paginationParams = {
    cursor: typeof cursor === 'string' ? cursor : undefined,
    limit: _limit,
  };

  next();
};
