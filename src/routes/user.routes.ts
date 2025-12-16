import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {
  validateUserSignup,
  validateUserLogin,
} from "../middlewares/validation.middleware";

const router = Router();
const userController = new UserController();

router.post("/signup", validateUserSignup, userController.signup);
router.post("/login", validateUserLogin, userController.login);
router.post("/refresh", userController.refreshToken);

router.use(authenticate);

router.get("/me", userController.getProfile);
router.patch("/me", userController.updateProfile);
router.patch("/me/password", userController.changePassword);
router.get("/me/products", userController.getMyProducts);
router.get("/me/liked-products", userController.getLikedProducts);

export default router;
