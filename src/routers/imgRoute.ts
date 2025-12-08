import express from 'express';
import asyncHandler from '../lib/asyncHandler';
import multer from 'multer';
import { uploadUserImage } from '../middleware/uploadImg';
import { uploadImgController } from '../controllers/img-controller';

const imgRouter = express.Router();
const upload = multer({ dest: 'files/' });

// imgRouter.post(
//   '/',
//   upload.single('attachment'),
//   asyncHandler(uploadImgController)
// );
imgRouter.post('/', uploadUserImage, asyncHandler(uploadImgController));

export default imgRouter;
