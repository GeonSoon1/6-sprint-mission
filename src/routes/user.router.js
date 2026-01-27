import express from 'express'
import { authenticate } from '../middlewares/authenticate'
import { asyncHandler } from '../middlewares/asyncHandler'
import { getUser, updateUser, updatePassword } from '../controllers/user.control'

const userRouter = express.Router()

userRouter.get('/me', authenticate, asyncHandler(getUser))
userRouter.patch('/me', authenticate, asyncHandler(updateUser))
userRouter.patch('/me/password', authenticate, asyncHandler(updatePassword))

export default userRouter