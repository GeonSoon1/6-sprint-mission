"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.findUserByNickname = findUserByNickname;
exports.findUserById = findUserById;
exports.createUser = createUser;
exports.updateUserById = updateUserById;
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
function findUserByEmail(email) {
    return prismaClient_1.default.user.findUnique({ where: { email } });
}
function findUserByNickname(nickname) {
    return prismaClient_1.default.user.findUnique({ where: { nickname } });
}
function findUserById(id) {
    return prismaClient_1.default.user.findUnique({ where: { id } });
}
function createUser(data) {
    return prismaClient_1.default.user.create({ data });
}
function updateUserById(id, data) {
    return prismaClient_1.default.user.update({
        where: { id },
        data,
    });
}
