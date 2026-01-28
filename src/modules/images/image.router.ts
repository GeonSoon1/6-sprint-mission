import express from 'express';
import upload from '../../upload';
import { uploadSingleImage } from './image.controller';
import { asyncHandler } from '../../libs/asyncHandler';

const imageRouter = express.Router();

imageRouter.post('/', upload.single('image'), asyncHandler(uploadSingleImage));

export default imageRouter;
