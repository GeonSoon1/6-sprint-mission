"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../services/userService");
class UserServiceController {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield userService_1.userService.createUser(req.body);
            return res.status(201).json(user);
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield userService_1.userService.getUser(email, password);
            const accessToken = userService_1.userService.createToken(user);
            const refreshToken = userService_1.userService.createToken(user, 'refresh');
            yield userService_1.userService.updateUser(user.id, { refreshToken });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });
            return res.status(200).json({ accessToken });
        });
        this.refresh = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.cookies;
            const { userId } = req.auth;
            const { accessToken, newRefreshToken } = yield userService_1.userService.refreshToken(userId, refreshToken); // 변경
            yield userService_1.userService.updateUser(userId, { refreshToken: newRefreshToken }); // 추가
            res.cookie('refreshToken', newRefreshToken, {
                path: '/token/refresh',
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });
            return res.json({ accessToken });
        });
        this.GetMe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            const user = yield userService_1.userService.getUserById(userId);
            return res.status(200).json(user);
        });
        this.updateMe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            const updatedUser = yield userService_1.userService.updateProfile(userId, req.body);
            return res.status(200).json(updatedUser);
        });
        this.updateMyPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            const updatedUser = yield userService_1.userService.updatePassword(userId, req.body);
            return res.status(200).json(updatedUser);
        });
        this.getMyProducts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            const products = yield userService_1.userService.getProductsByUserId(userId);
            return res.status(200).json(products);
        });
        this.getMyLikedProducts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            const products = yield userService_1.userService.getLikedProductsByUserId(userId);
            return res.status(200).json(products);
        });
    }
}
exports.default = UserServiceController;
//# sourceMappingURL=userController.js.map