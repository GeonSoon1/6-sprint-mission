// TODO) Upload-Routes: URL 매핑
// &) Config Import
import express from 'express';

// &) Middleware Import
import { upload } from '../config/multer.js';

// &) Controller Import
import { uploadController } from '../controllers/upload-controller.js';

// ?) Express 라우터 생성
const router = express.Router();

// ?) 이미지 업로드
router.post('/', upload.single('image'), uploadController.image);

export default router;
