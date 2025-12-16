import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { validator } from '../middlewares/validator';
import { AuthController } from '../controllers';
import { SignUpDTO, AuthDTO } from '../dto';
import { container } from '../lib/inversify.config';
import { TYPES } from '../types/di';

const authController = container.get<AuthController>(TYPES.AuthController);

const router = Router();

router.route('/signup').post(validator({ body: SignUpDTO }), asyncHandler(authController.signUp)); //회원가입
router.route('/login').post(validator({ body: AuthDTO }), asyncHandler(authController.login)); //로그인
router.route('/logout').post(isLoggedIn, asyncHandler(authController.logout)); // 로그아웃
router.route('/refresh').post(asyncHandler(authController.refresh)); //토큰 재발급

export default router;
