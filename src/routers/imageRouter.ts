import express from 'express';
import upload from '../upload';
import { uploadSingleImage } from '../controllers/imageController';
import { asyncHandler } from '../libs/asyncHandler';

const imageRouter = express.Router();

imageRouter.post('/', upload.single('image'), asyncHandler(uploadSingleImage));

export default imageRouter;
