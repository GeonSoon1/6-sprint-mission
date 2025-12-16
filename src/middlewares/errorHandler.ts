import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../lib/errors/BaseError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ message: '서버 오류 발생!' });
  }
  res.status(500).json({ message: err.message, stack: err.stack });
};
