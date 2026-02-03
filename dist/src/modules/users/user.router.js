"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const asyncHandler_1 = require("../../libs/asyncHandler");
const auth_1 = require("../../middlewares/auth");
const validateUser_1 = require("../../middlewares/validates/validateUser");
const validateId_1 = require("../../middlewares/validates/validateId");
const userRouter = express_1.default.Router();
userRouter.post('/registration', validateUser_1.validateCreateUser, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.createUser.bind(user_controller_1.userController)));
userRouter.post('/login', validateUser_1.validateLoginUser, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.loginUser.bind(user_controller_1.userController)));
userRouter.post('/token/refresh', auth_1.verifyRefreshToken, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.newRefreshToken.bind(user_controller_1.userController)));
userRouter.post('/logout', auth_1.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.logOutUser.bind(user_controller_1.userController)));
userRouter.get('/user/profile', auth_1.verifyAccessToken, auth_1.authorizeUser, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.getUserProfile.bind(user_controller_1.userController)));
userRouter.patch('/user/update', auth_1.verifyAccessToken, auth_1.authorizeUser, validateUser_1.validateUpdateUser, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.updateUserProfile.bind(user_controller_1.userController)));
userRouter.get('/user/products', auth_1.verifyAccessToken, auth_1.authorizeUser, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.getUserProducts.bind(user_controller_1.userController)));
userRouter.get('/user/articles', auth_1.verifyAccessToken, auth_1.authorizeUser, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.getUserArticles.bind(user_controller_1.userController)));
userRouter.post('/products/:productId/', auth_1.verifyAccessToken, auth_1.authorizeUser, validateId_1.validateProductIdParam, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.likeProductButton.bind(user_controller_1.userController)));
userRouter.post('/articles/:articleId/', auth_1.verifyAccessToken, auth_1.authorizeUser, validateId_1.validateArticleIdParam, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.likeArticleButton.bind(user_controller_1.userController)));
userRouter.get('/products/like', auth_1.verifyAccessToken, auth_1.authorizeUser, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.likeProductList.bind(user_controller_1.userController)));
userRouter.get('/articles/like', auth_1.verifyAccessToken, auth_1.authorizeUser, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.likeArticleList.bind(user_controller_1.userController)));
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map