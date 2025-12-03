import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (req: Request, res: Response) => Promise<void>;

export function withAsync(handler: AsyncHandler) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await handler(req, res);
    } catch (e) {
      next(e);
    }
  };
}

