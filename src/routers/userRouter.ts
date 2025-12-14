import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { UserValidators, validate } from '../middlewares/validator';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
import { UserRepository } from '../repositories/userRepository';
import { prisma } from '../lib/constants';

const router = Router();

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const { deleteValidator } = UserValidators(userRepository);

router.route('/').get(asyncHandler(userController.getSearchUsers)); // 회원 검색

router
  .route('/:id')
  .get(isLoggedIn, asyncHandler(userController.getUserById)) // 회원정보 보기
  .patch(isLoggedIn, asyncHandler(userController.updateUser)) // 회원정보 수정
  .delete(
    isLoggedIn,
    deleteValidator,
    validate,
    asyncHandler(userController.deleteUser),
  ); // 회원 탈퇴(삭제)

export default router;
