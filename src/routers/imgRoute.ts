import express from 'express';
import asyncHandler from '../lib/asyncHandler';
import multer from 'multer';
import { imgNew } from '../controllers/img-controller';

const imgRouter = express.Router();
const upload = multer({ dest: 'files/' });

imgRouter.post('/', upload.single('attachment'), asyncHandler(imgNew));

export default imgRouter;
