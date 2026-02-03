import express from 'express'
import { authenticate } from '../middlewares/authenticate.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { getComment, updateComment, deleteComment } from '../controllers/comment.controller.js'


const commentRouter = express.Router()

commentRouter.get('/:id', asyncHandler(authenticate), asyncHandler(getComment))
commentRouter.patch('/:id', authenticate, asyncHandler(updateComment))
commentRouter.delete('/:id', authenticate, asyncHandler(deleteComment))

export default commentRouter