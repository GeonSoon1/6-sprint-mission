"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokens = createTokens;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("./constants");
// 토큰 생성
function createTokens(userId) {
    const payload = { id: userId };
    const accessExpiresIn = { expiresIn: '1h' };
    const refreshExpiresIn = { expiresIn: '7d' };
    const accessToken = jsonwebtoken_1.default.sign(payload, constants_1.JWT_ACCESS_TOKEN_SECRET, accessExpiresIn);
    const refreshToken = jsonwebtoken_1.default.sign(payload, constants_1.JWT_REFRESH_TOKEN_SECRET, refreshExpiresIn);
    return { accessToken, refreshToken };
}
// 토큰 검증
function verifyAccessToken(token) {
    // Type assertion 형식
    const decodedUser = jsonwebtoken_1.default.verify(token, constants_1.JWT_ACCESS_TOKEN_SECRET);
    return { userId: decodedUser.id };
}
// Refresh Token을 활용하여 토큰 재발급
function verifyRefreshToken(token) {
    // Type Guard 형식
    const decodedUser = jsonwebtoken_1.default.verify(token, constants_1.JWT_REFRESH_TOKEN_SECRET);
    if (typeof decodedUser === 'string') {
        throw new Error('Invalid token payload');
    }
    return { userId: decodedUser.id };
}
