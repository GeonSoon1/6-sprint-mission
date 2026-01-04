import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { AuthValidators, validate } from '../middlewares/validator';
import { prisma } from '../lib/constants';
import { AuthController } from '../controllers/authController';
import { AuthService } from '../services/authService';
import { AuthRepository } from '../repositories/authRepository';
import { UserRepository } from '../repositories/userRepository';

const router = Router();

const userRepository = new UserRepository(prisma);
const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository, userRepository);
const authController = new AuthController(authService);

const { loginValidator, signUpValidator } = AuthValidators();

router
  .route('/signup')
  .post(signUpValidator, validate, asyncHandler(authController.signUp)); //회원가입
router
  .route('/login')
  .post(loginValidator, validate, asyncHandler(authController.login)); //로그인
router.route('/logout').post(isLoggedIn, asyncHandler(authController.logout)); // 로그아웃
router.route('/refresh').post(asyncHandler(authController.refresh)); //토큰 재발급

export default router;
