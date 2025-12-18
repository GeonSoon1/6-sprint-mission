import { NextFunction, RequestHandler, Request, Response } from 'express';

export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    // express타입패키지에서 타입정의를 가져와서 붙임
    Promise.resolve(fn(req, res, next)).catch(next);
  };
