import { Request, Response } from 'express';

export async function imgNew(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ message: '파일이 없습니다' });

  const filename = req.file.filename as string;

  const path = `/files/${filename}`;
  res.json({ path });
}
