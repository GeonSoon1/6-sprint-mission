import express from 'express';
import { upload } from '../middleware/uploads';
import { uploadFileController } from '../controllers/uploadController';

const router = express.Router();

router.post('/', upload.single('image'), uploadFileController);

export default router;
