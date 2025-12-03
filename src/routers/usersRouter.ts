import express from 'express';
import { authenticate } from '../middlewares/authenticate';
import * as usersController from '../controllers/usersController';

const router = express.Router();

router.get('/me', authenticate, usersController.getMyInfo);
router.patch('/me', authenticate, usersController.updateMyInfo);
router.patch('/me/password', authenticate, usersController.updatePassword);
router.get('/me/products', authenticate, usersController.getMyProducts);
router.get('/me/likes/products', authenticate, usersController.getMyLikedProducts);
export default router;
