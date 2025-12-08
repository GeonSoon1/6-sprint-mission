import { Request, Response } from 'express';
import { STATIC_PATH } from '../lib/constants';
import path from 'path';

export async function uploadImgController(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ message: '파일이 없습니다' });

  const host = req.get('host');
  const filename = req.file.filename as string;
  const filePath = path.join(host!, STATIC_PATH, filename);
  const url = `http://${filePath}`;

  return res.send({ url });
}

export async function imgNew(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ message: '파일이 없습니다' });

  const filename = req.file.filename as string;

  const path = `/files/${filename}`;
  res.json({ path });
}
