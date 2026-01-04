import { Request, Response, NextFunction } from 'express';

export const pagination = (req: Request, res: Response, next: NextFunction) => {
  const { page: pageStr, limit: limitStr } = req.query;

  const page = pageStr ? parseInt(pageStr as string, 10) : 1;
  const limit = limitStr ? parseInt(limitStr as string, 10) : 1;

  if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
    return res.status(400).json({ message: '유효하지 않은 페이지입니다.' });
  }

  const skip = (page - 1) * limit;
  const take = limit;

  (req as any).pagination = { skip, take };
  next();
};
