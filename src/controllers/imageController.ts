import { BadRequestError } from '../libs/error';
import { Request, Response, NextFunction } from 'express';

export function uploadSingleImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const file = req.file;

  if (!file) {
    return next(new BadRequestError());
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/${file.path}`;

  res.status(200).json({
    imageUrl: imageUrl,
  });
}
