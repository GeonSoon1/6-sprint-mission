"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../../libs/error");
class UserService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async createUser(dto) {
        const { email, password, ...rest } = dto;
        const existedUser = await this.repo.findByEmail(email);
        if (existedUser)
            throw new error_1.BadRequestError('이미 존재하는 사용자');
        const hashedPassword = await this.hashingPassword(password);
        const createdUser = await this.repo.create({
            ...rest,
            email,
            password: hashedPassword,
        });
        return this.filterSensitiveUserData(createdUser);
    }
    async hashingPassword(password) {
        return bcrypt_1.default.hash(password, 10);
    }
    async filterSensitiveUserData(user) {
        const { password, refreshToken, ...rest } = user;
        return rest;
    }
    async verifyPassword(inputPassword, savedPassword) {
        const isValid = await bcrypt_1.default.compare(inputPassword, savedPassword);
        if (!isValid)
            throw new error_1.ForbiddenError();
    }
    async isSamePassword(inputPassword, savedPassword) {
        const isSame = await bcrypt_1.default.compare(inputPassword, savedPassword);
        if (isSame)
            throw new error_1.IsSamePasswordError();
    }
    async getUser(email, password) {
        const user = await this.repo.findByEmail(email);
        if (!user)
            throw new error_1.BadRequestError('사용자 없음');
        await this.verifyPassword(password, user.password);
        return this.filterSensitiveUserData(user);
    }
    async createToken(user, type) {
        const payload = { userId: user.id };
        const options = {
            expiresIn: type === 'refresh' ? '2w' : '1h',
        };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, options);
    }
    //JWT 슬라이딩 세션
    async refreshToken(userId, refreshToken) {
        const user = await this.repo.findById(userId);
        if (!user || user.refreshToken !== refreshToken)
            throw new error_1.BadRequestError();
        const accessToken = await this.createToken(user);
        const newRefreshToken = await this.createToken(user, 'refresh');
        await this.repo.updateRefreshToken(userId, newRefreshToken);
        return { accessToken, newRefreshToken };
    }
    async updateRefreshToken(email, refreshToken) {
        await this.repo.updateRefreshTokenByEmail(email, refreshToken);
    }
    async logOutUser(userId) {
        await this.repo.clearRefreshToken(userId);
    }
    async getUserProfile(id) {
        const user = await this.repo.findById(id);
        if (!user)
            throw new error_1.NotFoundError();
        return this.filterSensitiveUserData(user);
    }
    async updateUserProfile(id, updateData, passwordChange) {
        const user = await this.repo.findById(id);
        if (!user)
            throw new error_1.NotFoundError();
        if (passwordChange) {
            await this.verifyPassword(passwordChange.oldPassword, user.password);
            await this.isSamePassword(passwordChange.newPassword, user.password);
            updateData.password = await this.hashingPassword(passwordChange.newPassword);
        }
        return this.repo.update(id, updateData);
    }
    async updateUserRefreshToken(userId, refreshToken) {
        await this.repo.updateRefreshToken(userId, refreshToken);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map