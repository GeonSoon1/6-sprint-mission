import express from 'express';
import asyncHandler from '../lib/asyncHandler.js';
import multer from 'multer';
import { imgNew } from '../controllers/img-controllers.js';

const imgRouter = express.Router();
const upload = multer({ dest: 'files/' });

imgRouter.post('/', upload.single('attachment'), asyncHandler(imgNew));

export default imgRouter;
