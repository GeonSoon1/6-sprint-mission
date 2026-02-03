"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prismaClient_1 = __importDefault(require("../../libs/prismaClient"));
class UserRepository {
    async create(data) {
        return prismaClient_1.default.user.create({ data });
    }
    async findByEmail(email) {
        return prismaClient_1.default.user.findUnique({ where: { email } });
    }
    async findById(id) {
        return prismaClient_1.default.user.findUnique({ where: { id } });
    }
    async updateRefreshToken(id, refreshToken) {
        return prismaClient_1.default.user.update({ where: { id }, data: { refreshToken } });
    }
    async updateRefreshTokenByEmail(email, refreshToken) {
        return prismaClient_1.default.user.update({ where: { email }, data: { refreshToken } });
    }
    async clearRefreshToken(userId) {
        return prismaClient_1.default.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
    async update(id, data) {
        return prismaClient_1.default.user.update({ where: { id }, data });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map