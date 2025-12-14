import type { Request, Response, NextFunction } from 'express';

export const uploadFileController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '업로드할 파일이 없습니다.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    return res.status(200).json({
      message: '파일 업로드 성공!',
      fileName: req.file.originalname,
      fileUrl,
    });
  } catch (error) {
    next(error);
  }
};
