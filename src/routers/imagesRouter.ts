import { Router, RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);

    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 파일 크기 제한
});

const uploadImage: RequestHandler = (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
    return;
  }

  const { filename } = req.file;
  const filePath = `/files/${filename}`;

  res.status(201).json({ path: filePath });
};

router.post('/', upload.single('attachment'), uploadImage);

export default router;
