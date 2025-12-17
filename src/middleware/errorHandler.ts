import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { HttpError } from '../lib/httpError';

function getMessage(e: unknown) {
  return e instanceof Error ? e.message : String(e);
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof Error && err.name === 'StructError') {
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ message: getMessage(err) });
  }

  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2025'
  ) {
    return res.sendStatus(404);
  }

  if (typeof err === 'object' && err !== null && 'status' in err) {
    const status = Number((err as any).status);
    if (!Number.isNaN(status) && status >= 400 && status < 600) {
      return res.status(status).json({ message: getMessage(err) });
    }
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  return res
    .status(500)
    .json({ message: getMessage(err) || 'Internal Server Error' });
};
