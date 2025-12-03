import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

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

router.post('/', upload.single('attachment'), (req, res) => {
  const { filename } = req.file;
  const path = `/files/${filename}`;

  res.status(201).json({ path });
});

export default router;
