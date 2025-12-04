import { Prisma } from '@prisma/client';
import { ErrorRequestHandler } from 'express';
import { string } from 'superstruct';
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (!err) {
    // err = undefined, null 인 경우
    return res.status(500).send({ message: 'Unknown Server error' });
  }

  // Prisma 에러 처리
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2025': // Record not found
        return res.status(404).json({
          status: 404,
          message: `Cannot find, ${err.meta?.cause || err.message}`,
        });

      case 'P2002': // Unique constraint failed
        return res.status(400).json({
          status: 400,
          message: `Unique constraint failed on ${err.meta?.target || 'field'}`,
        });

      case 'P2003': // Foreign key constraint failed
        return res.status(400).json({
          status: 400,
          message: 'Foreign key constraint failed',
        });
    }
  }

  // 나머지 에러를 확인하는 작업
  const status = err.status || 500;

  const messages: { [status: number]: string } = {
    400: 'Bad Request',
    404: 'Not Found',
    500: 'Unknown Server Error',
  };

  return res.status(status).json({
    status,
    message: err.message || messages[status] || 'Unexpected Error',
  });
};

export default errorHandler;
