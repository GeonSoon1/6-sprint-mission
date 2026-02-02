import express from 'express';
import { upload } from '../middleware/upload';

const uploadRouter = express.Router();

uploadRouter.post('/', upload.single('attachment'), (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  /**
   * S3일 때: req.file.location
   * 로컬일 때: req.file.filename
   */
  const filePath =
    process.env.NODE_ENV === 'production'
      ? (req.file as any).location
      : `/files/${req.file.filename}`;

  res.json({ path: filePath });
});

export default uploadRouter;
