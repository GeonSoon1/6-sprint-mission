import express from 'express'
import { register, login, logout } from '../controllers/auth.controller.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

const authRouter = express.Router()

// 회원가입
authRouter.post('/register', asyncHandler(register))
authRouter.post('/login', asyncHandler(login))
authRouter.post('/logout', asyncHandler(logout))

export default authRouter