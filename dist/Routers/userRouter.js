"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../libs/constants");
const catchAsync_1 = require("../libs/catchAsync");
const userController_1 = __importDefault(require("../controller/userController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const userRouter = constants_1.EXPRESS.Router();
const userController = new userController_1.default();
userRouter.post('/', (0, catchAsync_1.catchAsync)(userController.register));
userRouter.post('/login', (0, catchAsync_1.catchAsync)(userController.login));
userRouter.post('/token/refresh', auth_1.default.verifyRefreshToken, (0, catchAsync_1.catchAsync)(userController.refresh));
userRouter.get('/me', auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsync)(userController.GetMe));
userRouter.patch('/me', auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsync)(userController.updateMe));
userRouter.patch('/me/password', auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsync)(userController.updateMyPassword));
userRouter.get('/me/products', auth_1.default.verifyAccessToken, (0, catchAsync_1.catchAsync)(userController.getMyProducts));
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map