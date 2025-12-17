import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/authController';
import authenticate from '../middleware/authenticate';
import {
  validateRegister,
  validateLogin,
  validatePatchProfile,
  validateChangePassword,
} from '../middleware/validation';
const router = express.Router();

router.post('/register', validateRegister, asyncHandler(register));

router.post('/login', validateLogin, asyncHandler(login));

router.post('/refresh', asyncHandler(refresh));

router.post('/logout', logout);

router.get('/me', authenticate, asyncHandler(getMe));

router.patch(
  '/profile',
  authenticate,
  validatePatchProfile,
  asyncHandler(updateProfile)
);

router.patch(
  '/password',
  authenticate,
  validateChangePassword,
  asyncHandler(changePassword)
);

export default router;
