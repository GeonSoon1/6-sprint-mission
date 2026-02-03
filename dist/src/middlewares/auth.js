"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.verifyRefreshToken = void 0;
exports.authorizeUser = authorizeUser;
exports.optionalAuth = optionalAuth;
exports.authorizeProduct = authorizeProduct;
exports.authorizeArticle = authorizeArticle;
exports.authorizeComment = authorizeComment;
const express_jwt_1 = require("express-jwt");
const prismaClient_1 = __importDefault(require("../libs/prismaClient"));
const error_1 = require("../libs/error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 리퀘스트 토큰 검증 미들웨어
const verifyRefreshToken = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.refreshToken,
});
exports.verifyRefreshToken = verifyRefreshToken;
// 엑세스 토큰 검증 미들웨어
const verifyAccessToken = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.accessToken,
});
exports.verifyAccessToken = verifyAccessToken;
// 유저 인증 미들웨어
async function authorizeUser(req, res, next) {
    if (!req.auth)
        return next(new error_1.AuthorizeError());
    const { userId } = req.auth;
    const user = await prismaClient_1.default.user.findUnique({ where: { id: userId } });
    if (!user)
        next(new error_1.AuthorizeError());
    req.user = user;
    next();
}
// 토큰 유무 확인하는 전역 미들웨어
function optionalAuth(req, res, next) {
    const token = req.cookies.accessToken;
    if (!token)
        return next();
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // 검증 실패시 그냥 넘어감, 성공시 payload 반환
        if (err)
            return next();
        req.auth = decoded;
        next();
    });
}
// 유저가 생성한 상품인지 확인하는 미들웨어
async function authorizeProduct(req, res, next) {
    const userId = req.user.id; // user 가 ? 이기 때문에 확정을 시켜줘야 하는 것
    const { id } = req.params;
    const product = await prismaClient_1.default.product.findUniqueOrThrow({
        where: { id: id },
    });
    if (userId !== product.userId)
        next(new error_1.AuthorizeError());
    next();
}
// 유저가 생성한 게시글인지 확인하는 미들웨어
async function authorizeArticle(req, res, next) {
    const userId = req.user.id;
    const { id } = req.params;
    const article = await prismaClient_1.default.article.findUniqueOrThrow({
        where: { id: id },
    });
    if (userId !== article.userId)
        next(new error_1.AuthorizeError());
    next();
}
// 유저가 생성한 댓글인지 확인하는 미들웨어
async function authorizeComment(req, res, next) {
    const userId = req.user.id;
    const { id } = req.params;
    const comment = await prismaClient_1.default.comment.findUniqueOrThrow({
        where: { id: id },
    });
    if (userId !== comment.userId)
        next(new error_1.AuthorizeError());
    next();
}
//# sourceMappingURL=auth.js.map