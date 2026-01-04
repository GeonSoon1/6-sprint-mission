import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { CreateUser, PatchUser, UserLogin } from '../structs/userStructs.js';
import {
  login,
  createUser,
  patchUser,
  getUser,
  getSearchUser,
  deleteUser,
} from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.route('/login').post(validate(UserLogin), asyncHandler(login)); // 로그인

router
  .route('/')
  .post(validate(CreateUser), asyncHandler(createUser)) // 회원가입
  .get(asyncHandler(getSearchUser)); // 회원찾기

router
  .route('/:id')
  .patch(validate(PatchUser), authenticate, asyncHandler(patchUser)) // 회원정보 수정
  .get(authenticate, asyncHandler(getUser)) //회원정보 보기
  .delete(authenticate, asyncHandler(deleteUser)); //회원탈퇴(삭제)

export default router;
