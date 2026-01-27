import express from 'express'
import { authenticate } from '../middlewares/authenticate'
import { asyncHandler } from '../middlewares/asyncHandler'
import { getComment, updateComment, deleteComment } from '../controllers/comment.control'


const commentRouter = express.Router()

commentRouter.get('/:id', authenticate, asyncHandler(getComment))
commentRouter.patch('/:id', authenticate, asyncHandler(updateComment))
commentRouter.delete('/:id', authenticate, asyncHandler(deleteComment))

export default commentRouter