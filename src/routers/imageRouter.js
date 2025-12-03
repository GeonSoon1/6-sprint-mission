import express from 'express';
import upload from '../upload.js';
import { uploadSingleImage } from '../controllers/imageController.js';
import { asyncHandler } from '../libs/asyncHandler.js';

const imageRouter = express.Router();

imageRouter.post('/', upload.single('image'), asyncHandler(uploadSingleImage));

export default imageRouter;
