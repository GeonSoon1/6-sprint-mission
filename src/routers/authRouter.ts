import { Router } from 'express';
import { asyncHandler, isLoggedIn, validator } from '@middlewares';
import { AuthController } from '@controllers';
import { SignUpDTO, AuthDTO } from '@dto';
import { container } from '@lib';
import { TYPES } from '@types';

const authController = container.get<AuthController>(TYPES.AuthController);

const router = Router();

router.route('/signup').post(validator({ body: SignUpDTO }), asyncHandler(authController.signUp)); //회원가입
router.route('/login').post(validator({ body: AuthDTO }), asyncHandler(authController.login)); //로그인
router.route('/logout').post(isLoggedIn, asyncHandler(authController.logout)); // 로그아웃
router.route('/refresh').post(asyncHandler(authController.refresh)); //토큰 재발급

export default router;
