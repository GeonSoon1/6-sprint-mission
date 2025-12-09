"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_1 = require("../lib/withAsync");
const usersController_js_1 = require("../controllers/usersController.js");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const usersRouter = express_1.default.Router();
usersRouter.post('/register', (0, withAsync_1.withAsync)(usersController_js_1.userRegister));
usersRouter.post('/login', (0, withAsync_1.withAsync)(usersController_js_1.userLogin));
usersRouter.post('/refresh', (0, withAsync_1.withAsync)(usersController_js_1.refreshTokens));
usersRouter.post('/logout', (0, withAsync_1.withAsync)(usersController_js_1.userLogout));
usersRouter.get('/list', (0, withAsync_1.withAsync)(usersController_js_1.userList));
usersRouter.get('/info', authenticate_1.default, (0, withAsync_1.withAsync)(usersController_js_1.userInfo));
usersRouter.patch('/info', authenticate_1.default, (0, withAsync_1.withAsync)(usersController_js_1.userInfoPatch));
usersRouter.get('/products', authenticate_1.default, (0, withAsync_1.withAsync)(usersController_js_1.userUploadProducts));
exports.default = usersRouter;
