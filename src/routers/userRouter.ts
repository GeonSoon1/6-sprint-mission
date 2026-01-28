import { Router } from 'express';
import { asyncHandler, isLoggedIn, validator } from '@middlewares';
import { UserWithdrawalDTO } from '@dto';
import { UserController } from '@controllers';

import { container } from '../lib/inversify.config';
import { TYPES } from '../types/di';

const userController = container.get<UserController>(TYPES.UserController);

const router = Router();

router.route('/').get(asyncHandler(userController.getSearchUsers)); // 회원 검색

router
  .route('/:id')
  .get(isLoggedIn, asyncHandler(userController.getUserById)) // 회원정보 보기
  .patch(isLoggedIn, asyncHandler(userController.updateUser)) // 회원정보 수정
  .delete(
    isLoggedIn,
    validator({ body: UserWithdrawalDTO }),
    asyncHandler(userController.deleteUser),
  ); // 회원 탈퇴(삭제)

export default router;
