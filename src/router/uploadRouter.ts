import express from 'express';
import multer from 'multer';

const uploadRouter = express.Router();

const upload = multer({ dest: 'uploads/' });

uploadRouter.post('/', upload.single('attachment'), (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filename = req.file.filename;
  const path = `/files/${filename}`;
  res.json({ path });
});

export default uploadRouter;
